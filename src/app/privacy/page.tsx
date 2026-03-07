import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">CreatorDash</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mt-2">Last updated: March 7, 2026</p>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: March 6, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              Creator Dashboard collects only the information necessary to provide our analytics service:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Account information (email, name) when you sign in</li>
              <li>Social media metrics (follower counts, views, engagement) via official APIs</li>
              <li>Public profile information from connected platforms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use your information solely to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Display your analytics dashboard</li>
              <li>Generate reports and insights</li>
              <li>Send important account notifications</li>
              <li>Improve our service functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Data Sharing</h2>
            <p className="text-gray-600">
              We do not sell, trade, or rent your personal information to third parties. 
              We only share data with the social media platforms you connect (YouTube, Instagram) 
              through their official APIs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-gray-600">
              We implement industry-standard security measures including encryption, 
              secure API connections, and regular security audits to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Disconnect your social accounts at any time</li>
              <li>Delete your account and associated data</li>
              <li>Export your analytics data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:support@creatordash.app" className="text-blue-600 hover:underline">
                support@creatordash.app
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; 2026 CreatorDash. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
