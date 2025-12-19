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
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "sarus-hub");
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
      await writeFile(filepath, buffer);
      
      // Verify file was written successfully
      const fs = await import("fs");
      if (!fs.existsSync(filepath)) {
        throw new Error("File was not written successfully");
      }
      
      // Return public URL
      const publicUrl = `/uploads/sarus-hub/${filename}`;
      
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
    console.error("Error uploading image:", error);
    console.error("Error details:", {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
    });
    
    // Return more detailed error message
    const errorMessage = error?.message || "Failed to upload image";
    return NextResponse.json(
      { error: errorMessage, details: error?.code },
      { status: 500 }
    );
  }
}


