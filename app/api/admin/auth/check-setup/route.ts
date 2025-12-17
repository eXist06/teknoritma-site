import { NextResponse } from "next/server";
import { getAllAdminUsers } from "@/lib/db/admin";

export async function GET() {
  try {
    const allUsers = getAllAdminUsers();
    return NextResponse.json({ setup: allUsers.length > 0 });
  } catch (error) {
    return NextResponse.json({ setup: false });
  }
}
