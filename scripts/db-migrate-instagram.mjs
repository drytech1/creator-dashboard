#!/usr/bin/env node
/**
 * Database Migration - Add Instagram Support
 * Adds tables for Instagram metrics tracking
 */

import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'creatordash.db');

const db = new sqlite3.Database(DB_PATH);

console.log('🔄 Running migration: Add Instagram support\n');

db.serialize(() => {
  // Instagram account metrics (daily snapshots)
  db.run(`
    CREATE TABLE IF NOT EXISTS instagram_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      user_id TEXT NOT NULL,
      username TEXT NOT NULL,
      followers INTEGER NOT NULL,
      follows INTEGER NOT NULL,
      media_count INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating instagram_metrics:', err);
    else console.log('✓ Table created: instagram_metrics');
  });

  // Instagram media/posts metrics
  db.run(`
    CREATE TABLE IF NOT EXISTS instagram_media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      media_id TEXT NOT NULL,
      media_type TEXT NOT NULL,
      caption TEXT,
      permalink TEXT,
      thumbnail_url TEXT,
      timestamp TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      comments INTEGER DEFAULT 0,
      reach INTEGER DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, media_id)
    )
  `, (err) => {
    if (err) console.error('Error creating instagram_media:', err);
    else console.log('✓ Table created: instagram_media');
  });

  // Instagram growth metrics
  db.run(`
    CREATE TABLE IF NOT EXISTS instagram_growth (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      follower_growth INTEGER,
      media_growth INTEGER,
      follower_growth_pct REAL,
      week_over_week_followers INTEGER,
      month_over_month_followers INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Error creating instagram_growth:', err);
    else console.log('✓ Table created: instagram_growth');
  });

  // Indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_instagram_metrics_date ON instagram_metrics(date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_instagram_media_date ON instagram_media(date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_instagram_growth_date ON instagram_growth(date)`);

  // Update the daily summary view to include Instagram
  db.run(`DROP VIEW IF EXISTS v_daily_summary`, (err) => {
    db.run(`
      CREATE VIEW v_daily_summary AS
      SELECT 
        cm.date,
        cm.channel_name,
        cm.subscribers,
        cm.total_views,
        cm.total_videos,
        gm.subscriber_growth,
        gm.view_growth,
        gm.subscriber_growth_pct,
        gm.view_growth_pct,
        gm.week_over_week_subscribers,
        gm.week_over_week_views,
        im.username as instagram_username,
        im.followers as instagram_followers,
        im.media_count as instagram_posts,
        ig.follower_growth as instagram_follower_growth
      FROM channel_metrics cm
      LEFT JOIN growth_metrics gm ON cm.date = gm.date
      LEFT JOIN instagram_metrics im ON cm.date = im.date
      LEFT JOIN instagram_growth ig ON cm.date = ig.date
      ORDER BY cm.date DESC
    `, (err) => {
      if (err) console.error('Error creating view:', err);
      else console.log('✓ View updated: v_daily_summary (includes Instagram)');
    });
  });
});

db.close(() => {
  console.log('\n🎉 Migration complete!');
  console.log('\nNext steps:');
  console.log('  1. Add your Instagram access token to .env.local');
  console.log('  2. Run: npm run fetch:instagram');
  console.log('  3. Run: npm run report');
});
