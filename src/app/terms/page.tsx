import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, ArrowLeft } from "lucide-react";

export const dynamic = 'force-static';

export default function TermsPage() {
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
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: March 6, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing or using Creator Dashboard, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-gray-600">
              Creator Dashboard is an analytics platform that allows content creators to view 
              their social media metrics from YouTube and Instagram in a unified dashboard. 
              We use official APIs provided by these platforms to access your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-gray-600 mb-4">
              To use our service, you must:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Be at least 13 years old</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Have the authority to connect your social media accounts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Platform Connections</h2>
            <p className="text-gray-600 mb-4">
              By connecting your social media accounts:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>You authorize us to access your public profile and analytics data</li>
              <li>You understand we only read data and cannot post on your behalf</li>
              <li>You can disconnect accounts at any time through your settings</li>
              <li>You retain ownership of all your content and data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Subscription and Payments</h2>
            <p className="text-gray-600 mb-4">
              Creator Dashboard offers both free and paid subscription plans:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Free trial period of 7 days for new users</li>
              <li>Paid subscriptions are $10/month</li>
              <li>Payments processed securely through Stripe</li>
              <li>You can cancel your subscription at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Limitations of Liability</h2>
            <p className="text-gray-600">
              Creator Dashboard is provided &quot;as is&quot; without warranties of any kind. 
              We are not responsible for: (a) platform API changes or downtime, (b) accuracy 
              of data provided by third-party platforms, (c) any decisions made based on 
              analytics data. We do not guarantee uninterrupted or error-free service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
            <p className="text-gray-600">
              We reserve the right to terminate or suspend your account at any time for 
              violations of these terms. You may delete your account at any time through 
              your account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
            <p className="text-gray-600">
              We may update these Terms of Service from time to time. We will notify you 
              of any significant changes via email or through the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these Terms, please contact us at:{' '}
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
