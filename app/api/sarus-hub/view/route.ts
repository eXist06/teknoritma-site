import { NextRequest, NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/schema";
import { incrementViewCount } from "@/lib/db/sarus-hub";

// Initialize database on first import
if (typeof window === "undefined") {
  try {
    initializeDatabase();
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// POST - Increment view count
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const viewCount = incrementViewCount(slug);

    return NextResponse.json({ 
      success: true, 
      viewCount 
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return NextResponse.json(
      { error: "Failed to increment view count" },
      { status: 500 }
    );
  }
}
