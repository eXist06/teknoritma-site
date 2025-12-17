import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAllAdminUsers, createAdminUser } from "@/lib/db/admin";

export async function POST(request: NextRequest) {
  try {
    const allUsers = getAllAdminUsers();
    
    // Eğer kullanıcı varsa setup yapılamaz
    if (allUsers.length > 0) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 400 }
      );
    }

    // İlk kullanıcıyı oluştur
    const passwordHash = await bcrypt.hash("516708", 10);
    createAdminUser({
      username: "ik",
      passwordHash,
      email: "",
      role: "ik",
      isFirstLogin: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
