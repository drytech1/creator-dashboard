"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";

interface SubscriptionCardProps {
  daysLeft: number;
  trialActive: boolean;
  subscriptionStatus: string;
  subscriptionActive: boolean;
}

export function SubscriptionCard({
  daysLeft,
  trialActive,
  subscriptionStatus,
  subscriptionActive,
}: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (subscriptionActive) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Subscription Active</CardTitle>
          </div>
          <Badge variant="default" className="bg-green-600">
            $29/month
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            You have full access to all features.
          </p>
          <Button
            variant="outline"
            onClick={handleManage}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ExternalLink className="mr-2 h-4 w-4" />
            )}
            Manage Subscription
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (trialActive) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Pro Trial</CardTitle>
          </div>
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            {daysLeft} days left
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Enjoy full access during your trial. Subscribe anytime to keep your
            data syncing.
          </p>
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            Subscribe Now — $29/month
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Trial expired, no subscription
  return (
    <Card className="bg-red-50 border-red-200">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-red-600" />
          <CardTitle className="text-lg">Trial Expired</CardTitle>
        </div>
        <Badge variant="destructive">Access Limited</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Your trial has ended. Subscribe to continue tracking your metrics and
          access all features.
        </p>
        <Button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CreditCard className="mr-2 h-4 w-4" />
          )}
          Subscribe — $29/month
        </Button>
      </CardContent>
    </Card>
  );
}
