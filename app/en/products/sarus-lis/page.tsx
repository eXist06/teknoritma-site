import type { Metadata } from "next";
import SarusLbsPage from "@/components/SarusLbsPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "LIS - Laboratory Information System | Sarus LIS | Teknoritma",
  description:
    "Sarus LIS is a Laboratory Information System (LIS) solution for laboratories. Comprehensive test management, result reporting, and quality control platform. LIMS software.",
  keywords: [
    "laboratory information system",
    "LIS",
    "LBS",
    "laboratory management system",
    "Sarus LIS",
    "Teknoritma",
    "healthcare IT",
  ],
  alternates: {
    canonical: "/en/products/sarus-lis",
    languages: {
      tr: "/urunler/sarus-lbs",
      en: "/en/products/sarus-lis",
    },
  },
  openGraph: {
    title: "LIS - Laboratory Information System | Sarus LIS | Teknoritma",
    description:
      "Sarus LIS is a comprehensive laboratory information system solution for laboratories. Reliable platform for test management, result reporting, and quality control.",
    type: "website",
    url: "/en/products/sarus-lis",
    locale: "en_US",
    alternateLocale: "tr_TR",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "LIS - Laboratory Information System | Sarus LIS",
    description:
      "Sarus LIS is a comprehensive laboratory information system solution for laboratories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus LIS",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus LIS is a Laboratory Information System (LIS) solution for laboratories. Reliable platform for comprehensive test management, result reporting, and quality control. Clinical laboratory software.",
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
  url: `${SITE_URL}/en/products/sarus-lis`,
};

export default function SarusLisPageRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SarusLbsPage />
    </>
  );
}






