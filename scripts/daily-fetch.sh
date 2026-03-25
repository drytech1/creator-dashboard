#!/bin/bash
# Daily YouTube Metrics Fetch Script
# Runs at 9:00 AM CST daily

export YOUTUBE_API_KEY="AIzaSyDIXcWg_NHz2sPotg6aBsILOTHV_Ixz48I"
export CHANNEL_HANDLE="@Shonsreviews"

cd /root/.openclaw/workspace/creator-dashboard

# Run the fetch and capture output
node scripts/fetch-metrics.js > /tmp/youtube-metrics.txt 2>&1

if [ $? -eq 0 ]; then
    # Success - send via Telegram
    MESSAGE=$(cat /tmp/youtube-metrics.txt)
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=6683445723" \
        -d "text=${MESSAGE}" \
        -d "parse_mode=Markdown"
else
    # Error - send error message
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
        -d "chat_id=6683445723" \
        -d "text=⚠️ Failed to fetch YouTube metrics. Check logs." \
        -d "parse_mode=Markdown"
fi

rm -f /tmp/youtube-metrics.txt