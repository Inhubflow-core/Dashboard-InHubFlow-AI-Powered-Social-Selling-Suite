import { NextRequest, NextResponse } from "next/server";
import {
  initialSaaSUsers,
  addSubscriber,
  updateSubscriber,
  deleteSubscriber,
  getGlobalSaaSStats,
  getStoredUsers,
} from "@/lib/saas/store";
import { getPlanConfig } from "@/lib/saas/plans";
import type { PlanTier, SubscriptionStatus } from "@/lib/saas/types";

export async function GET() {
  try {
    const subscribers = getStoredUsers();
    const stats = getGlobalSaaSStats();

    return NextResponse.json({
      success: true,
      subscribers,
      stats,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error al listar suscriptores",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, companyName, planTier, slotsLimit } = body;

    if (!email || !companyName) {
      return NextResponse.json(
        { error: "Correo electronico y nombre de empresa son obligatorios." },
        { status: 400 }
      );
    }

    const plan = getPlanConfig(planTier || "starter");
    const slots = typeof slotsLimit === "number" ? Math.max(1, slotsLimit) : plan.slots;

    const newSubscriber = addSubscriber({
      email,
      name,
      companyName,
      planTier: planTier || "starter",
      slotsLimit: slots,
    });

    return NextResponse.json(
      {
        success: true,
        user: newSubscriber,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error al crear suscriptor",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, companyName, planTier, slotsLimit, subscriptionStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: "El ID del suscriptor es requerido." },
        { status: 400 }
      );
    }

    const updated = updateSubscriber(id, {
      companyName,
      planTier: planTier as PlanTier,
      slotsLimit,
      subscriptionStatus: subscriptionStatus as SubscriptionStatus,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Suscriptor no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: updated,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error al actualizar suscriptor",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "El ID del suscriptor es requerido." },
        { status: 400 }
      );
    }

    const success = deleteSubscriber(id);
    if (!success) {
      return NextResponse.json(
        { error: "No se puede eliminar la cuenta principal de Super Administrador." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Suscriptor eliminado exitosamente.",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error al eliminar suscriptor",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
