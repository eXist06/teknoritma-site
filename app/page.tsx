import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import SupportSection from "@/components/SupportSection";
import SegmentsSection from "@/components/SegmentsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductsSection />
      <SupportSection />
      <SegmentsSection />
      <ContactSection />
    </main>
  );
}

