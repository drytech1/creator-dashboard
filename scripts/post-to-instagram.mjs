#!/usr/bin/env node
/**
 * Instagram Posting Script
 * Upload posts, stories, reels, and carousels to Instagram
 * 
 * Usage:
 *   node post-to-instagram.mjs --image /path/to/image.jpg --caption "My caption"
 *   node post-to-instagram.mjs --reel /path/to/reel.mp4 --caption "My reel"
 *   node post-to-instagram.mjs --carousel /path/to/img1.jpg,/path/to/img2.jpg --caption "Carousel post"
 *   node post-to-instagram.mjs --story /path/to/story.jpg
 */

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

class InstagramPoster {
  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    this.instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID; // Need to get this from Facebook Graph API
  }

  async getInstagramAccountId() {
    // First, get the Facebook Page ID, then get the connected Instagram account
    console.log('🔍 Getting Instagram Account ID...');
    
    try {
      // Get user's Facebook pages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${this.accessToken}`
      );
      const pagesData = await pagesResponse.json();
      
      if (!pagesData.data || pagesData.data.length === 0) {
        throw new Error('No Facebook pages found. You need a Facebook page connected to your Instagram business account.');
      }

      // Get Instagram Business Account ID from the first page
      const pageId = pagesData.data[0].id;
      const pageToken = pagesData.data[0].access_token;
      
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
      );
      const igData = await igResponse.json();
      
      if (!igData.instagram_business_account) {
        throw new Error('No Instagram Business Account connected to this Facebook page.');
      }

      this.instagramAccountId = igData.instagram_business_account.id;
      this.pageAccessToken = pageToken;
      
      console.log(`✅ Found Instagram Account ID: ${this.instagramAccountId}`);
      return this.instagramAccountId;

    } catch (error) {
      console.error('❌ Error getting Instagram Account ID:', error.message);
      throw error;
    }
  }

  async uploadImage(options) {
    const { imagePath, caption = '' } = options;

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    if (!this.instagramAccountId) {
      await this.getInstagramAccountId();
    }

    console.log(`📤 Uploading image to Instagram...`);
    console.log(`   Caption: ${caption.substring(0, 50)}${caption.length > 50 ? '...' : ''}`);

    try {
      // Step 1: Create media container
      const imageUrl = await this.uploadToTemporaryHosting(imagePath);
      
      const createResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imageUrl,
            caption: caption,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const createData = await createResponse.json();
      
      if (createData.error) {
        throw new Error(createData.error.message);
      }

      const creationId = createData.id;
      console.log(`   Media container created: ${creationId}`);

      // Step 2: Publish the media
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: creationId,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const publishData = await publishResponse.json();
      
      if (publishData.error) {
        throw new Error(publishData.error.message);
      }

      console.log('✅ Image posted successfully!');
      console.log(`   Media ID: ${publishData.id}`);

      return {
        success: true,
        mediaId: publishData.id,
        permalink: `https://instagram.com/p/${publishData.id}`
      };

    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      throw error;
    }
  }

  async uploadReel(options) {
    const { videoPath, caption = '' } = options;

    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    if (!this.instagramAccountId) {
      await this.getInstagramAccountId();
    }

    console.log(`📤 Uploading reel to Instagram...`);
    console.log(`   Caption: ${caption.substring(0, 50)}${caption.length > 50 ? '...' : ''}`);

    try {
      // For reels, we need to upload to a publicly accessible URL first
      const videoUrl = await this.uploadToTemporaryHosting(videoPath);
      
      // Step 1: Create reel container
      const createResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'REELS',
            video_url: videoUrl,
            caption: caption,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const createData = await createResponse.json();
      
      if (createData.error) {
        throw new Error(createData.error.message);
      }

      const creationId = createData.id;
      console.log(`   Reel container created: ${creationId}`);
      console.log('   Waiting for processing...');

      // Step 2: Wait for video processing
      let status = 'IN_PROGRESS';
      let attempts = 0;
      const maxAttempts = 30;
      
      while (status === 'IN_PROGRESS' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(
          `https://graph.facebook.com/v18.0/${creationId}?fields=status_code&access_token=${this.pageAccessToken}`
        );
        const statusData = await statusResponse.json();
        status = statusData.status_code;
        attempts++;
        
        process.stdout.write(`\r   Processing... (${attempts}/${maxAttempts})`);
      }
      
      console.log('');

      if (status !== 'FINISHED') {
        throw new Error(`Video processing failed with status: ${status}`);
      }

      // Step 3: Publish the reel
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: creationId,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const publishData = await publishResponse.json();
      
      if (publishData.error) {
        throw new Error(publishData.error.message);
      }

      console.log('✅ Reel posted successfully!');
      console.log(`   Media ID: ${publishData.id}`);

      return {
        success: true,
        mediaId: publishData.id,
        permalink: `https://instagram.com/reel/${publishData.id}`
      };

    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      throw error;
    }
  }

  async uploadCarousel(options) {
    const { imagePaths, caption = '' } = options;

    if (!Array.isArray(imagePaths) || imagePaths.length < 2 || imagePaths.length > 10) {
      throw new Error('Carousel requires 2-10 images');
    }

    if (!this.instagramAccountId) {
      await this.getInstagramAccountId();
    }

    console.log(`📤 Uploading carousel to Instagram (${imagePaths.length} images)...`);

    try {
      // Upload all images and get their URLs
      const imageUrls = [];
      for (const imagePath of imagePaths) {
        if (!fs.existsSync(imagePath)) {
          throw new Error(`Image file not found: ${imagePath}`);
        }
        const url = await this.uploadToTemporaryHosting(imagePath);
        imageUrls.push(url);
      }

      // Step 1: Create carousel container
      const children = imageUrls.join(',');
      
      const createResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: 'CAROUSEL',
            children: children,
            caption: caption,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const createData = await createResponse.json();
      
      if (createData.error) {
        throw new Error(createData.error.message);
      }

      const creationId = createData.id;
      console.log(`   Carousel container created: ${creationId}`);

      // Step 2: Publish the carousel
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: creationId,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const publishData = await publishResponse.json();
      
      if (publishData.error) {
        throw new Error(publishData.error.message);
      }

      console.log('✅ Carousel posted successfully!');
      console.log(`   Media ID: ${publishData.id}`);

      return {
        success: true,
        mediaId: publishData.id,
        permalink: `https://instagram.com/p/${publishData.id}`
      };

    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      throw error;
    }
  }

  async uploadStory(options) {
    const { mediaPath } = options;

    if (!fs.existsSync(mediaPath)) {
      throw new Error(`Media file not found: ${mediaPath}`);
    }

    if (!this.instagramAccountId) {
      await this.getInstagramAccountId();
    }

    console.log(`📤 Uploading story to Instagram...`);

    try {
      const mediaUrl = await this.uploadToTemporaryHosting(mediaPath);
      const isVideo = mediaPath.toLowerCase().endsWith('.mp4') || 
                      mediaPath.toLowerCase().endsWith('.mov');
      
      const createResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            media_type: isVideo ? 'STORIES' : 'STORIES',
            [isVideo ? 'video_url' : 'image_url']: mediaUrl,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const createData = await createResponse.json();
      
      if (createData.error) {
        throw new Error(createData.error.message);
      }

      // Publish story
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media_publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creation_id: createData.id,
            access_token: this.pageAccessToken
          })
        }
      );
      
      const publishData = await publishResponse.json();
      
      if (publishData.error) {
        throw new Error(publishData.error.message);
      }

      console.log('✅ Story posted successfully!');

      return {
        success: true,
        mediaId: publishData.id
      };

    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      throw error;
    }
  }

  async uploadToTemporaryHosting(filePath) {
    // In production, you'd upload to your own server or S3
    // For now, this is a placeholder that returns a local file URL
    // You'll need to implement actual file hosting
    console.log('⚠️  Note: Instagram requires publicly accessible URLs for media');
    console.log('   Please upload your media to a public URL first (S3, CDN, etc.)');
    console.log('   File:', filePath);
    
    // Return a placeholder - in production, upload to S3 and return the URL
    throw new Error('Temporary hosting not implemented. Please provide a public URL or implement S3/CDN upload.');
  }

  async schedulePost(options) {
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    try {
      const result = await db.run(`
        INSERT INTO scheduled_posts 
        (platform, post_type, description, media_urls, scheduled_at, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        'instagram',
        options.postType,
        options.caption,
        JSON.stringify(options.mediaPaths || [options.mediaPath]),
        options.scheduledAt,
        'scheduled'
      ]);

      console.log('✅ Instagram post scheduled successfully!');
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
        WHERE platform = 'instagram' 
        AND status IN ('scheduled', 'draft')
        ORDER BY scheduled_at ASC
      `);

      return posts;
    } finally {
      await db.close();
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const poster = new InstagramPoster();

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Instagram Posting Script

Usage:
  Post single image:
    node post-to-instagram.mjs --image /path/to/image.jpg --caption "My caption"
  
  Post reel:
    node post-to-instagram.mjs --reel /path/to/reel.mp4 --caption "My reel caption"
  
  Post carousel (2-10 images):
    node post-to-instagram.mjs --carousel /path/to/img1.jpg,/path/to/img2.jpg --caption "Carousel"
  
  Post story:
    node post-to-instagram.mjs --story /path/to/story.jpg
  
  Schedule post:
    node post-to-instagram.mjs --image /path/to/image.jpg --caption "Caption" --schedule --at "2026-03-25 10:00"
  
  List scheduled posts:
    node post-to-instagram.mjs --list

Options:
  --image <path>        Path to image file
  --reel <path>         Path to reel video file
  --carousel <paths>    Comma-separated paths to images (2-10)
  --story <path>        Path to story image/video
  --caption <text>      Post caption
  --schedule            Schedule for later
  --at <datetime>       Schedule time (YYYY-MM-DD HH:MM)
  --list                List scheduled posts
  --help                Show this help

Requirements:
  • Instagram Business or Creator Account
  • Facebook Page connected to Instagram account
  • FACEBOOK_ACCESS_TOKEN in .env.local
    `);
    return;
  }

  if (args.includes('--list')) {
    const posts = await poster.getScheduledPosts();
    console.log(`\n📅 Scheduled Instagram Posts (${posts.length}):\n`);
    posts.forEach(post => {
      console.log(`  [${post.id}] ${post.description.substring(0, 50)}...`);
      console.log(`      Type: ${post.post_type} | Status: ${post.status}`);
      console.log(`      Scheduled: ${post.scheduled_at || 'Not scheduled'}`);
      console.log('');
    });
    return;
  }

  const imageIndex = args.indexOf('--image');
  const reelIndex = args.indexOf('--reel');
  const carouselIndex = args.indexOf('--carousel');
  const storyIndex = args.indexOf('--story');
  const captionIndex = args.indexOf('--caption');
  const scheduleIndex = args.indexOf('--schedule');
  const atIndex = args.indexOf('--at');

  const caption = captionIndex !== -1 ? args[captionIndex + 1] : '';
  const isScheduled = scheduleIndex !== -1;
  const scheduledAt = atIndex !== -1 ? args[atIndex + 1] : null;

  try {
    if (imageIndex !== -1) {
      const imagePath = args[imageIndex + 1];
      
      if (isScheduled) {
        await poster.schedulePost({
          postType: 'image',
          mediaPath: imagePath,
          caption,
          scheduledAt: new Date(scheduledAt).toISOString()
        });
      } else {
        await poster.uploadImage({ imagePath, caption });
      }
    } else if (reelIndex !== -1) {
      const videoPath = args[reelIndex + 1];
      
      if (isScheduled) {
        await poster.schedulePost({
          postType: 'reel',
          mediaPath: videoPath,
          caption,
          scheduledAt: new Date(scheduledAt).toISOString()
        });
      } else {
        await poster.uploadReel({ videoPath, caption });
      }
    } else if (carouselIndex !== -1) {
      const paths = args[carouselIndex + 1].split(',');
      
      if (isScheduled) {
        await poster.schedulePost({
          postType: 'carousel',
          mediaPaths: paths,
          caption,
          scheduledAt: new Date(scheduledAt).toISOString()
        });
      } else {
        await poster.uploadCarousel({ imagePaths: paths, caption });
      }
    } else if (storyIndex !== -1) {
      const mediaPath = args[storyIndex + 1];
      await poster.uploadStory({ mediaPath });
    } else {
      console.error('❌ Error: Please specify --image, --reel, --carousel, or --story');
      console.log('Run with --help for usage information');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
