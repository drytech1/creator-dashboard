# CreatorDash Posting System

Social media posting capabilities for CreatorDash. Post to YouTube, Instagram, and more platforms from a unified interface.

## 🚀 Quick Start

### 1. Setup Database
```bash
npm run db:migrate:posting
```

### 2. Post to YouTube
```bash
# Upload a video
npm run post:youtube -- --file /path/to/video.mp4 --title "My Video Title" --description "Video description"

# Upload a Short
npm run post:youtube -- --short /path/to/short.mp4 --title "My Short #Shorts"

# Schedule for later
npm run post:youtube -- --file video.mp4 --title "Title" --schedule --at "2026-03-25 10:00"
```

### 3. Post to Instagram
```bash
# Post an image
npm run post:instagram -- --image /path/to/photo.jpg --caption "My caption #hashtag"

# Post a reel
npm run post:instagram -- --reel /path/to/reel.mp4 --caption "Check out this reel!"

# Post a carousel (2-10 images)
npm run post:instagram -- --carousel /path/to/img1.jpg,/path/to/img2.jpg --caption "Swipe through!"

# Post a story
npm run post:instagram -- --story /path/to/story.jpg
```

### 4. Post to Multiple Platforms
```bash
npm run post -- --platforms youtube,instagram --file video.mp4 --title "Title" --caption "Caption"
```

## 📋 Available Commands

### Database Migration
```bash
npm run db:migrate:posting    # Add posting tables to database
```

### Posting Commands
```bash
# Unified posting (all platforms)
npm run post -- [options]

# Platform-specific
npm run post:youtube -- [options]
npm run post:instagram -- [options]

# Scheduling
npm run post:list              # List scheduled posts
npm run post:scheduled         # Process due scheduled posts
```

## 📖 Detailed Usage

### YouTube Posting

**Upload a Video:**
```bash
node scripts/post-to-youtube.mjs \
  --file /path/to/video.mp4 \
  --title "My Awesome Video" \
  --description "This is my video description" \
  --tags "tag1,tag2,tag3" \
  --privacy public
```

**Upload a Short:**
```bash
node scripts/post-to-youtube.mjs \
  --short /path/to/short.mp4 \
  --title "My Short #Shorts" \
  --description "Quick tip!"
```

**Schedule a Video:**
```bash
node scripts/post-to-youtube.mjs \
  --file /path/to/video.mp4 \
  --title "Scheduled Video" \
  --schedule \
  --at "2026-03-25 14:30"
```

**List Scheduled Posts:**
```bash
node scripts/post-to-youtube.mjs --list
```

**Process Due Posts:**
```bash
node scripts/post-to-youtube.mjs --process
```

### Instagram Posting

**Post an Image:**
```bash
node scripts/post-to-instagram.mjs \
  --image /path/to/photo.jpg \
  --caption "Beautiful day! ☀️ #lifestyle #photography"
```

**Post a Reel:**
```bash
node scripts/post-to-instagram.mjs \
  --reel /path/to/reel.mp4 \
  --caption "Watch this! 🎬 #reels #viral"
```

**Post a Carousel:**
```bash
node scripts/post-to-instagram.mjs \
  --carousel /path/to/img1.jpg,/path/to/img2.jpg,/path/to/img3.jpg \
  --caption "Swipe to see more! 👉"
```

**Post a Story:**
```bash
node scripts/post-to-instagram.mjs \
  --story /path/to/story.jpg
```

**Schedule a Post:**
```bash
node scripts/post-to-instagram.mjs \
  --image /path/to/photo.jpg \
  --caption "Morning post!" \
  --schedule \
  --at "2026-03-25 08:00"
```

### Multi-Platform Posting

**Post to Both YouTube and Instagram:**
```bash
node scripts/post.mjs \
  --platforms youtube,instagram \
  --file /path/to/video.mp4 \
  --title "My Video Title" \
  --caption "Video description for both platforms"
```

**Schedule Multi-Platform Post:**
```bash
node scripts/post.mjs \
  --schedule \
  --platforms youtube,instagram \
  --file /path/to/video.mp4 \
  --title "Scheduled Video" \
  --caption "This will post to both platforms" \
  --at "2026-03-25 10:00"
```

