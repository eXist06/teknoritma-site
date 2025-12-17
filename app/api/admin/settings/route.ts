import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SystemSettings } from "@/lib/types/admin";
import { verifyAdminRole } from "@/lib/utils/role-verification";

const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");

function readAdminData() {
  try {
    const data = fs.readFileSync(ADMIN_DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [], settings: {} };
  }
}

function writeAdminData(data: any) {
  fs.writeFileSync(ADMIN_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
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

    const data = readAdminData();
    return NextResponse.json({ settings: data.settings || {} });
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
    const data = readAdminData();
    data.settings = settings;
    writeAdminData(data);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}









