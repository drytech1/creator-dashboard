export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-5">
        <div className="max-w-3xl mx-auto px-5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
              <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
            CreatorDash
          </a>
          <a href="/" className="text-gray-600 text-sm hover:text-blue-600">← Back to Home</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: March 25, 2026</p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 mb-3">CreatorDash collects only the information necessary to provide our analytics service:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Account information (email, name) when you sign in</li>
              <li>Social media metrics (follower counts, views, engagement) via official APIs</li>
              <li>Public profile information from connected platforms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use your information solely to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Display your analytics dashboard</li>
              <li>Generate reports and insights</li>
              <li>Send important account notifications</li>
              <li>Improve our service functionality</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Storage</h2>
            <p className="text-gray-700">All data is stored securely in our database. We implement industry-standard encryption and security measures to protect your information.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Sharing</h2>
            <p className="text-gray-700">We do not sell, trade, or rent your personal information to third parties. We only share data with the social media platforms you connect (YouTube, Instagram, TikTok) through their official APIs.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p className="text-gray-700 mb-3">We implement industry-standard security measures including:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Secure API connections with OAuth authentication</li>
              <li>Encrypted data storage</li>
              <li>Regular security updates</li>
              <li>HTTPS encryption for all connections</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
            <p className="text-gray-700 mb-3">You have the right to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Access your personal data</li>
              <li>Disconnect your social accounts at any time</li>
              <li>Delete your account and associated data</li>
              <li>Export your analytics data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p className="text-gray-700">We use essential cookies to maintain your session and authentication status. We do not use tracking cookies or third-party analytics without your consent.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-3">We integrate with the following third-party services:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>YouTube Data API</li>
              <li>Instagram Basic Display API</li>
              <li>TikTok Business API</li>
              <li>Stripe for payment processing</li>
            </ul>
            <p className="text-gray-700 mt-3">Each of these services has their own privacy policies that govern how they handle your data.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Changes to This Policy</h2>
            <p className="text-gray-700">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Contact Us</h2>
            <p className="text-gray-700">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:support@creatordash.app" className="text-blue-600 hover:underline">support@creatordash.app</a>
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <p className="text-gray-600 text-sm mb-4">&copy; 2026 CreatorDash. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
