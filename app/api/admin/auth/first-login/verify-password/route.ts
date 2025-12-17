import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import { AdminUser } from "@/lib/types/admin";
import { getAllAdminUsers, getFirstLoginPasswordByEmail, markFirstLoginPasswordAsUsed, createAdminUser } from "@/lib/db/admin";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

function isValidTeknoritmaEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain === "teknoritma.com.tr";
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!isValidTeknoritmaEmail(email)) {
      return NextResponse.json(
        { error: "Only teknoritma.com.tr email addresses are allowed" },
        { status: 403 }
      );
    }

    const allUsers = getAllAdminUsers();

    // Check if users already exist
    if (allUsers.length > 0) {
      return NextResponse.json(
        { error: "Admin users already exist. Please use regular login." },
        { status: 403 }
      );
    }

    // Find the password in temporary storage
    const passwordEntry = getFirstLoginPasswordByEmail(email);
    
    if (!passwordEntry) {
      return NextResponse.json(
        { error: "Password not found. Please request a new password." },
        { status: 404 }
      );
    }

    // Verify password (trim whitespace to handle copy-paste issues)
    if (password.trim() !== passwordEntry.password.trim()) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Password is correct, create admin user
    const newAdmin = createAdminUser({
      username: "admin",
      passwordHash: passwordEntry.passwordHash,
      email: email.toLowerCase(),
      role: "admin",
      isFirstLogin: true,
    });

    // Mark password as used
    markFirstLoginPasswordAsUsed(passwordEntry.id);

    // Create JWT token
    const token = await new SignJWT({
      userId: newAdmin.id,
      username: newAdmin.username,
      role: newAdmin.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .setIssuedAt()
      .sign(new TextEncoder().encode(JWT_SECRET));

    const response = NextResponse.json({
      success: true,
      requiresPasswordChange: true,
    });

    // Set HttpOnly cookie
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 saat
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
