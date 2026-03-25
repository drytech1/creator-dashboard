# Instagram Integration Setup

CreatorDash now supports Instagram metrics tracking alongside YouTube!

## 📋 What Gets Tracked

- **Followers** - Total follower count
- **Following** - Accounts you follow
- **Media Count** - Total posts
- **Recent Posts** - Last 10 posts with engagement metrics
- **Reach & Impressions** - Post performance data
- **Growth Analytics** - Daily, weekly, monthly trends

## 🔑 API Access Setup

### Option 1: Instagram Basic Display API (Recommended for personal use)

1. **Create a Facebook App:**
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add "Instagram Basic Display" product

2. **Get Access Token:**
   - Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Select your app
   - Get User Token with permissions:
     - `instagram_basic`
     - `instagram_manage_insights`
   - Convert to long-lived token (valid for 60 days)

3. **Get User ID:**
   ```bash
   curl "https://graph.instagram.com/me?fields=id,username&access_token=YOUR_TOKEN"
   ```

4. **Configure CreatorDash:**
   Edit `.env.local` and add:
   ```
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
   INSTAGRAM_USER_ID=your_user_id_here
   INSTAGRAM_USERNAME=your_username
   ```

### Option 2: Instagram Graph API (For business/creator accounts)

If you have an Instagram Business or Creator account:

1. Connect your Instagram to a Facebook Page
2. Use Facebook Login with `instagram_basic` permission
3. Get a Page Access Token
4. Use the Graph API for more detailed insights

## 🚀 Usage

```bash
# Fetch Instagram metrics only
npm run fetch:instagram

# Fetch all platforms (YouTube + Instagram)
npm run fetch:all

# Generate multi-platform report
npm run report
```

## 📊 Database Schema

New tables added:
- `instagram_metrics` - Daily account snapshots
- `instagram_media` - Individual post metrics
- `instagram_growth` - Calculated growth metrics

## ⚠️ Limitations

**Instagram Basic Display API:**
- ❌ Real-time follower count (not available)
- ❌ Story metrics
- ❌ Detailed audience demographics
- ✅ Media/posts data
- ✅ Reach & impressions (limited)

**For full analytics, consider:**
- Upgrading to Instagram Business account
- Using Instagram Graph API
- Third-party tools like Iconosquare or Hootsuite

## 🔒 Token Refresh

Basic Display tokens expire after 60 days. Set a reminder to refresh:

```bash
# Refresh token (run before expiration)
curl -X GET "https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=YOUR_TOKEN"
```

## 🛠️ Troubleshooting

**"Error: INSTAGRAM_ACCESS_TOKEN not configured"**
→ Add your token to `.env.local`

**"Instagram API error: Invalid token"**
→ Token expired, generate a new one

**"Permission denied"**
→ Ensure token has `instagram_basic` permission

**No data returned**
→ Check that your Instagram account is public

## 📈 Next Steps

Once configured:
1. Run `npm run fetch:instagram` to test
2. Add to daily cron: `npm run fetch:all`
3. View combined reports with `npm run report`

## 🔗 Resources

- [Instagram Basic Display API Docs](https://developers.facebook.com/docs/instagram-basic-display-api)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)