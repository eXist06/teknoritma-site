import type { Metadata } from "next";
import SarusHISPage from "@/components/SarusHISPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "EMR - Electronic Medical Record | Sarus EMR | Teknoritma",
  description:
    "Sarus EMR is an integrated hospital information system that combines clinical, administrative, and financial operations in a single platform. Web-based EMR solution.",
  keywords: [
    "EMR",
    "EHR",
    "Electronic Medical Record",
    "Electronic Health Record",
    "Hospital Information System",
    "HIS",
    "Hospital Management System",
    "Sarus EMR",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/en/products/sarus-emr",
    languages: {
      tr: "/urunler/sarus",
      en: "/en/products/sarus-emr",
    },
  },
  openGraph: {
    title: "EMR - Electronic Medical Record | Sarus EMR | Teknoritma",
    description:
      "Sarus EMR is an integrated hospital information system that combines clinical, administrative, and financial operations in a single platform.",
    type: "website",
    url: "/en/products/sarus-emr",
    locale: "en_US",
    alternateLocale: "tr_TR",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMR - Electronic Medical Record | Sarus EMR",
    description:
      "Sarus EMR is an integrated hospital information system that combines clinical, administrative, and financial operations in a single platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus EMR",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus EMR is an integrated hospital information system (HIS) that combines clinical, administrative, and financial operations in a single platform. 100% web-based architecture provides flexible, scalable, and centrally manageable structure.",
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
  url: `${SITE_URL}/en/products/sarus-emr`,
};

export default function SarusEmrPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SarusHISPage />
    </>
  );
}










