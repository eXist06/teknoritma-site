import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emr.cemorion.com";

export default function StructuredData() {
  const pathname = usePathname();
  const { language } = useI18n();

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Teknoritma",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      // Add social media links if available
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@teknoritma.com",
    },
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Teknoritma",
    url: siteUrl,
    inLanguage: language === "en" ? "en-US" : "tr-TR",
    alternateName: language === "en" ? "Teknoritma Health Informatics" : "Teknoritma Sağlık Bilişimi",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Breadcrumb Schema (for non-home pages)
  const getBreadcrumbSchema = () => {
    if (pathname === "/" || pathname === "/en") return null;

    const pathParts = pathname.split("/").filter(Boolean);
    const breadcrumbs = [
      {
        "@type": "ListItem",
        position: 1,
        name: language === "en" ? "Home" : "Ana Sayfa",
        item: siteUrl,
      },
    ];

    let currentPath = "";
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      const name = part
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      breadcrumbs.push({
        "@type": "ListItem",
        position: index + 2,
        name: name,
        item: `${siteUrl}${currentPath}`,
      });
    });

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    };
  };

  const breadcrumbSchema = getBreadcrumbSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
