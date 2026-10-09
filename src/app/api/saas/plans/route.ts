import { NextResponse } from "next/server";
import { OFFICIAL_PLANS_LIST, SAAS_PLANS } from "@/lib/saas/plans";

export async function GET() {
  return NextResponse.json({
    success: true,
    plans: OFFICIAL_PLANS_LIST,
    allPlans: SAAS_PLANS,
  });
}
