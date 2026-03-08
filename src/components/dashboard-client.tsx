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
  Download,
  FileText,
  Table,
} from "lucide-react";
import { signOut } from "next-auth/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [isExporting, setIsExporting] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refresh data - in production, this would trigger metric fetch
    window.location.reload();
  };

  const exportToPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text("CreatorDash Analytics Report", 14, 20);

    // Date
    doc.setFontSize(12);
    doc.text(`Generated on: ${today}`, 14, 30);
    doc.text(`User: ${user.name || user.email}`, 14, 38);

    // Summary Section
    doc.setFontSize(14);
    doc.text("Summary", 14, 50);

    const summaryData = [
      ["Metric", "Value"],
      ["Total Followers", metrics?.totalFollowers.toLocaleString() || "0"],
      ["Total Views", metrics?.totalViews.toLocaleString() || "0"],
    ];

    autoTable(doc, {
      startY: 55,
      head: [summaryData[0]],
      body: summaryData.slice(1),
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
    });

    // YouTube Section
    if (metrics?.youtube) {
      doc.setFontSize(14);
      doc.text("YouTube", 14, (doc as any).lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["Metric", "Value"]],
        body: [
          ["Subscribers", metrics.youtube.followers.toLocaleString()],
          ["Total Views", metrics.youtube.views.toLocaleString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [239, 68, 68] },
      });
    }

    // Instagram Section
    if (metrics?.instagram) {
      doc.setFontSize(14);
      doc.text("Instagram", 14, (doc as any).lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["Metric", "Value"]],
        body: [
          ["Followers", metrics.instagram.followers.toLocaleString()],
          ["Total Reach", metrics.instagram.views.toLocaleString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [236, 72, 153] },
      });
    }

    // Footer
    doc.setFontSize(10);
    doc.text("Generated by CreatorDash", 14, 280);

    doc.save(`creatordash-report-${new Date().toISOString().split("T")[0]}.pdf`);
    setIsExporting(false);
  };

  const exportToCSV = () => {
    setIsExporting(true);
    const today = new Date().toLocaleDateString();

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "CreatorDash Analytics Report\n";
    csvContent += `Generated on,${today}\n`;
    csvContent += `User,${user.name || user.email}\n\n`;

    csvContent += "Summary\n";
    csvContent += "Metric,Value\n";
    csvContent += `Total Followers,${metrics?.totalFollowers || 0}\n`;
    csvContent += `Total Views,${metrics?.totalViews || 0}\n\n`;

    if (metrics?.youtube) {
      csvContent += "YouTube\n";
      csvContent += "Metric,Value\n";
      csvContent += `Subscribers,${metrics.youtube.followers}\n`;
      csvContent += `Total Views,${metrics.youtube.views}\n\n`;
    }

    if (metrics?.instagram) {
      csvContent += "Instagram\n";
      csvContent += "Metric,Value\n";
      csvContent += `Followers,${metrics.instagram.followers}\n`;
      csvContent += `Total Reach,${metrics.instagram.views}\n\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `creatordash-report-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExporting(false);
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
          <Button
            variant="outline"
            onClick={exportToPDF}
            disabled={!subscription.hasAccess || isExporting}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            disabled={!subscription.hasAccess || isExporting}
            className="gap-2"
          >
            <Table className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button variant="ghost" className="ml-auto">
            Settings
          </Button>
        </div>
      </main>
    </div>
  );
}
