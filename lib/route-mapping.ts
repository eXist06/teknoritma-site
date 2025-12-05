// Route mapping between Turkish and English versions
export const routeMapping: Record<string, string> = {
  // Turkish to English
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
  
  // English to Turkish
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

/**
 * Get the equivalent route in the target language
 */
export function getRouteInLanguage(path: string, targetLang: "tr" | "en"): string {
  // Normalize path
  let normalizedPath = path;
  
  // Remove /en prefix if exists
  if (normalizedPath.startsWith("/en")) {
    normalizedPath = normalizedPath.replace(/^\/en/, "") || "/";
  }
  
  // Handle root path
  if (normalizedPath === "/") {
    return targetLang === "en" ? "/en" : "/";
  }
  
  // Handle dynamic routes (e.g., /kariyer/[id], /sarus-hub/[slug])
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
  
  // Handle /en/sarus-hub/[slug] -> /sarus-hub/[slug]
  if (normalizedPath.startsWith("/sarus-hub/") && pathParts.length === 2) {
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
    // Turkish to English
    if (routeMapping[normalizedPath]) {
      return routeMapping[normalizedPath];
    }
    // If no mapping, add /en prefix
    return `/en${normalizedPath}`;
  } else {
    // English to Turkish
    const enPath = `/en${normalizedPath}`;
    if (routeMapping[enPath]) {
      return routeMapping[enPath];
    }
    // If no mapping, remove /en prefix
    return normalizedPath;
  }
}


