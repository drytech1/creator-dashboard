#!/usr/bin/env node
/**
 * Generate Multi-Platform Growth Report
 * Shows YouTube + Instagram historical data with growth analytics
 */

import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'creatordash.db');

const args = process.argv.slice(2);
const WEEKLY = args.includes('--weekly');
const MONTHLY = args.includes('--monthly');
const DAYS = args.includes('--days') ? parseInt(args[args.indexOf('--days') + 1]) || 7 : 7;

function formatNumber(num) {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString();
}

function formatGrowth(num) {
  if (num === null || num === undefined) return 'N/A';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toLocaleString()}`;
}

function formatPct(num) {
  if (num === null || num === undefined) return 'N/A';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num}%`;
}

async function generateReport() {
  const db = new sqlite3.Database(DB_PATH);
  
  // Check if database has data
  const ytCount = await new Promise((resolve) => {
    db.get('SELECT COUNT(*) as count FROM channel_metrics', (err, row) => {
      resolve(err ? 0 : row.count);
    });
  });
  
  const igCount = await new Promise((resolve) => {
    db.get('SELECT COUNT(*) as count FROM instagram_metrics', (err, row) => {
      resolve(err ? 0 : row.count);
    });
  });
  
  if (ytCount === 0 && igCount === 0) {
    console.log('📭 No data found. Run "npm run fetch" or "npm run fetch:instagram" first.');
    db.close();
    return;
  }
  
  console.log('📊 CREATOR DASHBOARD - MULTI-PLATFORM REPORT\n');
  console.log('='.repeat(70));
  
  // YouTube Section
  if (ytCount > 0) {
    console.log('\n📺 YOUTUBE');
    console.log('-'.repeat(70));
    
    const ytLatest = await new Promise((resolve) => {
      db.get('SELECT * FROM v_daily_summary LIMIT 1', (err, row) => {
        resolve(row || {});
      });
    });
    
    console.log(`\n📅 Latest: ${ytLatest.date || 'N/A'}`);
    console.log(`Channel: ${ytLatest.channel_name || 'N/A'}`);
    console.log(`\n📈 Current Metrics:`);
    console.log(`   Subscribers: ${formatNumber(ytLatest.subscribers)}`);
    console.log(`   Total Views: ${formatNumber(ytLatest.total_views)}`);
    console.log(`   Total Videos: ${formatNumber(ytLatest.total_videos)}`);
    
    if (ytLatest.subscriber_growth !== null) {
      console.log(`\n📊 Daily Growth:`);
      console.log(`   Subscribers: ${formatGrowth(ytLatest.subscriber_growth)} (${formatPct(ytLatest.subscriber_growth_pct)})`);
      console.log(`   Views: ${formatGrowth(ytLatest.view_growth)} (${formatPct(ytLatest.view_growth_pct)})`);
    }
    
    if (ytLatest.week_over_week_subscribers !== null) {
      console.log(`\n📈 Week over Week:`);
      console.log(`   Subscribers: ${formatGrowth(ytLatest.week_over_week_subscribers)}`);
      console.log(`   Views: ${formatGrowth(ytLatest.week_over_week_views)}`);
    }
  }
  
  // Instagram Section
  if (igCount > 0) {
    console.log('\n\n📸 INSTAGRAM');
    console.log('-'.repeat(70));
    
    const igLatest = await new Promise((resolve) => {
      db.get(`
        SELECT im.*, ig.follower_growth, ig.follower_growth_pct, 
               ig.week_over_week_followers, ig.month_over_month_followers
        FROM instagram_metrics im
        LEFT JOIN instagram_growth ig ON im.date = ig.date
        ORDER BY im.date DESC
        LIMIT 1
      `, (err, row) => {
        resolve(row || {});
      });
    });
    
    console.log(`\n📅 Latest: ${igLatest.date || 'N/A'}`);
    console.log(`Username: @${igLatest.username || 'N/A'}`);
    console.log(`\n📈 Current Metrics:`);
    console.log(`   Followers: ${formatNumber(igLatest.followers)}`);
    console.log(`   Following: ${formatNumber(igLatest.follows)}`);
    console.log(`   Posts: ${formatNumber(igLatest.media_count)}`);
    
    if (igLatest.follower_growth !== null) {
      console.log(`\n📊 Daily Growth:`);
      console.log(`   Followers: ${formatGrowth(igLatest.follower_growth)} (${formatPct(igLatest.follower_growth_pct)})`);
    }
    
    if (igLatest.week_over_week_followers !== null) {
      console.log(`\n📈 Week over Week:`);
      console.log(`   Followers: ${formatGrowth(igLatest.week_over_week_followers)}`);
    }
    
    // Recent Instagram posts
    console.log(`\n\n🖼️  RECENT POSTS`);
    console.log('-'.repeat(70));
    
    const posts = await new Promise((resolve) => {
      db.all(`
        SELECT * FROM instagram_media
        WHERE date = (SELECT MAX(date) FROM instagram_metrics)
        ORDER BY timestamp DESC
        LIMIT 5
      `, (err, rows) => {
        resolve(rows || []);
      });
    });
    
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      const caption = p.caption ? p.caption.substring(0, 60) + (p.caption.length > 60 ? '...' : '') : 'No caption';
      const posted = new Date(p.timestamp).toLocaleDateString();
      console.log(`\n${i + 1}. [${p.media_type}] ${caption}`);
      console.log(`   Posted: ${posted} | Reach: ${formatNumber(p.reach)} | Impressions: ${formatNumber(p.impressions)}`);
      if (p.permalink) console.log(`   Link: ${p.permalink}`);
    }
  }
  
  // Combined History
  if (ytCount > 0) {
    console.log(`\n\n📋 YOUTUBE HISTORY (Last ${DAYS} Days)`);
    console.log('-'.repeat(80));
    console.log(`${'Date'.padEnd(12)} ${'Subs'.padEnd(10)} ${'Views'.padEnd(12)} ${'Growth'.padEnd(10)} ${'WoW'.padEnd(10)}`);
    console.log('-'.repeat(80));
    
    const history = await new Promise((resolve) => {
      db.all(`
        SELECT date, subscribers, total_views, subscriber_growth, week_over_week_subscribers
        FROM v_daily_summary
        LIMIT ?
      `, [DAYS], (err, rows) => {
        resolve(rows || []);
      });
    });
    
    for (const row of history) {
      const growth = row.subscriber_growth !== null ? formatGrowth(row.subscriber_growth) : '-';
      const wow = row.week_over_week_subscribers !== null ? formatGrowth(row.week_over_week_subscribers) : '-';
      console.log(
        `${row.date.padEnd(12)} ` +
        `${formatNumber(row.subscribers).padEnd(10)} ` +
        `${formatNumber(row.total_views).padEnd(12)} ` +
        `${growth.padEnd(10)} ` +
        `${wow.padEnd(10)}`
      );
    }
  }
  
  // Milestones
  console.log(`\n\n🏆 MILESTONES`);
  console.log('-'.repeat(70));
  
  if (ytCount > 0) {
    const ytMilestones = await new Promise((resolve) => {
      db.get(`
        SELECT 
          MIN(subscribers) as min_subs,
          MAX(subscribers) as max_subs,
          MIN(total_views) as min_views,
          MAX(total_views) as max_views,
          MIN(date) as first_recorded,
          MAX(date) as latest_recorded,
          COUNT(*) as total_days
        FROM channel_metrics
      `, (err, row) => resolve(row || {}));
    });
    
    console.log(`\n📺 YouTube:`);
    console.log(`   Tracking since: ${ytMilestones.first_recorded || 'N/A'}`);
    console.log(`   Days of data: ${ytMilestones.total_days || 0}`);
    console.log(`   Subscribers: ${formatNumber(ytMilestones.min_subs)} → ${formatNumber(ytMilestones.max_subs)}`);
    console.log(`   Views: ${formatNumber(ytMilestones.min_views)} → ${formatNumber(ytMilestones.max_views)}`);
  }
  
  if (igCount > 0) {
    const igMilestones = await new Promise((resolve) => {
      db.get(`
        SELECT 
          MIN(followers) as min_followers,
          MAX(followers) as max_followers,
          MIN(media_count) as min_posts,
          MAX(media_count) as max_posts,
          MIN(date) as first_recorded,
          MAX(date) as latest_recorded,
          COUNT(*) as total_days
        FROM instagram_metrics
      `, (err, row) => resolve(row || {}));
    });
    
    console.log(`\n📸 Instagram:`);
    console.log(`   Tracking since: ${igMilestones.first_recorded || 'N/A'}`);
    console.log(`   Days of data: ${igMilestones.total_days || 0}`);
    console.log(`   Followers: ${formatNumber(igMilestones.min_followers)} → ${formatNumber(igMilestones.max_followers)}`);
    console.log(`   Posts: ${formatNumber(igMilestones.min_posts)} → ${formatNumber(igMilestones.max_posts)}`);
  }
  
  db.close();
  
  console.log('\n\n✅ Report complete!');
}

generateReport().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
