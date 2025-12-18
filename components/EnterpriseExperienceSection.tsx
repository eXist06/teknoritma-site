"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface Metric {
  value: string;
  label: string;
}

export default function EnterpriseExperienceSection() {
  const { language } = useI18n();

  const title = language === "en" 
    ? ["Mega Hospitals to", "National Health Informatics Platforms"]
    : ["Mega Hastanelerden", "Ulusal Sağlık Bilişimi Platformlarına"];

  const paragraph = language === "en"
    ? "200+ national and international scale projects across Health Informatics Platforms, Mega Hospital systems, and nationwide healthcare transformation programs demonstrate our end-to-end operational capability. Our corporate delivery approach ensures regulatory compliance and sustainable performance through integrated enterprise solutions."
    : "200'ün üzerinde ulusal ve uluslararası ölçekte gerçekleştirilen projede; Sağlık Bilişimi Platformları, Mega Hastane sistemleri ve ülke çapında sağlık dönüşüm programları için uçtan uca çözümler sunuyoruz.";

  const metrics: Metric[] = language === "en"
    ? [
        { value: "200+", label: "Health informatics projects" },
        { value: "20+", label: "1,000+ bed hospital experience" },
        { value: "15+", label: "International Health Informatics Projects" },
        { value: "100+", label: "National Scale Clinical Platform" },
        { value: "5", label: "Multi-country Operation Experience" },
        { value: "Mega Health Projects", label: "Ankara & Mersin City Hospitals (PPP)" },
      ]
    : [
        { value: "200+", label: "Sağlık bilişimi projesi" },
        { value: "20+", label: "1.000+ yataklı hastane deneyimi" },
        { value: "15+", label: "Uluslararası Sağlık Bilişimi Projesi" },
        { value: "100+", label: "Ulusal Ölçekte Klinik Platform" },
        { value: "5", label: "Çok Ülkeli Operasyon Deneyimi" },
        { value: "Mega Sağlık Projeleri", label: "Ankara & Mersin Şehir Hastaneleri (PPP)" },
      ];

  return (
    <section id="support" className="relative py-12 md:py-16 overflow-hidden bg-blue-50/30">
      {/* Grid pattern overlay - azaltılmış background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Title and Paragraph - Sol üst köşeye daya */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-xl self-start -mt-8 lg:-mt-16"
          >
            {/* Title */}
            <motion.h2 
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-900 tracking-tight leading-tight mb-8"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title[0]}
              <br />
              {title[1]}
            </motion.h2>
            
            {/* Paragraph */}
            <motion.p 
              className="text-lg md:text-xl text-neutral-900 leading-relaxed font-semibold tracking-normal"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {paragraph}
            </motion.p>
          </motion.div>

          {/* Right: Metrics Grid - Sağ alt köşeye daya */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 gap-6 self-end"
          >
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: 0.3 + index * 0.08, 
                  duration: 0.4,
                  ease: "easeOut"
                }}
                className="pt-6 pb-3"
              >
                <motion.div 
                  className="text-lg md:text-xl font-semibold font-sans leading-tight text-blue-800 mb-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}
                >
                  {metric.value}
                </motion.div>
                <motion.div 
                  className="text-xs text-neutral-700 uppercase tracking-wider leading-tight font-sans font-medium"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
                >
                  {metric.label}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

