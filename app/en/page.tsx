import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import EnterpriseExperienceSection from "@/components/EnterpriseExperienceSection";
import SegmentsSection from "@/components/SegmentsSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Teknoritma | Sarus EMR & EHR | Hospital Information System",
  description: "Teknoritma provides Sarus EMR and EHR solutions, delivering an enterprise-grade hospital information system for modern healthcare organizations.",
};

export default function HomeEN() {
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










