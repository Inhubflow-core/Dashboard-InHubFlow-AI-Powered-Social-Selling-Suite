import { NextRequest, NextResponse } from 'next/server';
import { unipile } from '@/lib/unipile/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, accountId, postId, text, reactionType } = body;

    if (!accountId || !postId) {
      return NextResponse.json({ error: 'accountId y postId son obligatorios' }, { status: 400 });
    }

    if (action === 'react') {
      const result = await unipile.reactToPost({
        account_id: accountId,
        post_id: postId,
        reaction_type: reactionType || 'like',
      });
      return NextResponse.json({
        ok: true,
        action: 'react',
        result,
        mode: unipile.isSandboxMode() ? 'sandbox' : 'live',
      });
    }

    if (action === 'comment') {
      if (!text || !text.trim()) {
        return NextResponse.json({ error: 'El texto del comentario es obligatorio' }, { status: 400 });
      }
      const result = await unipile.commentOnPost({
        account_id: accountId,
        post_id: postId,
        text: text.trim(),
      });
      return NextResponse.json({
        ok: true,
        action: 'comment',
        result,
        mode: unipile.isSandboxMode() ? 'sandbox' : 'live',
      });
    }

    return NextResponse.json({ error: 'Accion no valida (usa react o comment)' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al interactuar con el post';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    const accountId = searchParams.get('accountId') || undefined;

    if (!postId) {
      return NextResponse.json({ error: 'Especifica el postId' }, { status: 400 });
    }

    const [comments, reactions, postDetails] = await Promise.all([
      unipile.getPostComments(postId, accountId),
      unipile.getPostReactions(postId, accountId),
      unipile.getPost(postId, accountId),
    ]);

    return NextResponse.json({
      ok: true,
      post: postDetails,
      comments: comments.items,
      reactions: reactions.items,
      mode: unipile.isSandboxMode() ? 'sandbox' : 'live',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error al obtener datos del post';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
