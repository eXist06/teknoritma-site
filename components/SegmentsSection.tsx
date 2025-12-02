"use client";

import { motion } from "framer-motion";
import { segments } from "@/content/segments";

export default function SegmentsSection() {
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
            Çözüm alanlarımız
          </h2>
          <p className="text-lg text-neutral-body max-w-2xl mx-auto">
            Farklı ölçek ve yapıdaki sağlık kurumları için özelleştirilmiş
            çözümler sunuyoruz.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {segments.map((segment, idx) => (
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
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">🏥</span>
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">
                  {segment.title}
                </h3>
                <p className="text-base text-neutral-body leading-relaxed">
                  {segment.description}
                </p>
              </div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


