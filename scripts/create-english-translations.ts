/**
 * Script to create English draft translations for existing Turkish Sarus Hub items
 * Run this once to backfill English translations for existing content
 */

import { getAllItems, createItem } from "../lib/db/sarus-hub";
import { generateTranslationSlug, generatePlaceholderTranslation } from "../lib/utils/translation";
import { initializeDatabase } from "../lib/db/schema";

async function createEnglishTranslations() {
  console.log("Starting to create English translations for existing Turkish items...");
  
  // Initialize database
  initializeDatabase();
  
  // Get all Turkish items
  const allItems = getAllItems({ language: "tr" }, true);
  console.log(`Found ${allItems.length} Turkish items`);
  
  const existingSlugs = getAllItems({}, true).map(item => item.slug);
  let created = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const item of allItems) {
    try {
      // Check if English translation already exists
      const englishSlug = generateTranslationSlug(item.slug, "en");
      const existingEnglish = existingSlugs.includes(englishSlug);
      
      // Check if this item already has a translation
      const hasTranslation = getAllItems({}, true).some(
        i => i.translationId === item.id && i.language === "en"
      );
      
      if (existingEnglish || hasTranslation) {
        console.log(`Skipping ${item.slug} - English translation already exists`);
        skipped++;
        continue;
      }
      
      // Generate placeholder translation
      const placeholder = generatePlaceholderTranslation(
        item.title,
        item.summary,
        item.content
      );
      
      // Create English draft
      createItem({
        type: item.type,
        title: placeholder.title,
        slug: englishSlug,
        summary: placeholder.summary,
        content: placeholder.content,
        hospital: item.hospital,
        country: item.country,
        segment: item.segment,
        tags: item.tags,
        publishedAt: undefined, // Draft, not published
        featured: false, // Don't feature translations by default
        readingMinutes: item.readingMinutes,
        status: "draft", // Always create as draft
        author: item.author || "System",
        image: item.image,
        primaryImage: item.primaryImage,
        images: item.images,
        imageDisplayStyle: item.imageDisplayStyle,
        video: item.video,
        language: "en",
        translationId: item.id, // Link to Turkish original
        viewCount: 0,
      });
      
      console.log(`Created English draft for: ${item.title}`);
      created++;
    } catch (error) {
      console.error(`Error creating translation for ${item.slug}:`, error);
      errors++;
    }
  }
  
  console.log("\n=== Summary ===");
  console.log(`Created: ${created}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log("Done!");
}

createEnglishTranslations().catch(console.error);
