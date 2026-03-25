# CreatorDash Cron Setup

## Automated Daily Fetching

Your CreatorDash is now configured to automatically fetch YouTube metrics daily at **9:00 AM CST**.

### How It Works

1. **Cron Job**: `CreatorDash Daily Metrics` runs every day at 9:00 AM
2. **System Event**: Triggers a reminder in the main session
3. **Execution**: When the event fires, run the fetch command

### Manual Commands

```bash
# Fetch today's metrics and save to database
npm run fetch

# Generate growth report
npm run report

# View weekly summary
npm run report -- --weekly
```

### Cron Job Details

- **Name**: CreatorDash Daily Metrics
- **Schedule**: Every day at 9:00 AM CST
- **Job ID**: c5e8ca2a-4d1a-410f-a51e-cb2ebe75ed1e
- **Status**: Active

### Next Run

Check with: `openclaw cron list`

### Data Storage

- **Database**: `/root/.openclaw/workspace/creator-dashboard/data/creatordash.db`
- **Logs**: `/root/.openclaw/workspace/creator-dashboard/data/fetch.log`

### To Disable

```bash
openclaw cron disable c5e8ca2a-4d1a-410f-a51e-cb2ebe75ed1e
```

### To Remove

```bash
openclaw cron rm c5e8ca2a-4d1a-410f-a51e-cb2ebe75ed1e
```