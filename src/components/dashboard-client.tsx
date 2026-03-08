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
  FileText,
  Table,
  Music,
  Plus,
  Trash2,
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
  platform: "youtube" | "instagram" | "tiktok";
  followers: number;
  views: number;
  followerChange: number;
  viewChange: number;
  isConnected: boolean;
  username?: string | null;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

function PlatformCard({
  platform,
  followers,
  views,
  followerChange,
  viewChange,
  isConnected,
  username,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const Icon = platform === "youtube" ? Youtube : platform === "instagram" ? Instagram : Music;
  const name = platform === "youtube" ? "YouTube" : platform === "instagram" ? "Instagram" : "TikTok";
  const colorClass =
    platform === "youtube"
      ? "bg-red-50 border-red-200"
      : platform === "instagram"
      ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200"
      : "bg-gray-900 border-gray-800 text-white";

  const iconColor =
    platform === "youtube"
      ? "text-red-400"
      : platform === "instagram"
      ? "text-pink-400"
      : "text-white";

  const iconColorConnected =
    platform === "youtube"
      ? "text-red-600"
      : platform === "instagram"
      ? "text-pink-600"
      : "text-white";

  if (!isConnected) {
    return (
      <Card className={`${colorClass} border-dashed`}>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Icon className={`h-12 w-12 mb-4 ${iconColor}`} />
          <h3 className={`font-semibold mb-2 ${platform === "tiktok" ? "text-white" : ""}`}>Connect {name}</h3>
          <p className={`text-sm text-center mb-4 ${platform === "tiktok" ? "text-gray-300" : "text-muted-foreground"}`}>
            {platform === "tiktok" 
              ? "Enter your TikTok stats manually from Creator Portal"
              : `Link your ${name} account to track metrics`}
          </p>
          <Button
            variant="outline"
            onClick={onConnect}
            className={platform === "tiktok" ? "bg-white text-gray-900 border-white hover:bg-gray-100" : ""}
          >
            {platform === "tiktok" ? "Add TikTok Stats" : `Connect ${name}`}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={colorClass}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColorConnected}`} />
          <CardTitle className={`text-lg ${platform === "tiktok" ? "text-white" : ""}`}>{name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={platform === "tiktok" ? "outline" : "secondary"} className={platform === "tiktok" ? "border-white text-white" : ""}>
            Connected
          </Badge>
          {onDisconnect && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${platform === "tiktok" ? "text-white hover:bg-white/10" : "text-red-500 hover:text-red-700"}`}
              onClick={onDisconnect}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className={`text-sm ${platform === "tiktok" ? "text-gray-300" : "text-muted-foreground"}`}>Followers</p>
          <p className={`text-2xl font-bold ${platform === "tiktok" ? "text-white" : ""}`}>{followers.toLocaleString()}</p>
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
          <p className={`text-sm ${platform === "tiktok" ? "text-gray-300" : "text-muted-foreground"}`}>Views</p>
          <p className={`text-2xl font-bold ${platform === "tiktok" ? "text-white" : ""}`}>{views.toLocaleString()}</p>
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
      {username && (
        <CardContent className="pt-0">
          <p className={`text-sm ${platform === "tiktok" ? "text-gray-400" : "text-muted-foreground"}`}>
            @{username}
          </p>
        </CardContent>
      )}
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
    tiktok: {
      followers: number;
      views: number;
      likes: number;
      followerGrowth: number;
      viewGrowth: number;
      username: string | null;
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
  const [showTikTokModal, setShowTikTokModal] = useState(false);
  const [tiktokForm, setTiktokForm] = useState({
    username: "",
    followers: "",
    views: "",
    likes: "",
  });
  const [isSubmittingTikTok, setIsSubmittingTikTok] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(!!metrics?.tiktok);
  const [tiktokData, setTiktokData] = useState(metrics?.tiktok);

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

    // TikTok Section
    if (metrics?.tiktok) {
      doc.setFontSize(14);
      doc.text("TikTok", 14, (doc as any).lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [["Metric", "Value"]],
        body: [
          ["Followers", metrics.tiktok.followers.toLocaleString()],
          ["Total Views", metrics.tiktok.views.toLocaleString()],
          ["Total Likes", metrics.tiktok.likes.toLocaleString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [0, 0, 0] },
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

    if (metrics?.tiktok) {
      csvContent += "TikTok\n";
      csvContent += "Metric,Value\n";
      csvContent += `Followers,${metrics.tiktok.followers}\n`;
      csvContent += `Total Views,${metrics.tiktok.views}\n`;
      csvContent += `Total Likes,${metrics.tiktok.likes}\n\n`;
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

  const handleTikTokSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTikTok(true);

    try {
      const response = await fetch("/api/tiktok", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: tiktokForm.username,
          followers: parseInt(tiktokForm.followers) || 0,
          views: parseInt(tiktokForm.views) || 0,
          likes: parseInt(tiktokForm.likes) || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTiktokConnected(true);
        setTiktokData({
          followers: data.metric.followers,
          views: data.metric.views,
          likes: parseInt(tiktokForm.likes) || 0,
          followerGrowth: data.metric.followerGrowth,
          viewGrowth: data.metric.viewGrowth,
          username: tiktokForm.username,
        });
        setShowTikTokModal(false);
        setTiktokForm({ username: "", followers: "", views: "", likes: "" });
      } else {
        alert("Failed to save TikTok data");
      }
    } catch (error) {
      console.error("Error saving TikTok data:", error);
      alert("Failed to save TikTok data");
    } finally {
      setIsSubmittingTikTok(false);
    }
  };

  const handleTikTokDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect TikTok?")) return;

    try {
      const response = await fetch("/api/tiktok", { method: "DELETE" });
      if (response.ok) {
        setTiktokConnected(false);
        setTiktokData(null);
      } else {
        alert("Failed to disconnect TikTok");
      }
    } catch (error) {
      console.error("Error disconnecting TikTok:", error);
      alert("Failed to disconnect TikTok");
    }
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
          <PlatformCard
            platform="tiktok"
            followers={tiktokData?.followers || 0}
            views={tiktokData?.views || 0}
            followerChange={tiktokData?.followerGrowth || 0}
            viewChange={tiktokData?.viewGrowth || 0}
            isConnected={tiktokConnected}
            username={tiktokData?.username}
            onConnect={() => setShowTikTokModal(true)}
            onDisconnect={handleTikTokDisconnect}
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

      {/* TikTok Modal */}
      {showTikTokModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Add TikTok Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTikTokSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    TikTok Username
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={tiktokForm.username}
                    onChange={(e) =>
                      setTiktokForm({ ...tiktokForm, username: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Followers
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tiktokForm.followers}
                    onChange={(e) =>
                      setTiktokForm({ ...tiktokForm, followers: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Total Views
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tiktokForm.views}
                    onChange={(e) =>
                      setTiktokForm({ ...tiktokForm, views: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Total Likes (optional)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tiktokForm.likes}
                    onChange={(e) =>
                      setTiktokForm({ ...tiktokForm, likes: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Find these stats in your TikTok Creator Portal under Analytics.
                </p>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowTikTokModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmittingTikTok}
                  >
                    {isSubmittingTikTok ? "Saving..." : "Save Stats"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
