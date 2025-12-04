import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SarusHubItem, SarusHubFilters } from "@/lib/types/sarus-hub";
import { verifySarusHubRole } from "@/lib/utils/role-verification";

const DATA_PATH = path.join(process.cwd(), "lib/data/sarus-hub.json");

function readData(): { items: SarusHubItem[] } {
  try {
    const data = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { items: [] };
  }
}

function writeData(data: { items: SarusHubItem[] }) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
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

    const data = readData();
    let items = data.items;

    // Check if user is admin/sarus-hub (can see drafts)
    const authCheck = await verifySarusHubRole(request);
    const isAuthorized = authCheck.isAuthorized;

    // Filter by status (public users only see published)
    if (!isAuthorized) {
      items = items.filter((item) => item.status === "published");
    }

    // Apply filters
    if (filters.type) {
      items = items.filter((item) => item.type === filters.type);
    }

    if (filters.tags && filters.tags.length > 0) {
      items = items.filter((item) =>
        filters.tags!.some((tag) => item.tags.includes(tag))
      );
    }

    if (filters.segment) {
      items = items.filter((item) => item.segment === filters.segment);
    }

    if (filters.country) {
      items = items.filter((item) => item.country === filters.country);
    }

    if (filters.year) {
      items = items.filter((item) => {
        const year = new Date(item.publishedAt).getFullYear();
        return year === filters.year;
      });
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.summary.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          (item.hospital && item.hospital.toLowerCase().includes(searchLower))
      );
    }

    if (filters.language && filters.language !== "all") {
      items = items.filter(
        (item) => item.language === filters.language || item.language === "mixed"
      );
    }

    // Sort by publishedAt (newest first)
    items.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

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

    const data = readData();

    // Check if slug already exists
    if (data.items.some((item) => item.slug === slug)) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const newItem: SarusHubItem = {
      id: Date.now().toString(),
      type,
      title,
      slug,
      summary: summary || "",
      content: content || "",
      hospital: hospital || "",
      country: country || "",
      segment: segment || "",
      tags: tags || [],
      publishedAt: status === "published" ? now : "",
      featured: featured || false,
      readingMinutes,
      status: status || "draft",
      author: author || authCheck.user?.username || "Unknown",
      image: image || "",
      video: video || "",
      language: language || "tr",
      createdAt: now,
      updatedAt: now,
    };

    data.items.push(newItem);
    writeData(data);

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

    const data = readData();
    const itemIndex = data.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check if slug is being updated and already exists
    if (updates.slug && updates.slug !== data.items[itemIndex].slug) {
      if (data.items.some((item) => item.slug === updates.slug && item.id !== id)) {
        return NextResponse.json(
          { error: "Slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update item
    const updatedItem: SarusHubItem = {
      ...data.items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
      publishedAt:
        updates.status === "published" && !data.items[itemIndex].publishedAt
          ? new Date().toISOString()
          : data.items[itemIndex].publishedAt,
    };

    data.items[itemIndex] = updatedItem;
    writeData(data);

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

    const data = readData();
    const itemIndex = data.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    data.items.splice(itemIndex, 1);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting Sarus-HUB content:", error);
    return NextResponse.json(
      { error: "Failed to delete content" },
      { status: 500 }
    );
  }
}


