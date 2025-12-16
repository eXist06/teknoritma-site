import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { CareersContent } from "@/lib/types/careers";
import { getCurrentUser } from "@/lib/utils/role-verification";

const dataFilePath = path.join(process.cwd(), "lib/data/careers-data.json");

function readData() {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    return { jobs: [], content: {} };
  }
}

function writeData(data: any) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

async function verifyIKOrAdminRole(request: NextRequest): Promise<{ authorized: boolean; error?: string }> {
  const { user, error } = await getCurrentUser(request);
  if (error || !user) {
    return { authorized: false, error: "Unauthorized" };
  }
  
  // Admin ve IK rolleri erişebilir
  if (user.role === "admin" || user.role === "ik") {
    return { authorized: true };
  }
  
  return { authorized: false, error: "Insufficient permissions. Requires admin or IK role." };
}

export async function GET() {
  try {
    const data = readData();
    return NextResponse.json({ content: data.content || {} });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authCheck = await verifyIKOrAdminRole(request);
    if (!authCheck.authorized) {
      return NextResponse.json({ error: authCheck.error || "Unauthorized" }, { status: 401 });
    }
    
    const content: CareersContent = await request.json();
    
    const data = readData();
    data.content = content;
    writeData(data);
    
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}










