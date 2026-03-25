#!/bin/bash
# CreatorDash Daily Fetch and Report - Multi-Platform
# Fetches YouTube + Instagram metrics, saves to database, and generates report

cd /root/.openclaw/workspace/creator-dashboard

LOG_FILE="/root/.openclaw/workspace/creator-dashboard/data/fetch.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] === Daily fetch started ===" >> "$LOG_FILE"

# Fetch YouTube
YT_OUTPUT=$(npm run fetch 2>&1)
YT_EXIT=$?

if [ $YT_EXIT -eq 0 ]; then
    YT_SUBS=$(echo "$YT_OUTPUT" | grep "Subscribers:" | awk '{print $2}')
    YT_VIEWS=$(echo "$YT_OUTPUT" | grep "Total Views:" | awk '{print $3}')
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] YouTube: $YT_SUBS subs, $YT_VIEWS views" >> "$LOG_FILE"
    YT_STATUS="✅"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] YouTube fetch failed" >> "$LOG_FILE"
    YT_STATUS="❌"
fi

# Fetch Instagram (if configured)
IG_OUTPUT=$(npm run fetch:instagram 2>&1)
IG_EXIT=$?

if [ $IG_EXIT -eq 0 ]; then
    IG_FOLLOWERS=$(echo "$IG_OUTPUT" | grep "Followers:" | awk '{print $2}')
    IG_POSTS=$(echo "$IG_OUTPUT" | grep "Media Count:" | awk '{print $3}')
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram: $IG_FOLLOWERS followers, $IG_POSTS posts" >> "$LOG_FILE"
    IG_STATUS="✅"
elif echo "$IG_OUTPUT" | grep -q "INSTAGRAM_ACCESS_TOKEN not configured"; then
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram: Not configured" >> "$LOG_FILE"
    IG_STATUS="⚪"
else
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Instagram fetch failed" >> "$LOG_FILE"
    IG_STATUS="❌"
fi

# Generate report
REPORT_OUTPUT=$(npm run report 2>&1)

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Report generated" >> "$LOG_FILE"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] === Daily fetch complete ===" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Output summary
echo "📊 CreatorDash Daily Fetch Complete"
echo ""
echo "YouTube: $YT_STATUS"
if [ $YT_EXIT -eq 0 ]; then
    echo "  Subscribers: $YT_SUBS"
    echo "  Total Views: $YT_VIEWS"
fi
echo ""
echo "Instagram: $IG_STATUS"
if [ $IG_EXIT -eq 0 ]; then
    echo "  Followers: $IG_FOLLOWERS"
    echo "  Posts: $IG_POSTS"
elif [ "$IG_STATUS" = "⚪" ]; then
    echo "  (Not configured - see INSTAGRAM_SETUP.md)"
fi
echo ""
echo "Run 'npm run report' for detailed analytics"