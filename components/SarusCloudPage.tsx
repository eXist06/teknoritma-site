"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function SarusCloudPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("clinical-features");

  const tabs = [
    {
      id: "clinicalEfficiency",
      title: t("cloud.why.clinicalEfficiency.title"),
      icon: "⚕️",
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
      subtitle: t("cloud.why.clinicalEfficiency.description"),
      detail: t("cloud.why.clinicalEfficiency.detail"),
    },
    {
      id: "practiceManagement",
      title: t("cloud.why.practiceManagement.title"),
      icon: "📅",
      iconBgClass: "bg-green-50",
      iconColorClass: "text-green-600",
      subtitle: t("cloud.why.practiceManagement.description"),
      detail: t("cloud.why.practiceManagement.detail"),
    },
    {
      id: "patientEngagement",
      title: t("cloud.why.patientEngagement.title"),
      icon: "👥",
      iconBgClass: "bg-purple-50",
      iconColorClass: "text-purple-600",
      subtitle: t("cloud.why.patientEngagement.description"),
      detail: t("cloud.why.patientEngagement.detail"),
    },
    {
      id: "revenueCycle",
      title: t("cloud.why.revenueCycle.title"),
      icon: "💰",
      iconBgClass: "bg-amber-50",
      iconColorClass: "text-amber-600",
      subtitle: t("cloud.why.revenueCycle.description"),
      detail: t("cloud.why.revenueCycle.detail"),
    },
    {
      id: "cloudInfrastructure",
      title: t("cloud.why.cloudInfrastructure.title"),
      icon: "☁️",
      iconBgClass: "bg-cyan-50",
      iconColorClass: "text-cyan-600",
      subtitle: t("cloud.why.cloudInfrastructure.description"),
      detail: t("cloud.why.cloudInfrastructure.detail"),
    },
  ];

  // Auto-rotate cards every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % tabs.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [tabs.length]);

  // Track active navigation item based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["clinical-features", "platform-features", "architecture", "success-story"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveNavItem(sections[i]);
          break;
        }
      }
    };

    // Also check hash on mount
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (["clinical-features", "platform-features", "architecture", "success-story"].includes(hash)) {
        setActiveNavItem(hash);
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-background via-background-alt to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href={basePath || "/"}
                className="inline-flex items-center gap-2 text-sm text-neutral-body hover:text-primary transition-colors mb-8"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {t("cloud.backToHome")}
              </Link>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-primary">Sarus</span>{" "}
                <span className="text-neutral-heading">{t("cloud.productName")}</span>
              </h1>

              <p className="text-2xl md:text-3xl font-semibold text-neutral-heading mb-6">
                {t("cloud.tagline")}
              </p>

              <p className="text-lg md:text-xl text-neutral-body leading-relaxed mb-4">
                {t("cloud.description")}
              </p>

              <div className="mb-8">
                <AnimatePresence>
                  {isDescriptionExpanded && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-lg md:text-xl text-neutral-body leading-relaxed mb-3"
                    >
                      {t("cloud.descriptionSecond")}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-primary hover:text-primary-dark font-semibold text-sm md:text-base transition-colors flex items-center gap-2"
                >
                  {isDescriptionExpanded ? t("cloud.collapseText") : t("cloud.expandText")}
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isDescriptionExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Demo Request Button */}
              <div className="flex flex-wrap gap-4">
                <Link href={`${basePath}/demo-talep`}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                  >
                    {t("cloud.requestDemo")}
                  </motion.button>
                </Link>
                <a 
                  href="#navigation"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('navigation');
                    if (element) {
                      const elementRect = element.getBoundingClientRect();
                      const absoluteElementTop = elementRect.top + window.pageYOffset;
                      const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                      window.scrollTo({
                        top: middle,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                  >
                    {t("cloud.explore")}
                  </motion.button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden md:block mt-12 md:mt-20"
            >
              <div className="relative w-full aspect-video bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-border/50 shadow-xl overflow-hidden">
                <img
                  src="/bulut-cropped.png"
                  alt={language === "en" ? "Sarus Cloud" : "Sarus Bulut"}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons Section - Tab Style */}
      <section id="navigation" className="w-full bg-white relative">
        {/* Top teal-blue line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary"></div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 md:py-12">
          <nav className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
            {[
              {
                id: "clinical-features",
                href: "#clinical-features",
                label: t("cloud.why.title"),
                icon: "⚕️",
              },
              {
                id: "platform-features",
                href: "#platform-features",
                label: language === "en" ? "Platform Features" : "Platform Özellikleri",
                icon: "⚙️",
              },
              {
                id: "architecture",
                href: "#architecture",
                label: language === "en" ? "Architecture" : "Mimari",
                icon: "🏗️",
              },
              {
                id: "success-story",
                href: "#success-story",
                label: language === "en" ? "Success Story" : "Başarı Hikayesi",
                icon: "🏆",
              },
            ].map((item) => {
              const isActive = activeNavItem === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveNavItem(item.id)}
                  className="group flex flex-col items-center gap-2 px-4 py-3 transition-all duration-300 relative"
                >
                  {/* Icon */}
                  <div className="text-2xl md:text-3xl mb-1 transition-transform duration-300" style={{ color: isActive ? '#0066FF' : '#4A5568' }}>
                    {item.icon}
                  </div>
                  {/* Label */}
                  <span 
                    className={`text-sm md:text-base whitespace-nowrap transition-colors duration-300 ${
                      isActive 
                        ? 'font-bold text-primary' 
                        : 'font-normal text-neutral-heading'
                    }`}
                  >
                    {item.label}
                  </span>
                  {/* Active indicator underline */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[80%] h-0.5 bg-primary"></span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
        
        {/* Bottom light grey separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-border"></div>
      </section>

      {/* Clinical Features Section */}
      <section id="clinical-features" className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-3">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">{t("cloud.productName")}</span>{" "}
            <span className="text-neutral-heading">{t("cloud.why.title")}</span>
          </h2>
          <div className="w-20 h-0.5 bg-primary mx-auto"></div>
        </motion.div>

        {/* Enterprise Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.map((tab, idx) => (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`group relative bg-white border-2 rounded-lg p-6 md:p-8 transition-all duration-300 ${
                activeTab === idx
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-neutral-border hover:border-primary/50 hover:shadow-md"
              }`}
            >
              {/* Active Indicator */}
              {activeTab === idx && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
              )}

              {/* Icon */}
              <div className={`mb-4 h-14 w-14 rounded-lg flex items-center justify-center ${tab.iconBgClass} transition-transform duration-300 ${
                activeTab === idx ? "scale-110" : "group-hover:scale-105"
              }`}>
                <div className={`${tab.iconColorClass} text-2xl`}>
                  {tab.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold text-neutral-heading mb-3 leading-tight">
                {tab.title}
              </h3>
              <p className="text-sm md:text-base text-neutral-body leading-relaxed mb-4">
                {tab.subtitle}
              </p>
              {tab.detail && (
                <div className="pt-4 border-t border-neutral-border/50">
                  <p className="text-xs md:text-sm text-neutral-body/70 font-medium leading-relaxed">
                    {tab.detail}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="platform-features" className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 bg-background-alt">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-4">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">{t("cloud.productName")}</span>{" "}
            <span className="text-neutral-heading">{t("cloud.features.title")}</span>
          </h2>
          <p className="text-lg text-neutral-body max-w-3xl mx-auto">
            {t("cloud.features.subtitle")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: t("cloud.features.ehr.title"),
              description: t("cloud.features.ehr.description"),
              icon: "📋",
            },
            {
              title: t("cloud.features.eprescribe.title"),
              description: t("cloud.features.eprescribe.description"),
              icon: "💊",
            },
            {
              title: t("cloud.features.scheduling.title"),
              description: t("cloud.features.scheduling.description"),
              icon: "📅",
            },
            {
              title: t("cloud.features.clinicalDocs.title"),
              description: t("cloud.features.clinicalDocs.description"),
              icon: "📝",
            },
            {
              title: t("cloud.features.patientPortal.title"),
              description: t("cloud.features.patientPortal.description"),
              icon: "📱",
            },
            {
              title: t("cloud.features.billing.title"),
              description: t("cloud.features.billing.description"),
              icon: "💳",
            },
            {
              title: t("cloud.features.reporting.title"),
              description: t("cloud.features.reporting.description"),
              icon: "📊",
            },
            {
              title: t("cloud.features.integration.title"),
              description: t("cloud.features.integration.description"),
              icon: "🔗",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-neutral-border p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="text-lg md:text-xl font-semibold text-neutral-heading mb-2">
                {item.title}
              </h4>
              <p className="text-sm text-neutral-body leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="relative border-t border-neutral-border bg-gradient-to-b from-white via-background-alt/30 to-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 md:px-10 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-6">
              <span className="text-primary">Sarus</span>{" "}
              <span className="text-neutral-heading">{t("cloud.productName")}</span>{" "}
              <span className="text-neutral-heading">{t("cloud.architecture.title")}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-neutral-body max-w-3xl mx-auto leading-relaxed">
              {t("cloud.architecture.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t("cloud.architecture.azureReady.title"),
                description: t("cloud.architecture.azureReady.description"),
                icon: "☁️",
              },
              {
                title: t("cloud.architecture.multiTenant.title"),
                description: t("cloud.architecture.multiTenant.description"),
                icon: "🏢",
              },
              {
                title: t("cloud.architecture.scalable.title"),
                description: t("cloud.architecture.scalable.description"),
                icon: "📈",
              },
              {
                title: t("cloud.architecture.flexible.title"),
                description: t("cloud.architecture.flexible.description"),
                icon: "🔄",
              },
              {
                title: t("cloud.architecture.secure.title"),
                description: t("cloud.architecture.secure.description"),
                icon: "🔒",
              },
              {
                title: t("cloud.architecture.highAvailability.title"),
                description: t("cloud.architecture.highAvailability.description"),
                icon: "⚡",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-neutral-border p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="text-lg md:text-xl font-semibold text-neutral-heading mb-2">
                  {item.title}
                </h4>
                <p className="text-sm text-neutral-body leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story Section */}
      <section id="success-story" className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-4">
              {t("cloud.successStory.title")}
            </h2>
            <p className="text-lg text-neutral-body max-w-4xl mx-auto leading-relaxed mb-4">
              {t("cloud.successStory.subtitle")}
            </p>
            <p className="text-base text-neutral-body max-w-4xl mx-auto leading-relaxed">
              {t("cloud.successStory.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: t("cloud.successStory.stats.clinics"), label: t("cloud.successStory.stats.clinicsLabel") },
              { value: t("cloud.successStory.stats.patients"), label: t("cloud.successStory.stats.patientsLabel") },
              { value: t("cloud.successStory.stats.users"), label: t("cloud.successStory.stats.usersLabel") },
              { value: t("cloud.successStory.stats.uptime"), label: t("cloud.successStory.stats.uptimeLabel") },
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

      {/* CTA */}
      <section
        id="demo"
        className="bg-primary text-white py-14 md:py-20 mt-8"
      >
        <div className="mx-auto max-w-5xl px-4 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            {t("cloud.cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-blue-100 max-w-2xl mx-auto text-lg"
          >
            {t("cloud.cta.description")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex justify-center"
          >
            <Link href={`${basePath}/demo-talep`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t("cloud.requestDemo")}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
