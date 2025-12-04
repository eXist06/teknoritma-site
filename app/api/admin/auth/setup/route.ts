import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

function writeAdminData(data: any) {
  fs.writeFileSync(ADMIN_DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function POST(request: NextRequest) {
  try {
    const data = readAdminData();
    
    // Eğer kullanıcı varsa setup yapılamaz
    if (data.users.length > 0) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    // İlk kullanıcıyı oluştur
    const passwordHash = await bcrypt.hash("516708", 10);
    const adminUser = {
      id: Date.now().toString(),
      username: "ik",
      passwordHash,
      email: "",
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.users.push(adminUser);
    writeAdminData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


