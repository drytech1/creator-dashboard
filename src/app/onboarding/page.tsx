"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Youtube, Instagram, User, Mail, Phone, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    youtubeUsername: "",
    youtubePassword: "",
    facebookUsername: "",
    facebookPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to database
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6 pb-6">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to CreatorDash!</h2>
            <p className="text-muted-foreground mb-6">
              Your account is being set up. We&apos;ll connect your platforms within 24 hours.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Setup</h1>
          <p className="text-muted-foreground">
            Step {step} of 2 • We need your platform credentials to sync your data
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Contact Information" : "Platform Credentials"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={step === 1 ? () => setStep(2) : handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Continue to Platform Credentials
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700">
                      <strong>Security Note:</strong> Your credentials are encrypted and stored securely. 
                      We only use them to sync your analytics data.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-red-600" />
                      YouTube Credentials
                    </h3>
                    <div>
                      <Label htmlFor="youtubeUsername">YouTube Username / Email</Label>
                      <Input
                        id="youtubeUsername"
                        value={formData.youtubeUsername}
                        onChange={(e) =>
                          setFormData({ ...formData, youtubeUsername: e.target.value })
                        }
                        placeholder="yourchannel@gmail.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="youtubePassword">
                        <Lock className="h-4 w-4 inline mr-2" />
                        YouTube Password
                      </Label>
                      <Input
                        id="youtubePassword"
                        type="password"
                        value={formData.youtubePassword}
                        onChange={(e) =>
                          setFormData({ ...formData, youtubePassword: e.target.value })
                        }
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Instagram className="h-5 w-5 text-pink-600" />
                      Facebook/Instagram Credentials
                    </h3>
                    <div>
                      <Label htmlFor="facebookUsername">Facebook Username / Email</Label>
                      <Input
                        id="facebookUsername"
                        value={formData.facebookUsername}
                        onChange={(e) =>
                          setFormData({ ...formData, facebookUsername: e.target.value })
                        }
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebookPassword">
                        <Lock className="h-4 w-4 inline mr-2" />
                        Facebook Password
                      </Label>
                      <Input
                        id="facebookPassword"
                        type="password"
                        value={formData.facebookPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, facebookPassword: e.target.value })
                        }
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Complete Setup
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Questions? Contact us at support@weekendprofitlab.com
        </p>
      </div>
    </div>
  );
}
