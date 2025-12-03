"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function SarusHISPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";

  const features = [
    {
      icon: "🏥",
      title: t("sarus.features.integration.title"),
      description: t("sarus.features.integration.description"),
    },
    {
      icon: "💻",
      title: t("sarus.features.webBased.title"),
      description: t("sarus.features.webBased.description"),
    },
    {
      icon: "📱",
      title: t("sarus.features.mobile.title"),
      description: t("sarus.features.mobile.description"),
    },
    {
      icon: "🔧",
      title: t("sarus.features.dotnet.title"),
      description: t("sarus.features.dotnet.description"),
    },
    {
      icon: "🏗️",
      title: t("sarus.features.multilayered.title"),
      description: t("sarus.features.multilayered.description"),
    },
    {
      icon: "🌐",
      title: t("sarus.features.platform.title"),
      description: t("sarus.features.platform.description"),
    },
  ];

  const technicalSpecs = [
    { category: t("sarus.technical.specs.architecture"), value: t("sarus.technical.values.architecture") },
    { category: t("sarus.technical.specs.technology"), value: t("sarus.technical.values.technology") },
    { category: t("sarus.technical.specs.platform"), value: t("sarus.technical.values.platform") },
    { category: t("sarus.technical.specs.integration"), value: t("sarus.technical.values.integration") },
    { category: t("sarus.technical.specs.support"), value: t("sarus.technical.values.support") },
    { category: t("sarus.technical.specs.validation"), value: t("sarus.technical.values.validation") },
    { category: t("sarus.technical.specs.users"), value: t("sarus.technical.values.users") },
    { category: t("sarus.technical.specs.patients"), value: t("sarus.technical.values.patients") },
    { category: t("sarus.technical.specs.geography"), value: t("sarus.technical.values.geography") },
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
                {t("sarus.backToProducts")}
              </Link>

              <span className="inline-block px-4 py-2 bg-primary/10 text-primary-dark rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20">
                {t("sarus.mainProduct")}
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading mb-6 leading-tight">
                SarusHIS
              </h1>

            <p className="text-2xl md:text-3xl font-bold text-primary mb-6">
              {t("sarus.tagline")}
            </p>

            <p className="text-xl text-neutral-body leading-relaxed mb-8">
              {t("sarus.description")}
            </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                >
                  {t("sarus.requestDemo")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                >
                  {t("sarus.contact")}
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden md:block"
            >
              <div className="relative w-full aspect-square bg-white/80 backdrop-blur-md rounded-3xl border border-neutral-border/50 shadow-2xl flex items-center justify-center overflow-hidden p-8">
                <img
                  src="/Picture1.gif"
                  alt="SarusHIS Logo"
                  className="w-full h-auto max-w-md mx-auto object-contain"
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
              {t("sarus.features.title")}
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {t("sarus.features.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative bg-white rounded-3xl border border-neutral-border p-8 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-heading mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-body leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 md:py-32 bg-background-alt">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              {t("sarus.technical.title")}
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {t("sarus.technical.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl border border-neutral-border shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background-alt">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-heading uppercase tracking-wider">
                      {t("sarus.technical.category")}
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-neutral-heading uppercase tracking-wider">
                      {t("sarus.technical.feature")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border">
                  {technicalSpecs.map((spec, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-primary/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-heading">
                        {spec.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-body">
                        {spec.value}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
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
              {t("sarus.cta.title")}
            </h2>
            <p className="text-xl text-neutral-body mb-8 leading-relaxed">
              {t("sarus.cta.description")}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
              >
                {t("sarus.requestDemo")}
              </motion.button>
              <Link href={`${basePath}#contact`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                >
                  {t("sarus.contact")}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

