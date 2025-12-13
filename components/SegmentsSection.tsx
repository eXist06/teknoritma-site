"use client";

import { motion } from "framer-motion";
import { segments } from "@/content/segments";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

export default function SegmentsSection() {
  const { language, t } = useI18n();
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

  return (
    <section id="segments" className="py-20 md:py-32 bg-background-alt">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-4">
            {t("segments.title")}
          </h2>
          <p className="text-lg text-neutral-body max-w-2xl mx-auto">
            {t("segments.subtitle")}
          </p>
        </motion.div>

        {/* Segments Carousel */}
        <div className="relative">
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
              {segments.map((segment) => {
                const segmentTitle = language === "en" ? segment.titleEn : segment.title;
                const segmentDescription = language === "en" ? segment.descriptionEn : segment.description;
                const IconComponent = segment.icon;
                
                return (
                  <div
                    key={segment.id}
                    className="flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                  >
                    <motion.div
                      whileHover={{ y: -12, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative h-full bg-white rounded-2xl border border-neutral-border/60 p-8 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {/* Subtle accent line at top */}
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Hover gradient effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="w-7 h-7 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-neutral-heading mb-4 group-hover:text-primary transition-colors">
                          {segmentTitle}
                        </h3>
                        <p className="text-sm md:text-base text-neutral-body leading-relaxed">
                          {segmentDescription}
                        </p>
                      </div>
                      
                      {/* Decorative corner */}
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {segments.map((_, idx) => (
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


