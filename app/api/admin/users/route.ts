import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { AdminUser, UserRole } from "@/lib/types/admin";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";
const ADMIN_DATA_PATH = path.join(process.cwd(), "lib/data/admin-data.json");

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

async function verifyAdminRole(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { isAdmin: false, error: "No token payload" };
  }

  const adminData = readAdminData();
  const user = adminData.users.find((u: AdminUser) => u.id === payload.userId);
  
  if (!user) {
    return { isAdmin: false, error: `User not found with ID: ${payload.userId}` };
  }
  
  if (user.role !== "admin") {
    return { isAdmin: false, error: `User role is '${user.role}', admin required` };
  }
  
  return { isAdmin: true };
}

export async function GET(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can view all users
    const adminCheck = await verifyAdminRole(request);
    if (!adminCheck.isAdmin) {
      console.error("[USERS API] Admin check failed:", adminCheck.error);
      return NextResponse.json({ 
        error: "Forbidden - Admin access required",
        details: adminCheck.error 
      }, { status: 403 });
    }

    const adminData = readAdminData();
    // Don't send password hashes
    const users = adminData.users.map(({ passwordHash, ...user }: { passwordHash: string; [key: string]: any }) => user);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error reading users:", error);
    return NextResponse.json(
      { error: "Failed to read users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can create users
    const adminCheck = await verifyAdminRole(request);
    if (!adminCheck.isAdmin) {
      console.error("[USERS API] Admin check failed:", adminCheck.error);
      return NextResponse.json({ 
        error: "Forbidden - Admin access required",
        details: adminCheck.error 
      }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role } = body;

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "Username, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!["admin", "ik", "knowledge-base"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be: admin, ik, or knowledge-base" },
        { status: 400 }
      );
    }

    const adminData = readAdminData();

    // Check if username already exists
    if (adminData.users.some((u: AdminUser) => u.username === username)) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (adminData.users.some((u: AdminUser) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: AdminUser = {
      id: Date.now().toString(),
      username,
      passwordHash,
      email: email.toLowerCase(),
      role: role as UserRole,
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    adminData.users.push(newUser);
    writeAdminData(adminData);

    // Don't send password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can update users
    const adminCheck = await verifyAdminRole(request);
    if (!adminCheck.isAdmin) {
      console.error("[USERS API] Admin check failed:", adminCheck.error);
      return NextResponse.json({ 
        error: "Forbidden - Admin access required",
        details: adminCheck.error 
      }, { status: 403 });
    }

    const body = await request.json();
    const { id, username, email, password, role } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const adminData = readAdminData();
    const userIndex = adminData.users.findIndex((u: AdminUser) => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const user = adminData.users[userIndex];

    // Update fields
    if (username && username !== user.username) {
      // Check if new username already exists
      if (adminData.users.some((u: AdminUser) => u.username === username && u.id !== id)) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
      user.username = username;
    }

    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      // Check if new email already exists
      if (adminData.users.some((u: AdminUser) => u.email.toLowerCase() === email.toLowerCase() && u.id !== id)) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
      user.email = email.toLowerCase();
    }

    if (role && role !== user.role) {
      if (!["admin", "ik", "knowledge-base"].includes(role)) {
        return NextResponse.json(
          { error: "Invalid role. Must be: admin, ik, or knowledge-base" },
          { status: 400 }
        );
      }
      user.role = role as UserRole;
    }

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
      user.isFirstLogin = false; // Reset password means they've logged in
    }

    user.updatedAt = new Date().toISOString();
    adminData.users[userIndex] = user;
    writeAdminData(adminData);

    // Don't send password hash
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await verifyToken(request);
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can delete users
    const adminCheck = await verifyAdminRole(request);
    if (!adminCheck.isAdmin) {
      console.error("[USERS API] Admin check failed:", adminCheck.error);
      return NextResponse.json({ 
        error: "Forbidden - Admin access required",
        details: adminCheck.error 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const adminData = readAdminData();
    
    // Prevent deleting yourself
    if (id === payload.userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const userIndex = adminData.users.findIndex((u: AdminUser) => u.id === id);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    adminData.users.splice(userIndex, 1);
    writeAdminData(adminData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}

