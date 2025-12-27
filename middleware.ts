import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "teknoritma-secret-key-change-in-production";
const isProd = process.env.NODE_ENV === "production";

// Route mapping for language switching (inline version for middleware)
const routeMapping: Record<string, string> = {
  "/hakkimizda": "/en/about",
  "/kariyer": "/en/careers",
  "/urunler/sarus": "/en/products/sarus",
  "/urunler/sarus-bulut": "/en/products/sarus-cloud",
  "/urunler/sarus-icp": "/en/products/sarus-icp",
  "/urunler/sarus-lbs": "/en/products/sarus-lis",
  "/urunler/sarus-pacs": "/en/products/sarus-pacs",
  "/yasal/kvkk": "/en/legal/privacy",
  "/yasal/cerez-politikasi": "/en/legal/cookie-policy",
  "/yasal/kullanim-sartlari": "/en/legal/terms",
  "/sarus-hub": "/en/sarus-hub",
  "/demo-talep": "/en/request-demo",
  "/kariyer/hikayeler": "/en/careers/stories",
  "/en/about": "/hakkimizda",
  "/en/careers": "/kariyer",
  "/en/products/sarus": "/urunler/sarus",
  "/en/products/sarus-cloud": "/urunler/sarus-bulut",
  "/en/products/sarus-icp": "/urunler/sarus-icp",
  "/en/products/sarus-lis": "/urunler/sarus-lbs",
  "/en/products/sarus-pacs": "/urunler/sarus-pacs",
  "/en/legal/privacy": "/yasal/kvkk",
  "/en/legal/cookie-policy": "/yasal/cerez-politikasi",
  "/en/legal/terms": "/yasal/kullanim-sartlari",
  "/en/sarus-hub": "/sarus-hub",
  "/en/request-demo": "/demo-talep",
  "/en/careers/stories": "/kariyer/hikayeler",
};

function getRouteInLanguage(path: string, targetLang: "tr" | "en"): string {
  let normalizedPath = path;
  
  if (normalizedPath.startsWith("/en")) {
    normalizedPath = normalizedPath.replace(/^\/en/, "") || "/";
  }
  
  if (normalizedPath === "/") {
    return targetLang === "en" ? "/en" : "/";
  }
  
  const pathParts = normalizedPath.split("/").filter(Boolean);
  
  // Handle /kariyer/[id] -> /en/careers/[id]
  if (pathParts[0] === "kariyer" && pathParts.length === 2 && pathParts[1] !== "hikayeler") {
    return targetLang === "en" 
      ? `/en/careers/${pathParts[1]}`
      : `/kariyer/${pathParts[1]}`;
  }
  
  // Handle /en/careers/[id] -> /kariyer/[id]
  if (normalizedPath.startsWith("/careers/") && pathParts.length === 2 && pathParts[1] !== "stories") {
    return targetLang === "en"
      ? `/en/careers/${pathParts[1]}`
      : `/kariyer/${pathParts[1]}`;
  }
  
  // Handle /sarus-hub/[slug] -> /en/sarus-hub/[slug]
  if (pathParts[0] === "sarus-hub" && pathParts.length === 2) {
    return targetLang === "en"
      ? `/en/sarus-hub/${pathParts[1]}`
      : `/sarus-hub/${pathParts[1]}`;
  }
  
  // Handle story routes
  if (pathParts[0] === "kariyer" && pathParts[1] === "hikayeler") {
    const storyPath = pathParts.slice(2).join("/");
    if (targetLang === "en") {
      return storyPath ? `/en/careers/stories/${storyPath}` : "/en/careers/stories";
    } else {
      return storyPath ? `/kariyer/hikayeler/${storyPath}` : "/kariyer/hikayeler";
    }
  }
  
  if (pathParts[0] === "careers" && pathParts[1] === "stories") {
    const storyPath = pathParts.slice(2).join("/");
    if (targetLang === "en") {
      return storyPath ? `/en/careers/stories/${storyPath}` : "/en/careers/stories";
    } else {
      return storyPath ? `/kariyer/hikayeler/${storyPath}` : "/kariyer/hikayeler";
    }
  }
  
  // Check direct mapping
  if (targetLang === "en") {
    if (routeMapping[normalizedPath]) {
      return routeMapping[normalizedPath];
    }
    return `/en${normalizedPath}`;
  } else {
    const enPath = `/en${normalizedPath}`;
    if (routeMapping[enPath]) {
      return routeMapping[enPath];
    }
    return normalizedPath;
  }
}

