import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { LanguageAwareHtml } from "@/components/LanguageAwareHtml";
import CookieConsent from "@/components/CookieConsent";
import { SITE_URL, SITE_LOGO } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Teknoritma",
    default: "Teknoritma - Sağlık Bilişim Çözümleri",
  },
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
    "hospital information system",
    "healthcare IT",
    "EMR",
    "electronic medical records",
  ],
  authors: [{ name: "Teknoritma" }],
  creator: "Teknoritma",
  publisher: "Teknoritma",
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
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri. Türkiye'nin ilk %100 web tabanlı hastane bilgi sistemi Sarus.",
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    url: "/",
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
    title: "Teknoritma - Sağlık Bilişim Çözümleri",
    description:
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri.",
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
  verification: {
    // Add verification codes if available
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Teknoritma",
    url: SITE_URL,
    logo: SITE_LOGO,
    description:
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri sunan teknoloji şirketi.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@teknoritma.com.tr",
    },
    sameAs: [
      // Add social media links if available
    ],
  };

  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
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

