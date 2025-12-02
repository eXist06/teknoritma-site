import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
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
  openGraph: {
    title: "Teknoritma - Sağlık Bilişim Çözümleri",
    description:
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri.",
    type: "website",
    locale: "tr_TR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teknoritma - Sağlık Bilişim Çözümleri",
    description:
      "Orta ve büyük ölçekli hastaneler için uçtan uca sağlık bilişim çözümleri.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

