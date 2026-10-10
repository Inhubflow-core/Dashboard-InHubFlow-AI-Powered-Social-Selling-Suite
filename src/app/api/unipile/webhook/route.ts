import { NextRequest, NextResponse } from 'next/server';
import { handleUnipileWebhook, verifyUnipileSignature, getRecentWebhookEvents } from '@/lib/unipile/webhooks';
import type { UnipileWebhookPayload } from '@/lib/unipile/types';
import { getDemoWebhookEvents } from '@/lib/persistence/webhook-service';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let payload: UnipileWebhookPayload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'JSON malformado o vacio' }, { status: 400 });
    }

    const signatureHeader = req.headers.get('unipile-signature') || req.headers.get('x-unipile-signature') || '';
    const secret = process.env.UNIPILE_WEBHOOK_SECRET || '';

    // Si hay un secret configurado en .env, verificar firma (omitiendo si es prueba interna explicita)
    const isInternalSimulation = req.headers.get('x-internal-simulation') === 'true';
    if (process.env.NODE_ENV === 'production' && !secret) {
      return NextResponse.json({ error: 'UNIPILE_WEBHOOK_SECRET no esta configurado.' }, { status: 503 });
    }
    if (secret && !isInternalSimulation) {
      const isValid = verifyUnipileSignature(rawBody, signatureHeader, secret);
      if (!isValid) {
        return NextResponse.json({ error: 'Firma de webhook invalida o expirada' }, { status: 401 });
      }
    }

    const result = await handleUnipileWebhook(payload);

    return NextResponse.json({
      ok: true,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno al procesar webhook';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  const events = getRecentWebhookEvents(20);
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/unipile/webhook',
    recentEventsCount: events.length,
    recentEvents: events,
    timestamp: new Date().toISOString(),
  });
}
