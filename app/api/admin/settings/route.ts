import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import { SystemSettings } from "@/lib/types/admin";

const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");
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
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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





