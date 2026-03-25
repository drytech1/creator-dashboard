#!/usr/bin/env node
/**
 * YouTube Posting Script
 * Upload videos, shorts, and manage YouTube content
 * 
 * Usage:
 *   node post-to-youtube.mjs --file /path/to/video.mp4 --title "My Video" --description "Description here"
 *   node post-to-youtube.mjs --short /path/to/short.mp4 --title "My Short"
 *   node post-to-youtube.mjs --schedule --file /path/to/video.mp4 --title "Title" --at "2026-03-25 10:00"
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'creatordash.db');

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
    }
  });
}

class YouTubePoster {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'http://localhost:3000/api/auth/callback/google'
    );
    
    // Check for existing tokens
    const tokenPath = path.join(__dirname, '..', 'credentials', 'youtube-upload-token.json');
    if (fs.existsSync(tokenPath)) {
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      this.oauth2Client.setCredentials(tokens);
    }
    
    this.youtube = google.youtube({
      version: 'v3',
      auth: this.oauth2Client
    });
  }

  async authenticate() {
    console.log('🔐 YouTube Upload Authentication Required');
    console.log('\nTo upload videos to YouTube, you need additional permissions.');
    console.log('Please run the web app and authenticate via the dashboard.');
    console.log('\nRequired scopes:');
    console.log('  • https://www.googleapis.com/auth/youtube.upload');
    console.log('  • https://www.googleapis.com/auth/youtube');
    
    return false;
  }

  async uploadVideo(options) {
    const {
      filePath,
      title,
      description = '',
      tags = [],
      categoryId = '22', // People & Blogs
      privacyStatus = 'private', // private, public, unlisted
      madeForKids = false
    } = options;

    if (!fs.existsSync(filePath)) {
      throw new Error(`Video file not found: ${filePath}`);
    }

    console.log(`📤 Uploading video to YouTube...`);
    console.log(`   Title: ${title}`);
    console.log(`   File: ${path.basename(filePath)}`);

    try {
      const fileSize = fs.statSync(filePath).size;
      
      const response = await this.youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
          snippet: {
            title: title,
            description: description,
            tags: tags,
            categoryId: categoryId
          },
          status: {
            privacyStatus: privacyStatus,
            madeForKids: madeForKids
          }
        },
        media: {
          body: fs.createReadStream(filePath)
        }
      }, {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize * 100).toFixed(2);
          process.stdout.write(`\r   Progress: ${progress}%`);
        }
      });

      console.log('\n✅ Video uploaded successfully!');
      console.log(`   Video ID: ${response.data.id}`);
      console.log(`   URL: https://youtube.com/watch?v=${response.data.id}`);

      return {
        success: true,
        videoId: response.data.id,
        url: `https://youtube.com/watch?v=${response.data.id}`,
        title: response.data.snippet.title,
        status: response.data.status.privacyStatus
      };

    } catch (error) {
      console.error('\n❌ Upload failed:', error.message);
      throw error;
    }
  }

  async uploadShort(options) {
    // YouTube Shorts are just videos under 60 seconds with #Shorts in title/description
    const shortOptions = {
      ...options,
      title: options.title.includes('#Shorts') ? options.title : `${options.title} #Shorts`,
      description: options.description ? `${options.description}\n\n#Shorts` : '#Shorts'
    };
    
    return this.uploadVideo({
      ...shortOptions,
      categoryId: '24' // Entertainment for shorts
    });
  }

  async schedulePost(options) {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    try {
      const result = await db.run(`
        INSERT INTO scheduled_posts 
        (platform, post_type, title, description, media_urls, scheduled_at, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        'youtube',
        options.isShort ? 'short' : 'video',
        options.title,
        options.description,
        JSON.stringify([options.filePath]),
        options.scheduledAt,
        'scheduled'
      ]);

      console.log('✅ Post scheduled successfully!');
      console.log(`   Post ID: ${result.lastID}`);
      console.log(`   Scheduled for: ${options.scheduledAt}`);

      return {
        success: true,
        postId: result.lastID,
        scheduledAt: options.scheduledAt
      };

    } finally {
      await db.close();
    }
  }

  async getScheduledPosts() {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    try {
      const posts = await db.all(`
        SELECT * FROM scheduled_posts 
        WHERE platform = 'youtube' 
        AND status IN ('scheduled', 'draft')
        ORDER BY scheduled_at ASC
      `);

      return posts;
    } finally {
      await db.close();
    }
  }

  async processScheduledPosts() {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    try {
      const now = new Date().toISOString();
      
      const posts = await db.all(`
        SELECT * FROM scheduled_posts 
        WHERE platform = 'youtube' 
        AND status = 'scheduled'
        AND scheduled_at <= ?
      `, [now]);

      console.log(`🔄 Processing ${posts.length} scheduled YouTube posts...\n`);

      for (const post of posts) {
        try {
          const mediaUrls = JSON.parse(post.media_urls || '[]');
          if (!mediaUrls.length) {
            throw new Error('No media files found');
          }

          const result = await this.uploadVideo({
            filePath: mediaUrls[0],
            title: post.title,
            description: post.description,
            privacyStatus: 'public'
          });

          await db.run(`
            UPDATE scheduled_posts 
            SET status = 'posted', 
                posted_at = CURRENT_TIMESTAMP,
                platform_post_id = ?,
                platform_post_url = ?
            WHERE id = ?
          `, [result.videoId, result.url, post.id]);

          console.log(`✅ Posted: ${post.title}\n`);

        } catch (error) {
          await db.run(`
            UPDATE scheduled_posts 
            SET status = 'failed', 
                error_message = ?
            WHERE id = ?
          `, [error.message, post.id]);

          console.log(`❌ Failed to post: ${post.title}`);
          console.log(`   Error: ${error.message}\n`);
        }
      }

    } finally {
      await db.close();
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const poster = new YouTubePoster();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
YouTube Posting Script

Usage:
  Upload video:
    node post-to-youtube.mjs --file /path/to/video.mp4 --title "My Video Title"
  
  Upload short:
    node post-to-youtube.mjs --short /path/to/short.mp4 --title "My Short Title"
  
  Schedule video:
    node post-to-youtube.mjs --file /path/to/video.mp4 --title "Title" --schedule --at "2026-03-25 10:00"
  
  List scheduled posts:
    node post-to-youtube.mjs --list
  
  Process scheduled posts:
    node post-to-youtube.mjs --process

Options:
  --file <path>       Path to video file
  --short <path>      Path to short video file (under 60 seconds)
  --title <text>      Video title
  --description <text> Video description
  --tags <tag1,tag2>  Comma-separated tags
  --privacy <status>  Privacy status: public, unlisted, private (default: private)
  --schedule          Schedule for later instead of posting now
  --at <datetime>     Schedule time (format: YYYY-MM-DD HH:MM)
  --list              List scheduled posts
  --process           Process due scheduled posts
  --help              Show this help message
    `);
    return;
  }

  if (args.includes('--list')) {
    const posts = await poster.getScheduledPosts();
    console.log(`\n📅 Scheduled YouTube Posts (${posts.length}):\n`);
    posts.forEach(post => {
      console.log(`  [${post.id}] ${post.title}`);
      console.log(`      Type: ${post.post_type} | Status: ${post.status}`);
      console.log(`      Scheduled: ${post.scheduled_at || 'Not scheduled'}`);
      console.log('');
    });
    return;
  }

  if (args.includes('--process')) {
    await poster.processScheduledPosts();
    return;
  }

  const fileIndex = args.indexOf('--file');
  const shortIndex = args.indexOf('--short');
  const titleIndex = args.indexOf('--title');
  const descIndex = args.indexOf('--description');
  const tagsIndex = args.indexOf('--tags');
  const privacyIndex = args.indexOf('--privacy');
  const scheduleIndex = args.indexOf('--schedule');
  const atIndex = args.indexOf('--at');

  const isShort = shortIndex !== -1;
  const filePath = fileIndex !== -1 ? args[fileIndex + 1] : 
                   shortIndex !== -1 ? args[shortIndex + 1] : null;
  const title = titleIndex !== -1 ? args[titleIndex + 1] : null;
  const description = descIndex !== -1 ? args[descIndex + 1] : '';
  const tags = tagsIndex !== -1 ? args[tagsIndex + 1].split(',') : [];
  const privacyStatus = privacyIndex !== -1 ? args[privacyIndex + 1] : 'private';
  const isScheduled = scheduleIndex !== -1;
  const scheduledAt = atIndex !== -1 ? args[atIndex + 1] : null;

  if (!filePath || !title) {
    console.error('❌ Error: --file (or --short) and --title are required');
    console.log('Run with --help for usage information');
    process.exit(1);
  }

  if (isScheduled && !scheduledAt) {
    console.error('❌ Error: --at is required when using --schedule');
    process.exit(1);
  }

  try {
    if (isScheduled) {
      await poster.schedulePost({
        filePath,
        title,
        description,
        isShort,
        scheduledAt: new Date(scheduledAt).toISOString()
      });
    } else {
      if (isShort) {
        await poster.uploadShort({
          filePath,
          title,
          description,
          tags,
          privacyStatus
        });
      } else {
        await poster.uploadVideo({
          filePath,
          title,
          description,
          tags,
          privacyStatus
        });
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
