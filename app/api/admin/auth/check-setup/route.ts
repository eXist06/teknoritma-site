import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");

function readAdminData() {
  try {
    const data = fs.readFileSync(ADMIN_DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [], settings: {} };
  }
}

export async function GET() {
  try {
    const data = readAdminData();
    return NextResponse.json({ setup: data.users.length > 0 });
  } catch (error) {
    return NextResponse.json({ setup: false });
  }
}





