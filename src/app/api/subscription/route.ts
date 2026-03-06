import { NextResponse } from "next/server";

export async function GET() {
  // Mock subscription data for build
  return NextResponse.json({
    daysLeft: 7,
    trialActive: true,
    subscriptionStatus: "trialing",
    subscriptionActive: false,
    hasAccess: true,
    mock: true,
  });
}
