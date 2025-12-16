import type { Metadata } from "next";
import SarusLbsPage from "@/components/SarusLbsPage";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teknoritma.com.tr";

export const metadata: Metadata = {
  title: "Sarus LIS - Laboratory Information System",
  description:
    "Sarus LIS is a comprehensive laboratory information system solution for laboratories. Reliable platform for test management, result reporting, and quality control.",
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
    title: "Sarus LIS - Laboratory Information System | Teknoritma",
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
    title: "Sarus LIS - Laboratory Information System",
    description:
      "Sarus LIS is a comprehensive laboratory information system solution for laboratories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SarusLisPageRoute() {
  return <SarusLbsPage />;
}






