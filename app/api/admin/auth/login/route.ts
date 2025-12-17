import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { getAllAdminUsers, getAdminUserByUsername } from "@/lib/db/admin";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const allUsers = getAllAdminUsers();

    // Check if no users exist - redirect to first login
    if (allUsers.length === 0) {
      return NextResponse.json(
        { error: "No admin users found. Please use first login page." },
        { status: 403 }
      );
    }

    const user = getAdminUserByUsername(username);

    if (!user) {
      console.error(`[LOGIN] User not found: ${username}`);
      // Rate limiting için kısa bir delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log(`[LOGIN] Attempting login for user: ${username}, email: ${user.email}`);
    const isValid = await bcrypt.compare(password, user.passwordHash);
    console.log(`[LOGIN] Password validation result: ${isValid}`);
    
    if (!isValid) {
      console.error(`[LOGIN] Invalid password for user: ${username}`);
      // Rate limiting için kısa bir delay
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
