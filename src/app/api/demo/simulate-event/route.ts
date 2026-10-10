import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { handleUnipileWebhook } from "@/lib/unipile/webhooks";
import { getDemoWebhookEvents, listDemoInbox, listDemoLeads } from "@/lib/persistence/webhook-service";
import type { UnipileWebhookPayload } from "@/lib/unipile/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (process.env.INHUBFLOW_DEMO_PERSISTENCE !== "true" || process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Simulacion persistente solo disponible en desarrollo con INHUBFLOW_DEMO_PERSISTENCE=true." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const type = typeof body.type === "string" ? body.type : "keyword_comment";
    const eventId = `demo-event-${crypto.randomUUID()}`;
    let payload: UnipileWebhookPayload;

    if (type === "keyword_comment") {
      payload = {
        event: "comment_received",
        event_id: eventId,
        account_id: "demo-unipile-account",
        post_id: "demo-post-01",
        post_title: "Publicacion de demostracion",
        message: typeof body.commentText === "string" ? body.commentText : "SISTEMA: me interesa recibir la guia",
        sender: {
          name: typeof body.senderName === "string" ? body.senderName : "Contacto Demo",
          headline: "Perfil simulado para pruebas",
          provider_id: `demo-provider-${eventId}`,
          profile_url: "https://example.test/demo-profile",
        },
      };
    } else if (type === "incoming_message") {
      payload = {
        event: "message_received",
        event_id: eventId,
        account_id: "demo-unipile-account",
        chat_id: `demo-chat-${eventId}`,
        message_id: `demo-message-${eventId}`,
        message: typeof body.message === "string" ? body.message : "Mensaje entrante simulado para validar Inbox y parada de campaña.",
        timestamp: new Date().toISOString(),
        is_sender: 0,
        sender: {
          name: typeof body.senderName === "string" ? body.senderName : "Contacto Demo",
          attendee_name: typeof body.senderName === "string" ? body.senderName : "Contacto Demo",
          provider_id: `demo-provider-${eventId}`,
          profile_url: "https://example.test/demo-profile",
        },
      };
    } else if (type === "invitation_accepted") {
      payload = {
        event: "invitation_accepted",
        event_id: eventId,
        account_id: "demo-unipile-account",
        user_provider_id: typeof body.providerId === "string" ? body.providerId : "demo-provider-existing",
        user_profile_url: "https://example.test/demo-profile",
        sender: { name: typeof body.senderName === "string" ? body.senderName : "Contacto Demo" },
      };
    } else {
      return NextResponse.json({ error: "Tipo no soportado. Usa keyword_comment, incoming_message o invitation_accepted." }, { status: 400 });
    }

    const result = await handleUnipileWebhook(payload);
    return NextResponse.json({ ok: true, type, result, leads: listDemoLeads(), inbox: listDemoInbox(), events: getDemoWebhookEvents(10) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "No se pudo simular el evento." }, { status: 500 });
  }
}
