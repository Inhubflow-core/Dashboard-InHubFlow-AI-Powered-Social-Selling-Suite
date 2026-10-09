import { NextRequest, NextResponse } from 'next/server';
import { unipile } from '@/lib/unipile/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chatId, text, accountId, attendeesIds } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'El texto del mensaje es obligatorio' }, { status: 400 });
    }

    // Si ya existe chatId, enviar mensaje en conversacion existente
    if (chatId) {
      const response = await unipile.sendMessage({
        chat_id: chatId,
        text: text.trim(),
      });
      return NextResponse.json({
        ok: true,
        type: 'message_sent',
        response,
        mode: unipile.isSandboxMode() ? 'sandbox' : 'live',
      });
    }

    // Si no hay chatId pero hay attendeesIds y accountId, iniciar nuevo chat
    if (accountId && attendeesIds && attendeesIds.length > 0) {
      const response = await unipile.startChat({
        account_id: accountId,
        attendees_ids: attendeesIds,
        text: text.trim(),
      });
      return NextResponse.json({
        ok: true,
        type: 'chat_started',
        response,
        mode: unipile.isSandboxMode() ? 'sandbox' : 'live',
      });
    }

    return NextResponse.json({ error: 'Se requiere chatId o (accountId y attendeesIds)' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al enviar mensaje';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');
    const accountId = searchParams.get('accountId');

    if (chatId) {
      const messages = await unipile.listMessages(chatId);
      return NextResponse.json({ ok: true, data: messages });
    }

    if (accountId) {
      const chats = await unipile.listChats(accountId);
      return NextResponse.json({ ok: true, data: chats });
    }

    return NextResponse.json({ error: 'Especifica chatId o accountId' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al consultar mensajes';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
