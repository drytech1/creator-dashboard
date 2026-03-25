#!/usr/bin/env node
/**
 * Unified Social Media Posting Script
 * Post to multiple platforms from one command
 * 
 * Usage:
 *   node post.mjs --platforms youtube,instagram --file /path/to/video.mp4 --title "Title" --caption "Caption"
 *   node post.mjs --schedule --platforms instagram --image /path/to/image.jpg --caption "Caption" --at "2026-03-25 10:00"
 *   node post.mjs --list-scheduled
 *   node post.mjs --process-scheduled
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'creatordash.db');

class SocialMediaPoster {
  constructor() {
    this.platforms = {};
  }

  async loadPlatform(platform) {
    try {
      const module = await import(`./post-to-${platform}.mjs`);
      this.platforms[platform] = new module.default || module[Object.keys(module)[0]];
      return this.platforms[platform];
    } catch (error) {
      console.error(`❌ Failed to load platform: ${platform}`);
      throw error;
    }
  }

  async schedulePost(options) {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    try {
      const results = [];

      for (const platform of options.platforms) {
        const result = await db.run(`
          INSERT INTO scheduled_posts 
          (platform, post_type, title, description, media_urls, hashtags, scheduled_at, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          platform,
          options.postType,
          options.title || null,
          options.caption || options.description || null,
          JSON.stringify(options.mediaPaths || [options.mediaPath].filter(Boolean)),
          options.hashtags || null,
          options.scheduledAt,
          'scheduled'
        ]);

        results.push({
          platform,
          postId: result.lastID
        });

        console.log(`✅ Scheduled for ${platform}: Post ID ${result.lastID}`);
      }

      return results;

    } finally {
      await db.close();
    }
  }

  async getScheduledPosts(platform = null) {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    try {
      let query = `
        SELECT * FROM scheduled_posts 
        WHERE status IN ('scheduled', 'draft')
      `;
      
      if (platform) {
        query += ` AND platform = ?`;
      }
      
      query += ` ORDER BY scheduled_at ASC`;

      const posts = platform 
        ? await db.all(query, [platform])
        : await db.all(query);

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
        WHERE status = 'scheduled'
        AND scheduled_at <= ?
        ORDER BY scheduled_at ASC
      `, [now]);

      console.log(`🔄 Processing ${posts.length} scheduled posts...\n`);

      for (const post of posts) {
        try {
          console.log(`📤 Posting to ${post.platform}: ${post.title || post.description?.substring(0, 50)}...`);
          
          // Load the appropriate poster
          const poster = await this.loadPlatform(post.platform);
          
          const mediaUrls = JSON.parse(post.media_urls || '[]');
          
          let result;
          
          if (post.platform === 'youtube') {
            if (post.post_type === 'short') {
              result = await poster.uploadShort({
                filePath: mediaUrls[0],
                title: post.title,
                description: post.description
              });
            } else {
              result = await poster.uploadVideo({
                filePath: mediaUrls[0],
                title: post.title,
                description: post.description
              });
            }
          } else if (post.platform === 'instagram') {
            if (post.post_type === 'reel') {
              result = await poster.uploadReel({
                videoPath: mediaUrls[0],
                caption: post.description
              });
            } else if (post.post_type === 'carousel') {
              result = await poster.uploadCarousel({
                imagePaths: mediaUrls,
                caption: post.description
              });
            } else {
              result = await poster.uploadImage({
                imagePath: mediaUrls[0],
                caption: post.description
              });
            }
          }

          // Update post status
          await db.run(`
            UPDATE scheduled_posts 
            SET status = 'posted', 
                posted_at = CURRENT_TIMESTAMP,
                platform_post_id = ?,
                platform_post_url = ?
            WHERE id = ?
          `, [result.mediaId || result.videoId, result.permalink || result.url, post.id]);

          // Log the action
          await db.run(`
            INSERT INTO posting_logs (post_id, platform, action, status, message, api_response)
            VALUES (?, ?, ?, ?, ?, ?)
          `, [post.id, post.platform, 'post', 'success', 'Posted successfully', JSON.stringify(result)]);

          console.log(`✅ Successfully posted to ${post.platform}\n`);

        } catch (error) {
          console.error(`❌ Failed to post to ${post.platform}: ${error.message}\n`);
          
          await db.run(`
            UPDATE scheduled_posts 
            SET status = 'failed', 
                error_message = ?
            WHERE id = ?
          `, [error.message, post.id]);

          await db.run(`
            INSERT INTO posting_logs (post_id, platform, action, status, message)
            VALUES (?, ?, ?, ?, ?)
          `, [post.id, post.platform, 'post', 'failed', error.message]);
        }
      }

      console.log('🎉 Finished processing scheduled posts');

    } finally {
      await db.close();
    }
  }

  async postNow(options) {
    const results = [];

    for (const platform of options.platforms) {
      try {
        console.log(`\n📤 Posting to ${platform}...`);
        
        const poster = await this.loadPlatform(platform);
        let result;

        if (platform === 'youtube') {
          if (options.postType === 'short') {
            result = await poster.uploadShort({
              filePath: options.mediaPath,
              title: options.title,
              description: options.caption || options.description
            });
          } else {
            result = await poster.uploadVideo({
              filePath: options.mediaPath,
              title: options.title,
              description: options.caption || options.description,
              privacyStatus: options.privacy || 'private'
            });
          }
        } else if (platform === 'instagram') {
          if (options.postType === 'reel') {
            result = await poster.uploadReel({
              videoPath: options.mediaPath,
              caption: options.caption
            });
          } else if (options.postType === 'carousel') {
            result = await poster.uploadCarousel({
              imagePaths: options.mediaPaths,
              caption: options.caption
            });
          } else if (options.postType === 'story') {
            result = await poster.uploadStory({
              mediaPath: options.mediaPath
            });
          } else {
            result = await poster.uploadImage({
              imagePath: options.mediaPath,
              caption: options.caption
            });
          }
        }

        results.push({ platform, success: true, result });
        console.log(`✅ Successfully posted to ${platform}`);

      } catch (error) {
        results.push({ platform, success: false, error: error.message });
        console.error(`❌ Failed to post to ${platform}: ${error.message}`);
      }
    }

    return results;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const poster = new SocialMediaPoster();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Unified Social Media Posting Script
Post to multiple platforms from one command!

USAGE:
  Post now:
    node post.mjs --platforms youtube,instagram --file video.mp4 --title "Title" --caption "Caption"
  
  Schedule for later:
    node post.mjs --schedule --platforms youtube,instagram --file video.mp4 --title "Title" --at "2026-03-25 10:00"
  
  List scheduled posts:
    node post.mjs --list-scheduled
    node post.mjs --list-scheduled --platform instagram
  
  Process due scheduled posts:
    node post.mjs --process-scheduled

OPTIONS:
  --platforms <list>     Comma-separated list: youtube,instagram
  --file <path>          Path to video file (for YouTube/reels)
  --image <path>         Path to image file (for Instagram)
  --images <paths>       Comma-separated paths for carousel
  --title <text>         Post title (YouTube)
  --caption <text>       Post caption/description
  --hashtags <tags>      Hashtags to include
  --type <type>          Post type: video, short, image, reel, carousel, story
  --privacy <status>     YouTube privacy: public, unlisted, private (default: private)
  --schedule             Schedule instead of posting now
  --at <datetime>        Schedule time: "YYYY-MM-DD HH:MM"
  --list-scheduled       List all scheduled posts
  --process-scheduled    Process all due scheduled posts
  --help                 Show this help

EXAMPLES:
  # Post video to YouTube
  node post.mjs --platforms youtube --file video.mp4 --title "My Video" --caption "Check this out!"
  
  # Post image to Instagram
  node post.mjs --platforms instagram --image photo.jpg --caption "Great day! #lifestyle"
  
  # Post to both platforms
  node post.mjs --platforms youtube,instagram --file video.mp4 --title "My Video" --caption "Watch this!"
  
  # Schedule for tomorrow at 10 AM
  node post.mjs --schedule --platforms instagram --image photo.jpg --caption "Morning post" --at "2026-03-25 10:00"
    `);
    return;
  }

  if (args.includes('--list-scheduled')) {
    const platformIndex = args.indexOf('--platform');
    const platform = platformIndex !== -1 ? args[platformIndex + 1] : null;
    
    const posts = await poster.getScheduledPosts(platform);
    
    console.log(`\n📅 Scheduled Posts (${posts.length}):\n`);
    
    if (posts.length === 0) {
      console.log('  No scheduled posts found.\n');
      return;
    }

    posts.forEach(post => {
      console.log(`  [${post.id}] ${post.platform.toUpperCase()}`);
      console.log(`      Title: ${post.title || post.description?.substring(0, 50) || 'N/A'}...`);
      console.log(`      Type: ${post.post_type} | Status: ${post.status}`);
      console.log(`      Scheduled: ${post.scheduled_at || 'Not scheduled'}`);
      console.log('');
    });
    return;
  }

  if (args.includes('--process-scheduled')) {
    await poster.processScheduledPosts();
    return;
  }

  // Parse arguments
  const platformsIndex = args.indexOf('--platforms');
  const fileIndex = args.indexOf('--file');
  const imageIndex = args.indexOf('--image');
  const imagesIndex = args.indexOf('--images');
  const titleIndex = args.indexOf('--title');
  const captionIndex = args.indexOf('--caption');
  const hashtagsIndex = args.indexOf('--hashtags');
  const typeIndex = args.indexOf('--type');
  const privacyIndex = args.indexOf('--privacy');
  const scheduleIndex = args.indexOf('--schedule');
  const atIndex = args.indexOf('--at');

  if (platformsIndex === -1) {
    console.error('❌ Error: --platforms is required');
    console.log('Run with --help for usage information');
    process.exit(1);
  }

  const platforms = args[platformsIndex + 1].split(',');
  const title = titleIndex !== -1 ? args[titleIndex + 1] : null;
  const caption = captionIndex !== -1 ? args[captionIndex + 1] : null;
  const hashtags = hashtagsIndex !== -1 ? args[hashtagsIndex + 1] : null;
  const postType = typeIndex !== -1 ? args[typeIndex + 1] : 'video';
  const privacy = privacyIndex !== -1 ? args[privacyIndex + 1] : 'private';
  const isScheduled = scheduleIndex !== -1;
  const scheduledAt = atIndex !== -1 ? args[atIndex + 1] : null;

  // Determine media path(s)
  let mediaPath = null;
  let mediaPaths = null;

  if (fileIndex !== -1) {
    mediaPath = args[fileIndex + 1];
  } else if (imageIndex !== -1) {
    mediaPath = args[imageIndex + 1];
  } else if (imagesIndex !== -1) {
    mediaPaths = args[imagesIndex + 1].split(',');
  }

  if (!mediaPath && !mediaPaths) {
    console.error('❌ Error: --file, --image, or --images is required');
    process.exit(1);
  }

  if (isScheduled && !scheduledAt) {
    console.error('❌ Error: --at is required when using --schedule');
    process.exit(1);
  }

  const options = {
    platforms,
    postType,
    title,
    caption,
    description: caption,
    hashtags,
    mediaPath,
    mediaPaths,
    privacy,
    scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null
  };

  try {
    if (isScheduled) {
      await poster.schedulePost(options);
    } else {
      await poster.postNow(options);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
