import "server-only";
import { randomUUID } from "node:crypto";
import { getSocialSellingDb } from "./db";
import { createDemoLead, DEMO_ACCOUNT_ID, DEMO_WORKSPACE_ID, recordDemoMessage } from "./demo-seed";
import type { UnipileWebhookPayload } from "@/lib/unipile/types";

type JsonRecord = Record<string, unknown>;

function getObject(value: unknown): JsonRecord {
  return value && typeof value === "object" ? value as JsonRecord : {};
}

function getString(...values: unknown[]): string {
  for (const value of values) if (typeof value === "string" && value.trim()) return value.trim();
  return "";
}

function payloadEventId(payload: UnipileWebhookPayload): string | null {
  const data = getObject(payload.data);
  return getString(payload.event_id, data.event_id, data.id, payload.message_id, data.message_id) || null;
}

export function persistUnipileEvent(payload: UnipileWebhookPayload, result: JsonRecord) {
  if (process.env.INHUBFLOW_DEMO_PERSISTENCE !== "true") return { persisted: false, duplicate: false };
  const db = getSocialSellingDb();
  const event = getString(payload.event) || "unknown";
  const externalEventId = payloadEventId(payload);
  const eventId = `webhook-${randomUUID()}`;
  const insert = db.prepare(`INSERT OR IGNORE INTO webhook_events
    (id, workspace_id, provider, external_event_id, event_type, payload_json, result_json, status, processed_at)
    VALUES (?, ?, 'unipile', ?, ?, ?, ?, 'processed', datetime('now'))`).run(
      eventId, DEMO_WORKSPACE_ID, externalEventId, event,
      JSON.stringify(payload), JSON.stringify(result),
    );
  if (!insert.changes) return { persisted: true, duplicate: true };

  const accountId = getString(payload.account_id, getObject(payload.data).account_id);
  if (accountId && accountId !== "demo-unipile-account") {
    db.prepare("UPDATE webhook_events SET status = 'ignored', error_message = 'Account is not part of the demo workspace' WHERE id = ?").run(eventId);
    return { persisted: true, duplicate: false };
  }

  const data = getObject(payload.data);
  const sender = getObject(payload.sender || data.sender);
  const senderName = getString(sender.attendee_name, sender.name, data.sender_name) || "Contacto de demostracion";
  const senderId = getString(sender.attendee_provider_id, sender.provider_id, data.sender_id);
  const profileUrl = getString(sender.attendee_profile_url, sender.profile_url, data.sender_profile_url);
  const eventType = event.toLowerCase();

  if (eventType === "comment_received" || eventType === "new_comment_received") {
    const comment = getString(payload.message, data.text, data.message);
    if (/(SISTEMA|INFO|GUIA|QUIERO|INTERESA)/i.test(comment)) {
      createDemoLead(db, { name: senderName, headline: getString(sender.headline, data.headline), profileUrl, providerId: senderId || undefined, source: "comment" });
    }
  }

  if (eventType === "message_received" || eventType === "chat_updated") {
    const body = getString(payload.message, data.message, data.text);
    const messageId = getString(payload.message_id, data.message_id, data.id);
    const chatId = getString(payload.chat_id, data.chat_id);
    if (body && messageId && chatId) {
      const { leadId, conversationId } = createDemoLead(db, { name: senderName, profileUrl, providerId: senderId || undefined, source: "message" });
      if (conversationId) {
        recordDemoMessage(db, { conversationId, externalMessageId: messageId, direction: "inbound", senderName, body, sentAt: getString(payload.timestamp, data.timestamp) || new Date().toISOString() });
        db.prepare("UPDATE conversations SET external_chat_id = ? WHERE id = ? AND workspace_id = ?").run(chatId, conversationId, DEMO_WORKSPACE_ID);
      }
      db.prepare("UPDATE leads SET stage = 'conversation' WHERE id = ? AND workspace_id = ?").run(leadId, DEMO_WORKSPACE_ID);
    }
  }

  return { persisted: true, duplicate: false };
}

