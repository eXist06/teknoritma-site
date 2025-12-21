import type { Metadata } from "next";
import SarusCloudPage from "@/components/SarusCloudPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Bulut HBYS – Bulut Tabanlı Hastane Bilgi Sistemi | Sarus Bulut | Teknoritma",
  description:
    "Bulut HBYS çözümü olan Sarus Bulut, bulut tabanlı hastane bilgi sistemi ile düşük maliyet, yüksek güvenlik ve ölçeklenebilirlik sunar. SaaS hastane sistemi.",
  keywords: [
    "bulut tabanlı HIS",
    "cloud hospital information system",
    "Sarus Bulut",
    "cloud HIS",
    "SaaS hastane sistemi",
    "bulut sağlık bilişimi",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/urunler/sarus-bulut",
    languages: {
      tr: "/urunler/sarus-bulut",
      en: "/en/products/sarus-cloud",
    },
  },
  openGraph: {
    title: "Bulut HBYS – Bulut Tabanlı Hastane Bilgi Sistemi | Sarus Bulut | Teknoritma",
    description:
      "Sarus Bulut, bulut tabanlı hastane bilgi sistemi çözümüdür. Düşük maliyet, yüksek güvenlik ve ölçeklenebilirlik ile modern hastane yönetimi.",
    type: "website",
    url: "/urunler/sarus-bulut",
    locale: "tr_TR",
    alternateLocale: "en_US",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulut HBYS – Bulut Tabanlı Hastane Bilgi Sistemi | Sarus Bulut",
    description:
      "Sarus Bulut, bulut tabanlı hastane bilgi sistemi çözümüdür. Düşük maliyet, yüksek güvenlik ve ölçeklenebilirlik ile modern hastane yönetimi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus Bulut",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus Bulut, bulut tabanlı hastane bilgi sistemi (HBYS) çözümüdür. Düşük maliyet, yüksek güvenlik ve ölçeklenebilirlik ile modern hastane yönetimi sağlar. SaaS hastane sistemi.",
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
  url: `${SITE_URL}/urunler/sarus-bulut`,
};

export default function SarusBulutPage() {
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






