import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// GET - Fetch TikTok metrics for the user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          where: { provider: "tiktok" }
        },
        metrics: {
          where: { platform: "tiktok" },
          orderBy: { date: "desc" },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const tiktokAccount = user.accounts[0];
    const latestMetric = user.metrics[0];

    return NextResponse.json({
      connected: !!tiktokAccount,
      username: tiktokAccount?.platformUsername || null,
      followers: latestMetric?.followers || 0,
      views: latestMetric?.views || 0,
      likes: latestMetric?.rawData ? JSON.parse(latestMetric.rawData).likes || 0 : 0,
      lastUpdated: latestMetric?.date || null,
    });
  } catch (error) {
    console.error("Error fetching TikTok data:", error);
    return NextResponse.json(
      { error: "Failed to fetch TikTok data" },
      { status: 500 }
    );
  }
}

// POST - Save TikTok metrics (manual entry)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, followers, views, likes } = body;

    if (!username || followers === undefined || views === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        accounts: {
          where: { provider: "tiktok" }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update TikTok account
    let tiktokAccount = user.accounts[0];
    
    if (!tiktokAccount) {
      tiktokAccount = await prisma.account.create({
        data: {
          userId: user.id,
          type: "manual",
          provider: "tiktok",
          providerAccountId: username,
          platformUsername: username,
          isManualEntry: true,
        }
      });
    } else {
      await prisma.account.update({
        where: { id: tiktokAccount.id },
        data: { platformUsername: username }
      });
    }

    // Get previous metric for growth calculation
    const previousMetric = await prisma.metric.findFirst({
      where: { 
        userId: user.id, 
        platform: "tiktok" 
      },
      orderBy: { date: "desc" }
    });

    const followerGrowth = previousMetric 
      ? followers - previousMetric.followers 
      : 0;
    const viewGrowth = previousMetric 
      ? views - previousMetric.views 
      : 0;

    // Save new metric
    const metric = await prisma.metric.create({
      data: {
        userId: user.id,
        platform: "tiktok",
        followers,
        views,
        followerGrowth,
        viewGrowth,
        isManualEntry: true,
        rawData: JSON.stringify({ likes: likes || 0 })
      }
    });

    return NextResponse.json({
      success: true,
      metric: {
        followers: metric.followers,
        views: metric.views,
        followerGrowth: metric.followerGrowth,
        viewGrowth: metric.viewGrowth,
      }
    });
  } catch (error) {
    console.error("Error saving TikTok data:", error);
    return NextResponse.json(
      { error: "Failed to save TikTok data" },
      { status: 500 }
    );
  }
}

// DELETE - Disconnect TikTok
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete TikTok account and metrics
    await prisma.account.deleteMany({
      where: { 
        userId: user.id, 
        provider: "tiktok" 
      }
    });

    await prisma.metric.deleteMany({
      where: { 
        userId: user.id, 
        platform: "tiktok" 
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error disconnecting TikTok:", error);
    return NextResponse.json(
      { error: "Failed to disconnect TikTok" },
      { status: 500 }
    );
  }
}
