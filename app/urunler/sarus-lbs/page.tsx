import type { Metadata } from "next";
import SarusLbsPage from "@/components/SarusLbsPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teknoritma.com.tr";

export const metadata: Metadata = {
  title: "Sarus LBS - Laboratuvar Bilgi Sistemi",
  description:
    "Sarus LBS, laboratuvarlar için kapsamlı bir laboratuvar bilgi sistemi çözümüdür. Test yönetimi, sonuç raporlama ve kalite kontrolü için güvenilir platform.",
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
    title: "Sarus LBS - Laboratuvar Bilgi Sistemi | Teknoritma",
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
    title: "Sarus LBS - Laboratuvar Bilgi Sistemi",
    description:
      "Sarus LBS, laboratuvarlar için kapsamlı bir laboratuvar bilgi sistemi çözümüdür.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SarusLbsPageRoute() {
  return <SarusLbsPage />;
}






