#!/usr/bin/env node
/**
 * Fetch Instagram Metrics via Facebook Graph API
 * Uses connected Facebook Page to access Instagram Business/Creator account
 */

import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'creatordash.db');

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME || 'shonjimenez';

const DRY_RUN = process.argv.includes('--dry-run');

async function fetchInstagramMetrics() {
  if (!FACEBOOK_ACCESS_TOKEN) {
    throw new Error('FACEBOOK_ACCESS_TOKEN or INSTAGRAM_ACCESS_TOKEN not configured. Add it to .env.local');
  }

  try {
    // First, get the user's Facebook ID
    const meUrl = `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${FACEBOOK_ACCESS_TOKEN}`;
    const meResponse = await fetch(meUrl);
    const meData = await meResponse.json();
    
    if (meData.error) {
      throw new Error(`Facebook API error: ${meData.error.message}`);
    }

    console.log(`Connected as: ${meData.name} (ID: ${meData.id})`);

    // Get pages this user manages
    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${FACEBOOK_ACCESS_TOKEN}`;
    const pagesResponse = await fetch(pagesUrl);
    const pagesData = await pagesResponse.json();
    
    if (pagesData.error) {
      throw new Error(`Facebook API error: ${pagesData.error.message}`);
    }

    // Check if any page has Instagram connected
    let instagramBusinessAccount = null;
    let pageAccessToken = null;
    
    if (pagesData.data && pagesData.data.length > 0) {
      for (const page of pagesData.data) {
        const pageDetailsUrl = `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account,name&access_token=${FACEBOOK_ACCESS_TOKEN}`;
        const pageDetailsResponse = await fetch(pageDetailsUrl);
        const pageDetails = await pageDetailsResponse.json();
        
        if (pageDetails.instagram_business_account) {
          instagramBusinessAccount = pageDetails.instagram_business_account.id;
          pageAccessToken = page.access_token;
          console.log(`Found Instagram Business Account on page: ${page.name}`);
          break;
        }
      }
    }

    if (!instagramBusinessAccount) {
      // Fallback: Try to search for the Instagram user by username
      console.log('No connected Instagram Business account found. Trying alternative method...');
      
      // For now, return placeholder data
      // In production, you'd need to either:
      // 1. Connect Instagram to a Facebook Page
      // 2. Use Instagram Basic Display API with proper token
      // 3. Use a third-party service
      
      return {
        userId: 'pending_setup',
        username: INSTAGRAM_USERNAME,
        accountType: 'business_or_creator_required',
        mediaCount: 0,
        followers: 0,
        follows: 0,
        recentMedia: [],
        setupRequired: true
      };
    }

    // Get Instagram account info
    const igAccountUrl = `https://graph.facebook.com/v18.0/${instagramBusinessAccount}?fields=followers_count,follows_count,media_count,username&access_token=${pageAccessToken || FACEBOOK_ACCESS_TOKEN}`;
    const igAccountResponse = await fetch(igAccountUrl);
    const igAccount = await igAccountResponse.json();
    
    if (igAccount.error) {
      throw new Error(`Instagram API error: ${igAccount.error.message}`);
    }

    // Get recent media
    const mediaUrl = `https://graph.facebook.com/v18.0/${instagramBusinessAccount}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count&limit=10&access_token=${pageAccessToken || FACEBOOK_ACCESS_TOKEN}`;
    const mediaResponse = await fetch(mediaUrl);
    const mediaData = await mediaResponse.json();
    
    let recentMedia = [];
    if (mediaData.data) {
      recentMedia = mediaData.data.map(media => ({
        mediaId: media.id,
        mediaType: media.media_type,
        caption: media.caption || '',
        permalink: media.permalink,
        thumbnailUrl: media.thumbnail_url || media.media_url,
        timestamp: media.timestamp,
        username: igAccount.username,
        likes: media.like_count || 0,
        comments: media.comments_count || 0,
        reach: 0, // Requires insights permission
        impressions: 0 // Requires insights permission
      }));
    }

    return {
      userId: instagramBusinessAccount,
      username: igAccount.username,
      accountType: 'business',
      mediaCount: igAccount.media_count || 0,
      followers: igAccount.followers_count || 0,
      follows: igAccount.follows_count || 0,
      recentMedia,
      setupRequired: false
    };
    
  } catch (error) {
    console.error('Error fetching Instagram metrics:', error);
    throw error;
  }
}

