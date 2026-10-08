import { NextRequest, NextResponse } from 'next/server';
import { unipile } from '@/lib/unipile/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { remoteAccountId, code } = body;

    if (!remoteAccountId || !code?.trim()) {
      return NextResponse.json(
        { error: "Por favor proporciona el codigo de verificacion y el identificador de la cuenta." },
        { status: 400 }
      );
    }

    if (!unipile.isConfigured()) {
      return NextResponse.json({
        success: true,
        status: "OK",
        remoteAccountId,
        message: "Verificacion simulada con exito (modo demo).",
      });
    }

    await unipile.solveCheckpoint({
      accountId: remoteAccountId,
      code: code.trim(),
    });

    return NextResponse.json({
      success: true,
      status: "OK",
      remoteAccountId,
    });
  } catch (error: unknown) {
    console.error("[api/unipile/solve-checkpoint] Error resolviendo 2FA:", error);
    return NextResponse.json(
      {
        error: "Codigo incorrecto o expirado al verificar con LinkedIn.",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
