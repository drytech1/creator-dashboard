export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-600 mb-8">Last updated: March 25, 2026</p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700">By accessing or using CreatorDash, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
            <p className="text-gray-700">CreatorDash is a social media analytics dashboard that allows content creators to track and analyze their performance across multiple platforms including YouTube, Instagram, and TikTok.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Accounts</h2>
            <p className="text-gray-700 mb-3">To use CreatorDash, you must:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Be at least 13 years of age</li>
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Subscription and Billing</h2>
            <p className="text-gray-700 mb-3">CreatorDash offers a 7-day free trial followed by a $29/month subscription:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Free trial requires payment method but you won&apos;t be charged during trial</li>
              <li>Subscription auto-renews monthly unless cancelled</li>
              <li>Cancel anytime from your account settings</li>
              <li>Refunds are handled on a case-by-case basis within 14 days</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. API Usage and Rate Limits</h2>
            <p className="text-gray-700 mb-3">You agree to comply with the terms of service of any third-party platforms you connect to CreatorDash, including:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>YouTube Terms of Service</li>
              <li>Instagram Platform Policy</li>
              <li>TikTok Business Terms</li>
            </ul>
            <p className="text-gray-700 mt-3">You acknowledge that API usage is subject to rate limits imposed by these platforms.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Usage</h2>
            <p className="text-gray-700 mb-3">You retain ownership of your data. By using CreatorDash, you grant us permission to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Access your social media metrics via official APIs</li>
              <li>Store your analytics data securely on our servers</li>
              <li>Display this data in your dashboard</li>
              <li>Generate reports and insights based on your data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Prohibited Activities</h2>
            <p className="text-gray-700 mb-3">You agree not to:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>Use CreatorDash for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Share your account credentials with third parties</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Reverse engineer or attempt to extract the source code</li>
              <li>Resell or redistribute the service without authorization</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Service Availability</h2>
            <p className="text-gray-700">We strive to maintain 99.9% uptime for CreatorDash, but we do not guarantee uninterrupted access. The service may be temporarily unavailable for maintenance, updates, or factors beyond our control.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
            <p className="text-gray-700 mb-3">CreatorDash is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not warrant that:</p>
            <ul className="list-disc ml-6 text-gray-700 space-y-2">
              <li>The service will meet your specific requirements</li>
              <li>The service will be uninterrupted, timely, or error-free</li>
              <li>The results obtained from using the service will be accurate or reliable</li>
              <li>Third-party API data will always be available or accurate</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Limitation of Liability</h2>
            <p className="text-gray-700">In no event shall CreatorDash be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service, including but not limited to loss of revenue, data, or business opportunities.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
            <p className="text-gray-700">We reserve the right to modify these Terms of Service at any time. We will notify users of significant changes by email and by posting the updated terms on this page with a new &quot;Last updated&quot; date.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Termination</h2>
            <p className="text-gray-700">We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Governing Law</h2>
            <p className="text-gray-700">These Terms shall be governed by and construed in accordance with the laws of the State of Texas, United States, without regard to its conflict of law provisions.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Contact Information</h2>
            <p className="text-gray-700">
              If you have any questions about these Terms of Service, please contact us at:{' '}
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
