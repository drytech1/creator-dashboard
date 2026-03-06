import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";

export default function DataDeletionPage() {
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
          <Trash2 className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold">Data Deletion Instructions</h1>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: March 6, 2026
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Important Notice</h3>
                <p className="text-amber-700 text-sm">
                  Deleting your data is permanent and cannot be undone. Please ensure you have 
                  exported any analytics data you wish to keep before proceeding.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">How to Delete Your Data</h2>
            <p className="text-gray-600 mb-4">
              You have several options to delete your data from Creator Dashboard:
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Option 1: Disconnect Social Accounts</h2>
            <p className="text-gray-600 mb-4">
              To remove your social media data while keeping your account:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Log in to your Creator Dashboard account</li>
              <li>Go to <strong>Settings</strong> → <strong>Connected Accounts</strong></li>
              <li>Click <strong>Disconnect</strong> next to any connected platform</li>
              <li>Confirm the disconnection</li>
            </ol>
            <p className="text-gray-600 mt-4">
              This will immediately remove all data fetched from that platform from our servers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Option 2: Delete Your Account</h2>
            <p className="text-gray-600 mb-4">
              To permanently delete your entire account and all associated data:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Log in to your Creator Dashboard account</li>
              <li>Go to <strong>Settings</strong> → <strong>Account</strong></li>
              <li>Scroll to the bottom and click <strong>Delete Account</strong></li>
              <li>Confirm your decision by entering your password</li>
              <li>Click <strong>Permanently Delete Account</strong></li>
            </ol>
            <p className="text-gray-600 mt-4">
              This will delete:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-2">
              <li>Your account profile and login credentials</li>
              <li>All connected social media data</li>
              <li>All analytics and metrics data</li>
              <li>Journal entries and notes</li>
              <li>Subscription and billing information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Option 3: Request Data Deletion via Email</h2>
            <p className="text-gray-600 mb-4">
              If you cannot access your account or need assistance:
            </p>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 ml-4">
              <li>Send an email to{' '}
                <a href="mailto:support@creatordash.app" className="text-blue-600 hover:underline">
                  support@creatordash.app
                </a>
              </li>
              <li>Use subject line: <strong>Data Deletion Request</strong></li>
              <li>Include your registered email address</li>
              <li>We will process your request within 30 days</li>
              <li>You will receive confirmation once your data has been deleted</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">What Data is Deleted</h2>
            <p className="text-gray-600 mb-4">
              When you request data deletion, we remove:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Personal information (name, email, profile picture)</li>
              <li>Social media connection tokens</li>
              <li>Analytics data (followers, views, engagement metrics)</li>
              <li>User preferences and settings</li>
              <li>Payment and subscription history</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">What Data is Retained</h2>
            <p className="text-gray-600 mb-4">
              We may retain certain data as required by law:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Payment records for tax and accounting purposes (7 years)</li>
              <li>Anonymized usage analytics (no personal identifiers)</li>
              <li>Data required for legal compliance or disputes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Third-Party Data</h2>
            <p className="text-gray-600">
              Disconnecting your social accounts from Creator Dashboard does not delete your 
              data from the social platforms themselves (YouTube, Instagram). To delete data 
              from those platforms, you must contact them directly or use their account 
              deletion tools.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about data deletion, please contact us at:{' '}
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
