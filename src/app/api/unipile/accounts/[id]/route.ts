import { NextRequest, NextResponse } from 'next/server';
import { unipile } from '@/lib/unipile/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!unipile.isConfigured()) {
      return NextResponse.json({ id, status: 'OK', mock: true });
    }

    const account = await unipile.getAccount(id);
    return NextResponse.json(account);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'No se pudo obtener el detalle de la cuenta',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!unipile.isConfigured()) {
      return NextResponse.json({ success: true, mock: true });
    }

    const res = await unipile.deleteAccount(id);
    return NextResponse.json(res);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'No se pudo desconectar la cuenta de Unipile',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
