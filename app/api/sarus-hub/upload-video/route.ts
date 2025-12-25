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

    // Write file with better error handling
    try {
      const fs = await import("fs");
      
      // Write file
      await writeFile(filepath, buffer);
      
      // Force file system sync in production (ensures file is fully written to disk)
      if (process.env.NODE_ENV === "production") {
        const fd = await fs.promises.open(filepath, "r");
        try {
          await fd.sync(); // Force sync to disk
        } finally {
          await fd.close();
        }
        // Additional wait for production file system sync delays
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Verify file was written successfully
      if (!fs.existsSync(filepath)) {
        throw new Error("File was not written successfully");
      }
      
      // Verify file size matches
      const stats = await fs.promises.stat(filepath);
      if (stats.size !== buffer.length) {
        // Retry: wait a bit and check again (for production file system sync delays)
        await new Promise(resolve => setTimeout(resolve, 300));
        const retryStats = await fs.promises.stat(filepath);
        if (retryStats.size !== buffer.length) {
          throw new Error(`File size mismatch: expected ${buffer.length}, got ${retryStats.size}`);
        }
      }
      
      // Ensure file is readable by actually reading a small portion
      try {
        await fs.promises.access(filepath, fs.constants.R_OK);
        // Try to read first byte to ensure file is accessible
        const testRead = await fs.promises.readFile(filepath, { encoding: null, flag: 'r' });
        if (testRead.length !== buffer.length) {
          throw new Error("File read size mismatch");
        }
      } catch (accessError) {
        throw new Error("File is not readable after write");
      }
      
      // In production, add extra delay to ensure Next.js static file serving picks up the file
      if (process.env.NODE_ENV === "production") {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Return public URL with cache-busting timestamp
      const urlTimestamp = Date.now();
      const publicUrl = `/uploads/sarus-hub/videos/${filename}?t=${urlTimestamp}`;
      
      return NextResponse.json({ url: publicUrl, filename });
    } catch (writeError: any) {
      console.error("Error writing file:", writeError);
      // Check if it's a permission error
      if (writeError.code === "EACCES" || writeError.code === "EPERM") {
        return NextResponse.json(
          { error: "Permission denied. Please check directory permissions." },
          { status: 500 }
        );
      }
      // Check if it's a disk space error
      if (writeError.code === "ENOSPC") {
        return NextResponse.json(
          { error: "Insufficient disk space." },
          { status: 500 }
        );
      }
      throw writeError; // Re-throw to be caught by outer catch
    }
  } catch (error: any) {
    console.error("Error uploading video:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    
    // Return more detailed error message
    const errorMessage = error?.message || "Failed to upload video";
    return NextResponse.json(
      { error: errorMessage, details: error?.code },
      { status: 500 }
    );
  }
}