export function listDemoInbox() {
  const db = getSocialSellingDb();
  return db.prepare(`SELECT c.id, c.external_chat_id AS chatId, c.last_message AS lastMessage,
      c.last_message_at AS lastMessageAt, c.unread, l.id AS leadId, l.full_name AS leadName,
      l.headline, l.stage
    FROM conversations c LEFT JOIN leads l ON l.id = c.lead_id
    WHERE c.workspace_id = ? ORDER BY c.last_message_at DESC`).all(DEMO_WORKSPACE_ID);
}

export function listDemoLeads() {
  return getSocialSellingDb().prepare(`SELECT id, full_name AS fullName, headline, profile_url AS profileUrl,
      source, stage, created_at AS createdAt FROM leads WHERE workspace_id = ? ORDER BY created_at DESC`).all(DEMO_WORKSPACE_ID);
}

export function listDemoMessages(conversationId: string) {
  return getSocialSellingDb().prepare(`SELECT id, external_message_id AS externalMessageId,
      direction, sender_name AS senderName, body, sent_at AS sentAt
    FROM conversation_messages WHERE workspace_id = ? AND conversation_id = ? ORDER BY sent_at ASC`)
    .all(DEMO_WORKSPACE_ID, conversationId);
}

export function createDemoInboundMessage(input: { senderName: string; message: string; providerId: string; chatId: string; messageId: string }) {
  const db = getSocialSellingDb();
  const { leadId, conversationId } = createDemoLead(db, { name: input.senderName, providerId: input.providerId, source: "message" });
  if (!conversationId) throw new Error("No se pudo crear la conversacion de demostracion");
  db.prepare("UPDATE conversations SET external_chat_id = ? WHERE id = ? AND workspace_id = ?").run(input.chatId, conversationId, DEMO_WORKSPACE_ID);
  recordDemoMessage(db, { conversationId, externalMessageId: input.messageId, direction: "inbound", senderName: input.senderName, body: input.message, sentAt: new Date().toISOString() });
  db.prepare("UPDATE leads SET stage = 'conversation' WHERE id = ? AND workspace_id = ?").run(leadId, DEMO_WORKSPACE_ID);
  return { leadId, conversationId };
}

export function advanceDemoLeadForAcceptedInvitation(input: { name: string; providerId: string; profileUrl?: string }) {
  if (process.env.INHUBFLOW_DEMO_PERSISTENCE !== "true") return { updated: false };
  const db = getSocialSellingDb();
  const lead = db.prepare("SELECT id FROM leads WHERE workspace_id = ? AND provider_id = ?")
    .get(DEMO_WORKSPACE_ID, input.providerId) as { id: string } | undefined;
  if (!lead) return { updated: false };
  db.prepare("UPDATE leads SET stage = 'connected', updated_at = datetime('now') WHERE workspace_id = ? AND id = ?")
    .run(DEMO_WORKSPACE_ID, lead.id);
  return { updated: true, leadId: lead.id };
}

export function getDemoWebhookEvents(limit = 50) {
  return getSocialSellingDb().prepare(`SELECT id, event_type AS event, external_event_id AS externalEventId,
      status, attempts, received_at AS receivedAt, processed_at AS processedAt, error_message AS error
    FROM webhook_events WHERE workspace_id = ? ORDER BY received_at DESC LIMIT ?`).all(DEMO_WORKSPACE_ID, limit);
}

export function clearDemoPersistence() {
  const db = getSocialSellingDb();
  db.transaction(() => {
    db.prepare("DELETE FROM webhook_events WHERE workspace_id = ?").run(DEMO_WORKSPACE_ID);
    db.prepare("DELETE FROM conversation_messages WHERE workspace_id = ?").run(DEMO_WORKSPACE_ID);
    db.prepare("DELETE FROM conversations WHERE workspace_id = ?").run(DEMO_WORKSPACE_ID);
    db.prepare("DELETE FROM leads WHERE workspace_id = ?").run(DEMO_WORKSPACE_ID);
  })();
}
