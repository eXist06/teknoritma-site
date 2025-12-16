import type { Metadata } from "next";
import SarusCloudPage from "@/components/SarusCloudPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teknoritma.com.tr";

export const metadata: Metadata = {
  title: "Sarus Bulut - Bulut Tabanlı Hastane Bilgi Sistemi",
  description:
    "Sarus Bulut, bulut tabanlı hastane bilgi sistemi çözümüdür. Düşük maliyet, yüksek güvenlik ve ölçeklenebilirlik ile modern hastane yönetimi.",
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
    title: "Sarus Bulut - Bulut Tabanlı Hastane Bilgi Sistemi | Teknoritma",
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
    title: "Sarus Bulut - Bulut Tabanlı Hastane Bilgi Sistemi",
    description:
      "Sarus Bulut, bulut tabanlı hastane bilgi sistemi çözümüdür. Düşük maliyet, yüksek güvenlik ve ölçeklenebilirlik ile modern hastane yönetimi.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SarusBulutPage() {
  return <SarusCloudPage />;
}






