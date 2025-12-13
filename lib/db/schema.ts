import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_DIR = path.join(process.cwd(), "lib/db");
const DB_PATH = path.join(DB_DIR, "sarus-hub.db");

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
      view_count INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (translation_id) REFERENCES sarus_hub_items(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_slug ON sarus_hub_items(slug);
    CREATE INDEX IF NOT EXISTS idx_status ON sarus_hub_items(status);
    CREATE INDEX IF NOT EXISTS idx_type ON sarus_hub_items(type);
    CREATE INDEX IF NOT EXISTS idx_published_at ON sarus_hub_items(published_at);
    CREATE INDEX IF NOT EXISTS idx_language ON sarus_hub_items(language);
    CREATE INDEX IF NOT EXISTS idx_translation_id ON sarus_hub_items(translation_id);
  `);

  db.close();
}




