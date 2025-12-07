"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LisWorkflowDiagram from "@/components/LisWorkflowDiagram";

export default function SarusLbsPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const translationKey = language === "en" ? "lims" : "lbs";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("core-features");

  const tabs = [
    {
      id: "workflowEfficiency",
      title: t(`${translationKey}.why.workflowEfficiency.title`),
      icon: "⚡",
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
      subtitle: t(`${translationKey}.why.workflowEfficiency.description`),
      detail: t(`${translationKey}.why.workflowEfficiency.detail`),
    },
    {
      id: "orderManagement",
      title: t(`${translationKey}.why.orderManagement.title`),
      icon: "📋",
      iconBgClass: "bg-green-50",
      iconColorClass: "text-green-600",
      subtitle: t(`${translationKey}.why.orderManagement.description`),
      detail: t(`${translationKey}.why.orderManagement.detail`),
    },
    {
      id: "resultReporting",
      title: t(`${translationKey}.why.resultReporting.title`),
      icon: "📊",
      iconBgClass: "bg-purple-50",
      iconColorClass: "text-purple-600",
      subtitle: t(`${translationKey}.why.resultReporting.description`),
      detail: t(`${translationKey}.why.resultReporting.detail`),
    },
    {
      id: "instrumentIntegration",
      title: t(`${translationKey}.why.instrumentIntegration.title`),
      icon: "🔬",
      iconBgClass: "bg-amber-50",
      iconColorClass: "text-amber-600",
      subtitle: t(`${translationKey}.why.instrumentIntegration.description`),
      detail: t(`${translationKey}.why.instrumentIntegration.detail`),
    },
    {
      id: "qualityControl",
      title: t(`${translationKey}.why.qualityControl.title`),
      icon: "✅",
      iconBgClass: "bg-cyan-50",
      iconColorClass: "text-cyan-600",
      subtitle: t(`${translationKey}.why.qualityControl.description`),
      detail: t(`${translationKey}.why.qualityControl.detail`),
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
      const sections = ["core-features", "platform-features", "architecture", "workflow", "success-story"];
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
      if (["core-features", "platform-features", "architecture", "workflow", "success-story"].includes(hash)) {
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
                {t(`${translationKey}.backToHome`)}
              </Link>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-primary">Sarus</span>{" "}
                <span className="text-neutral-heading">{t(`${translationKey}.productName`)}</span>
              </h1>

              <p className="text-2xl md:text-3xl font-semibold text-neutral-heading mb-6">
                {t(`${translationKey}.tagline`)}
              </p>

              <p className="text-lg md:text-xl text-neutral-body leading-relaxed mb-4">
                {t(`${translationKey}.description`)}
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
                      {t(`${translationKey}.descriptionSecond`)}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-primary hover:text-primary-dark font-semibold text-sm md:text-base transition-colors flex items-center gap-2"
                >
                  {isDescriptionExpanded ? t(`${translationKey}.collapseText`) : t(`${translationKey}.expandText`)}
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
                    {t(`${translationKey}.requestDemo`)}
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
                    {t(`${translationKey}.explore`)}
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
                  src="/srslis.png"
                  alt={language === "en" ? "Sarus LIMS Laboratory System" : "Sarus LBYS Laboratuvar Sistemi"}
                  className="w-full h-full object-cover object-center"
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
                id: "core-features",
                href: "#core-features",
                label: t(`${translationKey}.why.title`),
                icon: "⚡",
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
              id: "workflow",
              href: "#workflow",
              label: language === "en" ? "Workflow" : "İş Akışı",
              icon: "🔄",
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

      {/* Core Features Section */}
      <section id="core-features" className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-3">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">{t(`${translationKey}.productName`)}</span>{" "}
            <span className="text-neutral-heading">{t(`${translationKey}.why.title`)}</span>
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
              whileHover={{ scale: 1.02, y: -4 }}
              className={`group relative bg-gradient-to-br from-white via-white to-gray-50/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 md:p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-primary/10 ${
                activeTab === idx
                  ? "border-primary/60 shadow-xl shadow-primary/20 ring-2 ring-primary/20"
                  : "hover:border-primary/40"
              }`}
            >
              {/* Active Indicator - Gradient */}
              {activeTab === idx && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/90 to-primary rounded-t-2xl"></div>
              )}

              {/* Decorative gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/2 group-hover:to-primary/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>

              {/* Icon Container with Enhanced Gradient */}
              <div className="relative mb-5">
                <div className={`h-16 w-16 md:h-18 md:w-18 rounded-xl flex items-center justify-center bg-gradient-to-br ${tab.iconBgClass} shadow-lg group-hover:shadow-xl transition-all duration-300 ${
                  activeTab === idx ? "scale-110 ring-2 ring-primary/30" : "group-hover:scale-105"
                }`}>
                  <div className={`${tab.iconColorClass} text-2xl md:text-3xl transition-transform duration-300 ${
                    activeTab === idx ? "scale-110" : ""
                  }`}>
                    {tab.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-bold text-neutral-heading mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                  {tab.title}
                </h3>
                <p className="text-sm md:text-base text-neutral-body leading-relaxed mb-4">
                  {tab.subtitle}
                </p>
                {tab.detail && (
                  <div className="pt-4 border-t border-gradient-to-r from-transparent via-gray-200/50 to-transparent">
                    <p className="text-xs md:text-sm text-neutral-body/80 font-medium leading-relaxed">
                      {tab.detail}
                    </p>
                  </div>
                )}
              </div>
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
            <span className="text-neutral-heading">{t(`${translationKey}.productName`)}</span>{" "}
            <span className="text-neutral-heading">{t(`${translationKey}.features.title`)}</span>
          </h2>
          <p className="text-lg text-neutral-body max-w-3xl mx-auto">
            {t(`${translationKey}.features.subtitle`)}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: t(`${translationKey}.features.orderEntry.title`),
              description: t(`${translationKey}.features.orderEntry.description`),
              icon: "📝",
            },
            {
              title: t(`${translationKey}.features.resultManagement.title`),
              description: t(`${translationKey}.features.resultManagement.description`),
              icon: "📊",
            },
            {
              title: t(`${translationKey}.features.instrumentInterface.title`),
              description: t(`${translationKey}.features.instrumentInterface.description`),
              icon: "🔬",
            },
            {
              title: t(`${translationKey}.features.qualityControl.title`),
              description: t(`${translationKey}.features.qualityControl.description`),
              icon: "✅",
            },
            {
              title: t(`${translationKey}.features.workflowManagement.title`),
              description: t(`${translationKey}.features.workflowManagement.description`),
              icon: "🔄",
            },
            {
              title: t(`${translationKey}.features.billing.title`),
              description: t(`${translationKey}.features.billing.description`),
              icon: "💳",
            },
            {
              title: t(`${translationKey}.features.reporting.title`),
              description: t(`${translationKey}.features.reporting.description`),
              icon: "📈",
            },
            {
              title: t(`${translationKey}.features.integration.title`),
              description: t(`${translationKey}.features.integration.description`),
              icon: "🔗",
            },
            {
              title: t(`${translationKey}.features.webAccess.title`),
              description: t(`${translationKey}.features.webAccess.description`),
              icon: "🌐",
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
              <span className="text-neutral-heading">{t(`${translationKey}.productName`)}</span>{" "}
              <span className="text-neutral-heading">{t(`${translationKey}.architecture.title`)}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-neutral-body max-w-3xl mx-auto leading-relaxed">
              {t(`${translationKey}.architecture.subtitle`)}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t(`${translationKey}.architecture.scalable.title`),
                description: t(`${translationKey}.architecture.scalable.description`),
                icon: "📈",
              },
              {
                title: t(`${translationKey}.architecture.integration.title`),
                description: t(`${translationKey}.architecture.integration.description`),
                icon: "🔗",
              },
              {
                title: t(`${translationKey}.architecture.security.title`),
                description: t(`${translationKey}.architecture.security.description`),
                icon: "🔒",
              },
              {
                title: t(`${translationKey}.architecture.realTime.title`),
                description: t(`${translationKey}.architecture.realTime.description`),
                icon: "⚡",
              },
              {
                title: t(`${translationKey}.architecture.customizable.title`),
                description: t(`${translationKey}.architecture.customizable.description`),
                icon: "⚙️",
              },
              {
                title: t(`${translationKey}.architecture.multiSite.title`),
                description: t(`${translationKey}.architecture.multiSite.description`),
                icon: "🏢",
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

      {/* Use Cases Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 bg-background-alt">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-6">
            {t(`${translationKey}.useCases.title`)}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: t(`${translationKey}.useCases.hospitals.title`),
              description: t(`${translationKey}.useCases.hospitals.description`),
            },
            {
              title: t(`${translationKey}.useCases.referenceLabs.title`),
              description: t(`${translationKey}.useCases.referenceLabs.description`),
            },
            {
              title: t(`${translationKey}.useCases.clinicLabs.title`),
              description: t(`${translationKey}.useCases.clinicLabs.description`),
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl border border-neutral-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
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

      {/* Workflow Section */}
      <section id="workflow" className="w-full px-4 md:px-6 py-8 md:py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-heading mb-3">
            {t(`${translationKey}.workflow.title`)}
          </h2>
          <p className="text-base md:text-lg text-neutral-body max-w-3xl mx-auto">
            {t(`${translationKey}.workflow.subtitle`)}
          </p>
        </motion.div>

        <div className="relative w-full">
          {/* React Flow Workflow Diagram - Full Screen Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <LisWorkflowDiagram translationKey={translationKey} />
          </motion.div>
        </div>
      </section>

      {/* Success Story Section */}
      <section id="success-story" className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bilkent.jpg"
            alt={language === "en" ? "Ankara (Bilkent) City Hospital" : "Ankara (Bilkent) Şehir Hastanesi"}
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 via-neutral-800/55 to-neutral-900/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {t(`${translationKey}.successStory.title`)}
            </h2>
            <p className="text-lg text-white/95 max-w-4xl mx-auto leading-relaxed mb-4 drop-shadow-md">
              {t(`${translationKey}.successStory.subtitle`)}
            </p>
            <p className="text-base text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
              {t(`${translationKey}.successStory.description`)}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { value: t(`${translationKey}.successStory.stats.tests`), label: t(`${translationKey}.successStory.stats.testsLabel`) },
              { value: t(`${translationKey}.successStory.stats.instruments`), label: t(`${translationKey}.successStory.stats.instrumentsLabel`) },
              { value: t(`${translationKey}.successStory.stats.users`), label: t(`${translationKey}.successStory.stats.usersLabel`) },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/20 p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
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
            {t(`${translationKey}.cta.title`)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-blue-100 max-w-2xl mx-auto text-lg"
          >
            {t(`${translationKey}.cta.description`)}
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
                {t(`${translationKey}.requestDemo`)}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

