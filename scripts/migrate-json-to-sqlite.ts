import Database from "better-sqlite3";
import { initializeDatabase, getDatabase } from "../lib/db/schema";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "lib/data");

interface MigrationStats {
  adminUsers: { migrated: number; skipped: number };
  settings: { migrated: number; skipped: number };
  mailingSubscribers: { migrated: number; skipped: number };
  emailQueue: { migrated: number; skipped: number };
  emailVerifications: { migrated: number; skipped: number };
  careersJobs: { migrated: number; skipped: number };
  careersContent: { migrated: number; skipped: number };
  talentNetwork: { migrated: number; skipped: number };
}

function readJsonFile<T>(filename: string): T | null {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${filename} not found, skipping...`);
    return null;
  }
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`❌ Error reading ${filename}:`, error);
    return null;
  }
}

async function migrateAdminUsers(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const adminData = readJsonFile<{ users: any[] }>("admin-data.json");
  if (!adminData || !adminData.users || adminData.users.length === 0) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO admin_users 
    (id, username, password_hash, email, role, is_first_login, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  for (const user of adminData.users) {
    try {
      stmt.run(
        user.id,
        user.username,
        user.passwordHash,
        user.email,
        user.role,
        user.isFirstLogin ? 1 : 0,
        user.createdAt,
        user.updatedAt
      );
      migrated++;
    } catch (error) {
      console.error(`Error migrating user ${user.id}:`, error);
      skipped++;
    }
  }

  return { migrated, skipped };
}

async function migrateSettings(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const adminData = readJsonFile<{ settings: any }>("admin-data.json");
  if (!adminData || !adminData.settings) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO system_settings (key, value, updated_at)
    VALUES (?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  try {
    // Migrate email settings
    if (adminData.settings.email) {
      stmt.run("email", JSON.stringify(adminData.settings.email), new Date().toISOString());
      migrated++;
    }

    // Migrate site settings
    const siteSettings = {
      siteName: adminData.settings.siteName || "",
      siteUrl: adminData.settings.siteUrl || "",
    };
    stmt.run("site", JSON.stringify(siteSettings), new Date().toISOString());
    migrated++;
  } catch (error) {
    console.error("Error migrating settings:", error);
    skipped++;
  }

  return { migrated, skipped };
}

async function migrateMailingSubscribers(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const mailingList = readJsonFile<{ subscribers: any[] }>("mailing-list.json");
  if (!mailingList || !mailingList.subscribers || mailingList.subscribers.length === 0) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO mailing_subscribers
    (id, email, name, organization, subscribed_at, source, category, tags, active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  for (const subscriber of mailingList.subscribers) {
    try {
      // Normalize category (can be string or array)
      const category = Array.isArray(subscriber.category)
        ? JSON.stringify(subscriber.category)
        : subscriber.category;

      stmt.run(
        subscriber.id,
        subscriber.email,
        subscriber.name || null,
        subscriber.organization || null,
        subscriber.subscribedAt,
        subscriber.source,
        category,
        JSON.stringify(subscriber.tags || []),
        subscriber.active ? 1 : 0,
        subscriber.subscribedAt,
        subscriber.subscribedAt
      );
      migrated++;
    } catch (error) {
      console.error(`Error migrating subscriber ${subscriber.id}:`, error);
      skipped++;
    }
  }

  return { migrated, skipped };
}

async function migrateEmailQueue(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const emailQueue = readJsonFile<{ items: any[] }>("email-queue.json");
  if (!emailQueue || !emailQueue.items || emailQueue.items.length === 0) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO email_queue
    (id, to_email, subject, html, text, from_email, from_name, sender_name, sender_email, sender_phone, message_content, created_at, last_attempt_at, attempts, max_attempts, status, error, next_retry_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  for (const item of emailQueue.items) {
    try {
      stmt.run(
        item.id,
        item.to,
        item.subject,
        item.html,
        item.text || null,
        item.fromEmail || null,
        item.fromName || null,
        item.senderName || null,
        item.senderEmail || null,
        item.senderPhone || null,
        item.messageContent || null,
        item.createdAt,
        item.lastAttemptAt || null,
        item.attempts || 0,
        item.maxAttempts || 7,
        item.status || "pending",
        item.error || null,
        item.nextRetryAt || null
      );
      migrated++;
    } catch (error) {
      console.error(`Error migrating email queue item ${item.id}:`, error);
      skipped++;
    }
  }

  return { migrated, skipped };
}

async function migrateEmailVerifications(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const verifications = readJsonFile<{ verifications: any[] }>("email-verifications.json");
  if (!verifications || !verifications.verifications || verifications.verifications.length === 0) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO email_verifications
    (id, email, code, form_type, created_at, expires_at, verified, attempts)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;
  const now = new Date();

  for (const verification of verifications.verifications) {
    try {
      // Only migrate non-expired and non-verified verifications
      if (new Date(verification.expiresAt) > now && !verification.verified) {
        stmt.run(
          verification.id,
          verification.email,
          verification.code,
          verification.formType || "demo", // Default for old records
          verification.createdAt,
          verification.expiresAt,
          verification.verified ? 1 : 0,
          verification.attempts || 0
        );
        migrated++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error migrating verification ${verification.id}:`, error);
      skipped++;
    }
  }

  return { migrated, skipped };
}

