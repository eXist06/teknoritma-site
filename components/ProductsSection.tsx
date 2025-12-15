"use client";

import { motion } from "framer-motion";
import { products } from "@/content/products";
import { featuredSlides } from "@/content/featuredProducts";
import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Cloud, Scan, FlaskConical, Link2 } from "lucide-react";

export default function ProductsSection() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const [activeIndex, setActiveIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 20 });

  useEffect(() => {
    if (!emblaApi) return;
    const timer = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  const sarusHIS = products.find((p) => p.id === "sarus-his");

  // Dil bazlı içerik
  const productName = language === "en" ? (sarusHIS?.nameEn || sarusHIS?.name) : (sarusHIS?.name || "Sarus HBS");
  const productTagline = language === "en" ? (sarusHIS?.taglineEn || sarusHIS?.tagline) : sarusHIS?.tagline;
  const productDescription = language === "en" ? (sarusHIS?.descriptionEn || sarusHIS?.description) : sarusHIS?.description;
  const productCategory = language === "en" ? (sarusHIS?.categoryEn || sarusHIS?.category) : sarusHIS?.category;
  const productFeatures = language === "en" ? (sarusHIS?.featuresEn || sarusHIS?.features) : sarusHIS?.features;

  return (
    <section id="products" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* SarusHIS Featured Card */}
        {sarusHIS && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="relative bg-white rounded-2xl border border-neutral-border/60 shadow-lg overflow-hidden group">
              {/* Subtle grid pattern overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
              
              {/* Subtle accent line at top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
              
              <div className="relative grid md:grid-cols-2 gap-12 md:gap-16 items-center p-10 md:p-16">
                <div>
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-semibold uppercase tracking-wider mb-6 border border-primary/20"
                  >
                    {productCategory}
                  </motion.span>
                  <h2 className="text-5xl md:text-6xl font-bold text-neutral-heading mb-4 leading-tight tracking-tight">
                    {productName?.split(' ').map((word, idx) => 
                      word.toLowerCase() === 'sarus' ? (
                        <span key={idx} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                          {word}
                        </span>
                      ) : (
                        <span key={idx}> {word}</span>
                      )
                    ) || productName}
                  </h2>
                  <p className="text-xl md:text-2xl text-primary font-semibold mb-6 tracking-tight">
                    {productTagline}
                  </p>
                  <div className="h-px w-16 bg-neutral-border mb-6" />
                  <p className="text-base md:text-lg text-neutral-body mb-10 leading-relaxed max-w-2xl">
                    {productDescription}
                  </p>
                  {productFeatures && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                      {productFeatures.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-start gap-3 text-neutral-body"
                        >
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                            <span className="text-primary text-xs font-bold">✓</span>
                          </div>
                          <span className="text-sm md:text-base leading-relaxed">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <Link href={`${basePath}/urunler/sarus`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg text-sm uppercase tracking-wide"
                    >
                      {t("products.exploreDetails")}
                      <span className="inline-block ml-2">→</span>
                    </motion.button>
                  </Link>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block"
                >
                  <div className="relative w-full aspect-square bg-neutral-light/30 rounded-xl border border-neutral-border/40 shadow-sm overflow-hidden">
                    <div className="relative z-10 w-full h-full">
                      <img
                        src="/sarusdig.png"
                        alt={language === "en" ? "Sarus EMR" : "Sarus HBS"}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Products - Sarus Bulut, PACS, LBS */}
        <div className="relative">
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-heading mb-8">
            {t("products.otherProducts")}
          </h3>
          
          {/* Navigation Arrows */}
          <div className="absolute right-0 top-0 flex items-center gap-3 z-10">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="p-2 rounded-lg bg-white border border-neutral-border shadow-sm hover:bg-neutral-light transition-colors"
              aria-label="Previous"
            >
              <svg className="w-5 h-5 text-neutral-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="p-2 rounded-lg bg-white border border-neutral-border shadow-sm hover:bg-neutral-light transition-colors"
              aria-label="Next"
            >
              <svg className="w-5 h-5 text-neutral-heading" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products
                .filter((p) => 
                  p.id === "sarus-cloud" || 
                  p.id === "sarus-pacs" || 
                  p.id === "sarus-lbs"
                )
                .map((product) => {
                  const prodName = language === "en" ? (product.nameEn || product.name) : product.name;
                  const prodTagline = language === "en" ? (product.taglineEn || product.tagline) : product.tagline;
                  const prodDescription = language === "en" ? (product.descriptionEn || product.description) : product.description;
                  const prodCategory = language === "en" ? (product.categoryEn || product.category) : product.category;
                  
                  // Determine product path and icon
                  let productPath = "";
                  let ProductIcon: any = null;
                  if (product.id === "sarus-cloud") {
                    productPath = language === "en" ? "/en/products/sarus-cloud" : "/urunler/sarus-bulut";
                    ProductIcon = Cloud;
                  } else if (product.id === "sarus-pacs") {
                    productPath = language === "en" ? "/en/products/sarus-pacs" : "/urunler/sarus-pacs";
                    ProductIcon = Scan;
                  } else if (product.id === "sarus-lbs") {
                    productPath = language === "en" ? "/en/products/sarus-lis" : "/urunler/sarus-lbs";
                    ProductIcon = FlaskConical;
                  }
                  
                  return (
                    <div
                      key={product.id}
                      className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                    >
                      <Link href={productPath}>
                        <motion.div
                          whileHover={{ y: -12, scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                          className="relative h-full bg-white rounded-2xl border border-neutral-border/60 p-8 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
                        >
                          {/* Subtle accent line at top */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          
                          {/* Hover gradient effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                              {ProductIcon && (
                                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                  <ProductIcon className="w-5 h-5 text-primary" strokeWidth={2.5} />
                                </div>
                              )}
                              <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-semibold uppercase tracking-wider border border-primary/20">
                                {prodCategory}
                              </span>
                            </div>
                            <h4 className="text-2xl font-bold text-neutral-heading mb-3 group-hover:text-primary transition-colors">
                              {prodName}
                            </h4>
                            <p className="text-base text-primary font-semibold mb-4">
                              {prodTagline}
                            </p>
                            <p className="text-sm text-neutral-body leading-relaxed line-clamp-3">
                              {prodDescription}
                            </p>
                            
                            {/* Arrow indicator */}
                            <div className="mt-6 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <span>{language === "en" ? "Learn more" : "Detayları gör"}</span>
                              <span className="ml-2">→</span>
                            </div>
                          </div>
                        
                          {/* Decorative corner element */}
                          <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
          
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {products
              .filter((p) => 
                p.id === "sarus-cloud" || 
                p.id === "sarus-pacs" || 
                p.id === "sarus-lbs"
              )
              .map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === activeIndex
                      ? "w-8 bg-primary"
                      : "bg-neutral-border hover:bg-neutral-muted"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
