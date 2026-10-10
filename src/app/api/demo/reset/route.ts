import { NextResponse } from "next/server";
import { clearDemoPersistence } from "@/lib/persistence/webhook-service";
import { getSocialSellingDb } from "@/lib/persistence/db";
import { seedDemoWorkspace } from "@/lib/persistence/demo-seed";

export const runtime = "nodejs";

export async function POST() {
  if (process.env.INHUBFLOW_DEMO_PERSISTENCE !== "true" || process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Reset demo solo disponible explicitamente en desarrollo." }, { status: 404 });
  }
  clearDemoPersistence();
  seedDemoWorkspace(getSocialSellingDb());
  return NextResponse.json({ ok: true, message: "Datos persistentes demo reiniciados." });
}
