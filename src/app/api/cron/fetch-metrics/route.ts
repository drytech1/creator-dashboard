import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// This route should be called by a cron job daily
// It fetches metrics for all active users

export async function POST(req: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with active subscriptions or active trials
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { subscriptionStatus: "active" },
          { subscriptionStatus: "trialing" },
        ],
      },
      include: {
        accounts: true,
      },
    });

    const results = [];

    for (const user of users) {
      const userResults = {
        userId: user.id,
        email: user.email,
        platforms: [] as string[],
        errors: [] as string[],
      };

      // Process each connected account
      for (const account of user.accounts) {
        try {
          if (account.provider === "google" && account.access_token) {
            // Fetch YouTube metrics
            const ytData = await fetchYouTubeMetrics(account.access_token);
            if (ytData) {
              await saveMetric(user.id, "youtube", ytData);
              userResults.platforms.push("youtube");
            }
          }

          if (account.provider === "facebook" && account.access_token) {
            // Fetch Instagram metrics
            const igData = await fetchInstagramMetrics(account.access_token);
            if (igData) {
              await saveMetric(user.id, "instagram", igData);
              userResults.platforms.push("instagram");
            }
          }
        } catch (error: any) {
          console.error(`Error fetching metrics for ${user.email}:`, error);
          userResults.errors.push(`${account.provider}: ${error.message}`);
        }
      }

      results.push(userResults);
    }

    return NextResponse.json({
      success: true,
      processed: users.length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to run metric fetch" },
      { status: 500 }
    );
  }
}

async function fetchYouTubeMetrics(accessToken: string) {
  const response = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=statistics&mine=true",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    return null;
  }

  const stats = data.items[0].statistics;
  return {
    followers: parseInt(stats.subscriberCount) || 0,
    views: parseInt(stats.viewCount) || 0,
    rawData: data.items[0],
  };
}

async function fetchInstagramMetrics(accessToken: string) {
  // Step 1: Get Facebook Pages
  const pagesResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  );

  if (!pagesResponse.ok) {
    throw new Error(`Facebook API error: ${pagesResponse.status}`);
  }

  const pagesData = await pagesResponse.json();
  if (!pagesData.data || pagesData.data.length === 0) {
    return null;
  }

  // Step 2: Get Instagram Business Account
  const page = pagesData.data[0];
  const igAccountResponse = await fetch(
    `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
  );

  const igAccountData = await igAccountResponse.json();
  if (!igAccountData.instagram_business_account) {
    return null;
  }

  const igBusinessId = igAccountData.instagram_business_account.id;

  // Step 3: Get Instagram metrics
  const igInfoResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igBusinessId}?fields=followers_count,media_count&access_token=${page.access_token}`
  );

  const igInfo = await igInfoResponse.json();

  // Step 4: Get media for view/engagement counts (approximate)
  const mediaResponse = await fetch(
    `https://graph.facebook.com/v18.0/${igBusinessId}/media?fields=like_count,comments_count&limit=50&access_token=${page.access_token}`
  );

  const mediaData = await mediaResponse.json();
  let totalEngagement = 0;
  if (mediaData.data) {
    totalEngagement = mediaData.data.reduce(
      (sum: number, media: any) =>
        sum + (media.like_count || 0) + (media.comments_count || 0),
      0
    );
  }

  return {
    followers: igInfo.followers_count || 0,
    views: totalEngagement * 10, // Approximate views from engagement
    rawData: { ...igInfo, media: mediaData.data },
  };
}

async function saveMetric(
  userId: string,
  platform: string,
  data: { followers: number; views: number; rawData: any }
) {
  // Get yesterday's metric for growth calculation
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const yesterdayMetric = await prisma.metric.findFirst({
    where: {
      userId,
      platform,
      date: {
        gte: yesterday,
        lt: new Date(),
      },
    },
    orderBy: { date: "desc" },
  });

  const followerGrowth = yesterdayMetric
    ? data.followers - yesterdayMetric.followers
    : 0;
  const viewGrowth = yesterdayMetric ? data.views - yesterdayMetric.views : 0;

  // Save today's metric
  await prisma.metric.create({
    data: {
      userId,
      platform,
      followers: data.followers,
      views: data.views,
      rawData: JSON.stringify(data.rawData),
      followerGrowth,
      viewGrowth,
    },
  });
}
