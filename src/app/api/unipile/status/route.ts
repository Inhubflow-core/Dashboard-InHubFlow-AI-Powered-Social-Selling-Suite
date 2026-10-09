import { NextResponse } from 'next/server';
import { unipile } from '@/lib/unipile/client';

export async function GET() {
  const isConfigured = unipile.isConfigured();
  const dsn = unipile.getDsn();

  return NextResponse.json({
    configured: isConfigured,
    mode: isConfigured ? 'live' : 'sandbox',
    dsn: isConfigured ? dsn.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@') : 'https://api.unipile.com (Sandbox Emulado)',
    provider: 'LINKEDIN',
    trialNotice: isConfigured
      ? 'Credenciales de Unipile conectadas a entorno de produccion.'
      : 'Modo Sandbox Activo: Probando todas las funciones sin consumir los 7 dias de prueba gratuitos.',
    webhookEndpoint: '/api/unipile/webhook',
  });
}
