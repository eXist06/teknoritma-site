import { NextRequest, NextResponse } from "next/server";
import { SarusHubItem, SarusHubFilters } from "@/lib/types/sarus-hub";
import { verifySarusHubRole } from "@/lib/utils/role-verification";
import { initializeDatabase } from "@/lib/db/schema";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "@/lib/db/sarus-hub";
import { generateTranslationSlug, generatePlaceholderTranslation } from "@/lib/utils/translation";

// Initialize database on first import
if (typeof window === "undefined") {
  try {
    initializeDatabase();
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// GET - Public: Get published items, Admin: Get all items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: SarusHubFilters = {
      type: searchParams.get("type") as any,
      tags: searchParams.get("tags")?.split(","),
      segment: searchParams.get("segment") || undefined,
      country: searchParams.get("country") || undefined,
      year: searchParams.get("year") ? parseInt(searchParams.get("year")!) : undefined,
      search: searchParams.get("search") || undefined,
      language: (searchParams.get("language") as any) || "all",
    };

    // Check if user is admin/sarus-hub (can see drafts)
    const authCheck = await verifySarusHubRole(request);
    const isAuthorized = authCheck.isAuthorized;

    // Get items from database
    let items = getAllItems(filters, isAuthorized);
    
    // If requesting all languages and not authorized (public), also include English translations of published Turkish items
    // This ensures English page shows translations even if they're not explicitly filtered
    if (!isAuthorized && filters.language === "all") {
      // Get all published Turkish items
      const allPublished = getAllItems({ language: "all" }, false);
      const turkishItems = allPublished.filter(item => item.language === "tr" && item.status === "published");
      
      // Find English translations of these Turkish items
      // We need to check all items (including drafts) to find translations
      const allItemsForTranslation = getAllItems({}, true); // Include drafts to find translations
      const englishTranslations = turkishItems
        .map(turkishItem => {
          // Find English translation (prefer published, but include draft if exists)
          const translation = allItemsForTranslation.find(
            item => item.translationId === turkishItem.id && item.language === "en"
          );
          return translation;
        })
        .filter((translation): translation is SarusHubItem => translation !== undefined);
      
      // For public users, only show published translations
      // But if a translation exists (even as draft), we should show it to indicate translation is in progress
      // For now, let's only show published translations to avoid showing placeholder content
      const publishedTranslations = englishTranslations.filter(t => t.status === "published");
      
      // Add published translations to items if not already included
      publishedTranslations.forEach(translation => {
        if (!items.find(item => item.id === translation.id)) {
          items.push(translation);
        }
      });
    }

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching Sarus-HUB content:", error);
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 500 }
    );
  }
}

// POST - Create new item (sarus-hub role required)
export async function POST(request: NextRequest) {
  try {
    const authCheck = await verifySarusHubRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Requires sarus-hub or admin role." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      type,
      title,
      slug,
      summary,
      content,
      hospital,
      country,
      segment,
      tags,
      featured,
      readingMinutes,
      status,
      author,
      image,
      video,
      language,
    } = body;

    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, slug" },
        { status: 400 }
      );
    }

    // Check if slug already exists by trying to get it
    try {
      const existing = getAllItems({}, true).find(item => item.slug === slug);
      if (existing) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    } catch (error) {
      // If getAllItems fails, continue (might be empty database)
    }

    const publishedAt = status === "published" ? new Date().toISOString() : undefined;
    const itemLanguage = language || "tr";
    
    const newItem = createItem({
      type,
      title,
      slug,
      summary: summary || "",
      content: content || "",
      hospital: hospital || undefined,
      country: country || undefined,
      segment: segment || undefined,
      tags: tags || [],
      publishedAt,
      featured: featured || false,
      readingMinutes: readingMinutes || undefined,
      status: status || "draft",
      author: author || authCheck.user?.username || "Unknown",
      image: image || undefined,
      video: video || undefined,
      language: itemLanguage,
      viewCount: 0,
    });

    // If Turkish item is created, automatically create English draft translation
    if (itemLanguage === "tr") {
      try {
        const allItems = getAllItems({}, true);
        const existingSlugs = allItems.map(item => item.slug);
        const englishSlug = generateTranslationSlug(slug, "en");
        
        // Check if English translation already exists
        const existingEnglish = allItems.find(
          item => item.translationId === newItem.id || 
          (item.slug === englishSlug && item.language === "en")
        );
        
        if (!existingEnglish) {
          // Generate placeholder translation
          const placeholder = generatePlaceholderTranslation(title, summary || "", content || "");
          
          // Create English draft
          createItem({
            type,
            title: placeholder.title,
            slug: englishSlug,
            summary: placeholder.summary,
            content: placeholder.content,
            hospital: hospital || undefined,
            country: country || undefined,
            segment: segment || undefined,
            tags: tags || [],
            publishedAt: undefined, // Draft, not published
            featured: false, // Don't feature translations by default
            readingMinutes: readingMinutes || undefined,
            status: "draft", // Always create as draft
            author: author || authCheck.user?.username || "Unknown",
            image: image || undefined,
            video: video || undefined,
            language: "en",
            translationId: newItem.id, // Link to Turkish original
            viewCount: 0,
          });
          
          console.log(`Created English draft translation for item ${newItem.id}`);
        }
      } catch (error) {
        // Log error but don't fail the main request
        console.error("Error creating English translation:", error);
      }
    }

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error("Error creating Sarus-HUB content:", error);
    return NextResponse.json(
      { error: "Failed to create content" },
      { status: 500 }
    );
  }
}

// PUT - Update item (sarus-hub role required)
export async function PUT(request: NextRequest) {
  try {
    const authCheck = await verifySarusHubRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Requires sarus-hub or admin role." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = getItemById(id);
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check if slug is being updated and already exists
    if (updates.slug && updates.slug !== existing.slug) {
      const allItems = getAllItems({}, true);
      if (allItems.some((item) => item.slug === updates.slug && item.id !== id)) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update item
    const updatedItem = updateItem(id, updates);

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error updating Sarus-HUB content:", error);
    return NextResponse.json(
      { error: "Failed to update content" },
      { status: 500 }
    );
  }
}

// DELETE - Delete item (sarus-hub role required)
export async function DELETE(request: NextRequest) {
  try {
    const authCheck = await verifySarusHubRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Requires sarus-hub or admin role." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = getItemById(id);
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const success = deleteItem(id);
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting Sarus-HUB content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}
