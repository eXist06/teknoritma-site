import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "lib/db");
const DB_PATH = path.join(DB_DIR, "teknoritma.db");

// Ensure db directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export function getDatabase(): Database.Database {
  const db = new Database(DB_PATH);
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");
  
  return db;
}

export function initializeDatabase() {
  const db = getDatabase();

  // Create sarus_hub_items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS sarus_hub_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('case-study', 'news', 'insight', 'event')),
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      hospital TEXT,
      country TEXT,
      segment TEXT,
      tags TEXT NOT NULL DEFAULT '[]', -- JSON array stored as text
      published_at TEXT,
      featured INTEGER DEFAULT 0,
      reading_minutes INTEGER,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      author TEXT,
      image TEXT, -- Legacy field, kept for backward compatibility
      primary_image TEXT, -- Primary/featured image for card preview
      images TEXT DEFAULT '[]', -- JSON array of image URLs
      image_display_style TEXT DEFAULT 'cover' CHECK(image_display_style IN ('cover', 'gallery', 'carousel', 'grid')),
      video TEXT,
      language TEXT NOT NULL DEFAULT 'tr' CHECK(language IN ('tr', 'en', 'mixed')),
      translation_id TEXT, -- ID of the original item if this is a translation
      translation_group_id TEXT, -- Group ID to link all translations together
      view_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (translation_id) REFERENCES sarus_hub_items(id) ON DELETE CASCADE
    )
  `);

  // Add translation_group_id column if it doesn't exist (for existing databases)
  try {
    const tableInfo = db.prepare("PRAGMA table_info(sarus_hub_items)").all() as any[];
    const hasTranslationGroupId = tableInfo.some((col: any) => col.name === "translation_group_id");
    
    if (!hasTranslationGroupId) {
      db.exec(`
        ALTER TABLE sarus_hub_items 
        ADD COLUMN translation_group_id TEXT
      `);
      db.exec(`
        CREATE INDEX IF NOT EXISTS idx_translation_group_id ON sarus_hub_items(translation_group_id)
      `);
    }
  } catch (error) {
    // Column might already exist, ignore error
    console.warn("Could not add translation_group_id column:", error);
  }

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_slug ON sarus_hub_items(slug);
    CREATE INDEX IF NOT EXISTS idx_status ON sarus_hub_items(status);
    CREATE INDEX IF NOT EXISTS idx_type ON sarus_hub_items(type);
    CREATE INDEX IF NOT EXISTS idx_published_at ON sarus_hub_items(published_at);
    CREATE INDEX IF NOT EXISTS idx_language ON sarus_hub_items(language);
    CREATE INDEX IF NOT EXISTS idx_translation_id ON sarus_hub_items(translation_id);
    CREATE INDEX IF NOT EXISTS idx_translation_group_id ON sarus_hub_items(translation_group_id);
  `);

  // Admin Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL CHECK(role IN ('admin', 'ik', 'knowledge-base', 'sarus-hub')),
      is_first_login INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // System Settings Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Mailing Subscribers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS mailing_subscribers (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      organization TEXT,
      subscribed_at TEXT NOT NULL,
      source TEXT NOT NULL CHECK(source IN ('contact', 'demo', 'talent-network', 'manual')),
      category TEXT NOT NULL,
      tags TEXT DEFAULT '[]',
      active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Email Queue Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_queue (
      id TEXT PRIMARY KEY,
      to_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      html TEXT NOT NULL,
      text TEXT,
      from_email TEXT,
      from_name TEXT,
      sender_name TEXT,
      sender_email TEXT,
      sender_phone TEXT,
      message_content TEXT,
      created_at TEXT NOT NULL,
      last_attempt_at TEXT,
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 7,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'failed', 'sent')),
      error TEXT,
      next_retry_at TEXT
    )
  `);

  // Email Verifications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_verifications (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT NOT NULL,
      form_type TEXT NOT NULL CHECK(form_type IN ('demo', 'contact', 'careers')),
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      verified INTEGER DEFAULT 0,
      attempts INTEGER DEFAULT 0
    )
  `);

  // First Login Passwords Table (temporary)
  db.exec(`
    CREATE TABLE IF NOT EXISTS first_login_passwords (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    )
  `);

  // Careers Jobs Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS careers_jobs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      title_en TEXT NOT NULL,
      department TEXT NOT NULL,
      department_en TEXT NOT NULL,
      location TEXT NOT NULL,
      location_en TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('full-time', 'part-time', 'contract', 'internship')),
      type_en TEXT NOT NULL,
      remote TEXT NOT NULL CHECK(remote IN ('remote', 'hybrid', 'office')),
      remote_en TEXT NOT NULL,
      description TEXT NOT NULL,
      description_en TEXT NOT NULL,
      requirements TEXT NOT NULL,
      requirements_en TEXT NOT NULL,
      benefits TEXT NOT NULL,
      benefits_en TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Careers Content Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS careers_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Talent Network Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS talent_network (
      id TEXT PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      email TEXT NOT NULL,
      phone TEXT,
      job_category TEXT,
      city TEXT,
      remote_workplace TEXT,
      cv_file_name TEXT,
      created_at TEXT NOT NULL
    )
  `);

  // Create additional indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
    CREATE INDEX IF NOT EXISTS idx_email_queue_created ON email_queue(created_at);
    CREATE INDEX IF NOT EXISTS idx_email_verification_email ON email_verifications(email);
    CREATE INDEX IF NOT EXISTS idx_email_verification_expires ON email_verifications(expires_at);
    CREATE INDEX IF NOT EXISTS idx_mailing_subscriber_email ON mailing_subscribers(email);
    CREATE INDEX IF NOT EXISTS idx_mailing_subscriber_active ON mailing_subscribers(active);
    CREATE INDEX IF NOT EXISTS idx_careers_jobs_active ON careers_jobs(is_active);
    CREATE INDEX IF NOT EXISTS idx_talent_network_email ON talent_network(email);
  `);

  db.close();
}




