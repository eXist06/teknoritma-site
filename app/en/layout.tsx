import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Teknoritma",
    default: "Teknoritma - Health Informatics Solutions",
  },
  description:
    "End-to-end health informatics solutions for medium and large-scale hospitals. Sarus, Turkey's first 100% web-based hospital information system.",
  keywords: [
    "hospital information system",
    "HIS",
    "PACS",
    "LIS",
    "health informatics",
    "Sarus",
    "Teknoritma",
    "EMR",
    "electronic medical records",
    "healthcare IT",
  ],
  authors: [{ name: "Teknoritma" }],
  creator: "Teknoritma",
  publisher: "Teknoritma",
  alternates: {
    canonical: "/en",
    languages: {
      "tr": "/",
      "en": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Teknoritma - Health Informatics Solutions",
    description:
      "End-to-end health informatics solutions for medium and large-scale hospitals. Sarus, Turkey's first 100% web-based hospital information system.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR"],
    url: "/en",
    siteName: "Teknoritma",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Teknoritma Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknoritma - Health Informatics Solutions",
    description:
      "End-to-end health informatics solutions for medium and large-scale hospitals.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

