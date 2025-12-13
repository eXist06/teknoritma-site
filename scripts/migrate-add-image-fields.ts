import { getDatabase } from "../lib/db/schema";

const db = getDatabase();

// Add new columns if they don't exist
try {
  db.exec(`
    ALTER TABLE sarus_hub_items ADD COLUMN primary_image TEXT;
    ALTER TABLE sarus_hub_items ADD COLUMN images TEXT DEFAULT '[]';
    ALTER TABLE sarus_hub_items ADD COLUMN image_display_style TEXT DEFAULT 'cover' CHECK(image_display_style IN ('cover', 'gallery', 'carousel', 'grid'));
  `);
  console.log("✅ New columns added successfully");
  
  // Migrate existing image data to primary_image
  db.exec(`
    UPDATE sarus_hub_items 
    SET primary_image = image 
    WHERE image IS NOT NULL AND primary_image IS NULL;
  `);
  console.log("✅ Migrated existing image data to primary_image");
  
} catch (error: any) {
  if (error.message.includes("duplicate column")) {
    console.log("ℹ️  Columns already exist, skipping migration");
  } else {
    console.error("❌ Migration error:", error);
  }
}

db.close();
console.log("Migration completed!");




