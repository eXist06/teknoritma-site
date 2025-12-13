"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import {
  Zap, Settings, Layers, Link2, Globe
} from "lucide-react";
import { EnterpriseSolutionsSection } from "./EnterpriseSolutionsSection";

export default function SarusHISPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const translationKey = "sarus";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("enterprise-solutions");
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);


  const tabs = [
    {
      id: "integration",
      title: t("sarus.features.integration.title"),
      icon: Link2,
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
      subtitle: t("sarus.features.integration.description"),
    },
    {
      id: "webBased",
      title: t("sarus.features.webBased.title"),
      icon: Globe,
      iconBgClass: "bg-green-50",
      iconColorClass: "text-green-600",
      subtitle: t("sarus.features.webBased.description"),
    },
    {
      id: "mobile",
      title: t("sarus.features.mobile.title"),
      icon: Globe,
      iconBgClass: "bg-purple-50",
      iconColorClass: "text-purple-600",
      subtitle: t("sarus.features.mobile.description"),
    },
    {
      id: "dotnet",
      title: t("sarus.features.dotnet.title"),
      icon: Settings,
      iconBgClass: "bg-amber-50",
      iconColorClass: "text-amber-600",
      subtitle: t("sarus.features.dotnet.description"),
    },
    {
      id: "multilayered",
      title: t("sarus.features.multilayered.title"),
      icon: Layers,
      iconBgClass: "bg-cyan-50",
      iconColorClass: "text-cyan-600",
      subtitle: t("sarus.features.multilayered.description"),
    },
    {
      id: "platform",
      title: t("sarus.features.platform.title"),
      icon: Zap,
      iconBgClass: "bg-indigo-50",
      iconColorClass: "text-indigo-600",
      subtitle: t("sarus.features.platform.description"),
    },
  ];

  // Detect mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    const checkReducedMotion = () => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };
    
    checkMobile();
    checkReducedMotion();
    window.addEventListener('resize', checkMobile);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', checkReducedMotion);
    };
  }, []);

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
      const sections = ["enterprise-solutions", "core-features", "platform-features", "architecture"];
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveNavItem(sections[i]);
          break;
        }
      }
    };

    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (["enterprise-solutions", "core-features", "platform-features", "architecture"].includes(hash)) {
        setActiveNavItem(hash);
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/his2.png"
                  alt={language === "en" ? "Sarus EMR" : "Sarus HBS"}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    console.error("Hero image failed to load:", e);
                  }}
                  onLoad={() => {
                    console.log("Hero image loaded successfully");
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons Section */}
      <section id="navigation" className="w-full bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <nav className="flex flex-wrap items-center justify-center">
            {[
              {
                id: "enterprise-solutions",
                href: "#enterprise-solutions",
                label: language === "en" ? "Enterprise Solutions" : "Kurumsal Çözümler",
                icon: Layers,
              },
              {
                id: "core-features",
                href: "#core-features",
                label: language === "en" ? "Core Features" : "Temel Özellikler",
                icon: Zap,
              },
              {
                id: "platform-features",
                href: "#platform-features",
                label: language === "en" ? "Platform Features" : "Platform Özellikleri",
                icon: Settings,
              },
              {
                id: "architecture",
                href: "#architecture",
                label: language === "en" ? "Architecture" : "Mimari",
                icon: Layers,
              },
            ].map((item) => {
              const isActive = activeNavItem === item.id;
              const IconComponent = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveNavItem(item.id);
                    const element = document.querySelector(item.href);
                    if (element) {
                      const elementRect = element.getBoundingClientRect();
                      const absoluteElementTop = elementRect.top + window.pageYOffset;
                      const offset = 100;
                      window.scrollTo({
                        top: absoluteElementTop - offset,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`group relative flex flex-col items-center justify-center gap-2 px-8 py-5
                    transition-all duration-200 ease-out cursor-pointer
                    border-b-2 -mb-px select-none
                    ${isActive 
                      ? 'border-primary text-primary bg-primary/5' 
                      : 'border-transparent text-gray-600 hover:text-primary hover:border-primary/30 hover:bg-primary/3'
                    }`}
                >
                  <div className={`transition-all duration-200 pointer-events-none
                    ${isActive 
                      ? 'opacity-100 text-primary scale-110' 
                      : 'opacity-60 text-gray-600 group-hover:opacity-100 group-hover:text-primary group-hover:scale-110'
                    }`}
                  >
                    <IconComponent className="w-7 h-7 md:w-8 md:h-8" strokeWidth={2} />
                  </div>
                  <span 
                    className={`text-xs md:text-sm font-medium whitespace-nowrap tracking-wide pointer-events-none
                      transition-all duration-200
                      ${isActive 
                        ? 'text-primary font-semibold' 
                        : 'text-gray-600 group-hover:text-primary group-hover:font-semibold'
                      }`}
                  >
                    {item.label}
                  </span>
                </a>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section id="enterprise-solutions" className="py-20 md:py-32 bg-gradient-to-b from-background via-blue-50/20 to-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-heading mb-4">
              <span className="text-primary">Enterprise</span>{" "}
              <span className="text-neutral-heading">{language === "en" ? "Solutions" : "Çözümler"}</span>
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {language === "en" ? "Comprehensive enterprise solutions for modern healthcare facilities" : "Modern sağlık kuruluşları için kapsamlı kurumsal çözümler"}
            </p>
          </motion.div>

          {/* Enterprise Solutions Section */}
          <EnterpriseSolutionsSection />
        </div>
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
            <span className="text-neutral-heading">{language === "en" ? "Core Features" : "Temel Özellikler"}</span>
          </h2>
          <div className="w-20 h-0.5 bg-primary mx-auto"></div>
        </motion.div>

        {/* Integrated Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Menu */}
            <div className="lg:w-1/3 bg-gradient-to-br from-blue-50 to-sky-50 border-r border-gray-200">
              <div className="p-4 space-y-2">
                {tabs.map((tab, idx) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === idx;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(idx)}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 2 }}
                      className={`w-full text-left px-4 py-4 rounded-lg transition-all duration-300 relative ${
                        isActive
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isActive ? "bg-white/20" : tab.iconBgClass
                        }`}>
                          <TabIcon className={`w-5 h-5 ${
                            isActive ? "text-white" : tab.iconColorClass
                          }`} strokeWidth={2} />
                        </div>
                        <span className={`font-medium text-sm md:text-base ${
                          isActive ? "text-white" : "text-gray-700"
                        }`}>{tab.title}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:w-2/3 flex-1">
              <AnimatePresence mode="wait">
                {tabs.map((tab, idx) => {
                  if (activeTab !== idx) return null;
                  const TabIcon = tab.icon;
                  return (
                    <motion.div
                      key={tab.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 md:p-8 h-full"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-neutral-heading mb-4">
                        {tab.title}
                      </h3>
                      <p className="text-base md:text-lg text-neutral-body leading-relaxed mb-6">
                        {tab.subtitle}
                      </p>
                      {/* Placeholder for image - will be added later */}
                      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 shadow-inner">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl ${tab.iconBgClass} mb-4`}>
                              <TabIcon className={`w-10 h-10 ${tab.iconColorClass}`} strokeWidth={1.5} />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{language === "en" ? "Image placeholder" : "Görsel yeri"}</p>
                            <p className="text-gray-400 text-xs mt-1">{language === "en" ? "Click to enlarge" : "Büyütmek için tıklayın"}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
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
        {/* Will be populated with content */}
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
              <span className="text-neutral-heading">{language === "en" ? "Architecture" : "Mimari"}</span>
            </h2>
          </motion.div>
          {/* Will be populated with content */}
        </div>
      </section>

      {/* CTA Section */}
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
