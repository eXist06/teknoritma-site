import { NextRequest, NextResponse } from "next/server";
import { SystemSettings } from "@/lib/types/admin";
import { verifyAdminRole } from "@/lib/utils/role-verification";
import { runMigrationIfNeeded } from "@/lib/db/migration";
import { getSystemSettings, updateSystemSettings } from "@/lib/db/admin";

// Run migration on first import
if (typeof window === "undefined") {
  runMigrationIfNeeded();
}

export async function GET(request: NextRequest) {
  try {
    // Only admin can view settings
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const settings = getSystemSettings();
    return NextResponse.json({ settings }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Only admin can update settings
    const authCheck = await verifyAdminRole(request);
    if (!authCheck.isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized. Admin role required." },
        { status: 403 }
      );
    }

    const settings: SystemSettings = await request.json();
    updateSystemSettings(settings);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
