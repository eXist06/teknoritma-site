import { migrate } from "../../scripts/migrate-json-to-sqlite";
import { initializeDatabase } from "./schema";

let migrationRun = false;

export function runMigrationIfNeeded() {
  // Only run once per process
  if (migrationRun) return;
  
  if (typeof window !== "undefined") return; // Only run on server
  
  try {
    // Initialize schema first
    initializeDatabase();
    
    // Run migration silently (don't spam logs in production)
    migrate().catch((error) => {
      console.error("Migration error:", error);
    });
    
    migrationRun = true;
  } catch (error) {
    console.error("Migration initialization error:", error);
  }
}




