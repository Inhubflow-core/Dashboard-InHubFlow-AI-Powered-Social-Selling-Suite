import "server-only";
import { randomUUID } from "node:crypto";
import type Database from "better-sqlite3";

export const DEMO_WORKSPACE_ID = "ws-social-selling-demo";
export const DEMO_USER_ID = "usr-social-selling-demo";
export const DEMO_ACCOUNT_ID = "acc-social-selling-demo";
export const DEMO_WORKFLOW_ID = "wf-social-selling-demo";

export function seedDemoWorkspace(db: Database.Database): void {
  const seeded = db.prepare("SELECT id FROM workspaces WHERE id = ?").get(DEMO_WORKSPACE_ID);
  if (seeded) return;

  db.transaction(() => {
    db.prepare("INSERT INTO workspaces(id, name) VALUES (?, ?)").run(DEMO_WORKSPACE_ID, "Workspace de demostracion");
    db.prepare("INSERT INTO workspace_members(workspace_id, user_id, role) VALUES (?, ?, 'owner')").run(DEMO_WORKSPACE_ID, DEMO_USER_ID);
    db.prepare(`INSERT INTO linkedin_accounts(id, workspace_id, owner_user_id, unipile_account_id, name, status, metadata_json)
      VALUES (?, ?, ?, ?, ?, 'OK', ?)`)
      .run(DEMO_ACCOUNT_ID, DEMO_WORKSPACE_ID, DEMO_USER_ID, "demo-unipile-account", "Cuenta simulada (Demo)", JSON.stringify({ demo: true }));
    db.prepare(`INSERT INTO campaign_workflows(id, workspace_id, name, status, workflow_json)
      VALUES (?, ?, ?, 'active', ?)`)
      .run(DEMO_WORKFLOW_ID, DEMO_WORKSPACE_ID, "Flujo de prueba local", JSON.stringify({ source: "simulator", stopOnReply: true }));
  })();
}

export function createDemoLead(db: Database.Database, input: {
  name: string;
  headline?: string;
  profileUrl?: string;
  providerId?: string;
  source: "comment" | "message";
}): { leadId: string; conversationId?: string } {
  const now = new Date().toISOString();
  const existing = input.providerId
    ? db.prepare("SELECT id FROM leads WHERE workspace_id = ? AND provider_id = ?").get(DEMO_WORKSPACE_ID, input.providerId) as { id: string } | undefined
    : undefined;
  const leadId = existing?.id || `demo-lead-${randomUUID()}`;

  if (!existing) {
    db.prepare(`INSERT INTO leads(id, workspace_id, account_id, provider_id, profile_url, full_name, headline, source, stage, metadata_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'captured', ?, ?, ?)`)
      .run(leadId, DEMO_WORKSPACE_ID, DEMO_ACCOUNT_ID, input.providerId || null, input.profileUrl || null, input.name, input.headline || null, input.source, JSON.stringify({ demo: true }), now, now);
  }

  if (input.source !== "message") return { leadId };
  const externalChatId = `demo-chat-${input.providerId || leadId}`;
  const conversation = db.prepare("SELECT id FROM conversations WHERE account_id = ? AND external_chat_id = ?")
    .get(DEMO_ACCOUNT_ID, externalChatId) as { id: string } | undefined;
  const conversationId = conversation?.id || `demo-conv-${randomUUID()}`;
  if (!conversation) {
    db.prepare(`INSERT INTO conversations(id, workspace_id, account_id, lead_id, external_chat_id, last_message, last_message_at, unread)
      VALUES (?, ?, ?, ?, ?, '', ?, 0)`)
      .run(conversationId, DEMO_WORKSPACE_ID, DEMO_ACCOUNT_ID, leadId, externalChatId, now);
  }
  return { leadId, conversationId };
}

export function recordDemoMessage(db: Database.Database, input: {
  conversationId: string;
  externalMessageId: string;
  direction: "inbound" | "outbound";
  senderName: string;
  body: string;
  sentAt: string;
}): boolean {
  const result = db.prepare(`INSERT OR IGNORE INTO conversation_messages
    (id, workspace_id, conversation_id, external_message_id, direction, sender_name, body, sent_at, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(`demo-msg-${randomUUID()}`, DEMO_WORKSPACE_ID, input.conversationId, input.externalMessageId,
      input.direction, input.senderName, input.body, input.sentAt, JSON.stringify({ demo: true }));
  if (result.changes) {
    db.prepare("UPDATE conversations SET last_message = ?, last_message_at = ?, unread = ? WHERE id = ? AND workspace_id = ?")
      .run(input.body, input.sentAt, input.direction === "inbound" ? 1 : 0, input.conversationId, DEMO_WORKSPACE_ID);
  }
  return result.changes > 0;
}
