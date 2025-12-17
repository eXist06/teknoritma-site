import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { AdminUser } from "@/lib/types/admin";
import {
  getAdminUserById,
} from "@/lib/db/admin";

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

export async function verifyKnowledgeBaseRole(
  request: NextRequest
): Promise<{ isAuthorized: boolean; error?: string; user?: AdminUser }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { isAuthorized: false, error: "Unauthorized" };
  }

  const user = getAdminUserById(payload.userId as string);

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

  const user = getAdminUserById(payload.userId as string);

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

  const user = getAdminUserById(payload.userId as string);

  if (!user) {
    return { isAuthorized: false, error: "User not found" };
  }

  // Sadece admin erişebilir
  if (user.role === "admin") {
    return { isAuthorized: true, user };
  }

  return { isAuthorized: false, error: "Insufficient permissions. Requires admin role." };
}

export async function verifyIKOrAdminRole(
  request: NextRequest
): Promise<{ authorized: boolean; error?: string; user?: AdminUser }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { authorized: false, error: "Unauthorized" };
  }

  const user = getAdminUserById(payload.userId as string);

  if (!user) {
    return { authorized: false, error: "User not found" };
  }

  // Admin ve IK rolleri erişebilir
  if (user.role === "admin" || user.role === "ik") {
    return { authorized: true, user };
  }

  return { authorized: false, error: "Insufficient permissions. Requires IK or admin role." };
}

export async function getCurrentUser(
  request: NextRequest
): Promise<{ user?: AdminUser; error?: string }> {
  const payload = await verifyToken(request);
  if (!payload) {
    return { error: "Unauthorized" };
  }

  const user = getAdminUserById(payload.userId as string);

  if (!user) {
    return { error: "User not found" };
  }

  return { user };
}
