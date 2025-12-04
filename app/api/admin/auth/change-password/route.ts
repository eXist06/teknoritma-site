import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";

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

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword, email } = await request.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const data = readAdminData();
    const user = data.users.find((u: any) => u.id === payload.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // İlk girişte current password kontrolü yapma
    if (!user.isFirstLogin) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required" },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
    }

    // Yeni şifreyi hash'le
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Kullanıcıyı güncelle
    user.passwordHash = newPasswordHash;
    user.isFirstLogin = false;
    user.email = email || user.email;
    user.updatedAt = new Date().toISOString();

    writeAdminData(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

