#!/usr/bin/env node
/**
 * Database Initialization Script
 * Creates SQLite database and tables for historical tracking
 */

import sqlite3 from 'sqlite3';
import { mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'creatordash.db');

// Ensure data directory exists
try {
  mkdirSync(DATA_DIR, { recursive: true });
  console.log('✓ Data directory created');
} catch (err) {
  // Directory already exists
}

const db = new sqlite3.Database(DB_PATH);
console.log(`✓ Database opened: ${DB_PATH}`);

// Create tables
db.serialize(() => {
  // Daily channel metrics snapshot
  db.run(`
    CREATE TABLE IF NOT EXISTS channel_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      channel_id TEXT NOT NULL,
      channel_name TEXT NOT NULL,
      subscribers INTEGER NOT NULL,
      total_views INTEGER NOT NULL,
      total_videos INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Individual video metrics (snapshots over time)
  db.run(`
    CREATE TABLE IF NOT EXISTS video_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      video_id TEXT NOT NULL,
      title TEXT NOT NULL,
      views INTEGER NOT NULL,
      likes INTEGER NOT NULL,
      comments INTEGER NOT NULL,
      published_at TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(date, video_id)
    )
  `);

  // Growth calculations (derived data for fast queries)
  db.run(`
    CREATE TABLE IF NOT EXISTS growth_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT UNIQUE NOT NULL,
      subscriber_growth INTEGER,
      view_growth INTEGER,
      video_growth INTEGER,
      subscriber_growth_pct REAL,
      view_growth_pct REAL,
      week_over_week_subscribers INTEGER,
      week_over_week_views INTEGER,
      month_over_month_subscribers INTEGER,
      month_over_month_views INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Indexes for performance
  db.run(`CREATE INDEX IF NOT EXISTS idx_channel_metrics_date ON channel_metrics(date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_video_metrics_date ON video_metrics(date)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_video_metrics_video_id ON video_metrics(video_id)`);
  db.run(`CREATE INDEX IF NOT EXISTS idx_growth_metrics_date ON growth_metrics(date)`);
});

console.log('✓ Tables created: channel_metrics, video_metrics, growth_metrics');
console.log('✓ Indexes created');

// Create a view for easy reporting
db.run(`
  CREATE VIEW IF NOT EXISTS v_daily_summary AS
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
    gm.week_over_week_views
  FROM channel_metrics cm
  LEFT JOIN growth_metrics gm ON cm.date = gm.date
  ORDER BY cm.date DESC
`, (err) => {
  if (err) {
    console.error('Error creating view:', err);
  } else {
    console.log('✓ View created: v_daily_summary');
  }
  
  db.close();
  console.log('\n🎉 Database initialized successfully!');
  console.log(`\nNext steps:`);
  console.log(`  npm run fetch        - Fetch and save today's metrics`);
  console.log(`  npm run report       - Generate growth report`);
});
