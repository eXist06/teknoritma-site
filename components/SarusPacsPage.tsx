"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function SarusPacsPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const features = [
    {
      title: t("pacs.features.pacsSolutions.title"),
      description: t("pacs.features.pacsSolutions.description"),
    },
    {
      title: t("pacs.features.ris.title"),
      description: t("pacs.features.ris.description"),
    },
    {
      title: t("pacs.features.worklist.title"),
      description: t("pacs.features.worklist.description"),
    },
    {
      title: t("pacs.features.workstation.title"),
      description: t("pacs.features.workstation.description"),
    },
    {
      title: t("pacs.features.webViewer.title"),
      description: t("pacs.features.webViewer.description"),
    },
    {
      title: t("pacs.features.workflow.title"),
      description: t("pacs.features.workflow.description"),
    },
    {
      title: t("pacs.features.archiving.title"),
      description: t("pacs.features.archiving.description"),
    },
    {
      title: t("pacs.features.telemedicine.title"),
      description: t("pacs.features.telemedicine.description"),
    },
    {
      title: t("pacs.features.dicomRouter.title"),
      description: t("pacs.features.dicomRouter.description"),
    },
  ];

  const products = [
    t("pacs.products.webViewer"),
    t("pacs.products.audioManager"),
    t("pacs.products.imageServer"),
    t("pacs.products.dicomRouter"),
    t("pacs.products.hl7Router"),
    t("pacs.products.telemedicine"),
    t("pacs.products.modalityWorkslist"),
    t("pacs.products.fileRepo"),
    t("pacs.products.ris"),
    t("pacs.products.workstation"),
  ];

  const capabilities = [
    t("pacs.capabilities.telemedicine"),
    t("pacs.capabilities.html5"),
    t("pacs.capabilities.teleradiology"),
    t("pacs.capabilities.dicomRobot"),
    t("pacs.capabilities.dicomHl7"),
    t("pacs.capabilities.fastAccess"),
    t("pacs.capabilities.workstation"),
    t("pacs.capabilities.dictation"),
  ];

  const testimonials = [
    {
      name: t("pacs.testimonials.ankara1.name"),
      hospital: t("pacs.testimonials.ankara1.hospital"),
      quote: t("pacs.testimonials.ankara1.quote"),
    },
    {
      name: t("pacs.testimonials.ankara2.name"),
      hospital: t("pacs.testimonials.ankara2.hospital"),
      quote: t("pacs.testimonials.ankara2.quote"),
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-background via-background-alt to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={`${basePath}#products`}
                className="inline-flex items-center gap-2 text-sm text-neutral-body hover:text-primary transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("pacs.backToProducts")}
              </Link>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-primary">Sarus</span>{" "}
                <span className="text-neutral-heading">PACS</span>
              </h1>

              <p className="text-2xl md:text-3xl font-semibold text-neutral-heading mb-6">
                {t("pacs.tagline")}
              </p>

              <div className="mb-8">
                <p className="text-lg md:text-xl text-neutral-body leading-relaxed font-serif">
                  {t("pacs.description")}
                </p>
                {isDescriptionExpanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-lg md:text-xl text-neutral-body leading-relaxed font-serif mt-4"
                  >
                    {t("pacs.descriptionExtended")}
                  </motion.p>
                )}
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-3 text-primary hover:text-primary-dark font-semibold text-sm md:text-base transition-colors flex items-center gap-2"
                >
                  {isDescriptionExpanded ? t("pacs.collapseText") : t("pacs.expandText")}
                  <svg
                    className={`w-4 h-4 transition-transform ${isDescriptionExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`${basePath}/demo-talep`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                  >
                    {t("pacs.requestDemo")}
                  </motion.button>
                </Link>
                <Link href={`${basePath}#contact`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                  >
                    {t("pacs.contact")}
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden md:block"
            >
              <div className="relative w-full aspect-video bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-border/50 shadow-xl overflow-hidden">
                <img
                  src="/pacs-workstation.png"
                  alt={language === "en" ? "Sarus PACS Workstation" : "Sarus PACS İş İstasyonu"}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              <span className="text-primary">Sarus</span>{" "}
              <span className="text-neutral-heading">
                {language === "en" ? "Pacs Solution Center" : "Pacs Çözüm Merkezi"}
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-neutral-border p-6 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-neutral-heading mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              {t("pacs.stats.title")}
            </h2>
            <p className="text-lg text-neutral-body max-w-4xl mx-auto leading-relaxed">
              {t("pacs.stats.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: t("pacs.stats.modalities"), label: t("pacs.stats.modalitiesLabel") },
              { value: t("pacs.stats.radiologists"), label: t("pacs.stats.radiologistsLabel") },
              { value: t("pacs.stats.workstations"), label: t("pacs.stats.workstationsLabel") },
              { value: t("pacs.stats.dailyProcedures"), label: t("pacs.stats.dailyProceduresLabel") },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-neutral-border p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-2">
                  {stat.value}
                </div>
                <p className="text-base font-semibold text-neutral-heading">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Imaging Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              <span className="text-primary">Sarus</span>{" "}
              <span className="text-neutral-heading">
                {language === "en" ? "Pacs Solution Center" : "Pacs Çözüm Merkezi"}
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "🔗",
                title: t("pacs.enterprise.singleAccess.title"),
                description: t("pacs.enterprise.singleAccess.description"),
              },
              {
                icon: "🤝",
                title: t("pacs.enterprise.crossDepartment.title"),
                description: t("pacs.enterprise.crossDepartment.description"),
              },
              {
                icon: "📈",
                title: t("pacs.enterprise.scalability.title"),
                description: t("pacs.enterprise.scalability.description"),
              },
              {
                icon: "⚡",
                title: t("pacs.enterprise.highAvailability.title"),
                description: t("pacs.enterprise.highAvailability.description"),
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-white to-background-alt rounded-3xl border border-neutral-border p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-heading mb-3">
                      {item.title}
                    </h3>
                    <p className="text-neutral-body leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              <span className="text-primary">Sarus</span>{" "}
              <span className="text-neutral-heading">
                {language === "en" ? "Pacs Ecosystem" : "Pacs Ekosistemi"}
              </span>
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {t("pacs.products.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {products.map((product, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl border border-neutral-border p-6 shadow-md hover:shadow-xl transition-all duration-300 text-center"
              >
                <p className="text-base font-semibold text-neutral-heading">
                  {product}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background-alt">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              {t("pacs.capabilities.title")}
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {t("pacs.capabilities.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((capability, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-primary/5 via-white to-accent/5 rounded-2xl border border-primary/20 p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-neutral-heading leading-relaxed">
                    {capability}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-background-alt">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              {t("pacs.testimonials.title")}
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {t("pacs.testimonials.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white rounded-3xl border border-neutral-border p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">
                      {testimonial.name.split(" ")[0][0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-neutral-heading mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-primary font-semibold">
                      {testimonial.hospital}
                    </p>
                  </div>
                </div>
                <p className="text-neutral-body leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        <div className="max-w-4xl mx-auto px-5 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-6">
              {t("pacs.cta.title")}
            </h2>
            <p className="text-xl text-neutral-body mb-8 leading-relaxed">
              {t("pacs.cta.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`${basePath}/demo-talep`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                >
                  {t("pacs.requestDemo")}
                </motion.button>
              </Link>
              <Link href={`${basePath}#contact`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                >
                  {t("pacs.contact")}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

