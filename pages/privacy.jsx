export default function Privacy() {
  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f8fafc;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 20px 0;
          margin-bottom: 40px;
        }
        .header-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #2563eb;
          font-weight: bold;
          font-size: 1.25rem;
        }
        .logo svg {
          width: 28px;
          height: 28px;
        }
        .back-link {
          color: #64748b;
          text-decoration: none;
          font-size: 0.875rem;
        }
        .back-link:hover {
          color: #2563eb;
        }
        h1 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: #1e293b;
        }
        .last-updated {
          color: #64748b;
          font-size: 0.875rem;
          margin-bottom: 30px;
        }
        h2 {
          font-size: 1.25rem;
          margin-top: 30px;
          margin-bottom: 15px;
          color: #1e293b;
        }
        p {
          margin-bottom: 15px;
          color: #475569;
        }
        ul {
          margin-bottom: 15px;
          margin-left: 20px;
          color: #475569;
        }
        li {
          margin-bottom: 8px;
        }
        a {
          color: #2563eb;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        footer {
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 30px 0;
          margin-top: 60px;
          text-align: center;
        }
        .footer-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          color: #64748b;
          font-size: 0.875rem;
        }
        .footer-links {
          margin-top: 15px;
        }
        .footer-links a {
          color: #64748b;
          margin: 0 10px;
        }
        .footer-links a:hover {
          color: #2563eb;
        }
      `}</style>

      <header>
        <div className="header-content">
          <a href="/" className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v16a2 2 0 0 0 2 2h16"></path>
              <path d="M18 17V9"></path>
              <path d="M13 17V5"></path>
              <path d="M8 17v-3"></path>
            </svg>
            CreatorDash
          </a>
          <a href="/" className="back-link">← Back to Home</a>
        </div>
      </header>

      <div className="container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last updated: March 25, 2026</p>

        <h2>1. Information We Collect</h2>
        <p>CreatorDash collects only the information necessary to provide our analytics service:</p>
        <ul>
          <li>Account information (email, name) when you sign in</li>
          <li>Social media metrics (follower counts, views, engagement) via official APIs</li>
          <li>Public profile information from connected platforms</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information solely to:</p>
        <ul>
          <li>Display your analytics dashboard</li>
          <li>Generate reports and insights</li>
          <li>Send important account notifications</li>
          <li>Improve our service functionality</li>
        </ul>

        <h2>3. Data Storage</h2>
        <p>All data is stored securely in our database. We implement industry-standard encryption and security measures to protect your information.</p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We only share data with the social media platforms you connect (YouTube, Instagram, TikTok) through their official APIs.</p>

        <h2>5. Data Security</h2>
        <p>We implement industry-standard security measures including:</p>
        <ul>
          <li>Secure API connections with OAuth authentication</li>
          <li>Encrypted data storage</li>
          <li>Regular security updates</li>
          <li>HTTPS encryption for all connections</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Disconnect your social accounts at any time</li>
          <li>Delete your account and associated data</li>
          <li>Export your analytics data</li>
        </ul>

        <h2>7. Cookies</h2>
        <p>We use essential cookies to maintain your session and authentication status. We do not use tracking cookies or third-party analytics without your consent.</p>

        <h2>8. Third-Party Services</h2>
        <p>We integrate with the following third-party services:</p>
        <ul>
          <li>YouTube Data API</li>
          <li>Instagram Basic Display API</li>
          <li>TikTok Business API</li>
          <li>Stripe for payment processing</li>
        </ul>
        <p>Each of these services has their own privacy policies that govern how they handle your data.</p>

        <h2>9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>

        <h2>10. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:support@creatordash.app">support@creatordash.app</a></p>
      </div>

      <footer>
        <div className="footer-content">
          <p>&copy; 2026 CreatorDash. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </footer>
    </>
  );
}
