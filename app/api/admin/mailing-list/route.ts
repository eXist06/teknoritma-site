import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRole } from "@/lib/utils/role-verification";
import { getAllMailingSubscribers, deleteMailingSubscriber, createMailingSubscriber, updateMailingSubscriber, getMailingSubscriberByEmail } from "@/lib/db/mailing";

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
    return NextResponse.json({ subscribers }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error reading mailing list:", error);
    return NextResponse.json(
      { error: "Failed to read mailing list" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only admin can add to mailing list
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      console.error("[ADMIN MAILING LIST POST] Unauthorized");
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("[ADMIN MAILING LIST POST] Received body:", body);
    const { email, name, organization, source = "manual", tags = [], category } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Handle category: can be string, array, or undefined
    let finalCategory: "ik" | "general" | ("ik" | "general")[] = ["general"];
    if (category) {
      if (Array.isArray(category)) {
        // If array, use it as-is (can be multiple categories)
        finalCategory = category.length > 0 ? category : ["general"];
      } else {
        // If string, convert to array
        finalCategory = [category as "ik" | "general"];
      }
    }
    console.log("[ADMIN MAILING LIST POST] Final category:", finalCategory);

    // Check if already subscribed
    const existing = getMailingSubscriberByEmail(email);
    console.log("[ADMIN MAILING LIST POST] Existing subscriber:", existing ? existing.id : "none");

    if (existing) {
      // Update existing subscriber
      const updated = updateMailingSubscriber(existing.id, {
        name: name || existing.name,
        organization: organization || existing.organization,
        source,
        category: finalCategory,
        tags: tags.length > 0 ? tags : existing.tags,
        active: true,
      });

      return NextResponse.json({
        success: true,
        message: "Subscriber updated",
        subscriber: updated,
      });
    } else {
      // Create new subscriber
      console.log("[ADMIN MAILING LIST POST] Creating new subscriber with:", {
        email: email.toLowerCase(),
        name: name || undefined,
        organization: organization || undefined,
        source,
        category: finalCategory,
        tags: tags || [],
        active: true,
      });
      
      const newSubscriber = createMailingSubscriber({
        email: email.toLowerCase(),
        name: name || undefined,
        organization: organization || undefined,
        source,
        category: finalCategory,
        tags: tags || [],
        active: true,
      });

      console.log("[ADMIN MAILING LIST POST] Created subscriber:", newSubscriber.id);
      return NextResponse.json({
        success: true,
        message: "Subscriber added",
        subscriber: newSubscriber,
      });
    }
  } catch (error: any) {
    console.error("Error adding subscriber:", error);
    const errorMessage = error?.message || String(error) || "Failed to add subscriber";
    return NextResponse.json(
      { error: errorMessage, details: error },
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
