import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import TimelineSection from "@/components/TimelineSection";
import SupportSection from "@/components/SupportSection";
import SegmentsSection from "@/components/SegmentsSection";
import ContactSection from "@/components/ContactSection";

export default function HomeEN() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProductsSection />
      <SupportSection />
      <TimelineSection />
      <SegmentsSection />
      <ContactSection />
    </main>
  );
}

