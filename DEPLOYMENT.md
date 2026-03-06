# Deployment Guide

## Option 1: Vercel (Recommended for Beginners)

### Prerequisites
- Vercel account (free)
- GitHub/GitLab/Bitbucket account

### Steps

1. **Push to Git**
```bash
cd /root/.openclaw/workspace/creator-dashboard
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/creator-dashboard.git
git push -u origin main
```

2. **Import to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your GitHub repo
- Framework preset: Next.js

3. **Environment Variables**
Add these in Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=file:./prisma/dev.db
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_ID=price_...
CRON_SECRET=your_cron_secret
```

4. **Update OAuth Redirects**
- Google: Add `https://your-domain.vercel.app/api/auth/callback/google`
- Facebook: Add `https://your-domain.vercel.app/api/auth/callback/facebook`

5. **Deploy**
- Click "Deploy"
- Vercel will build and deploy automatically

6. **Set Up Cron Job**
Since Vercel has limited cron support, use an external service:
- [Cron-job.org](https://cron-job.org) (free)
- Set URL: `https://your-domain.vercel.app/api/cron/fetch-metrics`
- Schedule: Daily at 6:00 AM
- Header: `Authorization: Bearer your_cron_secret`

---

## Option 2: Railway (Good for Databases)

### Prerequisites
- Railway account (free tier available)

### Steps

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
railway login
```

2. **Create Project**
```bash
cd /root/.openclaw/workspace/creator-dashboard
railway init
```

3. **Add Database**
```bash
railway add --database postgres
```

4. **Update Database URL**
Change `DATABASE_URL` in environment variables to the PostgreSQL URL Railway provides.

5. **Update Schema** (if using PostgreSQL)
Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
}
```

6. **Deploy**
```bash
railway up
```

---

## Option 3: VPS / Self-Hosted (Full Control)

### Prerequisites
- VPS (DigitalOcean, Linode, AWS, etc.)
- Domain name
- Node.js 18+ installed

### Steps

1. **Server Setup**
```bash
# SSH into your server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Clone your repo
git clone https://github.com/YOUR_USERNAME/creator-dashboard.git
cd creator-dashboard

# Install dependencies
npm install

# Build
npm run build
```

2. **Environment Setup**
```bash
cp .env.example .env.local
# Edit with your production values
nano .env.local
```

3. **Database Setup**
```bash
# For SQLite (simple)
mkdir -p prisma
touch prisma/dev.db

# Or install PostgreSQL
sudo apt-get install postgresql
```

4. **Run Migrations**
```bash
npx prisma migrate deploy
```

5. **Start with PM2**
```bash
pm2 start npm --name "creator-dashboard" -- start
pm2 save
pm2 startup
```

6. **Set Up Nginx (Reverse Proxy)**
```bash
sudo apt-get install nginx

# Create config
sudo nano /etc/nginx/sites-available/creator-dashboard
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/creator-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **SSL with Certbot**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

8. **Set Up Cron Job on Server**
```bash
# Edit crontab
crontab -e

# Add line:
0 6 * * * cd /path/to/creator-dashboard && CRON_SECRET=your_secret npm run fetch-metrics
```

---

## Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] OAuth redirect URLs updated for production domain
- [ ] Stripe webhooks configured for production
- [ ] Database migrations run
- [ ] Cron job scheduled
- [ ] Test payment flow with real card ($0.50 test)
- [ ] Test OAuth login for both YouTube and Instagram
- [ ] Verify metric fetching works

## Post-Deployment

1. **Test Everything**
   - Sign up flow
   - OAuth connections
   - Subscription payment
   - Dashboard data display

2. **Set Up Monitoring**
   - Vercel: Built-in analytics
   - Railway: Built-in metrics
   - VPS: UptimeRobot or similar

3. **Backups**
   - Database: Automated backups (Railway/PostgreSQL)
   - SQLite: Copy file regularly

## Troubleshooting

**Build fails:**
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

**Database connection errors:**
- Check DATABASE_URL format
- Ensure database file exists (SQLite)
- Verify network access (PostgreSQL)

**OAuth not working:**
- Verify redirect URLs match exactly
- Check client ID/secret are correct
- Ensure HTTPS in production

**Stripe webhooks failing:**
- Verify webhook endpoint URL
- Check webhook secret matches
- Ensure endpoint returns 200

## Domain Setup

1. Buy domain (Namecheap, Cloudflare, etc.)
2. Add DNS record:
   - Type: A
   - Name: @
   - Value: Your server IP (or Vercel/Railway IP)
3. Wait for propagation (5-60 minutes)
4. Update OAuth redirects
5. Update NEXTAUTH_URL

## Cost Estimates

| Platform | Monthly Cost |
|----------|-------------|
| Vercel (Hobby) | Free |
| Vercel (Pro) | $20 |
| Railway | $5-20 |
| VPS (DigitalOcean) | $6-12 |
| Domain | $10-15/year |
| Stripe Fees | 2.9% + $0.30 per transaction |

---

**Ready to deploy!** Start with Vercel for the easiest setup.
