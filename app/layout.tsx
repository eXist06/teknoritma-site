import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { LanguageAwareHtml } from "@/components/LanguageAwareHtml";
import CookieConsent from "@/components/CookieConsent";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://emr.cemorion.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Teknoritma - Sağlık Bilişim Çözümleri",
  description:
    "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri. Türkiye'nin ilk %100 web tabanlı hastane bilgi sistemi Sarus.",
  keywords: [
    "hastane bilgi sistemi",
    "HIS",
    "PACS",
    "LIS",
    "sağlık bilişimi",
    "Sarus",
    "Teknoritma",
  ],
  authors: [{ name: "Teknoritma" }],
  alternates: {
    canonical: "/",
    languages: {
      "tr": "/",
      "en": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Teknoritma - Sağlık Bilişim Çözümleri",
    description:
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri.",
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    url: "/",
    siteName: "Teknoritma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknoritma - Sağlık Bilişim Çözümleri",
    description:
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <LanguageAwareHtml>
            <Header />
            {children}
            <Footer />
            <CookieConsent />
          </LanguageAwareHtml>
        </Providers>
      </body>
    </html>
  );
}

