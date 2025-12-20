import type { Metadata } from "next";
import SarusCloudPage from "@/components/SarusCloudPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Cloud EMR - Cloud-Based Hospital Information System | Sarus Cloud | Teknoritma",
  description:
    "Sarus Cloud is a cloud-based hospital information system solution. Cloud EMR with low cost, high security, and scalability for modern hospital management. SaaS EMR.",
  keywords: [
    "cloud-based HIS",
    "cloud hospital information system",
    "Sarus Cloud",
    "cloud HIS",
    "SaaS hospital system",
    "cloud healthcare IT",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/en/products/sarus-cloud",
    languages: {
      tr: "/urunler/sarus-bulut",
      en: "/en/products/sarus-cloud",
    },
  },
  openGraph: {
    title: "Cloud EMR - Cloud-Based Hospital Information System | Sarus Cloud | Teknoritma",
    description:
      "Sarus Cloud is a cloud-based hospital information system solution. Modern hospital management with low cost, high security, and scalability.",
    type: "website",
    url: "/en/products/sarus-cloud",
    locale: "en_US",
    alternateLocale: "tr_TR",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud EMR - Cloud-Based Hospital Information System | Sarus Cloud",
    description:
      "Sarus Cloud is a cloud-based hospital information system solution. Modern hospital management with low cost, high security, and scalability.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus Cloud",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus Cloud is a cloud-based hospital information system (HIS) solution. Modern hospital management with low cost, high security, and scalability. SaaS EMR platform.",
  offers: {
    "@type": "Offer",
    category: "Enterprise Software",
    priceCurrency: "USD",
  },
  provider: {
    "@type": "Organization",
    name: "Teknoritma",
    url: SITE_URL,
  },
  inLanguage: "en-US",
  url: `${SITE_URL}/en/products/sarus-cloud`,
};

export default function SarusCloudPageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SarusCloudPage />
    </>
  );
}






