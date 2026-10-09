import crypto from 'crypto';
import type { UnipileWebhookPayload } from './types';

export interface ProcessWebhookResult {
  handled: boolean;
  event: string;
  message?: string;
  details?: Record<string, unknown>;
  leadCaptured?: {
    id: string;
    name: string;
    headline: string;
    commentText?: string;
    keywordMatched?: string;
    postTitle?: string;
  };
  inboxMessageAdded?: {
    chatId: string;
    messageId: string;
    senderName: string;
    text: string;
    timestamp: string;
  };
  accountStatusUpdated?: {
    accountId: string;
    status: string;
  };
}

export interface IngestedWebhookRecord {
  id: string;
  event: string;
  receivedAt: string;
  payload: UnipileWebhookPayload;
  result: ProcessWebhookResult;
}

// Almacenamiento en memoria para eventos recientes en el servidor
const globalWebhookHistory: IngestedWebhookRecord[] = [];

export function getRecentWebhookEvents(limit = 30): IngestedWebhookRecord[] {
  return globalWebhookHistory.slice(0, limit);
}

export function recordWebhookEvent(record: IngestedWebhookRecord) {
  globalWebhookHistory.unshift(record);
  if (globalWebhookHistory.length > 100) {
    globalWebhookHistory.pop();
  }
}

export function clearWebhookEvents() {
  globalWebhookHistory.length = 0;
}

function getMessageFields(payload: UnipileWebhookPayload) {
  const data = payload.data || {};
  const sender = payload.sender || data.sender || {};
  return {
    messageId: payload.message_id || data.message_id || data.id || `msg-${Date.now()}`,
    chatId: payload.chat_id || data.chat_id || `chat-${Date.now()}`,
    text: payload.message ?? data.message ?? data.text ?? '',
    timestamp: payload.timestamp || data.timestamp || new Date().toISOString(),
    senderId: sender.attendee_provider_id || sender.provider_id || data.sender_id || 'lead-sender',
    senderName: sender.attendee_name || sender.name || data.sender_name || 'Contacto de LinkedIn',
    senderProfileUrl: sender.attendee_profile_url || sender.profile_url || data.sender_profile_url || null,
    accountUserId: payload.account_info?.user_id || data.account_info?.user_id || '',
    attachments: payload.attachments || data.attachments || [],
  };
}

/**
 * Valida la firma criptográfica HMAC sha256 enviada en las cabeceras de Unipile
 */
