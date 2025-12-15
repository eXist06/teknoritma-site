import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emr.cemorion.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Teknoritma - Health Informatics Solutions",
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
  ],
  authors: [{ name: "Teknoritma" }],
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
      "End-to-end health informatics solutions for medium and large-scale hospitals.",
    type: "website",
    locale: "en_US",
    alternateLocale: "tr_TR",
    url: "/en",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknoritma - Health Informatics Solutions",
    description:
      "End-to-end health informatics solutions for medium and large-scale hospitals.",
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

