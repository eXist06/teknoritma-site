"use client";

import { motion } from "framer-motion";
import { timelineItems } from "@/content/timeline";

export default function TimelineSection() {
  return (
    <section id="projects" className="py-20 md:py-32 bg-background-alt">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-4">
            Zaman içinde Sarus
          </h2>
          <p className="text-lg text-neutral-body max-w-2xl mx-auto">
            Sarus; Türkiye'nin ilk web tabanlı hastane bilgi sistemi olarak
            başladığı yolculuğunu, şehir hastaneleri ve yüksek yatak kapasiteli
            referans projelerle sürdürüyor.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {timelineItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative bg-white rounded-3xl border border-neutral-border p-8 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-4">
                  {item.year}
                </div>
                <h3 className="text-xl font-bold text-neutral-heading mb-3">
                  {item.title}
                </h3>
                <p className="text-base text-neutral-body leading-relaxed">
                  {item.description}
                </p>
              </div>
              
              {/* Timeline connector line (visual element) */}
              {idx < timelineItems.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


