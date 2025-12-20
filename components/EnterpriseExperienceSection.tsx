"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Database, Building2, Globe, Cloud, MapPin, Building } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Metric {
  value: string;
  label: string;
  icon: LucideIcon;
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
        { value: "200+", label: "Health informatics projects", icon: Database },
        { value: "20+", label: "1,000+ bed hospital experience", icon: Building2 },
        { value: "15+", label: "International Health Informatics Projects", icon: Globe },
        { value: "100+", label: "National Scale Cloud Clinical Platform", icon: Cloud },
        { value: "5 Countries", label: "Multi-country Operation Experience", icon: MapPin },
        { value: "Mega Health Projects", label: "Ankara & Mersin City Hospitals (PPP)", icon: Building },
      ]
    : [
        { value: "200+", label: "Sağlık bilişimi projesi", icon: Database },
        { value: "20+", label: "1.000+ yataklı hastane deneyimi", icon: Building2 },
        { value: "15+", label: "Uluslararası Sağlık Bilişimi Projesi", icon: Globe },
        { value: "100+", label: "Ulusal Ölçekte Bulut Klinik Platform", icon: Cloud },
        { value: "5 Ülkede", label: "Çok Ülkeli Operasyon Deneyimi", icon: MapPin },
        { value: "Mega Sağlık Projeleri", label: "Ankara & Mersin Şehir Hastaneleri (PPP)", icon: Building },
      ];

  return (
    <section id="support" className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark">
      {/* Grid pattern overlay - azaltılmış background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-start">
          {/* Left: Title and Paragraph - Sol üst köşeye daya */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-xl self-start mt-6 lg:mt-12 pr-8 lg:pr-12"
          >
            {/* Title */}
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6"
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
              className="text-base md:text-lg text-white/80 leading-relaxed font-normal tracking-normal"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {paragraph}
            </motion.p>
          </motion.div>

          {/* Vertical Divider - Beyaz ayraç */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/20 -translate-x-1/2" />

          {/* Right: Metrics Grid - Sağ alt köşeye daya */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="grid grid-cols-2 gap-6 self-end ml-auto pl-8 lg:pl-12 mt-8 lg:mt-0"
          >
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
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
                  className="pt-6 pb-3 flex items-start gap-3"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.32 + index * 0.08, duration: 0.3 }}
                    className="mt-1 flex-shrink-0"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <motion.div 
                      className="text-base md:text-lg font-bold text-white/80 leading-relaxed tracking-normal mb-2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + index * 0.08, duration: 0.3 }}
                    >
                      {metric.value}
                    </motion.div>
                    <motion.div 
                      className="text-base md:text-lg font-normal text-white/80 leading-relaxed tracking-normal"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
                    >
                      {metric.label}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