async function migrateCareersJobs(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const careersData = readJsonFile<{ jobs: any[] }>("careers-data.json");
  if (!careersData || !careersData.jobs || careersData.jobs.length === 0) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO careers_jobs
    (id, title, title_en, department, department_en, location, location_en, type, type_en, remote, remote_en, description, description_en, requirements, requirements_en, benefits, benefits_en, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  for (const job of careersData.jobs) {
    try {
      stmt.run(
        job.id,
        job.title,
        job.titleEn,
        job.department,
        job.departmentEn,
        job.location,
        job.locationEn,
        job.type,
        job.typeEn,
        job.remote,
        job.remoteEn,
        job.description,
        job.descriptionEn,
        JSON.stringify(job.requirements || []),
        JSON.stringify(job.requirementsEn || []),
        JSON.stringify(job.benefits || []),
        JSON.stringify(job.benefitsEn || []),
        job.isActive ? 1 : 0,
        job.createdAt,
        job.updatedAt
      );
      migrated++;
    } catch (error) {
      console.error(`Error migrating job ${job.id}:`, error);
      skipped++;
    }
  }

  return { migrated, skipped };
}

async function migrateCareersContent(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const careersData = readJsonFile<{ content: any }>("careers-data.json");
  if (!careersData || !careersData.content) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO careers_content (section, content, updated_at)
    VALUES (?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  try {
    stmt.run("all", JSON.stringify(careersData.content), new Date().toISOString());
    migrated++;
  } catch (error) {
    console.error("Error migrating careers content:", error);
    skipped++;
  }

  return { migrated, skipped };
}

async function migrateTalentNetwork(db: Database.Database): Promise<{ migrated: number; skipped: number }> {
  const careersData = readJsonFile<{ talentNetwork: any[] }>("careers-data.json");
  if (!careersData || !careersData.talentNetwork || careersData.talentNetwork.length === 0) {
    return { migrated: 0, skipped: 0 };
  }

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO talent_network
    (id, first_name, last_name, email, phone, job_category, city, remote_workplace, cv_file_name, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let migrated = 0;
  let skipped = 0;

  for (const entry of careersData.talentNetwork) {
    try {
      stmt.run(
        entry.id,
        entry.firstName || null,
        entry.lastName || null,
        entry.email,
        entry.phone || null,
        entry.jobCategory || null,
        entry.city || null,
        entry.remoteWorkplace || null,
        entry.cvFileName || null,
        entry.createdAt
      );
      migrated++;
    } catch (error) {
      console.error(`Error migrating talent network entry ${entry.id}:`, error);
      skipped++;
    }
  }

  return { migrated, skipped };
}

async function migrateSarusHubFromOldDb() {
  const oldDbPath = path.join(process.cwd(), "lib/db", "sarus-hub.db");
  if (!fs.existsSync(oldDbPath)) {
    return { migrated: 0, skipped: 0 };
  }

  try {
    const oldDb = new Database(oldDbPath);
    const newDb = getDatabase();

    // Check if old database has data
    const oldCount = oldDb.prepare("SELECT COUNT(*) as count FROM sarus_hub_items").get() as { count: number };
    if (oldCount.count === 0) {
      oldDb.close();
      return { migrated: 0, skipped: 0 };
    }

    // Check if new database already has data
    const newCount = newDb.prepare("SELECT COUNT(*) as count FROM sarus_hub_items").get() as { count: number };
    if (newCount.count > 0) {
      console.log(`⚠️  New database already has ${newCount.count} Sarus Hub items, skipping old DB migration...`);
      oldDb.close();
      newDb.close();
      return { migrated: 0, skipped: oldCount.count };
    }

    // Migrate items from old DB
    const items = oldDb.prepare("SELECT * FROM sarus_hub_items").all() as any[];
    const stmt = newDb.prepare(`
      INSERT OR REPLACE INTO sarus_hub_items
      (id, type, title, slug, summary, content, hospital, country, segment, tags, published_at, featured, reading_minutes, status, author, image, primary_image, images, image_display_style, video, language, translation_id, view_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let migrated = 0;
    let skipped = 0;

    for (const item of items) {
      try {
        stmt.run(
          item.id,
          item.type,
          item.title,
          item.slug,
          item.summary,
          item.content,
          item.hospital || null,
          item.country || null,
          item.segment || null,
          item.tags || "[]",
          item.published_at || null,
          item.featured || 0,
          item.reading_minutes || null,
          item.status || "draft",
          item.author || null,
          item.image || null,
          item.primary_image || null,
          item.images || "[]",
          item.image_display_style || "cover",
          item.video || null,
          item.language || "tr",
          item.translation_id || null,
          item.view_count || 0,
          item.created_at,
          item.updated_at
        );
        migrated++;
      } catch (error) {
        console.error(`Error migrating Sarus Hub item ${item.id}:`, error);
        skipped++;
      }
    }

    oldDb.close();
    newDb.close();

    return { migrated, skipped };
  } catch (error) {
    console.error("Error migrating from old Sarus Hub DB:", error);
    return { migrated: 0, skipped: 0 };
  }
}

async function shouldSkipMigration(): Promise<boolean> {
  try {
    const db = getDatabase();
    // Check if database already has migrated data
    const adminUsersCount = db.prepare("SELECT COUNT(*) as count FROM admin_users").get() as { count: number };
    const settingsCount = db.prepare("SELECT COUNT(*) as count FROM system_settings").get() as { count: number };
    
    db.close();
    
    // If database has data, migration already completed
    if (adminUsersCount.count > 0 || settingsCount.count > 0) {
      return true;
    }
    
    return false;
  } catch (error) {
    // If database doesn't exist or error, don't skip migration
    return false;
  }
}

async function migrate() {
  // Check if migration should be skipped
  if (await shouldSkipMigration()) {
    console.log("ℹ️  Migration skipped - database already has data");
    return;
  }

  console.log("🚀 Starting JSON to SQLite migration...\n");

  // Initialize database schema
  console.log("📦 Initializing database schema...");
  initializeDatabase();
  console.log("✅ Database schema initialized\n");

  // Migrate from old sarus-hub.db if exists
  console.log("🔄 Checking for old Sarus Hub database...");
  const sarusHubMigration = await migrateSarusHubFromOldDb();
  if (sarusHubMigration.migrated > 0) {
    console.log(`   ✅ Migrated ${sarusHubMigration.migrated} Sarus Hub items from old database\n`);
  } else if (sarusHubMigration.skipped > 0) {
    console.log(`   ⏭️  Skipped ${sarusHubMigration.skipped} items (already migrated)\n`);
  } else {
    console.log("   ℹ️  No old Sarus Hub database found\n");
  }

  const db = getDatabase();
  const stats: MigrationStats = {
    adminUsers: { migrated: 0, skipped: 0 },
    settings: { migrated: 0, skipped: 0 },
    mailingSubscribers: { migrated: 0, skipped: 0 },
    emailQueue: { migrated: 0, skipped: 0 },
    emailVerifications: { migrated: 0, skipped: 0 },
    careersJobs: { migrated: 0, skipped: 0 },
    careersContent: { migrated: 0, skipped: 0 },
    talentNetwork: { migrated: 0, skipped: 0 },
  };

  try {
    // Migrate each module
    console.log("👥 Migrating admin users...");
    stats.adminUsers = await migrateAdminUsers(db);
    console.log(`   ✅ Migrated: ${stats.adminUsers.migrated}, Skipped: ${stats.adminUsers.skipped}\n`);

    console.log("⚙️  Migrating system settings...");
    stats.settings = await migrateSettings(db);
    console.log(`   ✅ Migrated: ${stats.settings.migrated}, Skipped: ${stats.settings.skipped}\n`);

    console.log("📧 Migrating mailing subscribers...");
    stats.mailingSubscribers = await migrateMailingSubscribers(db);
    console.log(`   ✅ Migrated: ${stats.mailingSubscribers.migrated}, Skipped: ${stats.mailingSubscribers.skipped}\n`);

    console.log("📬 Migrating email queue...");
    stats.emailQueue = await migrateEmailQueue(db);
    console.log(`   ✅ Migrated: ${stats.emailQueue.migrated}, Skipped: ${stats.emailQueue.skipped}\n`);

    console.log("🔐 Migrating email verifications...");
    stats.emailVerifications = await migrateEmailVerifications(db);
    console.log(`   ✅ Migrated: ${stats.emailVerifications.migrated}, Skipped: ${stats.emailVerifications.skipped}\n`);

    console.log("💼 Migrating careers jobs...");
    stats.careersJobs = await migrateCareersJobs(db);
    console.log(`   ✅ Migrated: ${stats.careersJobs.migrated}, Skipped: ${stats.careersJobs.skipped}\n`);

    console.log("📝 Migrating careers content...");
    stats.careersContent = await migrateCareersContent(db);
    console.log(`   ✅ Migrated: ${stats.careersContent.migrated}, Skipped: ${stats.careersContent.skipped}\n`);

    console.log("🌟 Migrating talent network...");
    stats.talentNetwork = await migrateTalentNetwork(db);
    console.log(`   ✅ Migrated: ${stats.talentNetwork.migrated}, Skipped: ${stats.talentNetwork.skipped}\n`);

    // Summary
    const totalMigrated =
      stats.adminUsers.migrated +
      stats.settings.migrated +
      stats.mailingSubscribers.migrated +
      stats.emailQueue.migrated +
      stats.emailVerifications.migrated +
      stats.careersJobs.migrated +
      stats.careersContent.migrated +
      stats.talentNetwork.migrated;

    const totalSkipped =
      stats.adminUsers.skipped +
      stats.settings.skipped +
      stats.mailingSubscribers.skipped +
      stats.emailQueue.skipped +
      stats.emailVerifications.skipped +
      stats.careersJobs.skipped +
      stats.careersContent.skipped +
      stats.talentNetwork.skipped;

    console.log("=".repeat(50));
    console.log("📊 Migration Summary:");
    console.log(`   ✅ Total Migrated: ${totalMigrated}`);
    console.log(`   ⏭️  Total Skipped: ${totalSkipped}`);
    console.log("=".repeat(50));
    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    db.close();
  }
}

// Run migration
if (require.main === module) {
  migrate().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export { migrate };

