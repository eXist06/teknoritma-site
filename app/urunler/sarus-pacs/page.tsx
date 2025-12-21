import type { Metadata } from "next";
import SarusPacsPageComponent from "@/components/SarusPacsPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "PACS – Görüntü Arşivleme ve İletişim Sistemi | Sarus PACS | Teknoritma",
  description:
    "PACS (Görüntü Arşivleme ve İletişim Sistemi) çözümü olan Sarus PACS, DICOM uyumlu görüntü yönetimi ve teleradyoloji özellikleri sunar. DICOM PACS sistemi.",
  keywords: [
    "PACS",
    "Görüntü Arşivleme ve İletişim Sistemi",
    "DICOM PACS",
    "teleradyoloji",
    "medikal görüntüleme",
    "Sarus PACS",
    "radyal görüntüleme sistemi",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/urunler/sarus-pacs",
    languages: {
      tr: "/urunler/sarus-pacs",
      en: "/en/products/sarus-pacs",
    },
  },
  openGraph: {
    title: "PACS – Görüntü Arşivleme ve İletişim Sistemi | Sarus PACS | Teknoritma",
    description:
      "PACS (Görüntü Arşivleme ve İletişim Sistemi) çözümü olan Sarus PACS, DICOM uyumlu görüntü yönetimi ve teleradyoloji özellikleri sunar.",
    type: "website",
    url: "/urunler/sarus-pacs",
    locale: "tr_TR",
    alternateLocale: "en_US",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "PACS – Görüntü Arşivleme ve İletişim Sistemi | Sarus PACS",
    description:
      "PACS (Görüntü Arşivleme ve İletişim Sistemi) çözümü olan Sarus PACS, DICOM uyumlu görüntü yönetimi ve teleradyoloji özellikleri sunar.",
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
    "Sarus PACS, PACS (Görüntü Arşivleme ve İletişim Sistemi) çözümüdür. DICOM uyumlu görüntü yönetimi, teleradyoloji ve medikal görüntüleme özellikleri sunar.",
  offers: {
    "@type": "Offer",
    category: "Enterprise Software",
    priceCurrency: "TRY",
  },
  provider: {
    "@type": "Organization",
    name: "Teknoritma",
    url: SITE_URL,
  },
  inLanguage: "tr-TR",
  url: `${SITE_URL}/urunler/sarus-pacs`,
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





