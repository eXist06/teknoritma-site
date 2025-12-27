import { MetadataRoute } from "next";
import { routeMapping } from "@/lib/route-mapping";
import { SITE_URL } from "@/lib/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: Array<{
    path: string;
    priority: number;
    changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    lastModified?: Date;
  }> = [
    // Turkish routes
    { path: "", priority: 1.0, changefreq: "weekly" },
    { path: "/hakkimizda", priority: 0.8, changefreq: "monthly" },
    { path: "/kariyer", priority: 0.8, changefreq: "weekly" },
    { path: "/kariyer/hikayeler", priority: 0.7, changefreq: "monthly" },
    { path: "/kariyer/hikayeler/5-neden", priority: 0.6, changefreq: "monthly" },
    { path: "/kariyer/hikayeler/kariyer-yolculugu", priority: 0.6, changefreq: "monthly" },
    { path: "/kariyer/hikayeler/yazilim-muhendisi-gunu", priority: 0.6, changefreq: "monthly" },
    { path: "/urunler/sarus", priority: 0.9, changefreq: "monthly" },
    { path: "/urunler/sarus-bulut", priority: 0.9, changefreq: "monthly" },
    { path: "/urunler/sarus-lbs", priority: 0.9, changefreq: "monthly" },
    { path: "/urunler/sarus-pacs", priority: 0.9, changefreq: "monthly" },
    { path: "/urunler/sarus-icp", priority: 0.9, changefreq: "monthly" },
    { path: "/yasal/kvkk", priority: 0.5, changefreq: "yearly" },
    { path: "/yasal/cerez-politikasi", priority: 0.5, changefreq: "yearly" },
    { path: "/yasal/kullanim-sartlari", priority: 0.5, changefreq: "yearly" },
    { path: "/sarus-hub", priority: 0.7, changefreq: "weekly" },
    { path: "/demo-talep", priority: 0.6, changefreq: "monthly" },
    
    // English routes
    { path: "/en", priority: 1.0, changefreq: "weekly" },
    { path: "/en/about", priority: 0.8, changefreq: "monthly" },
    { path: "/en/careers", priority: 0.8, changefreq: "weekly" },
    { path: "/en/careers/stories", priority: 0.7, changefreq: "monthly" },
    { path: "/en/careers/stories/5-reasons", priority: 0.6, changefreq: "monthly" },
    { path: "/en/careers/stories/career-journey", priority: 0.6, changefreq: "monthly" },
    { path: "/en/careers/stories/software-engineer-day", priority: 0.6, changefreq: "monthly" },
    { path: "/en/products/sarus-emr", priority: 0.9, changefreq: "monthly" },
    { path: "/en/products/sarus-emr/sarus", priority: 0.9, changefreq: "monthly" },
    { path: "/en/products/sarus-cloud", priority: 0.9, changefreq: "monthly" },
    { path: "/en/products/sarus-lis", priority: 0.9, changefreq: "monthly" },
    { path: "/en/products/sarus-pacs", priority: 0.9, changefreq: "monthly" },
    { path: "/en/products/sarus-icp", priority: 0.9, changefreq: "monthly" },
    { path: "/en/legal/privacy", priority: 0.5, changefreq: "yearly" },
    { path: "/en/legal/cookie-policy", priority: 0.5, changefreq: "yearly" },
    { path: "/en/legal/terms", priority: 0.5, changefreq: "yearly" },
    { path: "/en/sarus-hub", priority: 0.7, changefreq: "weekly" },
    { path: "/en/request-demo", priority: 0.6, changefreq: "monthly" },
  ];

  // Add dynamic Sarus Hub content from database
  try {
    const { getAllItems } = await import("@/lib/db/sarus-hub");
    const { initializeDatabase } = await import("@/lib/db/schema");
    initializeDatabase();
    
    // Get only published items
    const sarusHubItems = getAllItems({}, false);
    
    // Add Sarus Hub items to sitemap
    for (const item of sarusHubItems) {
      const lastModified = item.updatedAt || item.publishedAt || item.createdAt;
      const lastModifiedDate = lastModified ? new Date(lastModified) : new Date();
      
      // Determine priority based on featured status
      const priority = item.featured ? 0.8 : 0.6;
      
      // Turkish version (if language is tr or mixed)
      if (item.language === "tr" || item.language === "mixed") {
        routes.push({
          path: `/sarus-hub/${item.slug}`,
          priority,
          changefreq: "monthly",
          lastModified: lastModifiedDate,
        });
      }
      
      // English version (if language is en or mixed)
      if (item.language === "en" || item.language === "mixed") {
        routes.push({
          path: `/en/sarus-hub/${item.slug}`,
          priority,
          changefreq: "monthly",
          lastModified: lastModifiedDate,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching Sarus Hub items for sitemap:", error);
    // Continue without dynamic content if database error occurs
  }

  return routes.map((route) => {
    // For Sarus Hub detail pages, use general hub pages for hreflang
    let alternates: { tr?: string; en?: string };
    
    if (route.path.startsWith("/sarus-hub/") && route.path !== "/sarus-hub") {
      // TR detail page -> link to general EN hub
      alternates = {
        tr: `${SITE_URL}${route.path}`,
        en: `${SITE_URL}/en/sarus-hub`,
      };
    } else if (route.path.startsWith("/en/sarus-hub/") && route.path !== "/en/sarus-hub") {
      // EN detail page -> link to general TR hub
      alternates = {
        en: `${SITE_URL}${route.path}`,
        tr: `${SITE_URL}/sarus-hub`,
      };
    } else {
      // Other routes use route mapping
      alternates = route.path.startsWith("/en")
        ? {
            tr: `${SITE_URL}${routeMapping[route.path] || route.path.replace("/en", "")}`,
            en: `${SITE_URL}${route.path}`,
          }
        : {
            tr: `${SITE_URL}${route.path}`,
            en: `${SITE_URL}${routeMapping[route.path] || `/en${route.path}`}`,
          };
    }
    
    return {
      url: `${SITE_URL}${route.path}`,
      lastModified: route.lastModified || new Date(),
      changeFrequency: route.changefreq as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
      priority: route.priority,
      alternates: {
        languages: alternates,
      },
    };
  });
}
