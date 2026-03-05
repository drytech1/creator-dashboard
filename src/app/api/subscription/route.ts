import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate trial status
    const trialEnd = new Date(user.trialStart);
    trialEnd.setDate(trialEnd.getDate() + user.trialDays);
    
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    const trialActive = daysLeft > 0 && user.subscriptionStatus === "trialing";
    const subscriptionActive = user.subscriptionStatus === "active";
    const hasAccess = trialActive || subscriptionActive;

    return NextResponse.json({
      trialStart: user.trialStart,
      trialDays: user.trialDays,
      trialEnd,
      daysLeft: Math.max(0, daysLeft),
      trialActive,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionActive,
      hasAccess,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}
