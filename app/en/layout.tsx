import type { Metadata } from "next";

export const metadata: Metadata = {
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
  openGraph: {
    title: "Teknoritma - Health Informatics Solutions",
    description:
      "End-to-end health informatics solutions for medium and large-scale hospitals.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknoritma - Health Informatics Solutions",
    description:
      "End-to-end health informatics solutions for medium and large-scale hospitals.",
  },
};

export default function EnLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}

