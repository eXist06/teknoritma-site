import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
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
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
