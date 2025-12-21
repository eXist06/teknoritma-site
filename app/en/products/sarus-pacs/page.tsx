import type { Metadata } from "next";
import SarusPacsPageComponent from "@/components/SarusPacsPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "PACS System – Picture Archiving and Communication System | Sarus PACS | Teknoritma",
  description:
    "Sarus PACS is a PACS (Picture Archiving and Communication System) solution with DICOM-compliant image management and teleradiology features. Medical imaging system.",
  keywords: [
    "PACS system",
    "Picture Archiving and Communication System",
    "DICOM PACS",
    "teleradiology",
    "medical imaging system",
    "Sarus PACS",
    "radial imaging",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/en/products/sarus-pacs",
    languages: {
      tr: "/urunler/sarus-pacs",
      en: "/en/products/sarus-pacs",
    },
  },
  openGraph: {
    title: "PACS System – Picture Archiving and Communication System | Sarus PACS | Teknoritma",
    description:
      "Sarus PACS is a PACS (Picture Archiving and Communication System) solution with DICOM-compliant image management and teleradiology features.",
    type: "website",
    url: "/en/products/sarus-pacs",
    locale: "en_US",
    alternateLocale: "tr_TR",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "PACS System – Picture Archiving and Communication System | Sarus PACS",
    description:
      "Sarus PACS is a PACS (Picture Archiving and Communication System) solution with DICOM-compliant image management and teleradiology features.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus PACS",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus PACS is a PACS (Picture Archiving and Communication System) solution with DICOM-compliant image management, teleradiology, and medical imaging features.",
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
  url: `${SITE_URL}/en/products/sarus-pacs`,
};

export default function SarusPacsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SarusPacsPageComponent />
    </>
  );
}





