import { NextRequest, NextResponse } from "next/server";
import { getQueue, processQueue, removeFromQueue } from "@/lib/services/email-queue";
import { verifyAdminRole } from "@/lib/utils/role-verification";

export async function GET(request: NextRequest) {
  try {
    // Only admin can view email queue
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
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
    // Only admin can process email queue
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
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
    // Only admin can delete from email queue
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
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









