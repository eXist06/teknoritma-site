import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { verifySarusHubRole, verifyAdminRole, verifyIKOrAdminRole } from "./role-verification";

export async function checkAdminAuth(): Promise<{ authorized: boolean; role?: string; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    return { authorized: false, error: "No token" };
  }

  const headers = new Headers();
  headers.set("cookie", `admin_token=${token}`);
  const mockRequest = new NextRequest("http://localhost/api/admin/auth/me", {
    headers,
  });

  try {
    const authCheck = await verifyAdminRole(mockRequest);
    if (authCheck.isAuthorized) {
      return { authorized: true, role: "admin" };
    }
  } catch {}

  return { authorized: false, error: "Unauthorized" };
}

export async function checkSarusHubAuth(): Promise<{ authorized: boolean; role?: string; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    return { authorized: false, error: "No token" };
  }

  const headers = new Headers();
  headers.set("cookie", `admin_token=${token}`);
  const mockRequest = new NextRequest("http://localhost/api/admin/auth/me", {
    headers,
  });

  try {
    const authCheck = await verifySarusHubRole(mockRequest);
    if (authCheck.isAuthorized) {
      return { authorized: true, role: authCheck.user?.role };
    }
  } catch {}

  return { authorized: false, error: "Unauthorized" };
}

export async function checkIKOrAdminAuth(): Promise<{ authorized: boolean; role?: string; error?: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  
  if (!token) {
    return { authorized: false, error: "No token" };
  }

  const headers = new Headers();
  headers.set("cookie", `admin_token=${token}`);
  const mockRequest = new NextRequest("http://localhost/api/admin/auth/me", {
    headers,
  });

  try {
    const authCheck = await verifyIKOrAdminRole(mockRequest);
    if (authCheck.authorized) {
      return { authorized: true, role: authCheck.user?.role };
    }
  } catch {}

  return { authorized: false, error: "Unauthorized" };
}

