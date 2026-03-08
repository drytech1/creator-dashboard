import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Youtube,
  Instagram,
  TrendingUp,
  Zap,
  Shield,
  Clock,
  ChevronRight,
  Star,
  Users,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">CreatorDash</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/signin">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6" variant="secondary">
              🚀 Now with Instagram & YouTube
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Track Your Growth Across
              <span className="text-blue-600"> All Platforms</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8">
              Unified analytics for content creators. Monitor your YouTube and
              Instagram metrics in one beautiful dashboard. No more switching
              between apps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              7-day free trial • No credit card required • $29/month after
            </p>
          </div>
        </div>
      </section>

      {/* Stats Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-muted-foreground">
                  Creators Tracked
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">1B+</div>
                <div className="text-sm text-muted-foreground">
                  Views Monitored
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-blue-600">4.9/5</div>
                <div className="text-sm text-muted-foreground">
                  User Rating
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to Grow
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful analytics and insights to help you understand your
              audience and optimize your content strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Unified Dashboard"
              description="See all your metrics in one place. No more switching between YouTube Studio and Instagram Insights."
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Growth Tracking"
              description="Monitor your daily follower growth, view counts, and engagement rates across all platforms."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Daily Updates"
              description="Fresh data every day. Your metrics are automatically updated so you always have the latest insights."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Real-time Insights"
              description="See which content is performing best and understand what drives your growth."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure & Private"
              description="Your data is encrypted and secure. We never share your information with third parties."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Audience Insights"
              description="Understand your audience demographics and behavior across platforms."
            />
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Supported Platforms</h2>
            <p className="text-muted-foreground">
              Connect your accounts and start tracking in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PlatformCard
              icon={<Youtube className="h-8 w-8 text-red-600" />}
              name="YouTube"
              description="Track subscribers, views, watch time, and video performance metrics."
              features={[
                "Subscriber count",
                "Total views",
                "Video analytics",
                "Channel growth",
              ]}
              color="red"
            />
            <PlatformCard
              icon={<Instagram className="h-8 w-8 text-pink-600" />}
              name="Instagram"
              description="Monitor followers, reach, impressions, and engagement rates."
              features={[
                "Follower growth",
                "Post reach",
                "Story insights",
                "Engagement rate",
              ]}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Free Trial</h3>
                  <div className="text-4xl font-bold mb-2">$0</div>
                  <p className="text-muted-foreground mb-6">for 7 days</p>
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Full access to all features
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      YouTube & Instagram tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Daily metric updates
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Email support
                    </li>
                  </ul>
                  <Link href="/auth/signin">
                    <Button className="w-full" variant="outline">
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-600 relative">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">
                Most Popular
              </Badge>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Pro</h3>
                  <div className="text-4xl font-bold mb-2">
                    $29
                    <span className="text-lg font-normal text-muted-foreground">
                      /month
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Billed monthly, cancel anytime
                  </p>
                  <ul className="text-left space-y-3 mb-6">
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Everything in Free Trial
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Unlimited platforms
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Historical data (1 year)
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Export reports (PDF/CSV)
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Priority support
                    </li>
                  </ul>
                  <Link href="/auth/signin">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Audience?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of creators who use CreatorDash to track their growth
            and optimize their content strategy.
          </p>
          <Link href="/auth/signin">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Free Trial
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <span className="font-bold text-xl text-white">
                  CreatorDash
                </span>
              </div>
              <p className="text-sm">
                The all-in-one analytics dashboard for content creators.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features">Features</Link>
                </li>
                <li>
                  <Link href="#pricing">Pricing</Link>
                </li>
                <li>
                  <Link href="#">Changelog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">Help Center</Link>
                </li>
                <li>
                  <Link href="#">Contact</Link>
                </li>
                <li>
                  <Link href="#">Status</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="#">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            © 2024 CreatorDash. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="text-blue-600 mb-4">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

function PlatformCard({
  icon,
  name,
  description,
  features,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  description: string;
  features: string[];
  color: string;
}) {
  return (
    <Card className={`border-${color}-200 bg-${color}-50/30`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          {icon}
          <h3 className="font-semibold text-xl">{name}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <Eye className={`h-4 w-4 text-${color}-600`} />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
