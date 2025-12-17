import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { AdminUser, UserRole } from "@/lib/types/admin";
import { runMigrationIfNeeded } from "@/lib/db/migration";
import {
  getAllAdminUsers,
  getAdminUserById,
  getAdminUserByEmail,
  getAdminUserByUsername,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/db/admin";

// Run migration on first import
if (typeof window === "undefined") {
  runMigrationIfNeeded();
}

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

async function verifyAdminRole(request: NextRequest): Promise<{ isAdmin: boolean; error?: string }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { isAdmin: false, error: "No token payload" };
  }

  const user = getAdminUserById(payload.userId as string);
  
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

    const adminCheck = await verifyAdminRole(request);
    if (!adminCheck.isAdmin) {
      console.error("[USERS API] Admin check failed:", adminCheck.error);
      return NextResponse.json({ 
        error: "Forbidden - Admin access required",
        details: adminCheck.error 
      }, { status: 403 });
    }

    const users = getAllAdminUsers();
    // Don't send password hashes
    const usersWithoutPasswords = users.map(({ passwordHash, ...user }) => user);
    
    return NextResponse.json({ users: usersWithoutPasswords });
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

    if (!["admin", "ik", "knowledge-base", "sarus-hub"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be: admin, ik, knowledge-base, or sarus-hub" },
        { status: 400 }
      );
    }

    // Check if username already exists
    if (getAdminUserByUsername(username)) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Check if email already exists
    if (getAdminUserByEmail(email)) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = createAdminUser({
      username,
      passwordHash,
      email: email.toLowerCase(),
      role: role as UserRole,
      isFirstLogin: true,
    });

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

    const existingUser = getAdminUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updates: Partial<AdminUser> = {};

    if (username && username !== existingUser.username) {
      if (getAdminUserByUsername(username)) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }
      updates.username = username;
    }

    if (email && email.toLowerCase() !== existingUser.email.toLowerCase()) {
      if (getAdminUserByEmail(email)) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
      updates.email = email.toLowerCase();
    }

    if (role && role !== existingUser.role) {
      if (!["admin", "ik", "knowledge-base", "sarus-hub"].includes(role)) {
        return NextResponse.json(
          { error: "Invalid role. Must be: admin, ik, knowledge-base, or sarus-hub" },
          { status: 400 }
        );
      }
      updates.role = role as UserRole;
    }

    if (password) {
      updates.passwordHash = await bcrypt.hash(password, 10);
      updates.isFirstLogin = false;
    }

    const updatedUser = updateAdminUser(id, updates);

    // Don't send password hash
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;

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

    // Prevent deleting yourself
    if (id === payload.userId) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const deleted = deleteAdminUser(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
