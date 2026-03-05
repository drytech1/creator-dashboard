import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardClient } from "@/components/dashboard-client";

// Mock data for build/Vercel deployment
const mockSubscriptionData = {
  daysLeft: 7,
  trialActive: true,
  subscriptionStatus: "trialing",
  subscriptionActive: false,
  hasAccess: true,
};

const mockMetricsData = {
  totalFollowers: 45231,
  totalViews: 892456,
  followerGrowth: 523,
  viewGrowth: 12450,
  youtube: {
    followers: 28400,
    views: 523891,
    followerGrowth: 127,
    viewGrowth: 8942,
  },
  instagram: {
    followers: 16800,
    views: 368565,
    followerGrowth: 89,
    viewGrowth: 5621,
  },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  // For now, use mock data to allow build
  // In production with database, fetch real data
  return (
    <DashboardClient
      subscription={mockSubscriptionData}
      metrics={mockMetricsData}
      user={session.user}
    />
  );
}
