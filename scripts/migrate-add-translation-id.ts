import Database from "better-sqlite3";
import path from "path";
import { getDatabase } from "../lib/db/schema";

const DB_PATH = path.join(process.cwd(), "lib/db", "sarus-hub.db");

async function migrate() {
  console.log("Starting migration: Adding translation_id column...");
  
  const db = getDatabase();
  
  try {
    // Check if column already exists
    const tableInfo = db.prepare("PRAGMA table_info(sarus_hub_items)").all() as any[];
    const hasTranslationId = tableInfo.some(col => col.name === "translation_id");
    
    if (hasTranslationId) {
      console.log("Column translation_id already exists. Skipping migration.");
      db.close();
      return;
    }
    
    // Add translation_id column
    db.exec(`
      ALTER TABLE sarus_hub_items 
      ADD COLUMN translation_id TEXT;
    `);
    
    // Add foreign key constraint (SQLite doesn't support adding foreign keys via ALTER TABLE)
    // We'll recreate the table with the foreign key
    console.log("Adding foreign key constraint...");
    
    // Create new table with translation_id and foreign key
    db.exec(`
      CREATE TABLE IF NOT EXISTS sarus_hub_items_new (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK(type IN ('case-study', 'news', 'insight', 'event')),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        summary TEXT NOT NULL,
        content TEXT NOT NULL,
        hospital TEXT,
        country TEXT,
        segment TEXT,
        tags TEXT NOT NULL DEFAULT '[]',
        published_at TEXT,
        featured INTEGER DEFAULT 0,
        reading_minutes INTEGER,
        status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
        author TEXT,
        image TEXT,
        primary_image TEXT,
        images TEXT DEFAULT '[]',
        image_display_style TEXT DEFAULT 'cover' CHECK(image_display_style IN ('cover', 'gallery', 'carousel', 'grid')),
        video TEXT,
        language TEXT NOT NULL DEFAULT 'tr' CHECK(language IN ('tr', 'en', 'mixed')),
        translation_id TEXT,
        view_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (translation_id) REFERENCES sarus_hub_items_new(id) ON DELETE CASCADE
      )
    `);
    
    // Copy data from old table to new table
    db.exec(`
      INSERT INTO sarus_hub_items_new 
      SELECT 
        id, type, title, slug, summary, content, hospital, country, segment,
        tags, published_at, featured, reading_minutes, status, author,
        image, primary_image, images, image_display_style, video,
        language, translation_id, view_count, created_at, updated_at
      FROM sarus_hub_items
    `);
    
    // Drop old table
    db.exec(`DROP TABLE sarus_hub_items`);
    
    // Rename new table
    db.exec(`ALTER TABLE sarus_hub_items_new RENAME TO sarus_hub_items`);
    
    // Recreate indexes
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_slug ON sarus_hub_items(slug);
      CREATE INDEX IF NOT EXISTS idx_status ON sarus_hub_items(status);
      CREATE INDEX IF NOT EXISTS idx_type ON sarus_hub_items(type);
      CREATE INDEX IF NOT EXISTS idx_published_at ON sarus_hub_items(published_at);
      CREATE INDEX IF NOT EXISTS idx_language ON sarus_hub_items(language);
      CREATE INDEX IF NOT EXISTS idx_translation_id ON sarus_hub_items(translation_id);
    `);
    
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    db.close();
  }
}

migrate().catch(console.error);