function saveMetrics(db, metrics) {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Save account metrics
    const insertAccount = `
      INSERT INTO instagram_metrics (date, user_id, username, followers, follows, media_count)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(date) DO UPDATE SET
        followers = excluded.followers,
        follows = excluded.follows,
        media_count = excluded.media_count,
        created_at = CURRENT_TIMESTAMP
    `;
    
    db.run(insertAccount, [
      today,
      metrics.userId,
      metrics.username,
      metrics.followers,
      metrics.follows,
      metrics.mediaCount
    ], function(err) {
      if (err) return reject(err);
      
      // Save media metrics
      const insertMedia = `
        INSERT INTO instagram_media 
        (date, media_id, media_type, caption, permalink, thumbnail_url, timestamp, likes, comments, reach, impressions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(date, media_id) DO UPDATE SET
          likes = excluded.likes,
          comments = excluded.comments,
          reach = excluded.reach,
          impressions = excluded.impressions,
          created_at = CURRENT_TIMESTAMP
      `;
      
      let completed = 0;
      const total = metrics.recentMedia.length;
      
      if (total === 0) {
        resolve(today);
        return;
      }
      
      for (const media of metrics.recentMedia) {
        db.run(insertMedia, [
          today,
          media.mediaId,
          media.mediaType,
          media.caption,
          media.permalink,
          media.thumbnailUrl,
          media.timestamp,
          media.likes,
          media.comments,
          media.reach,
          media.impressions
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
      SELECT followers, media_count 
      FROM instagram_metrics 
      WHERE date < ? 
      ORDER BY date DESC 
      LIMIT 1
    `, [date], (err, yesterday) => {
      if (err) return reject(err);
      
      // Get today's metrics
      db.get(`
        SELECT followers, media_count 
        FROM instagram_metrics 
        WHERE date = ?
      `, [date], (err, today) => {
        if (err) return reject(err);
        if (!today) return resolve();
        
        let followerGrowth = 0;
        let mediaGrowth = 0;
        let followerGrowthPct = 0;
        
        if (yesterday) {
          followerGrowth = today.followers - yesterday.followers;
          mediaGrowth = today.media_count - yesterday.media_count;
          followerGrowthPct = yesterday.followers > 0 
            ? parseFloat(((followerGrowth / yesterday.followers) * 100).toFixed(2))
            : 0;
        }
        
        // Get week-over-week metrics
        db.get(`
          SELECT followers 
          FROM instagram_metrics 
          WHERE date <= date(?, '-7 days')
          ORDER BY date DESC 
          LIMIT 1
        `, [date], (err, weekAgo) => {
          if (err) return reject(err);
          
          // Get month-over-month metrics
          db.get(`
            SELECT followers 
            FROM instagram_metrics 
            WHERE date <= date(?, '-30 days')
            ORDER BY date DESC 
            LIMIT 1
          `, [date], (err, monthAgo) => {
            if (err) return reject(err);
            
            const insertGrowth = `
              INSERT INTO instagram_growth (
                date, follower_growth, media_growth, follower_growth_pct,
                week_over_week_followers, month_over_month_followers
              ) VALUES (?, ?, ?, ?, ?, ?)
              ON CONFLICT(date) DO UPDATE SET
                follower_growth = excluded.follower_growth,
                media_growth = excluded.media_growth,
                follower_growth_pct = excluded.follower_growth_pct,
                week_over_week_followers = excluded.week_over_week_followers,
                month_over_month_followers = excluded.month_over_month_followers,
                created_at = CURRENT_TIMESTAMP
            `;
            
            db.run(insertGrowth, [
              date,
              followerGrowth,
              mediaGrowth,
              followerGrowthPct,
              weekAgo ? today.followers - weekAgo.followers : null,
              monthAgo ? today.followers - monthAgo.followers : null
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
  console.log('📸 Fetching Instagram metrics...\n');
  
  try {
    const metrics = await fetchInstagramMetrics();
    
    if (metrics.setupRequired) {
      console.log(`\n⚠️  Instagram Setup Required`);
      console.log(`\nTo access Instagram metrics, you need to:`);
      console.log(`\n1. Convert your Instagram to a Business or Creator account`);
      console.log(`   - Go to Instagram → Settings → Account → Switch to Professional Account`);
      console.log(`\n2. Connect Instagram to a Facebook Page`);
      console.log(`   - In Instagram: Settings → Account → Linked Accounts → Facebook`);
      console.log(`   - Select or create a Facebook Page`);
      console.log(`\n3. Grant permissions`);
      console.log(`   - Make sure you're an admin of the Facebook Page`);
      console.log(`   - The page must be connected to your Instagram`);
      console.log(`\n4. Re-run this fetch`);
      console.log(`\n📚 More info: https://developers.facebook.com/docs/instagram-api/getting-started`);
      
      // Still save a placeholder record
      const db = new sqlite3.Database(DB_PATH);
      const today = new Date().toISOString().split('T')[0];
      db.run(`
        INSERT INTO instagram_metrics (date, user_id, username, followers, follows, media_count)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(date) DO UPDATE SET
          created_at = CURRENT_TIMESTAMP
      `, [today, 'setup_pending', metrics.username, 0, 0, 0], function() {
        db.close();
      });
      
      return;
    }
    
    console.log(`Username: @${metrics.username}`);
    console.log(`Account Type: ${metrics.accountType}`);
    console.log(`Followers: ${metrics.followers.toLocaleString()}`);
    console.log(`Following: ${metrics.follows.toLocaleString()}`);
    console.log(`Media Count: ${metrics.mediaCount}`);
    console.log(`Recent Media: ${metrics.recentMedia.length}`);
    
    if (DRY_RUN) {
      console.log('\n🏃 DRY RUN - Not saving to database');
      return;
    }
    
    console.log('\n💾 Saving to database...');
    
    const db = new sqlite3.Database(DB_PATH);
    
    const date = await saveMetrics(db, metrics);
    await calculateGrowth(db, date);
    
    db.close();
    
    console.log('✅ Instagram metrics saved successfully!');
    console.log(`\n📅 Date: ${date}`);
    
  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

main();
