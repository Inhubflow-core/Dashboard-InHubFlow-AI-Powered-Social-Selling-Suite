import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: NextRequest) {
  try {
    const rawBodyString = await req.text();
    const signature = req.headers.get("x-signature") || "";
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET?.trim() || "";

    // Validación criptográfica si hay secret configurado
    if (secret) {
      if (!signature) {
        return NextResponse.json(
          { error: "Falta la cabecera de firma x-signature obligatoria" },
          { status: 401 }
        );
      }

      const hmac = crypto.createHmac("sha256", secret).update(rawBodyString).digest("hex");
      const hmacBuf = Buffer.from(hmac, "utf8");
      const sigBuf = Buffer.from(signature, "utf8");

      if (hmacBuf.length !== sigBuf.length || !crypto.timingSafeEqual(hmacBuf, sigBuf)) {
        return NextResponse.json(
          { error: "Firma criptografica invalida de Lemon Squeezy" },
          { status: 401 }
        );
      }
    }

    let body: any;
    try {
      body = JSON.parse(rawBodyString);
    } catch {
      return NextResponse.json({ error: "JSON malformado" }, { status: 400 });
    }

    const eventName = body?.meta?.event_name || req.headers.get("x-event-name") || "unknown";
    const customData = body?.meta?.custom_data || {};
    const data = body?.data || {};
    const attributes = data?.attributes || {};

    const customerEmail = (
      customData.admin_email ||
      attributes.user_email ||
      data?.customer?.email ||
      ""
    ).trim().toLowerCase();

    const planId = (customData.plan_id || attributes.product_name || "").toLowerCase();
    const slots =
      planId.includes("10") || planId.includes("business")
        ? 10
        : planId.includes("5") || planId.includes("growth")
        ? 5
        : 1;

    const planTier = slots === 10 ? "business" : slots === 5 ? "growth" : "starter";
    const subscriptionId = String(data.id || attributes.order_id || `sub_${Date.now()}`);

    console.log(`[LemonSqueezy Webhook] Evento: ${eventName} | Plan: ${planTier} | Slots: ${slots} | Email: ${customerEmail}`);

    return NextResponse.json({
      ok: true,
      received: true,
      event: eventName,
      customerEmail,
      planTier,
      slots,
      subscriptionId,
      status: "active",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error procesando webhook de Lemon Squeezy";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    endpoint: "/api/webhooks/lemonsqueezy",
    service: "Lemon Squeezy SaaS Billing & Multislot Provisioning",
    supportedPlans: {
      starter: { slots: 1, priceMonthly: 49 },
      growth: { slots: 5, priceMonthly: 149 },
      business: { slots: 10, priceMonthly: 279 },
    },
    timestamp: new Date().toISOString(),
  });
}
