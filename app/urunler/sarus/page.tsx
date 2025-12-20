import type { Metadata } from "next";
import SarusHISPage from "@/components/SarusHISPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "HBYS - Hastane Bilgi Sistemi | Sarus HBS | Teknoritma",
  description:
    "Sarus HBS, hastanelerin klinik, idari ve finansal operasyonlarını tek bir entegre platform altında birleştiren HBYS çözümüdür. Web tabanlı hastane bilgi sistemi.",
  keywords: [
    "HBYS",
    "Hastane Bilgi Sistemi",
    "Hastane Bilgi Yönetim Sistemi",
    "HBS",
    "Web tabanlı HBYS",
    "Sarus HBS",
    "hastane yönetim sistemi",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/urunler/sarus",
    languages: {
      tr: "/urunler/sarus",
      en: "/en/products/sarus-emr",
    },
  },
  openGraph: {
    title: "HBYS - Hastane Bilgi Sistemi | Sarus HBS | Teknoritma",
    description:
      "Sarus HBS, hastanelerin klinik, idari ve finansal operasyonlarını tek bir entegre platform altında birleştiren HBYS çözümüdür.",
    type: "website",
    url: "/urunler/sarus",
    locale: "tr_TR",
    alternateLocale: "en_US",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "HBYS - Hastane Bilgi Sistemi | Sarus HBS",
    description:
      "Sarus HBS, hastanelerin klinik, idari ve finansal operasyonlarını tek bir entegre platform altında birleştiren HBYS çözümüdür.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Sarus HBS",
  applicationCategory: "HealthcareApplication",
  operatingSystem: "Web",
  description:
    "Sarus HBS, hastanelerin klinik, idari ve finansal operasyonlarını tek bir entegre platform altında birleştiren HBYS (Hastane Bilgi Sistemi) çözümüdür. %100 web tabanlı mimari ile esnek, ölçeklenebilir ve merkezi olarak yönetilebilir bir yapı sunar.",
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
  url: `${SITE_URL}/urunler/sarus`,
};

export default function SarusPage() {
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

