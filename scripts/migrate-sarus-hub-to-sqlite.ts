import fs from "fs";
import path from "path";
import { initializeDatabase, getDatabase } from "../lib/db/schema";
import { createItem } from "../lib/db/sarus-hub";
import { SarusHubItem } from "../lib/types/sarus-hub";

const JSON_PATH = path.join(process.cwd(), "lib/data/sarus-hub.json");
const DB_PATH = path.join(process.cwd(), "lib/db/sarus-hub.db");

function readJsonData(): { items: SarusHubItem[] } {
  try {
    const data = fs.readFileSync(JSON_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return { items: [] };
  }
}

async function migrate() {
  console.log("Starting migration from JSON to SQLite...");

  // Initialize database
  console.log("Initializing database...");
  initializeDatabase();

  // Check if database already has data
  const db = getDatabase();
  const existingCount = db.prepare("SELECT COUNT(*) as count FROM sarus_hub_items").get() as { count: number };
  
  if (existingCount.count > 0) {
    console.log(`Database already has ${existingCount.count} items.`);
    const response = process.argv.includes("--force") ? "yes" : "no";
    
    if (response !== "yes") {
      console.log("Migration cancelled. Use --force to overwrite existing data.");
      db.close();
      return;
    }
    
    console.log("Clearing existing data...");
    db.prepare("DELETE FROM sarus_hub_items").run();
  }
  db.close();

  // Read JSON data
  console.log("Reading JSON data...");
  const jsonData = readJsonData();
  console.log(`Found ${jsonData.items.length} items in JSON file.`);

  // Migrate each item
  let successCount = 0;
  let errorCount = 0;

  for (const item of jsonData.items) {
    try {
      // Ensure viewCount exists
      const itemWithViewCount = {
        ...item,
        viewCount: item.viewCount || 0,
      };
      
      createItem(itemWithViewCount);
      successCount++;
    } catch (error) {
      console.error(`Error migrating item ${item.id} (${item.title}):`, error);
      errorCount++;
    }
  }

  console.log("\nMigration completed!");
  console.log(`✅ Successfully migrated: ${successCount} items`);
  if (errorCount > 0) {
    console.log(`❌ Errors: ${errorCount} items`);
  }
}

// Run migration
migrate().catch(console.error);




