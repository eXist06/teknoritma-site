import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin sayfalarını koru (login, first-login ve change-password hariç)
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/en/admin")) &&
    !pathname.includes("/login") &&
    !pathname.includes("/first-login") &&
    !pathname.includes("/change-password") &&
    !pathname.includes("/reset-password")
  ) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      if (pathname.startsWith("/en/admin")) {
        url.pathname = "/en/admin/login";
      } else {
        url.pathname = "/admin/login";
      }
      return NextResponse.redirect(url);
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      
      // Role check for Sarus-HUB will be done in API routes
      // Middleware only checks token validity
      
      return NextResponse.next();
    } catch {
      const url = request.nextUrl.clone();
      if (pathname.startsWith("/en/admin")) {
        url.pathname = "/en/admin/login";
      } else {
        url.pathname = "/admin/login";
      }
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/en/admin/:path*"],
};

