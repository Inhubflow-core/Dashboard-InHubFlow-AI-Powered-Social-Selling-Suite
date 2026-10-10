import { NextResponse } from "next/server";
import { listDemoInbox } from "@/lib/persistence/webhook-service";

export const runtime = "nodejs";

export async function GET() {
  if (process.env.INHUBFLOW_DEMO_PERSISTENCE !== "true") {
    return NextResponse.json({ error: "Persistencia demo deshabilitada." }, { status: 404 });
  }
  return NextResponse.json({ ok: true, conversations: listDemoInbox() });
}