**List All Scheduled Posts:**
```bash
node scripts/post.mjs --list-scheduled
```

**List by Platform:**
```bash
node scripts/post.mjs --list-scheduled --platform instagram
```

**Process All Due Posts:**
```bash
node scripts/post.mjs --process-scheduled
```

## ⚙️ Configuration

### Environment Variables

Add to your `.env.local`:

```bash
# YouTube (Google OAuth)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Instagram (Facebook Graph API)
FACEBOOK_ACCESS_TOKEN=your_access_token
INSTAGRAM_USERNAME=your_username
# INSTAGRAM_ACCOUNT_ID will be auto-discovered
```

### Getting Instagram Access Token

1. Go to [Facebook Developers](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Get User Access Token with permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_read_engagement`
4. Copy the token to `.env.local`

### Getting YouTube OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Enable YouTube Data API v3
5. Download credentials and add to `.env.local`

## 🗄️ Database Schema

### scheduled_posts
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| platform | TEXT | youtube, instagram, etc. |
| post_type | TEXT | video, short, image, reel, carousel, story |
| title | TEXT | Post title |
| description | TEXT | Post description/caption |
| media_urls | TEXT | JSON array of file paths |
| hashtags | TEXT | Hashtags to include |
| scheduled_at | DATETIME | When to post |
| posted_at | DATETIME | When actually posted |
| status | TEXT | draft, scheduled, posted, failed |
| platform_post_id | TEXT | ID from platform API |
| platform_post_url | TEXT | URL to the posted content |
| error_message | TEXT | Error if posting failed |

### post_templates
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| name | TEXT | Template name |
| platform | TEXT | Target platform |
| post_type | TEXT | Type of post |
| title_template | TEXT | Title template with placeholders |
| description_template | TEXT | Description template |
| hashtag_template | TEXT | Default hashtags |

### posting_logs
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key |
| post_id | INTEGER | Reference to scheduled_posts |
| platform | TEXT | Platform name |
| action | TEXT | schedule, post, update, delete, error |
| status | TEXT | success, failed |
| message | TEXT | Log message |
| api_response | TEXT | JSON response from API |

## 🔄 Automated Scheduling

### Set Up Cron Job for Scheduled Posts

Add to your crontab to check for scheduled posts every 5 minutes:

```bash
*/5 * * * * cd /path/to/creator-dashboard && npm run post:scheduled >> data/posting.log 2>&1
```

Or use OpenClaw cron:

```bash
openclaw cron add --name "Process Scheduled Posts" \
  --schedule "*/5 * * * *" \
  --command "cd /path/to/creator-dashboard && npm run post:scheduled"
```

## 📝 Template System

### Default Templates

The system comes with pre-configured templates:

- **YouTube Video Standard**: Basic video upload template
- **Instagram Post Standard**: Image post with hashtags
- **Instagram Reel Standard**: Reel optimized hashtags

### Using Templates

Templates support placeholders:
- `{{title}}` - Post title
- `{{description}}` - Post description
- `{{caption}}` - Caption text
- `{{hashtags}}` - Hashtag block

Example template:
```
Title: {{title}}
Description: {{description}}

{{hashtags}}
```

## 🐛 Troubleshooting

### "No Facebook pages found"
- Ensure your Facebook account has a Page
- Connect your Instagram Business account to the Page
- Check your access token has `pages_read_engagement` permission

### "Video processing failed"
- Instagram reels need time to process
- The script waits up to 60 seconds
- For longer videos, processing may take longer

### "Authentication required"
- YouTube requires OAuth authentication
- Run the web dashboard and authenticate there
- Tokens will be saved for future use

### "File not found"
- Use absolute paths or paths relative to the script
- Check file permissions
- Ensure file format is supported by the platform

## 🎯 Future Enhancements

- [ ] Twitter/X posting
- [ ] TikTok posting
- [ ] LinkedIn posting
- [ ] Bulk upload from CSV
- [ ] Content calendar view
- [ ] Auto-hashtag suggestions
- [ ] Best time to post recommendations
- [ ] Cross-posting with platform-specific optimizations
- [ ] Media library management
- [ ] Post analytics and performance tracking

## 📄 License

Private - For Shon Jimenez use only
