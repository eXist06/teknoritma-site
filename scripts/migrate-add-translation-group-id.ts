import { getDatabase } from "../lib/db/schema";

/**
 * Migration script to add translation_group_id column to sarus_hub_items table
 * This groups all translations of the same content together
 */
async function migrate() {
  const db = getDatabase();

  try {
    // Check if column already exists
    const tableInfo = db.prepare("PRAGMA table_info(sarus_hub_items)").all() as any[];
    const hasTranslationGroupId = tableInfo.some((col: any) => col.name === "translation_group_id");

    if (hasTranslationGroupId) {
      console.log("✅ translation_group_id column already exists");
      db.close();
      return;
    }

    console.log("Adding translation_group_id column...");

    // Add the column
    db.exec(`
      ALTER TABLE sarus_hub_items 
      ADD COLUMN translation_group_id TEXT
    `);

    // Create index
    db.exec(`
      CREATE INDEX IF NOT EXISTS idx_translation_group_id ON sarus_hub_items(translation_group_id)
    `);

    // For existing items with translation_id, set translation_group_id to the original item's id
    // For items without translation_id, set translation_group_id to their own id
    console.log("Setting translation_group_id for existing items...");
    
    const items = db.prepare("SELECT id, translation_id FROM sarus_hub_items").all() as any[];
    
    for (const item of items) {
      let groupId: string;
      
      if (item.translation_id) {
        // This is a translation, use the original item's id as group id
        groupId = item.translation_id;
      } else {
        // This is an original item, use its own id as group id
        groupId = item.id;
      }
      
      db.prepare("UPDATE sarus_hub_items SET translation_group_id = ? WHERE id = ?").run(groupId, item.id);
    }

    // Now update all items in the same group to have the same translation_group_id
    // Find all groups
    const groups = db.prepare(`
      SELECT DISTINCT translation_group_id 
      FROM sarus_hub_items 
      WHERE translation_group_id IS NOT NULL
    `).all() as any[];

    for (const group of groups) {
      const groupId = group.translation_group_id;
      
      // Find all items that should be in this group
      // Items with translation_id pointing to groupId, or items with id = groupId
      const relatedItems = db.prepare(`
        SELECT id FROM sarus_hub_items 
        WHERE id = ? OR translation_id = ?
      `).all(groupId, groupId) as any[];
      
      // Update all related items to have the same group id
      for (const relatedItem of relatedItems) {
        db.prepare("UPDATE sarus_hub_items SET translation_group_id = ? WHERE id = ?").run(groupId, relatedItem.id);
      }
    }

    console.log("✅ Migration completed successfully");
    db.close();
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    db.close();
    throw error;
  }
}

migrate();

