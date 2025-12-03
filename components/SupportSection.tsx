"use client";

import { motion } from "framer-motion";
import { supportIntro, supportHighlights } from "@/content/support";
import { useI18n } from "@/lib/i18n";

export default function SupportSection() {
  const { t } = useI18n();
  return (
    <section id="support" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-6">
              {t("support.title")}
            </h2>
            <div className="space-y-4 text-neutral-body leading-relaxed">
              <p>{supportIntro.paragraph1}</p>
              <p>{supportIntro.paragraph2}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-background-alt rounded-3xl border border-neutral-border p-10 shadow-xl overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-neutral-heading mb-8">
                {t("support.highlights")}
              </h3>
              <ul className="space-y-5">
                {supportHighlights.points.map((point, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-accent mt-1 text-xl font-bold">✓</span>
                    <span className="text-neutral-body text-base leading-relaxed">{point}</span>
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


