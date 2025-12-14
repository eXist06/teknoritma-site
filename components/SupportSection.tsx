"use client";

import { motion, AnimatePresence } from "framer-motion";
import { supportIntro, supportHighlights } from "@/content/support";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SupportSection() {
  const { t, language } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <section id="support" className="py-16 md:py-24 bg-gradient-to-b from-background to-background-alt/30">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-4">
            {t("support.title")}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Content with Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Image */}
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl mb-8">
              <Image
                src="/dr.jpg"
                alt="Healthcare Informatics"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="space-y-6 text-neutral-body leading-relaxed text-lg">
              <p className="text-xl text-neutral-heading font-medium">{supportIntro.paragraph1}</p>
              <div>
                <p>{supportIntro.paragraph2Visible}</p>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4">{supportIntro.paragraph2Hidden}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-4 flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors group"
                >
                  <span>{isExpanded ? (language === "en" ? "Show less" : "Daha az göster") : (language === "en" ? "Read more" : "Devamını oku")}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right: Highlights Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white rounded-2xl border border-neutral-border/60 p-8 md:p-10 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-neutral-heading mb-8 pb-4 border-b border-neutral-border/40">
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
              <ul className="space-y-4">
                {supportHighlights.points.map((point, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-6 h-6 text-primary" strokeWidth={2.5} />
                    </div>
                    <span className="text-neutral-body text-base leading-relaxed group-hover:text-neutral-heading transition-colors">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


