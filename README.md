# 🚀 Creator Dashboard

A unified analytics dashboard for social media content creators. Track your YouTube and Instagram growth in one place.

## Features

- 📊 **Unified Dashboard** — View all your metrics in one place
- 📺 **YouTube Integration** — Track subscribers, views, and growth
- 📸 **Instagram Integration** — Monitor followers and engagement
- 💳 **Subscriptions** — 7-day free trial, then $10/month
- 📈 **Daily Metrics** — Automatic daily data fetching
- 🔐 **Secure OAuth** — Safe authentication with Google and Facebook

## Tech Stack

- **Framework:** Next.js 16 + React 19
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** SQLite (Prisma ORM)
- **Auth:** NextAuth.js (Google, Facebook)
- **Payments:** Stripe
- **Cron:** OpenClaw / External

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/creator-dashboard.git
cd creator-dashboard
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your keys
```

Required variables:
- `DATABASE_URL` — SQLite file path
- `NEXTAUTH_SECRET` — Random string (generate: `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` — For YouTube OAuth
- `FACEBOOK_APP_ID` & `FACEBOOK_APP_SECRET` — For Instagram OAuth
- `STRIPE_SECRET_KEY` & `STRIPE_PRICE_ID` — For payments
- `CRON_SECRET` — For cron job security

### 3. Database Setup

```bash
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

- [OAuth Setup](./OAUTH_SETUP.md) — Configure YouTube and Instagram login
- [Stripe Setup](./STRIPE_SETUP.md) — Set up payments
- [Cron Setup](./CRON_SETUP.md) — Configure daily metric fetching
- [Deployment Guide](./DEPLOYMENT.md) — Deploy to production

## Project Structure

```
creator-dashboard/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # NextAuth configuration
│   │   │   ├── cron/       # Cron job endpoints
│   │   │   ├── stripe/     # Stripe webhooks
│   │   │   ├── youtube/    # YouTube API
│   │   │   └── instagram/  # Instagram API
│   │   ├── auth/signin/    # Sign-in page
│   │   ├── dashboard/      # Dashboard page
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── dashboard-client.tsx
│   │   └── subscription-card.tsx
│   └── lib/               # Utilities
│       ├── prisma.ts      # Database client
│       └── stripe.ts      # Stripe helpers
├── prisma/
│   └── schema.prisma      # Database schema
├── scripts/
│   └── fetch-metrics.ts   # Manual metric fetch
└── docs/
    ├── OAUTH_SETUP.md
    ├── STRIPE_SETUP.md
    ├── CRON_SETUP.md
    └── DEPLOYMENT.md
```

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/auth/signin/google` | Sign in with YouTube |
| `POST /api/auth/signin/facebook` | Sign in with Instagram |
| `GET /api/youtube` | Fetch YouTube stats |
| `GET /api/instagram` | Fetch Instagram stats |
| `POST /api/stripe/checkout` | Create checkout session |
| `POST /api/stripe/portal` | Customer portal |
| `POST /api/stripe/webhook` | Stripe webhooks |
| `POST /api/cron/fetch-metrics` | Daily metric fetch |

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Manual metric fetch
npm run fetch-metrics

# Database
npm run db:migrate    # Run migrations
npm run db:studio     # Open Prisma Studio
```

## Monetization

- **Free Trial:** 7 days full access
- **Price:** $10/month subscription
- **Payment:** Stripe Checkout + Customer Portal

## Roadmap

- [ ] TikTok integration
- [ ] Twitter/X integration
- [ ] Analytics charts and graphs
- [ ] Export to PDF/CSV
- [ ] Team/Agency features
- [ ] White-label option

## License

MIT

## Support

For questions or issues, open a GitHub issue or contact support.

---

Built with ❤️ for content creators
