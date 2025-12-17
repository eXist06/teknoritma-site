"use client";

import { motion } from "framer-motion";
import { supportHighlights, supportHighlightsEn } from "@/content/support";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

export default function SupportSection() {
  const { t, language } = useI18n();
  
  const currentHighlights = language === "en" ? supportHighlightsEn : supportHighlights;

  const contentText = language === "en" 
    ? [
        "Among the more than 200 projects we have implemented at national and international levels, centrally managed EMR platforms used nationwide, Mega Hospital projects, and large-scale healthcare transformation projects hold an important place."
      ]
    : [
        "Ulusal ve Uluslararası düzeyde hayata geçirdiğimiz 200'den fazla proje arasında, ülke genelinde kullanılan merkezi EMR platformları, Mega Hastane projeleri ve büyük ölçekli sağlık dönüşüm projeleri önemli bir yer tutmaktadır."
      ];

  return (
    <section id="support" className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        {/* Enterprise Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 md:mb-24"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading mb-6 tracking-tight leading-tight">
            {t("support.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Content with Image - Enterprise Style */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            {/* Image with Enhanced Styling */}
            <div className="relative w-full h-72 md:h-96 rounded-3xl overflow-hidden shadow-2xl border-2 border-neutral-200/50 group">
              <Image
                src="/dr.jpg"
                alt="Healthcare Informatics"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-neutral-900/25 to-transparent" />
              {/* Subtle accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>
            </div>

            {/* Content - Enterprise Typography */}
            <div className="bg-gradient-to-br from-white via-white to-neutral-50/50 rounded-3xl border-2 border-neutral-200/60 p-8 md:p-10 lg:p-12 shadow-xl relative overflow-hidden">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #1e40af 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
              
              {/* Decorative gradient */}
              <div className="absolute top-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  {/* Paragraph number indicator (subtle) */}
                  <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary/30 via-primary/20 to-transparent rounded-full hidden md:block"></div>
                  
                  <p className="text-base md:text-lg lg:text-xl text-neutral-heading leading-[1.8] md:leading-[1.9] font-semibold tracking-wide pl-0 md:pl-6">
                    {(() => {
                      // Extract numbers and key terms for highlighting
                      const paragraph = contentText[0];
                      const parts = paragraph.split(/(\d+[+\-]?)/g);
                      return parts.map((part, i) => {
                        if (/^\d+[+\-]?$/.test(part)) {
                          return (
                            <span key={i} className="text-primary font-bold">{part}</span>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      });
                    })()}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Highlights Card - Enterprise Style */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-white via-white to-neutral-50/80 rounded-3xl border-2 border-primary/20 p-10 md:p-12 lg:p-16 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, #1e40af 1px, transparent 0)`,
                backgroundSize: '50px 50px'
              }}></div>
              
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-12 pb-8 border-b-2 border-primary/20 tracking-tight">
                  {(() => {
                    const title = t("support.highlights");
                    const parts = title.split("Teknoritma");
                    if (parts.length === 2) {
                      return (
                        <>
                          {parts[0]}
                          <span className="text-primary">Teknoritma</span>
                          {parts[1]}
                        </>
                      );
                    }
                    return title;
                  })()}
                </h3>
                <ul className="space-y-6">
                  {currentHighlights.points.map((point, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + idx * 0.05 }}
                      className="flex items-start gap-4 text-lg md:text-xl text-neutral-heading group"
                    >
                      <span className="text-primary text-2xl mt-0.5 flex-shrink-0">●</span>
                      <span className="group-hover:text-primary transition-colors font-semibold leading-relaxed">
                        {point}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


