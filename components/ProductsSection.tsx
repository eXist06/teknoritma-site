"use client";

import { motion } from "framer-motion";
import { products } from "@/content/products";
import { featuredSlides } from "@/content/featuredProducts";
import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

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

  return (
    <section id="products" className="py-20 md:py-32 bg-background">
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
            <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-xl overflow-hidden group">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              
              <div className="relative grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold mb-6 shadow-lg"
                  >
                    {sarusHIS.category}
                  </motion.span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-5 leading-tight">
                    {sarusHIS.name}
                  </h2>
                  <p className="text-xl text-primary font-bold mb-5">
                    {sarusHIS.tagline}
                  </p>
                  <p className="text-lg text-neutral-body mb-8 leading-relaxed">
                    {sarusHIS.description}
                  </p>
                  {sarusHIS.features && (
                    <ul className="space-y-3 mb-8">
                      {sarusHIS.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 text-neutral-body"
                        >
                          <span className="text-accent mt-1 text-xl font-bold">✓</span>
                          <span className="text-base">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  <Link href={`${basePath}/urunler/sarus`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                    >
                      {t("products.exploreDetails")}
                      <span className="inline-block ml-2">→</span>
                    </motion.button>
                  </Link>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="hidden md:block"
                >
                  <div className="relative w-full aspect-square bg-white/80 backdrop-blur-md rounded-3xl border border-neutral-border/50 shadow-2xl flex items-center justify-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10 p-8">
                      <img
                        src="/Picture1.gif"
                        alt="SarusHIS Logo"
                        className="w-full h-auto max-w-xs mx-auto object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Products Slider */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-neutral-heading mb-8">
            {t("products.otherProducts")}
          </h3>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {products
                .filter((p) => p.id !== "sarus-his")
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                  >
                    <motion.div
                      whileHover={{ y: -12, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full bg-white rounded-3xl border border-neutral-border p-8 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <span className="inline-block px-3 py-1.5 bg-accent-light text-accent-dark rounded-full text-xs font-bold mb-4 shadow-sm">
                          {product.category}
                        </span>
                        <h4 className="text-2xl font-extrabold text-neutral-heading mb-3">
                          {product.name}
                        </h4>
                        <p className="text-base text-primary font-bold mb-4">
                          {product.tagline}
                        </p>
                        <p className="text-sm text-neutral-body leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      
                      {/* Decorative corner element */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>
                ))}
            </div>
          </div>
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {products
              .filter((p) => p.id !== "sarus-his")
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


