import { DashboardClient } from "@/components/dashboard-client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Mock subscription data
const mockSubscriptionData = {
  daysLeft: 7,
  trialActive: true,
  subscriptionStatus: "trialing",
  subscriptionActive: false,
  hasAccess: true,
};

async function getYouTubeData(accessToken: string) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("YouTube API error:", await response.json());
      return null;
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return null;
    }

    const channel = data.items[0];
    const stats = channel.statistics;

    return {
      followers: parseInt(stats.subscriberCount || "0"),
      views: parseInt(stats.viewCount || "0"),
      videos: parseInt(stats.videoCount || "0"),
      followerGrowth: 0,
      viewGrowth: 0,
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
}

async function getInstagramData(accessToken: string) {
  try {
    // Get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`,
      { cache: "no-store" }
    );
    
    if (!pagesRes.ok) return null;

    const pagesData = await pagesRes.json();
    if (!pagesData.data || pagesData.data.length === 0) return null;

    // Get Instagram Business Account
    const page = pagesData.data[0];
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`,
      { cache: "no-store" }
    );

    if (!igAccountRes.ok) return null;

    const igAccountData = await igAccountRes.json();
    if (!igAccountData.instagram_business_account) return null;

    // Get Instagram stats
    const igInfoRes = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountData.instagram_business_account.id}?fields=username,followers_count,follows_count,media_count&access_token=${page.access_token}`,
      { cache: "no-store" }
    );

    if (!igInfoRes.ok) return null;

    const igInfo = await igInfoRes.json();

    return {
      followers: igInfo.followers_count || 0,
      views: 0, // Instagram doesn't provide total views easily
      followerGrowth: 0,
      viewGrowth: 0,
    };
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return null;
  }
}

async function getTikTokData(userId: string) {
  try {
    // Check if we're in a build/SSG context where DB might not be available
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return null;
    }

    const metric = await prisma.metric.findFirst({
      where: { userId, platform: "tiktok" },
      orderBy: { date: "desc" }
    });

    const account = await prisma.account.findFirst({
      where: { userId, provider: "tiktok" }
    });

    if (!metric) return null;

    return {
      followers: metric.followers,
      views: metric.views,
      likes: metric.rawData ? JSON.parse(metric.rawData).likes || 0 : 0,
      followerGrowth: metric.followerGrowth,
      viewGrowth: metric.viewGrowth,
      username: account?.platformUsername || null,
    };
  } catch (error) {
    console.error("Error fetching TikTok data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  const user = {
    name: session?.user?.name || "Demo User",
    email: session?.user?.email || "demo@example.com",
    image: session?.user?.image || null,
  };

  // Determine which platform user logged in with
  const provider = session?.provider;
  
  // Fetch data based on provider
  let youtubeData = null;
  let instagramData = null;
  let tiktokData = null;

  if (session?.accessToken) {
    if (provider === "google") {
      youtubeData = await getYouTubeData(session.accessToken as string);
    } else if (provider === "facebook") {
      instagramData = await getInstagramData(session.accessToken as string);
    }
  }

  // Fetch TikTok data if user is logged in
  if (session?.user?.email) {
    try {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser) {
        tiktokData = await getTikTokData(dbUser.id);
      }
    } catch (error) {
      console.error("Database error:", error);
      // Continue without TikTok data if DB fails
    }
  }

  const totalFollowers = (youtubeData?.followers || 0) + (instagramData?.followers || 0) + (tiktokData?.followers || 0);
  const totalViews = (youtubeData?.views || 0) + (instagramData?.views || 0) + (tiktokData?.views || 0);

  const metricsData = {
    totalFollowers,
    totalViews,
    followerGrowth: 0,
    viewGrowth: 0,
    youtube: youtubeData,
    instagram: instagramData,
    tiktok: tiktokData,
  };

  return (
    <DashboardClient
      subscription={mockSubscriptionData}
      metrics={metricsData}
      user={user}
    />
  );
}
