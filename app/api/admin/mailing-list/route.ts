import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRole } from "@/lib/utils/role-verification";
import { getAllMailingSubscribers, deleteMailingSubscriber } from "@/lib/db/mailing";

export async function GET(request: NextRequest) {
  try {
    // Only admin can view mailing list
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const subscribers = getAllMailingSubscribers();
    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Error reading mailing list:", error);
    return NextResponse.json(
      { error: "Failed to read mailing list" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Only admin can delete from mailing list
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
        { error: "Subscriber ID is required" },
        { status: 400 }
      );
    }

    const deleted = deleteMailingSubscriber(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Subscriber not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    return NextResponse.json(
      { error: "Failed to delete subscriber" },
      { status: 500 }
    );
  }
}
