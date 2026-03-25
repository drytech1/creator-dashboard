#!/usr/bin/env node
/**
 * Fetch YouTube Metrics and Save to Database
 * Fetches current metrics and stores them for historical tracking
 */

import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'creatordash.db');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDIXcWg_NHz2sPotg6aBsILOTHV_Ixz48I';
const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@Shonsreviews';

const DRY_RUN = process.argv.includes('--dry-run');

async function fetchYouTubeMetrics() {
  try {
    // Get channel ID from handle
    const channelSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(CHANNEL_HANDLE)}&key=${YOUTUBE_API_KEY}`;
    
    const searchResponse = await fetch(channelSearchUrl);
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error('Channel not found');
    }
    
    const channelId = searchData.items[0].id.channelId;
    
    // Fetch channel statistics
    const statsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();
    
    if (!statsData.items || statsData.items.length === 0) {
      throw new Error('Channel statistics not available');
    }
    
    const channel = statsData.items[0];
    const stats = channel.statistics;
    
    // Fetch recent videos
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=10&type=video&key=${YOUTUBE_API_KEY}`;
    
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    
    // Get video statistics for recent videos
    let recentVideos = [];
    if (videosData.items && videosData.items.length > 0) {
      const videoIds = videosData.items.map(v => v.id.videoId).join(',');
      const videoStatsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`;
      
      const videoStatsResponse = await fetch(videoStatsUrl);
      const videoStatsData = await videoStatsResponse.json();
      
      recentVideos = videosData.items.map((video) => {
        const vstats = videoStatsData.items?.find(v => v.id === video.id.videoId)?.statistics || {};
        return {
          videoId: video.id.videoId,
          title: video.snippet.title,
          publishedAt: video.snippet.publishedAt,
          views: parseInt(vstats.viewCount || '0'),
          likes: parseInt(vstats.likeCount || '0'),
          comments: parseInt(vstats.commentCount || '0')
        };
      });
    }
    
    return {
      channelId,
      channelName: channel.snippet.title,
      subscribers: parseInt(stats.subscriberCount || '0'),
      totalViews: parseInt(stats.viewCount || '0'),
      totalVideos: parseInt(stats.videoCount || '0'),
      recentVideos
    };
    
  } catch (error) {
    console.error('Error fetching YouTube metrics:', error);
    throw error;
  }
}

function saveMetrics(db, metrics) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Save channel metrics
    const insertChannel = `
      INSERT INTO channel_metrics (date, channel_id, channel_name, subscribers, total_views, total_videos)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        subscribers = excluded.subscribers,
        total_views = excluded.total_views,
        total_videos = excluded.total_videos,
        created_at = CURRENT_TIMESTAMP
    `;
    
    db.run(insertChannel, [
      today,
      metrics.channelId,
      metrics.channelName,
      metrics.subscribers,
      metrics.totalViews,
      metrics.totalVideos
    ], function(err) {
      if (err) return reject(err);
      
      // Save video metrics
      const insertVideo = `
        INSERT INTO video_metrics (date, video_id, title, views, likes, comments, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date, video_id) DO UPDATE SET
          views = excluded.views,
          likes = excluded.likes,
          comments = excluded.comments,
          created_at = CURRENT_TIMESTAMP
      `;
      
      let completed = 0;
      const total = metrics.recentVideos.length;
      
      if (total === 0) {
        resolve(today);
        return;
      }
      
      for (const video of metrics.recentVideos) {
        db.run(insertVideo, [
          today,
          video.videoId,
          video.title,
          video.views,
          video.likes,
          video.comments,
          video.publishedAt
        ], function(err) {
          if (err) return reject(err);
          completed++;
          if (completed === total) {
            resolve(today);
          }
        });
      }
    });
  });
}

function calculateGrowth(db, date) {
  return new Promise((resolve, reject) => {
    // Get yesterday's metrics
    db.get(`
      SELECT subscribers, total_views 
      FROM channel_metrics 
      WHERE date < ? 
      ORDER BY date DESC 
      LIMIT 1
    `, [date], (err, yesterday) => {
      if (err) return reject(err);
      
      // Get today's metrics
      db.get(`
        SELECT subscribers, total_views 
        FROM channel_metrics 
        WHERE date = ?
      `, [date], (err, today) => {
        if (err) return reject(err);
        if (!today) return resolve();
        
        let subscriberGrowth = 0;
        let viewGrowth = 0;
        let subscriberGrowthPct = 0;
        let viewGrowthPct = 0;
        
        if (yesterday) {
          subscriberGrowth = today.subscribers - yesterday.subscribers;
          viewGrowth = today.total_views - yesterday.total_views;
          subscriberGrowthPct = yesterday.subscribers > 0 
            ? parseFloat(((subscriberGrowth / yesterday.subscribers) * 100).toFixed(2))
            : 0;
          viewGrowthPct = yesterday.total_views > 0 
            ? parseFloat(((viewGrowth / yesterday.total_views) * 100).toFixed(2))
            : 0;
        }
        
        // Get week-over-week metrics
        db.get(`
          SELECT subscribers, total_views 
          FROM channel_metrics 
          WHERE date <= date(?, '-7 days')
          ORDER BY date DESC 
          LIMIT 1
        `, [date], (err, weekAgo) => {
          if (err) return reject(err);
          
          // Get month-over-month metrics
          db.get(`
            SELECT subscribers, total_views 
            FROM channel_metrics 
            WHERE date <= date(?, '-30 days')
            ORDER BY date DESC 
            LIMIT 1
          `, [date], (err, monthAgo) => {
            if (err) return reject(err);
            
            const insertGrowth = `
              INSERT INTO growth_metrics (
                date, subscriber_growth, view_growth, subscriber_growth_pct, view_growth_pct,
                week_over_week_subscribers, week_over_week_views,
                month_over_month_subscribers, month_over_month_views
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(date) DO UPDATE SET
                subscriber_growth = excluded.subscriber_growth,
                view_growth = excluded.view_growth,
                subscriber_growth_pct = excluded.subscriber_growth_pct,
                view_growth_pct = excluded.view_growth_pct,
                week_over_week_subscribers = excluded.week_over_week_subscribers,
                week_over_week_views = excluded.week_over_week_views,
                month_over_month_subscribers = excluded.month_over_month_subscribers,
                month_over_month_views = excluded.month_over_month_views,
                created_at = CURRENT_TIMESTAMP
            `;
            
            db.run(insertGrowth, [
              date,
              subscriberGrowth,
              viewGrowth,
              subscriberGrowthPct,
              viewGrowthPct,
              weekAgo ? today.subscribers - weekAgo.subscribers : null,
              weekAgo ? today.total_views - weekAgo.total_views : null,
              monthAgo ? today.subscribers - monthAgo.subscribers : null,
              monthAgo ? today.total_views - monthAgo.total_views : null
            ], function(err) {
              if (err) return reject(err);
              resolve();
            });
          });
        });
      });
    });
  });
}

async function main() {
  console.log('📊 Fetching YouTube metrics...\n');
  
  const metrics = await fetchYouTubeMetrics();
  
  console.log(`Channel: ${metrics.channelName}`);
  console.log(`Subscribers: ${metrics.subscribers.toLocaleString()}`);
  console.log(`Total Views: ${metrics.totalViews.toLocaleString()}`);
  console.log(`Total Videos: ${metrics.totalVideos.toLocaleString()}`);
  console.log(`Recent Videos: ${metrics.recentVideos.length}`);
  
  if (DRY_RUN) {
    console.log('\n🏃 DRY RUN - Not saving to database');
    return;
  }
  
  console.log('\n💾 Saving to database...');
  
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    const date = await saveMetrics(db, metrics);
    await calculateGrowth(db, date);
    
    console.log('✅ Metrics saved successfully!');
    console.log(`\n📅 Date: ${date}`);
    console.log(`\nNext: Run 'npm run report' to see growth analytics`);
  } catch (err) {
    console.error('❌ Error saving metrics:', err.message);
  } finally {
    db.close();
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
