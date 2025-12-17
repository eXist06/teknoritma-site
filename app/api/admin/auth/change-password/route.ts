import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { getAdminUserById, updateAdminUser } from "@/lib/db/admin";

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

    const user = getAdminUserById(payload.userId as string);

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
    console.log(`[CHANGE PASSWORD] Updating password for user: ${user.username}, email: ${user.email}`);

    // Kullanıcıyı güncelle
    const updates: any = {
      passwordHash: newPasswordHash,
      isFirstLogin: false,
    };
    
    if (email) {
      updates.email = email.toLowerCase();
    }

    updateAdminUser(user.id, updates);
    console.log(`[CHANGE PASSWORD] Password updated successfully for user: ${user.username}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
