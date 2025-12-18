import type { Metadata } from "next";
import SarusCloudPage from "@/components/SarusCloudPage";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Sarus Cloud - Cloud-Based Hospital Information System",
  description:
    "Sarus Cloud is a cloud-based hospital information system solution. Modern hospital management with low cost, high security, and scalability.",
  keywords: [
    "cloud-based HIS",
    "cloud hospital information system",
    "Sarus Cloud",
    "cloud HIS",
    "SaaS hospital system",
    "cloud healthcare IT",
    "Teknoritma",
  ],
  alternates: {
    canonical: "/en/products/sarus-cloud",
    languages: {
      tr: "/urunler/sarus-bulut",
      en: "/en/products/sarus-cloud",
    },
  },
  openGraph: {
    title: "Sarus Cloud - Cloud-Based Hospital Information System | Teknoritma",
    description:
      "Sarus Cloud is a cloud-based hospital information system solution. Modern hospital management with low cost, high security, and scalability.",
    type: "website",
    url: "/en/products/sarus-cloud",
    locale: "en_US",
    alternateLocale: "tr_TR",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarus Cloud - Cloud-Based Hospital Information System",
    description:
      "Sarus Cloud is a cloud-based hospital information system solution. Modern hospital management with low cost, high security, and scalability.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SarusCloudPageRoute() {
  return <SarusCloudPage />;
}






