import { DashboardClient } from "@/components/dashboard-client";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

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
      followerGrowth: 0, // Would need historical data
      viewGrowth: 0, // Would need historical data
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
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

  // Fetch real YouTube data if authenticated
  const youtubeData = session?.accessToken 
    ? await getYouTubeData(session.accessToken as string)
    : null;

  const metricsData = {
    totalFollowers: youtubeData?.followers || 0,
    totalViews: youtubeData?.views || 0,
    followerGrowth: youtubeData?.followerGrowth || 0,
    viewGrowth: youtubeData?.viewGrowth || 0,
    youtube: youtubeData,
    instagram: null, // Not connected yet
  };

  return (
    <DashboardClient
      subscription={mockSubscriptionData}
      metrics={metricsData}
      user={user}
    />
  );
}
