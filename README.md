# CreatorDash

A unified analytics dashboard for content creators. Track your growth across YouTube, Instagram, and more platforms in one place.

## ✨ Features

- **🌐 Web UI** - Professional home page with privacy policy and terms
- **📺 YouTube Integration** - Subscribers, views, videos, recent performance
- **📸 Instagram Integration** - Followers, posts, reach, impressions
- **📈 Historical Tracking** - Daily snapshots with growth analytics
- **📊 Multi-Platform Reports** - Combined view of all your channels
- **🗄️ Local Database** - SQLite for fast, private data storage
- **⏰ Automated Fetching** - Daily cron jobs keep data up to date
- **🚀 Social Media Posting** - Post to YouTube, Instagram from one interface
- **📅 Content Scheduling** - Schedule posts for optimal timing
- **📝 Post Templates** - Reusable content templates

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the web server (optional)
npm start
# Visit: http://localhost:3000

# Initialize database
npm run db:init

# Add posting capabilities (optional)
npm run db:migrate:posting

# Fetch YouTube metrics
npm run fetch

# Generate report
npm run report

# Post to social media
npm run post:youtube -- --file video.mp4 --title "My Video"
npm run post:instagram -- --image photo.jpg --caption "My Post"
```

See [WEB_UI.md](WEB_UI.md) for web server documentation.

## 📋 Available Commands

### Database
```bash
npm run db:init                    # Initialize database
npm run db:migrate:instagram       # Add Instagram support
npm run db:migrate:posting         # Add posting capabilities
```

### Fetching Data
```bash
npm run fetch                      # Fetch YouTube metrics
npm run fetch:dry                  # Test YouTube fetch (no save)
npm run fetch:instagram            # Fetch Instagram metrics
npm run fetch:instagram:dry        # Test Instagram fetch
npm run fetch:all                  # Fetch all platforms
```

### Reports
```bash
npm run report                     # Full multi-platform report
npm run report:weekly              # Include weekly summary
npm run report:monthly             # Include monthly summary
```

### Social Media Posting
```bash
# Unified posting
npm run post -- --platforms youtube,instagram --file video.mp4 --title "Title"

# Platform-specific
npm run post:youtube -- --file video.mp4 --title "My Video"
npm run post:youtube -- --short short.mp4 --title "My Short"
npm run post:instagram -- --image photo.jpg --caption "My Caption"
npm run post:instagram -- --reel reel.mp4 --caption "My Reel"
npm run post:instagram -- --carousel img1.jpg,img2.jpg --caption "Carousel"
npm run post:instagram -- --story story.jpg

# Scheduling
npm run post:list                  # List scheduled posts
npm run post:scheduled             # Process due scheduled posts
```

See [POSTING.md](POSTING.md) for detailed posting documentation.

## 🔧 Configuration

### YouTube Setup

Already configured! Uses your existing API key.

### Instagram Setup

See [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) for detailed instructions.

Quick steps:
1. Get access token from [Facebook Developers](https://developers.facebook.com/tools/explorer/)
2. Add to `.env.local`:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_token_here
   INSTAGRAM_USER_ID=your_user_id
   INSTAGRAM_USERNAME=your_username
   ```

## 📊 Database Schema

### Tables
- `channel_metrics` - YouTube daily snapshots
- `video_metrics` - Individual YouTube video stats
- `growth_metrics` - YouTube calculated growth
- `instagram_metrics` - Instagram daily snapshots
- `instagram_media` - Individual Instagram posts
- `instagram_growth` - Instagram calculated growth

### Views
- `v_daily_summary` - Combined daily metrics

## ⏰ Automated Fetching

A cron job is configured to run daily at 9:00 AM CST:

```bash
# Check cron status
openclaw cron list

# Job ID: c5e8ca2a-4d1a-410f-a51e-cb2ebe75ed1e
```

## 📁 Project Structure

```
creator-dashboard/
├── data/
│   ├── creatordash.db          # SQLite database
│   └── fetch.log               # Execution logs
├── scripts/
│   ├── db-init.mjs             # Database initialization
│   ├── db-migrate-instagram.mjs # Instagram migration
│   ├── fetch-and-save.mjs      # YouTube fetcher
│   ├── fetch-instagram.mjs     # Instagram fetcher
│   ├── generate-full-report.mjs # Multi-platform reports
│   └── daily-cron.sh           # Cron execution script
├── .env.local                  # Configuration
├── CRON_SETUP.md              # Cron documentation
├── INSTAGRAM_SETUP.md         # Instagram setup guide
└── package.json
```

## 📈 Growth Analytics

The system tracks:
- **Daily Growth** - Day-over-day changes
- **Week-over-Week** - 7-day comparisons
- **Month-over-Month** - 30-day comparisons
- **Milestones** - All-time highs and tracking duration

## 🔒 Privacy

All data is stored locally in SQLite. No cloud services, no third-party analytics.

## 🛠️ Troubleshooting

**Database locked**
→ Wait a moment and try again

**API rate limits**
→ YouTube: 10,000 quota units/day (plenty for daily fetching)
→ Instagram: 200 calls/hour/user

**Missing data**
→ Check `.env.local` configuration
→ Verify API tokens are valid

## 📝 Roadmap

- [x] YouTube integration
- [x] Historical tracking
- [x] Growth analytics
- [x] Instagram integration
- [x] YouTube posting
- [x] Instagram posting
- [x] Content scheduling
- [ ] TikTok integration
- [ ] Twitter/X integration
- [ ] Web dashboard UI
- [ ] Export to CSV/Excel
- [ ] Email reports
- [ ] Competitor tracking

## 📄 License

Private - For Shon Jimenez use only