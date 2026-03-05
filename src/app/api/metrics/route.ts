import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { platform, followers, views, rawData } = await req.json();

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        },
      });
    }

    // Get yesterday's metric for growth calculation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const yesterdayMetric = await prisma.metric.findFirst({
      where: {
        userId: user.id,
        platform,
        date: {
          gte: yesterday,
          lt: new Date(),
        },
      },
      orderBy: { date: "desc" },
    });

    const followerGrowth = yesterdayMetric 
      ? followers - yesterdayMetric.followers 
      : 0;
    const viewGrowth = yesterdayMetric 
      ? views - yesterdayMetric.views 
      : 0;

    // Save today's metric
    const metric = await prisma.metric.create({
      data: {
        userId: user.id,
        platform,
        followers,
        views,
        rawData: JSON.stringify(rawData),
        followerGrowth,
        viewGrowth,
      },
    });

    return NextResponse.json({ success: true, metric });
  } catch (error) {
    console.error("Error saving metric:", error);
    return NextResponse.json(
      { error: "Failed to save metric" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get("platform");
    const days = parseInt(searchParams.get("days") || "30");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await prisma.metric.findMany({
      where: {
        userId: user.id,
        ...(platform ? { platform } : {}),
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
