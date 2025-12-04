import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import fs from "fs";
import path from "path";

const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");
const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

function readAdminData() {
  try {
    const data = fs.readFileSync(ADMIN_DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { users: [], settings: {} };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const data = readAdminData();
    const user = data.users.find((u: any) => u.username === username);

    if (!user) {
      // Rate limiting için kısa bir delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // JWT token oluştur (role bilgisini de ekle)
    const userRole = user.role || "admin"; // Backward compatibility
    const token = await new SignJWT({ 
      userId: user.id, 
      username: user.username,
      role: userRole 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .setIssuedAt()
      .sign(new TextEncoder().encode(JWT_SECRET));

    const response = NextResponse.json({
      success: true,
      isFirstLogin: user.isFirstLogin,
      requiresPasswordChange: user.isFirstLogin,
      role: userRole,
    });

    // HttpOnly cookie olarak token kaydet
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 saat
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

