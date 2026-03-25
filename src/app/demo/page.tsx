"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Youtube,
  Instagram,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  ThumbsUp,
  MessageCircle,
  Share2,
  Clock,
  ArrowLeft,
  Play,
  BarChart,
  LineChart,
  Activity,
} from "lucide-react";
import Link from "next/link";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
} from "recharts";

// Sample data for demo
const growthData = [
  { date: "Jan 1", youtube: 12000, instagram: 8500 },
  { date: "Jan 8", youtube: 12500, instagram: 8900 },
  { date: "Jan 15", youtube: 13200, instagram: 9200 },
  { date: "Jan 22", youtube: 14100, instagram: 9800 },
  { date: "Jan 29", youtube: 14800, instagram: 10500 },
  { date: "Feb 5", youtube: 15600, instagram: 11200 },
  { date: "Feb 12", youtube: 16500, instagram: 12100 },
];

const viewsData = [
  { date: "Mon", youtube: 45000, instagram: 32000 },
  { date: "Tue", youtube: 52000, instagram: 38000 },
  { date: "Wed", youtube: 48000, instagram: 35000 },
  { date: "Thu", youtube: 61000, instagram: 42000 },
  { date: "Fri", youtube: 58000, instagram: 39000 },
  { date: "Sat", youtube: 72000, instagram: 51000 },
  { date: "Sun", youtube: 68000, instagram: 48000 },
];

const topVideos = [
  {
    title: "How I Grew to 100K Subscribers",
    views: "1.2M",
    likes: "45K",
    comments: "2.3K",
    platform: "youtube",
    thumbnail: "🎬",
  },
  {
    title: "Day in the Life of a Creator",
    views: "892K",
    likes: "38K",
    comments: "1.8K",
    platform: "youtube",
    thumbnail: "📹",
  },
  {
    title: "Behind the Scenes",
    views: "456K",
    likes: "52K",
    comments: "892",
    platform: "instagram",
    thumbnail: "📸",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">CreatorDash</span>
              <Badge variant="secondary" className="ml-2">
                Demo
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Demo Notice */}
      <div className="bg-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            🎯 This is a demo with sample data. 
            <Link href="/auth/signin" className="underline font-semibold ml-1">
              Start your free trial
            </Link> to see your real analytics.
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's how your content is performing across platforms.
          </p>
        </div>

        {/* Platform Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All Platforms</TabsTrigger>
            <TabsTrigger value="youtube" className="gap-2">
              <Youtube className="h-4 w-4 text-red-600" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="instagram" className="gap-2">
              <Instagram className="h-4 w-4 text-pink-600" />
              Instagram
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Users className="h-5 w-5 text-blue-600" />}
                title="Total Followers"
                value="28,600"
                change="+12.5%"
                changeType="positive"
                platforms="YouTube + Instagram"
              />
              <StatCard
                icon={<Eye className="h-5 w-5 text-green-600" />}
                title="Total Views"
                value="397K"
                change="+23.1%"
                changeType="positive"
                platforms="Last 7 days"
              />
              <StatCard
                icon={<ThumbsUp className="h-5 w-5 text-yellow-600" />}
                title="Engagement"
                value="4.8%"
                change="+0.3%"
                changeType="positive"
                platforms="Avg. across platforms"
              />
              <StatCard
                icon={<Clock className="h-5 w-5 text-purple-600" />}
                title="Watch Time"
                value="24.5K"
                change="-2.1%"
                changeType="negative"
                platforms="Hours this week"
              />
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Follower Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={growthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="youtube"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="YouTube"
                        />
                        <Line
                          type="monotone"
                          dataKey="instagram"
                          stroke="#ec4899"
                          strokeWidth={2}
                          name="Instagram"
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart className="h-5 w-5 text-green-600" />
                    Weekly Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="youtube" fill="#ef4444" name="YouTube" />
                        <Bar dataKey="instagram" fill="#ec4899" name="Instagram" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Content */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Play className="h-5 w-5 text-purple-600" />
                  Top Performing Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVideos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-3xl">{video.thumbnail}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{video.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {video.platform === "youtube" ? (
                              <Youtube className="h-3 w-3 text-red-600" />
                            ) : (
                              <Instagram className="h-3 w-3 text-pink-600" />
                            )}
                            {video.platform === "youtube" ? "YouTube" : "Instagram"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {video.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {video.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {video.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Platform Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <PlatformBreakdown
                icon={<Youtube className="h-6 w-6 text-red-600" />}
                name="YouTube"
                followers="16,500"
                followersChange="+8.2%"
                views="456K"
                viewsChange="+15.3%"
                color="red"
              />
              <PlatformBreakdown
                icon={<Instagram className="h-6 w-6 text-pink-600" />}
                name="Instagram"
                followers="12,100"
                followersChange="+18.7%"
                views="298K"
                viewsChange="+32.1%"
                color="pink"
              />
            </div>
          </TabsContent>

          <TabsContent value="youtube" className="mt-6">
            <YouTubeDemo />
          </TabsContent>

          <TabsContent value="instagram" className="mt-6">
            <InstagramDemo />
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to See Your Real Analytics?
            </h2>
            <p className="text-blue-100 mb-6 max-w-xl mx-auto">
              Connect your YouTube and Instagram accounts to get personalized insights
              and track your growth in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Free Trial
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
            <p className="text-blue-200 text-sm mt-4">
              7-day free trial • No credit card required
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  change,
  changeType,
  platforms,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  platforms: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-sm">{title}</span>
          {icon}
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              changeType === "positive" ? "text-green-600" : "text-red-600"
            }`}
          >
            {changeType === "positive" ? "↑" : "↓"} {change}
          </span>
          <span className="text-xs text-muted-foreground">{platforms}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function PlatformBreakdown({
  icon,
  name,
  followers,
  followersChange,
  views,
  viewsChange,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  followers: string;
  followersChange: string;
  views: string;
  viewsChange: string;
  color: string;
}) {
  return (
    <Card className={`border-${color}-200`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Followers</p>
            <p className="text-xl font-bold">{followers}</p>
            <p className="text-sm text-green-600">{followersChange}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Views (7d)</p>
            <p className="text-xl font-bold">{views}</p>
            <p className="text-sm text-green-600">{viewsChange}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function YouTubeDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-red-600" />}
          title="Subscribers"
          value="16,500"
          change="+8.2%"
          changeType="positive"
          platforms="This month"
        />
        <StatCard
          icon={<Eye className="h-5 w-5 text-red-600" />}
          title="Total Views"
          value="2.4M"
          change="+15.3%"
          changeType="positive"
          platforms="All time"
        />
        <StatCard
          icon={<Activity className="h-5 w-5 text-red-600" />}
          title="Avg. Watch Time"
          value="4:32"
          change="+12s"
          changeType="positive"
          platforms="Per video"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Subscriber Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="youtube"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Subscribers"
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InstagramDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<Users className="h-5 w-5 text-pink-600" />}
          title="Followers"
          value="12,100"
          change="+18.7%"
          changeType="positive"
          platforms="This month"
        />
        <StatCard
          icon={<Eye className="h-5 w-5 text-pink-600" />}
          title="Reach"
          value="89.2K"
          change="+32.1%"
          changeType="positive"
          platforms="Last 7 days"
        />
        <StatCard
          icon={<ThumbsUp className="h-5 w-5 text-pink-600" />}
          title="Engagement"
          value="6.2%"
          change="+0.8%"
          changeType="positive"
          platforms="Avg. rate"
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Follower Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="instagram"
                  stroke="#ec4899"
                  strokeWidth={2}
                  name="Followers"
                />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
