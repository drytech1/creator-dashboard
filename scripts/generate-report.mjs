#!/usr/bin/env node
/**
 * Generate Growth Reports
 * Shows historical data with growth analytics
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
  const count = await new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) as count FROM channel_metrics', (err, row) => {
      if (err) reject(err);
      else resolve(row.count);
    });
  });
  
  if (count === 0) {
    console.log('📭 No data found. Run "npm run fetch" first to collect metrics.');
    db.close();
    return;
  }
  
  console.log('📊 CREATOR DASHBOARD - GROWTH REPORT\n');
  console.log('='.repeat(60));
  
  // Latest snapshot
  const latest = await new Promise((resolve, reject) => {
    db.get('SELECT * FROM v_daily_summary LIMIT 1', (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
  
  console.log(`\n📅 Latest Snapshot: ${latest.date}`);
  console.log(`📺 Channel: ${latest.channel_name}`);
  console.log(`\n📈 Current Metrics:`);
  console.log(`   Subscribers: ${formatNumber(latest.subscribers)}`);
  console.log(`   Total Views: ${formatNumber(latest.total_views)}`);
  console.log(`   Total Videos: ${formatNumber(latest.total_videos)}`);
  
  // Daily growth
  if (latest.subscriber_growth !== null) {
    console.log(`\n📊 Daily Growth (vs yesterday):`);
    console.log(`   Subscribers: ${formatGrowth(latest.subscriber_growth)} (${formatPct(latest.subscriber_growth_pct)})`);
    console.log(`   Views: ${formatGrowth(latest.view_growth)} (${formatPct(latest.view_growth_pct)})`);
  }
  
  // Week over week
  if (latest.week_over_week_subscribers !== null) {
    console.log(`\n📈 Week over Week:`);
    console.log(`   Subscribers: ${formatGrowth(latest.week_over_week_subscribers)}`);
    console.log(`   Views: ${formatGrowth(latest.week_over_week_views)}`);
  }
  
  // Month over month
  if (latest.month_over_month_subscribers !== null) {
    console.log(`\n📉 Month over Month:`);
    console.log(`   Subscribers: ${formatGrowth(latest.month_over_month_subscribers)}`);
    console.log(`   Views: ${formatGrowth(latest.month_over_month_views)}`);
  }
  
  // Recent history table
  console.log(`\n\n📋 RECENT HISTORY (Last ${DAYS} Days)`);
  console.log('-'.repeat(80));
  console.log(`${'Date'.padEnd(12)} ${'Subs'.padEnd(10)} ${'Views'.padEnd(12)} ${'Growth'.padEnd(10)} ${'WoW'.padEnd(10)}`);
  console.log('-'.repeat(80));
  
  const history = await new Promise((resolve, reject) => {
    db.all(`
      SELECT date, subscribers, total_views, subscriber_growth, week_over_week_subscribers
      FROM v_daily_summary
      LIMIT ?
    `, [DAYS], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
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
  
  // Weekly summary if requested
  if (WEEKLY || MONTHLY) {
    console.log(`\n\n📅 WEEKLY SUMMARY`);
    console.log('-'.repeat(80));
    
    const weekly = await new Promise((resolve, reject) => {
      db.all(`
        SELECT 
          strftime('%Y-W%W', date) as week,
          MIN(subscribers) as start_subs,
          MAX(subscribers) as end_subs,
          MIN(total_views) as start_views,
          MAX(total_views) as end_views,
          COUNT(*) as days_recorded
        FROM channel_metrics
        GROUP BY week
        ORDER BY week DESC
        LIMIT 8
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log(`${'Week'.padEnd(12)} ${'Start Subs'.padEnd(12)} ${'End Subs'.padEnd(12)} ${'Growth'.padEnd(10)} ${'Days'}`);
    console.log('-'.repeat(80));
    
    for (const row of weekly) {
      const growth = row.end_subs - row.start_subs;
      console.log(
        `${row.week.padEnd(12)} ` +
        `${formatNumber(row.start_subs).padEnd(12)} ` +
        `${formatNumber(row.end_subs).padEnd(12)} ` +
        `${formatGrowth(growth).padEnd(10)} ` +
        `${row.days_recorded}`
      );
    }
  }
  
  // Top performing videos
  console.log(`\n\n🎬 RECENT VIDEO PERFORMANCE`);
  console.log('-'.repeat(80));
  
  const videos = await new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        vm.title,
        vm.views,
        vm.likes,
        vm.comments,
        vm.published_at,
        cm.date as recorded_date
      FROM video_metrics vm
      JOIN channel_metrics cm ON vm.date = cm.date
      WHERE vm.date = (SELECT MAX(date) FROM channel_metrics)
      ORDER BY vm.views DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
  
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const published = new Date(v.published_at).toLocaleDateString();
    console.log(`\n${i + 1}. ${v.title.substring(0, 50)}${v.title.length > 50 ? '...' : ''}`);
    console.log(`   Views: ${formatNumber(v.views)} | Likes: ${formatNumber(v.likes)} | Comments: ${formatNumber(v.comments)}`);
    console.log(`   Published: ${published}`);
  }
  
  // Milestones
  console.log(`\n\n🏆 MILESTONES`);
  console.log('-'.repeat(60));
  
  const milestones = await new Promise((resolve, reject) => {
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
    `, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
  
  console.log(`First recorded: ${milestones.first_recorded}`);
  console.log(`Latest recorded: ${milestones.latest_recorded}`);
  console.log(`Days of data: ${milestones.total_days}`);
  console.log(`Subscriber growth: ${formatNumber(milestones.min_subs)} → ${formatNumber(milestones.max_subs)}`);
  console.log(`View growth: ${formatNumber(milestones.min_views)} → ${formatNumber(milestones.max_views)}`);
  
  db.close();
  
  console.log('\n\n✅ Report complete!');
}

generateReport().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
