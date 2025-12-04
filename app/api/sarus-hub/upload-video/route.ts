import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import { verifySarusHubRole } from "@/lib/utils/role-verification";

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authCheck = await verifySarusHubRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Requires sarus-hub or admin role." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only MP4, WebM, and QuickTime videos are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 100MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "sarus-hub", "videos");
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/sarus-hub/videos/${filename}`;

    return NextResponse.json({ url: publicUrl, filename });
  } catch (error) {
    console.error("Error uploading video:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}


