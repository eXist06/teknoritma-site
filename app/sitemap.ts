import { MetadataRoute } from "next";
import { routeMapping } from "@/lib/route-mapping";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teknoritma.com.tr";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
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

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq as "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
    priority: route.priority,
    alternates: {
      languages: route.path.startsWith("/en")
        ? {
            tr: `${siteUrl}${routeMapping[route.path] || route.path.replace("/en", "")}`,
            en: `${siteUrl}${route.path}`,
          }
        : {
            tr: `${siteUrl}${route.path}`,
            en: `${siteUrl}${routeMapping[route.path] || `/en${route.path}`}`,
          },
    },
  }));
}
