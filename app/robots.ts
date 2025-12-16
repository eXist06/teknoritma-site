import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teknoritma.com.tr";
const isProduction = process.env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: isProduction ? "/" : "/",
        disallow: isProduction
          ? [
              "/api/",
              "/admin/",
              "/en/admin/",
              "/_next/",
              "/logs/",
            ]
          : [
              "/api/",
              "/admin/",
              "/en/admin/",
              "/_next/",
              "/logs/",
            ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
