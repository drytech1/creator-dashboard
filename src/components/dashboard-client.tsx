"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SubscriptionCard } from "@/components/subscription-card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Youtube,
  Instagram,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  platform?: "youtube" | "instagram";
}

function MetricCard({ title, value, change, icon, platform }: MetricCardProps) {
  const isPositive = change >= 0;
  const platformColor =
    platform === "youtube"
      ? "text-red-600"
      : platform === "instagram"
      ? "text-pink-600"
      : "text-blue-600";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={platformColor}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={`flex items-center text-xs ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {change}% from yesterday
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

interface PlatformCardProps {
  platform: "youtube" | "instagram";
  followers: number;
  views: number;
  followerChange: number;
  viewChange: number;
  isConnected: boolean;
}

function PlatformCard({
  platform,
  followers,
  views,
  followerChange,
  viewChange,
  isConnected,
}: PlatformCardProps) {
  const Icon = platform === "youtube" ? Youtube : Instagram;
  const name = platform === "youtube" ? "YouTube" : "Instagram";
  const colorClass =
    platform === "youtube"
      ? "bg-red-50 border-red-200"
      : "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200";

  if (!isConnected) {
    return (
      <Card className={`${colorClass} border-dashed`}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Icon
            className={`h-12 w-12 mb-4 ${
              platform === "youtube" ? "text-red-400" : "text-pink-400"
            }`}
          />
          <h3 className="font-semibold mb-2">Connect {name}</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Link your {name} account to track metrics
          </p>
          <Button variant="outline">Connect {name}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={colorClass}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            className={`h-5 w-5 ${
              platform === "youtube" ? "text-red-600" : "text-pink-600"
            }`}
          />
          <CardTitle className="text-lg">{name}</CardTitle>
        </div>
        <Badge variant="secondary">Connected</Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Followers</p>
          <p className="text-2xl font-bold">{followers.toLocaleString()}</p>
          <p
            className={`text-xs ${
              followerChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {followerChange >= 0 ? "+" : ""}
            {followerChange.toLocaleString()} today
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Views</p>
          <p className="text-2xl font-bold">{views.toLocaleString()}</p>
          <p
            className={`text-xs ${
              viewChange >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {viewChange >= 0 ? "+" : ""}
            {viewChange.toLocaleString()} today
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardClientProps {
  subscription: {
    daysLeft: number;
    trialActive: boolean;
    subscriptionStatus: string;
    subscriptionActive: boolean;
    hasAccess: boolean;
  };
  metrics: {
    totalFollowers: number;
    totalViews: number;
    followerGrowth: number;
    viewGrowth: number;
    youtube: {
      followers: number;
      views: number;
      followerGrowth: number;
      viewGrowth: number;
    } | null;
    instagram: {
      followers: number;
      views: number;
      followerGrowth: number;
      viewGrowth: number;
    } | null;
  } | null;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function DashboardClient({
  subscription,
  metrics,
  user,
}: DashboardClientProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refresh data - in production, this would trigger metric fetch
    window.location.reload();
  };

  // Calculate percentages for display
  const followerGrowthPct =
    metrics && metrics.totalFollowers > 0
      ? (metrics.followerGrowth / metrics.totalFollowers) * 100
      : 0;
  const viewGrowthPct =
    metrics && metrics.totalViews > 0
      ? (metrics.viewGrowth / metrics.totalViews) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Creator Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.name || user.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Subscription Card */}
        <div className="mb-8">
          <SubscriptionCard
            daysLeft={subscription.daysLeft}
            trialActive={subscription.trialActive}
            subscriptionStatus={subscription.subscriptionStatus}
            subscriptionActive={subscription.subscriptionActive}
          />
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Total Followers"
            value={metrics?.totalFollowers.toLocaleString() || "0"}
            change={parseFloat(followerGrowthPct.toFixed(1))}
            icon={<Users className="h-4 w-4" />}
          />
          <MetricCard
            title="Total Views"
            value={metrics?.totalViews.toLocaleString() || "0"}
            change={parseFloat(viewGrowthPct.toFixed(1))}
            icon={<Eye className="h-4 w-4" />}
          />
          <MetricCard
            title="YouTube Views"
            value={metrics?.youtube?.views.toLocaleString() || "0"}
            change={5.2}
            icon={<Youtube className="h-4 w-4" />}
            platform="youtube"
          />
          <MetricCard
            title="Instagram Reach"
            value={metrics?.instagram?.views.toLocaleString() || "0"}
            change={8.4}
            icon={<Instagram className="h-4 w-4" />}
            platform="instagram"
          />
        </div>

        {/* Platform Cards */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <PlatformCard
            platform="youtube"
            followers={metrics?.youtube?.followers || 0}
            views={metrics?.youtube?.views || 0}
            followerChange={metrics?.youtube?.followerGrowth || 0}
            viewChange={metrics?.youtube?.viewGrowth || 0}
            isConnected={!!metrics?.youtube}
          />
          <PlatformCard
            platform="instagram"
            followers={metrics?.instagram?.followers || 0}
            views={metrics?.instagram?.views || 0}
            followerChange={metrics?.instagram?.followerGrowth || 0}
            viewChange={metrics?.instagram?.viewGrowth || 0}
            isConnected={!!metrics?.instagram}
          />
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh Data"}
          </Button>
          <Button variant="outline" disabled={!subscription.hasAccess}>
            Export Report
          </Button>
          <Button variant="ghost" className="ml-auto">
            Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
