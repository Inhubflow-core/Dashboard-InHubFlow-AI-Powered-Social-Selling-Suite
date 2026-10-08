import { NextResponse } from 'next/server';
import { unipile } from '@/lib/unipile/client';

export async function GET() {
  const isConfigured = unipile.isConfigured();
  const dsn = unipile.getDsn();

  return NextResponse.json({
    configured: isConfigured,
    dsn: isConfigured ? dsn.replace(/\/\/([^:]+):[^@]+@/, '//$1:***@') : null,
    provider: 'LINKEDIN',
  });
}
