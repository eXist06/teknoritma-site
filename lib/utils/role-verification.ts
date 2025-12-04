import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";
import { AdminUser } from "@/lib/types/admin";

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

export async function verifyKnowledgeBaseRole(
  request: NextRequest
): Promise<{ isAuthorized: boolean; error?: string; user?: AdminUser }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { isAuthorized: false, error: "Unauthorized" };
  }

  const adminData = readAdminData();
  const user = adminData.users.find((u: AdminUser) => u.id === payload.userId);

  if (!user) {
    return { isAuthorized: false, error: "User not found" };
  }

  // Admin ve knowledge-base rolleri erişebilir
  if (user.role === "admin" || user.role === "knowledge-base") {
    return { isAuthorized: true, user };
  }

  return { isAuthorized: false, error: "Insufficient permissions. Requires knowledge-base or admin role." };
}

export async function verifySarusHubRole(
  request: NextRequest
): Promise<{ isAuthorized: boolean; error?: string; user?: AdminUser }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { isAuthorized: false, error: "Unauthorized" };
  }

  const adminData = readAdminData();
  const user = adminData.users.find((u: AdminUser) => u.id === payload.userId);

  if (!user) {
    return { isAuthorized: false, error: "User not found" };
  }

  // Admin ve sarus-hub rolleri erişebilir
  if (user.role === "admin" || user.role === "sarus-hub") {
    return { isAuthorized: true, user };
  }

  return { isAuthorized: false, error: "Insufficient permissions. Requires sarus-hub or admin role." };
}

export async function verifyAdminRole(
  request: NextRequest
): Promise<{ isAuthorized: boolean; error?: string; user?: AdminUser }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { isAuthorized: false, error: "Unauthorized" };
  }

  const adminData = readAdminData();
  const user = adminData.users.find((u: AdminUser) => u.id === payload.userId);

  if (!user) {
    return { isAuthorized: false, error: "User not found" };
  }

  // Sadece admin erişebilir
  if (user.role === "admin") {
    return { isAuthorized: true, user };
  }

  return { isAuthorized: false, error: "Insufficient permissions. Requires admin role." };
}

export async function getCurrentUser(
  request: NextRequest
): Promise<{ user?: AdminUser; error?: string }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { error: "Unauthorized" };
  }

  const adminData = readAdminData();
  const user = adminData.users.find((u: AdminUser) => u.id === payload.userId);

  if (!user) {
    return { error: "User not found" };
  }

  return { user };
}


