import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getQueue, processQueue, removeFromQueue } from "@/lib/services/email-queue";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

async function verifyToken(request: NextRequest) {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queue = getQueue();
    return NextResponse.json({ queue });
  } catch (error) {
    console.error("Error reading email queue:", error);
    return NextResponse.json(
      { error: "Failed to read email queue" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processQueue();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error processing email queue:", error);
    return NextResponse.json(
      { error: "Failed to process email queue" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Queue item ID is required" },
        { status: 400 }
      );
    }

    const removed = removeFromQueue(id);
    if (removed) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Queue item not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting queue item:", error);
    return NextResponse.json(
      { error: "Failed to delete queue item" },
      { status: 500 }
    );
  }
}









