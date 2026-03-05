import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard-client";

async function getSubscriptionData(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Return default trial data for new users
    return {
      daysLeft: 7,
      trialActive: true,
      subscriptionStatus: "trialing",
      subscriptionActive: false,
      hasAccess: true,
    };
  }

  const trialEnd = new Date(user.trialStart);
  trialEnd.setDate(trialEnd.getDate() + user.trialDays);

  const now = new Date();
  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const trialActive = daysLeft > 0 && user.subscriptionStatus === "trialing";
  const subscriptionActive = user.subscriptionStatus === "active";
  const hasAccess = trialActive || subscriptionActive;

  return {
    daysLeft: Math.max(0, daysLeft),
    trialActive,
    subscriptionStatus: user.subscriptionStatus,
    subscriptionActive,
    hasAccess,
  };
}

async function getMetricsData(userId: string) {
  const metrics = await prisma.metric.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 30,
  });

  // Aggregate by platform
  const youtubeMetrics = metrics.filter((m) => m.platform === "youtube");
  const instagramMetrics = metrics.filter((m) => m.platform === "instagram");

  const latestYoutube = youtubeMetrics[0];
  const latestInstagram = instagramMetrics[0];

  const totalFollowers = 
    (latestYoutube?.followers || 0) + (latestInstagram?.followers || 0);
  const totalViews = 
    (latestYoutube?.views || 0) + (latestInstagram?.views || 0);

  return {
    totalFollowers,
    totalViews,
    followerGrowth: 
      (latestYoutube?.followerGrowth || 0) + (latestInstagram?.followerGrowth || 0),
    viewGrowth: 
      (latestYoutube?.viewGrowth || 0) + (latestInstagram?.viewGrowth || 0),
    youtube: latestYoutube
      ? {
          followers: latestYoutube.followers,
          views: latestYoutube.views,
          followerGrowth: latestYoutube.followerGrowth,
          viewGrowth: latestYoutube.viewGrowth,
        }
      : null,
    instagram: latestInstagram
      ? {
          followers: latestInstagram.followers,
          views: latestInstagram.views,
          followerGrowth: latestInstagram.followerGrowth,
          viewGrowth: latestInstagram.viewGrowth,
        }
      : null,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const subscriptionData = await getSubscriptionData(session.user.email);

  // Get user for metrics lookup
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const metricsData = user ? await getMetricsData(user.id) : null;

  return (
    <DashboardClient
      subscription={subscriptionData}
      metrics={metricsData}
      user={session.user}
    />
  );
}
