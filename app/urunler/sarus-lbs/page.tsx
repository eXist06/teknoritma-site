import type { Metadata } from "next";
import SarusLbsPage from "@/components/SarusLbsPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "LBS – Laboratuvar Bilgi Sistemi | Sarus LBS | Teknoritma",
  description:
    "LBS (Laboratuvar Bilgi Sistemi) çözümü olan Sarus LBS, laboratuvarlar için kapsamlı test yönetimi, sonuç raporlama ve kalite kontrolü sağlar. Laboratuvar otomasyon sistemi.",
  keywords: [
    "laboratuvar bilgi sistemi",
    "LBS",
    "LIS",
    "laboratory information system",
    "laboratuvar yönetim sistemi",
    "Sarus LBS",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/urunler/sarus-lbs",
    languages: {
      tr: "/urunler/sarus-lbs",
      en: "/en/products/sarus-lis",
    },
  },
  openGraph: {
    title: "LBS – Laboratuvar Bilgi Sistemi | Sarus LBS | Teknoritma",
    description:
      "Sarus LBS, laboratuvarlar için kapsamlı bir laboratuvar bilgi sistemi çözümüdür. Test yönetimi, sonuç raporlama ve kalite kontrolü için güvenilir platform.",
    type: "website",
    url: "/urunler/sarus-lbs",
    locale: "tr_TR",
    alternateLocale: "en_US",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "LBS – Laboratuvar Bilgi Sistemi | Sarus LBS",
    description:
      "Sarus LBS, laboratuvarlar için kapsamlı bir laboratuvar bilgi sistemi çözümüdür.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus LBS",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus LBS, LBS (Laboratuvar Bilgi Sistemi) çözümüdür. Laboratuvarlar için kapsamlı test yönetimi, sonuç raporlama ve kalite kontrolü için güvenilir platform. Laboratuvar otomasyon sistemi.",
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
  url: `${SITE_URL}/urunler/sarus-lbs`,
};

export default function SarusLbsPageRoute() {
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






