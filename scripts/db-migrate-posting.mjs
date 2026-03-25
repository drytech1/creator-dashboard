import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'creatordash.db');

async function migratePosts() {
  console.log('🔄 Adding posting capabilities to database...\n');
  
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  try {
    // Create scheduled_posts table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL, -- 'youtube', 'instagram', 'twitter', 'tiktok', etc.
        post_type TEXT NOT NULL, -- 'video', 'short', 'image', 'carousel', 'text'
        title TEXT,
        description TEXT,
        content TEXT,
        media_urls TEXT, -- JSON array of media file paths or URLs
        hashtags TEXT,
        scheduled_at DATETIME,
        posted_at DATETIME,
        status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'posted', 'failed'
        platform_post_id TEXT, -- ID returned by platform after posting
        platform_post_url TEXT,
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ scheduled_posts table created');

    // Create post_templates table for reusable content templates
    await db.exec(`
      CREATE TABLE IF NOT EXISTS post_templates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        platform TEXT NOT NULL,
        post_type TEXT NOT NULL,
        title_template TEXT,
        description_template TEXT,
        hashtag_template TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ post_templates table created');

    // Create posting_logs table for detailed posting history
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posting_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        platform TEXT NOT NULL,
        action TEXT NOT NULL, -- 'schedule', 'post', 'update', 'delete', 'error'
        status TEXT NOT NULL,
        message TEXT,
        api_response TEXT, -- JSON response from platform API
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES scheduled_posts(id)
      )
    `);
    console.log('✅ posting_logs table created');

    // Insert default templates
    const defaultTemplates = [
      {
        name: 'YouTube Video Standard',
        platform: 'youtube',
        post_type: 'video',
        title_template: '{{title}}',
        description_template: '{{description}}\n\n#YouTube #Creator #Content',
        hashtag_template: '#YouTube #Creator #Content'
      },
      {
        name: 'Instagram Post Standard',
        platform: 'instagram',
        post_type: 'image',
        title_template: '',
        description_template: '{{caption}}\n\n{{hashtags}}',
        hashtag_template: '#instagram #creator #contentcreator #daily'
      },
      {
        name: 'Instagram Reel Standard',
        platform: 'instagram',
        post_type: 'reel',
        title_template: '',
        description_template: '{{caption}}\n\n{{hashtags}}',
        hashtag_template: '#reels #reelsofinstagram #viral #trending'
      }
    ];

    for (const template of defaultTemplates) {
      await db.run(`
        INSERT OR IGNORE INTO post_templates (name, platform, post_type, title_template, description_template, hashtag_template)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        template.name,
        template.platform,
        template.post_type,
        template.title_template,
        template.description_template,
        template.hashtag_template
      ]);
    }
    console.log('✅ Default templates added');

    // Create indexes for better query performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_posts_platform ON scheduled_posts(platform);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON scheduled_posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_scheduled_at ON scheduled_posts(scheduled_at);
      CREATE INDEX IF NOT EXISTS idx_posts_posted_at ON scheduled_posts(posted_at);
    `);
    console.log('✅ Indexes created');

    console.log('\n🎉 Posting capabilities migration complete!');
    console.log('\nNew Features:');
    console.log('  • Schedule posts for multiple platforms');
    console.log('  • Track posting history and status');
    console.log('  • Use content templates for consistency');
    console.log('  • Log all posting activities');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

migratePosts();