function detectPreferredLanguage(request: NextRequest): "tr" | "en" {
  // Check cookie first
  const langCookie = request.cookies.get("lang_preference")?.value;
  if (langCookie === "tr" || langCookie === "en") {
    return langCookie as "tr" | "en";
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const languages = acceptLanguage.split(",").map(lang => {
      const langCode = lang.split(";")[0].trim().toLowerCase();
      return langCode;
    });
    
    // Check if Turkish is preferred
    const hasTurkish = languages.some(lang => lang.startsWith("tr"));
    if (hasTurkish) {
      return "tr";
    }
    
    // If not Turkish, default to English (for all other languages)
    return "en";
  }

  // Default to English if no preference detected (non-Turkish users)
  return "en";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Bot istisnası: Botlar için redirect yapma, doğrudan erişime izin ver
  const ua = request.headers.get("user-agent")?.toLowerCase() || "";
  const isBot = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|twitterbot|linkedinbot|duckduckbot|yandex|baiduspider|googlebot|msnbot|ia_archiver/.test(ua);
  
  if (isBot) {
    return NextResponse.next();
  }

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/robots.txt")
  ) {
    return NextResponse.next();
  }

  // Admin sayfalarını koru (login, first-login ve change-password hariç)
  // Admin sayfaları için dil yönlendirmesi yapma
  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/en/admin")) &&
    !pathname.includes("/login") &&
    !pathname.includes("/first-login") &&
    !pathname.includes("/change-password") &&
    !pathname.includes("/reset-password")
  ) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
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
      if (pathname.startsWith("/en/admin")) {
        url.pathname = "/en/admin/login";
      } else {
        url.pathname = "/admin/login";
      }
      return NextResponse.redirect(url);
    }
  }

  // SEO-friendly URL handling: Never redirect direct URLs
  // Only redirect root path (/) based on language preference
  // This allows search engines to index both language versions properly
  if (pathname === "/") {
    const preferredLang = detectPreferredLanguage(request);
    const response = NextResponse.next();
    
    // Set cookie based on pathname language, not preferred language
    // This ensures direct URLs are not redirected
    if (!request.cookies.get("lang_preference")) {
      response.cookies.set("lang_preference", preferredLang, { 
        maxAge: 365 * 24 * 60 * 60,
        sameSite: "lax",
        path: "/",
        secure: isProd
      });
    }
    
    // Only redirect root to /en if preferred language is English AND no cookie exists
    // If cookie exists, respect it but don't redirect (user explicitly chose a language)
    const langCookie = request.cookies.get("lang_preference")?.value;
    if (preferredLang === "en" && !langCookie) {
      url.pathname = "/en";
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.set("lang_preference", "en", { 
        maxAge: 365 * 24 * 60 * 60,
        sameSite: "lax",
        path: "/",
        secure: isProd
      });
      return redirectResponse;
    }
    
    return response;
  }
  
  if (pathname === "/en") {
    const preferredLang = detectPreferredLanguage(request);
    const response = NextResponse.next();
    
    if (!request.cookies.get("lang_preference")) {
      response.cookies.set("lang_preference", "en", { 
        maxAge: 365 * 24 * 60 * 60,
        sameSite: "lax",
        path: "/",
        secure: isProd
      });
    }
    
    // Only redirect /en to / if preferred language is Turkish AND no cookie exists
    const langCookie = request.cookies.get("lang_preference")?.value;
    if (preferredLang === "tr" && !langCookie) {
      url.pathname = "/";
      const redirectResponse = NextResponse.redirect(url);
      redirectResponse.cookies.set("lang_preference", "tr", { 
        maxAge: 365 * 24 * 60 * 60,
        sameSite: "lax",
        path: "/",
        secure: isProd
      });
      return redirectResponse;
    }
    
    return response;
  }
  
  // For all other paths (including /urunler/sarus-bulut), NEVER redirect
  // Just set cookie based on pathname language to preserve SEO-friendly URLs
  const response = NextResponse.next();
  const pathLang = pathname.startsWith("/en") ? "en" : "tr";
  const currentCookie = request.cookies.get("lang_preference")?.value;
  
  // Set x-lang header for server-side lang attribute in root layout
  response.headers.set("x-lang", pathLang);
  
  // Only update cookie if it's different or doesn't exist to prevent unnecessary cookie updates
  if (currentCookie !== pathLang) {
    response.cookies.set("lang_preference", pathLang, { 
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "lax",
      path: "/",
      secure: isProd
    });
  }
  
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/en/admin/:path*",
    "/",
    "/hakkimizda",
    "/kariyer/:path*",
    "/urunler/:path*",
    "/yasal/:path*",
    "/sarus-hub/:path*",
    "/demo-talep",
    "/en/about",
    "/en/careers/:path*",
    "/en/products/:path*",
    "/en/legal/:path*",
    "/en/sarus-hub/:path*",
    "/en/request-demo",
  ],
};

