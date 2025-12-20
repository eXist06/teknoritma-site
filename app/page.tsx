import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import EnterpriseExperienceSection from "@/components/EnterpriseExperienceSection";
import SegmentsSection from "@/components/SegmentsSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Teknoritma | Sarus Hastane Bilgi Sistemi (HBYS)",
  description: "Teknoritma, hastaneler için geliştirilen Sarus Hastane Bilgi Sistemi (HBYS) ile entegre ve ölçeklenebilir sağlık bilişimi çözümleri sunar.",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductsSection />
      <EnterpriseExperienceSection />
      <SegmentsSection />
      <ContactSection />
    </main>
  );
}