export function verifyUnipileSignature(
  rawBody: Buffer | string,
  header: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = 300
): boolean {
  if (!header || !secret) return false;
  try {
    const fields = Object.fromEntries(
      header.split(',').map((part) => {
        const index = part.indexOf('=');
        return index < 0 ? [part.trim(), ''] : [part.slice(0, index).trim(), part.slice(index + 1).trim()];
      })
    );
    const timestamp = Number(fields.t);
    const supplied = String(fields.v0 || '').toLowerCase();
    if (!Number.isFinite(timestamp) || !/^[a-f0-9]{64}$/.test(supplied)) return false;
    if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) return false;

    const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
    const expected = crypto.createHmac('sha256', secret).update(`${fields.t}.${bodyString}`, 'utf8').digest('hex');
    const suppliedBuffer = Buffer.from(supplied, 'utf8');
    const expectedBuffer = Buffer.from(expected, 'utf8');
    return suppliedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export function createUnipileSignature(
  rawBody: Buffer | string,
  secret: string,
  timestamp = Math.floor(Date.now() / 1000)
): string {
  const bodyString = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');
  const digest = crypto.createHmac('sha256', secret).update(`${timestamp}.${bodyString}`, 'utf8').digest('hex');
  return `t=${timestamp},v0=${digest}`;
}

/**
 * Procesa el evento de Unipile y ejecuta la logica de negocio correspondiente
 */
export async function handleUnipileWebhook(payload: UnipileWebhookPayload): Promise<ProcessWebhookResult> {
  const event = String(payload.event || '');
  const remoteAccountId = payload.account_id || payload.data?.account_id || 'up_acc_roberto_orse_main';

  // 1. EVENTO: Mensaje entrante de LinkedIn (Inbox Unificado + Asistente SDR IA)
  if (event === 'message_received' || event === 'chat_updated') {
    const fields = getMessageFields(payload);
    const isSender = payload.is_sender !== undefined
      ? Boolean(payload.is_sender)
      : (payload.data?.is_sender !== undefined
        ? Boolean(payload.data.is_sender)
        : (fields.accountUserId ? fields.accountUserId === fields.senderId : false));

    const result: ProcessWebhookResult = {
      handled: true,
      event,
      message: 'Mensaje de LinkedIn recibido e integrado al Inbox de Social Selling',
      inboxMessageAdded: {
        chatId: fields.chatId,
        messageId: fields.messageId,
        senderName: fields.senderName,
        text: fields.text,
        timestamp: fields.timestamp,
      },
      details: {
        accountId: remoteAccountId,
        senderId: fields.senderId,
        isSender,
        profileUrl: fields.senderProfileUrl,
      },
    };

    recordWebhookEvent({
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      event,
      receivedAt: new Date().toISOString(),
      payload,
      result,
    });

    return result;
  }

  // 2. EVENTO: Invitacion aceptada o nueva conexion establecida
  if (event === 'invitation_accepted' || event === 'new_relation') {
    const data = payload.data || {};
    const providerId = payload.user_provider_id || data.user_provider_id || data.provider_id || data.user_id || 'urn:li:member:lead';
    const name = payload.sender?.name || data.sender_name || 'Contacto de LinkedIn';

    const result: ProcessWebhookResult = {
      handled: true,
      event,
      message: `${name} acepto la solicitud de conexion. Pipeline de Social Selling avanzado a nivel 1er grado.`,
      details: {
        providerId,
        accountId: remoteAccountId,
        connectedAt: new Date().toISOString(),
      },
    };

    recordWebhookEvent({
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      event,
      receivedAt: new Date().toISOString(),
      payload,
      result,
    });

    return result;
  }

  // 3. EVENTO: Cambio de estado de la cuenta de LinkedIn
  if (
    event === 'account_status_changed' ||
    event === 'account_status_ok' ||
    event === 'account_reconnected' ||
    event === 'account_creation_success' ||
    event === 'account_credentials' ||
    event === 'account_error' ||
    event === 'account_stopped' ||
    payload.AccountStatus
  ) {
    const data = payload.data || {};
    const accountStatus = payload.AccountStatus || {};
    let status = (accountStatus.message || data.message || data.status || payload.status || '').toUpperCase();

    if (!status) {
      if (event.includes('ok') || event.includes('reconnected') || event.includes('success')) {
        status = 'OK';
      } else if (event.includes('credentials')) {
        status = 'CREDENTIALS';
      } else if (event.includes('error')) {
        status = 'ERROR';
      } else if (event.includes('stopped')) {
        status = 'STOPPED';
      } else {
        status = 'OK';
      }
    }

    const targetAccountId = accountStatus.account_id || remoteAccountId;

    const result: ProcessWebhookResult = {
      handled: true,
      event,
      message: `Estado de la cuenta de LinkedIn actualizado a: ${status}`,
      accountStatusUpdated: {
        accountId: targetAccountId,
        status,
      },
      details: {
        rawStatus: status,
        updatedAt: new Date().toISOString(),
      },
    };

    recordWebhookEvent({
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      event,
      receivedAt: new Date().toISOString(),
      payload,
      result,
    });

    return result;
  }

  // 4. EVENTO: Comentario recibido en post de LinkedIn (Signal Radar de Social Selling)
  if (event === 'comment_received' || event === 'new_comment_received') {
    const data = payload.data || {};
    const commentText = payload.message || data.text || data.message || '';
    const authorName = payload.sender?.name || data.sender_name || 'Comentarista LinkedIn';
    const authorHeadline = payload.sender?.headline as string || 'Profesional B2B';
    const targetPostTitle = (payload.post_title as string) || 'Estrategias de Social Selling 2026';

    // Comprobar si el comentario coincide con la palabra clave del Radar (ej: "SISTEMA")
    const isKeywordMatch = /SISTEMA|INFO|GUIA|QUIERO|INTERESA/i.test(commentText);

    const result: ProcessWebhookResult = {
      handled: true,
      event,
      message: isKeywordMatch
        ? `Lead capturado por Signal Radar: ${authorName} comento '${commentText}'`
        : `Comentario registrado en publicacion: '${commentText}'`,
      leadCaptured: isKeywordMatch
        ? {
            id: `lead-sig-${Date.now()}`,
            name: authorName,
            headline: authorHeadline,
            commentText,
            keywordMatched: 'SISTEMA',
            postTitle: targetPostTitle,
          }
        : undefined,
      details: {
        isKeywordMatch,
        commentText,
        postId: payload.post_id || data.post_id,
      },
    };

    recordWebhookEvent({
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      event,
      receivedAt: new Date().toISOString(),
      payload,
      result,
    });

    return result;
  }

  // Evento no mapeado pero registrado
  const genericResult: ProcessWebhookResult = {
    handled: true,
    event,
    message: `Evento '${event}' recibido y almacenado en el registro de auditoria`,
    details: payload as Record<string, unknown>,
  };

  recordWebhookEvent({
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    event,
    receivedAt: new Date().toISOString(),
    payload,
    result: genericResult,
  });

  return genericResult;
}
