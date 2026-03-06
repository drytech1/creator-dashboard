# Cron Job Setup

## Option 1: OpenClaw Cron (Recommended)

Add a daily cron job using OpenClaw's built-in scheduler:

```bash
# Generate a cron secret first
openssl rand -hex 32

# Add to your .env.local
CRON_SECRET=your_generated_secret

# Create the cron job (run this from your OpenClaw workspace)
openclaw cron add \
  --name "Fetch Creator Metrics" \
  --cron "0 6 * * *" \
  --tz "America/Chicago" \
  --url "https://yourdomain.com/api/cron/fetch-metrics" \
  --headers "Authorization:Bearer your_cron_secret"
```

This will run every day at 6:00 AM CT.

## Option 2: Vercel Cron (if deploying to Vercel)

Add to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/fetch-metrics",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Note: You'll need to handle the CRON_SECRET verification in the route.

## Option 3: External Cron Service

Use a service like:
- [Cron-job.org](https://cron-job.org) (free)
- [EasyCron](https://www.easycron.com)
- [UptimeRobot](https://uptimerobot.com)

Set up a daily POST request to:
```
POST https://yourdomain.com/api/cron/fetch-metrics
Headers:
  Authorization: Bearer your_cron_secret
```

## Manual Testing

Test the cron endpoint locally:

```bash
# Start your dev server
npm run dev

# In another terminal, test the endpoint
curl -X POST http://localhost:3000/api/cron/fetch-metrics \
  -H "Authorization: Bearer your_cron_secret"
```

## What the Cron Job Does

1. Finds all users with active subscriptions or trials
2. For each user's connected accounts:
   - Fetches YouTube channel stats (subscribers, views)
   - Fetches Instagram Business account stats (followers, engagement)
3. Calculates daily growth (compared to yesterday)
4. Saves metrics to the database
5. Returns summary of processed users

## Monitoring

Check the cron job status:
```bash
openclaw cron list
openclaw cron runs "Fetch Creator Metrics"
```

## Troubleshooting

If metrics aren't updating:
1. Check that users have connected their accounts
2. Verify OAuth tokens haven't expired (may need refresh logic)
3. Check the cron job logs: `openclaw cron runs "Fetch Creator Metrics"`
4. Test manually with the curl command above
