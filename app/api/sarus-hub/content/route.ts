import { NextRequest, NextResponse } from "next/server";
import { SarusHubItem, SarusHubFilters } from "@/lib/types/sarus-hub";
import { verifySarusHubRole } from "@/lib/utils/role-verification";
import { initializeDatabase } from "@/lib/db/schema";
import { getAllItems, createItem, updateItem, deleteItem, slugExists } from "@/lib/db/sarus-hub";
import { runMigrationIfNeeded } from "@/lib/db/migration";

// Initialize database and run migration on first import
if (typeof window === "undefined") {
  try {
    initializeDatabase();
    runMigrationIfNeeded();
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

    // Get items from database (includeDrafts based on authorization)
    const items = getAllItems(filters, isAuthorized);

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
      primaryImage,
      images,
      imageDisplayStyle,
      video,
      language,
    } = body;

    if (!type || !title || !slug) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, slug" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    if (slugExists(slug)) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newItem = createItem({
      type,
      title,
      slug,
      summary: summary || "",
      content: content || "",
      hospital: hospital || "",
      country: country || "",
      segment: segment || "",
      tags: tags || [],
      publishedAt: status === "published" ? now : undefined,
      featured: featured || false,
      readingMinutes,
      status: status || "draft",
      author: author || authCheck.user?.username || "Unknown",
      image: image || "", // Legacy support
      primaryImage: primaryImage || image || "",
      images: images || [],
      imageDisplayStyle: imageDisplayStyle || "cover",
      video: video || "",
      language: language || "tr",
    });

    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating Sarus-HUB content:", error);
    
    // Handle slug conflict error
    if (error.message && error.message.includes("already exists")) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
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

    // Check if slug is being updated and already exists
    if (updates.slug) {
      // Get existing item to check current slug
      const { getItemById } = await import("@/lib/db/sarus-hub");
      const existing = getItemById(id);
      
      if (!existing) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      // Only check if slug is actually changing
      if (updates.slug !== existing.slug && slugExists(updates.slug)) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update item in database
    const updatedItem = updateItem(id, updates);

    return NextResponse.json({ item: updatedItem });
  } catch (error: any) {
    console.error("Error updating Sarus-HUB content:", error);
    
    if (error.message && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
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

    const deleted = deleteItem(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
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
