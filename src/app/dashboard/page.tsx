import { DashboardClient } from "@/components/dashboard-client";

// Mock data for demo
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

const mockUser = {
  name: "Demo User",
  email: "demo@example.com",
  image: null,
};

export default function DashboardPage() {
  return (
    <DashboardClient
      subscription={mockSubscriptionData}
      metrics={mockMetricsData}
      user={mockUser}
    />
  );
}
