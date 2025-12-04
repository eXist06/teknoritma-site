import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SignJWT } from "jose";
import { AdminUser } from "@/lib/types/admin";
import bcrypt from "bcryptjs";

const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");
const FIRST_LOGIN_PASSWORDS_PATH = path.join(process.cwd(), "lib/data/first-login-passwords.json");
const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

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

function readFirstLoginPasswords() {
  try {
    const data = fs.readFileSync(FIRST_LOGIN_PASSWORDS_PATH, "utf8");
    return JSON.parse(data);
  } catch {
    return { passwords: [] };
  }
}

function writeFirstLoginPasswords(data: any) {
  fs.writeFileSync(FIRST_LOGIN_PASSWORDS_PATH, JSON.stringify(data, null, 2), "utf8");
}

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

    const data = readAdminData();

    // Check if users already exist
    if (data.users.length > 0) {
      return NextResponse.json(
        { error: "Admin users already exist. Please use regular login." },
        { status: 403 }
      );
    }

    // Find the password in temporary storage
    const passwordsData = readFirstLoginPasswords();
    const passwordEntry = passwordsData.passwords.find(
      (p: any) => p.email.toLowerCase() === email.toLowerCase()
    );

    if (!passwordEntry) {
      return NextResponse.json(
        { error: "Password not found. Please request a new password." },
        { status: 404 }
      );
    }

    // Check if password is expired (1 hour)
    const createdAt = new Date(passwordEntry.createdAt);
    if (Date.now() - createdAt.getTime() > 60 * 60 * 1000) {
      // Remove expired password
      passwordsData.passwords = passwordsData.passwords.filter(
        (p: any) => p.email.toLowerCase() !== email.toLowerCase()
      );
      writeFirstLoginPasswords(passwordsData);
      return NextResponse.json(
        { error: "Password expired. Please request a new password." },
        { status: 400 }
      );
    }

    // Verify password
    if (password !== passwordEntry.password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    // Password is correct, create admin user
    const newAdmin: AdminUser = {
      id: Date.now().toString(),
      username: "admin",
      passwordHash: passwordEntry.passwordHash,
      email: email.toLowerCase(),
      role: "admin",
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.users.push(newAdmin);
    writeAdminData(data);

    // Remove used password from temporary storage
    passwordsData.passwords = passwordsData.passwords.filter(
      (p: any) => p.email.toLowerCase() !== email.toLowerCase()
    );
    writeFirstLoginPasswords(passwordsData);

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

