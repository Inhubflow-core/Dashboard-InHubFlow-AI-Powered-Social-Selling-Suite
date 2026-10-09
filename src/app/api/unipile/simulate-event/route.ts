import { NextRequest, NextResponse } from 'next/server';
import { handleUnipileWebhook } from '@/lib/unipile/webhooks';
import type { UnipileWebhookPayload } from '@/lib/unipile/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = body.type || 'incoming_message';

    let payload: UnipileWebhookPayload;

    if (type === 'incoming_message') {
      payload = {
        event: 'message_received',
        account_id: body.accountId || 'up_acc_roberto_orse_main',
        chat_id: body.chatId || 'conv-1',
        message_id: `msg-sim-${Date.now()}`,
        message: body.message || 'Hola Roberto, vi el caso de exito sobre prospeccion B2B con IA y me gustaria coordinar una demo.',
        timestamp: new Date().toISOString(),
        is_sender: 0,
        sender: {
          attendee_id: 'att-sim-lead',
          attendee_name: body.senderName || 'Alejandro Ramos',
          attendee_profile_url: 'https://www.linkedin.com/in/alejandro-ramos-cloud',
          provider_id: 'urn:li:member:lead-alejandro',
          name: body.senderName || 'Alejandro Ramos',
        },
      };
    } else if (type === 'invitation_accepted') {
      payload = {
        event: 'invitation_accepted',
        account_id: body.accountId || 'up_acc_roberto_orse_main',
        timestamp: new Date().toISOString(),
        user_provider_id: 'urn:li:member:carlos-benitez-sales',
        user_public_identifier: 'carlos-benitez-sales',
        user_profile_url: 'https://www.linkedin.com/in/carlos-benitez-sales',
        sender: {
          name: body.senderName || 'Carlos Benitez (VP Sales)',
          profile_url: 'https://www.linkedin.com/in/carlos-benitez-sales',
        },
      };
    } else if (type === 'keyword_comment') {
      payload = {
        event: 'comment_received',
        account_id: body.accountId || 'up_acc_roberto_orse_main',
        post_id: body.postId || 'urn:li:activity:72891238912',
        post_title: body.postTitle || 'Estrategias de Social Selling B2B para 2026',
        message: body.commentText || 'SISTEMA por favor Roberto, me gustaria recibir el framework completo!',
        timestamp: new Date().toISOString(),
        sender: {
          name: body.authorName || 'Mariana Costa',
          headline: 'Directora de Operaciones B2B en TechLatam',
          profile_url: 'https://www.linkedin.com/in/mariana-costa-tech',
        },
      };
    } else if (type === 'account_status') {
      const newStatus = body.status || 'OK';
      payload = {
        event: 'account_status_changed',
        account_id: body.accountId || 'up_acc_roberto_orse_main',
        timestamp: new Date().toISOString(),
        status: newStatus,
        AccountStatus: {
          account_id: body.accountId || 'up_acc_roberto_orse_main',
          account_type: 'LINKEDIN',
          message: newStatus,
        },
      };
    } else {
      payload = body;
    }

    const result = await handleUnipileWebhook(payload);

    return NextResponse.json({
      ok: true,
      simulatedType: type,
      payload,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al procesar simulacion';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
