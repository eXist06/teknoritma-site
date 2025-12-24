"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import LisWorkflowDiagram from "@/components/LisWorkflowDiagram";
import React from "react";
import { Zap, Clipboard, BarChart3, FlaskConical, CheckCircle2, RefreshCw, Settings, Wrench, Trophy, FileText, CreditCard, Database, TrendingUp, Link2, Globe, Building2, Lock, Layers, ChevronDown } from "lucide-react";

export default function SarusLbsPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const translationKey = language === "en" ? "lims" : "lbs";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("platform-features");
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

  const tabs = [
    {
      id: "workflowEfficiency",
      title: t(`${translationKey}.why.workflowEfficiency.title`),
      icon: Zap,
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
      subtitle: t(`${translationKey}.why.workflowEfficiency.description`),
      detail: t(`${translationKey}.why.workflowEfficiency.detail`),
    },
    {
      id: "orderManagement",
      title: t(`${translationKey}.why.orderManagement.title`),
      icon: Clipboard,
      iconBgClass: "bg-green-50",
      iconColorClass: "text-green-600",
      subtitle: t(`${translationKey}.why.orderManagement.description`),
      detail: t(`${translationKey}.why.orderManagement.detail`),
    },
    {
      id: "resultReporting",
      title: t(`${translationKey}.why.resultReporting.title`),
      icon: BarChart3,
      iconBgClass: "bg-purple-50",
      iconColorClass: "text-purple-600",
      subtitle: t(`${translationKey}.why.resultReporting.description`),
      detail: t(`${translationKey}.why.resultReporting.detail`),
    },
    {
      id: "instrumentIntegration",
      title: t(`${translationKey}.why.instrumentIntegration.title`),
      icon: FlaskConical,
      iconBgClass: "bg-amber-50",
      iconColorClass: "text-amber-600",
      subtitle: t(`${translationKey}.why.instrumentIntegration.description`),
      detail: t(`${translationKey}.why.instrumentIntegration.detail`),
    },
    {
      id: "qualityControl",
      title: t(`${translationKey}.why.qualityControl.title`),
      icon: CheckCircle2,
      iconBgClass: "bg-cyan-50",
      iconColorClass: "text-cyan-600",
      subtitle: t(`${translationKey}.why.qualityControl.description`),
      detail: t(`${translationKey}.why.qualityControl.detail`),
    },
  ];

  // Detect mobile and reduced motion preference
  useEffect(() => {
    setMounted(true);
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
      setActiveTab((prev) => (prev + 1) % 5);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Track active navigation item based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["platform-features", "core-features", "workflow", "success-story"];
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
      if (["platform-features", "core-features", "workflow", "success-story"].includes(hash)) {
        setActiveNavItem(hash);
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleFeatureExpanded = (id: string) => {
    const newExpandedId = expandedFeatureId === id ? null : id;
    setExpandedFeatureId(newExpandedId);
    
    // Scroll to expanded panel after state update
    if (newExpandedId) {
      // Wait for animation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(`feature-panel-${newExpandedId}`);
        if (element) {
          // Get element position
          const elementRect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTop = elementRect.top + scrollTop;
          
          // Calculate center position: viewport center minus half of element height
          const viewportCenter = window.innerHeight / 2;
          const elementHeight = elementRect.height;
          const targetScroll = elementTop - viewportCenter + (elementHeight / 2);
          
          // Add some padding from top (for header/navbar)
          const headerOffset = 100;
          const finalScroll = Math.max(0, targetScroll - headerOffset);
          
          window.scrollTo({
            top: finalScroll,
            behavior: 'smooth'
          });
        }
      }, 350); // Wait for animation to complete (300ms animation + 50ms buffer)
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-br from-background via-background-alt to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.6) }}
              style={{ 
                willChange: isMobile ? "opacity" : "opacity, transform",
                transform: isMobile ? "none" : "translateZ(0)"
              }}
              suppressHydrationWarning
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
                <Link href={language === "en" ? "/en/request-demo" : "/demo-talep"}>
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
                  alt={language === "en" ? "Sarus LIS Laboratory System" : "Sarus LBYS Laboratuvar Sistemi"}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation Buttons Section */}
      <section id="navigation" className="w-full bg-white sticky top-16 md:top-20 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 md:px-10">
          <nav className="flex overflow-x-auto scrollbar-hide items-center justify-start md:justify-center">
            {[
              {
                id: "platform-features",
                href: "#platform-features",
                label: language === "en" ? "Sarus LIS Solutions" : "Sarus LBYS Çözümleri",
                icon: Layers,
              },
              {
                id: "core-features",
                href: "#core-features",
                label: language === "en" ? "Core Features" : "Temel Özellikler",
                icon: Layers,
              },
              {
                id: "workflow",
                href: "#workflow",
                label: language === "en" ? "Workflow" : "İş Akışı",
                icon: RefreshCw,
              },
              {
                id: "success-story",
                href: "#success-story",
                label: language === "en" ? "Success Story" : "Başarı Hikayesi",
                icon: Trophy,
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
                      const headerHeight = isMobile ? 64 : 80;
                      const navHeight = isMobile ? 80 : 100;
                      const offset = headerHeight + navHeight;
                      window.scrollTo({
                        top: absoluteElementTop - offset,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`group relative flex flex-col items-center justify-center gap-1 md:gap-2 px-4 md:px-8 py-3 md:py-5 min-w-[80px] md:min-w-0
                    transition-all duration-200 ease-out cursor-pointer touch-manipulation
                    border-b-2 -mb-px select-none flex-shrink-0
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
                    <IconComponent className="w-5 h-5 md:w-8 md:h-8" strokeWidth={2} />
                  </div>
                  <span 
                    className={`text-[10px] md:text-sm font-medium whitespace-nowrap tracking-wide pointer-events-none
                      transition-all duration-200 leading-tight
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

      {/* Solutions Section */}
      <section id="platform-features" className="mx-auto max-w-7xl px-4 md:px-10 py-20 md:py-28 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? (isMobile ? { opacity: 1 } : {}) : {}}
          whileInView={mounted && !isMobile ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
          transition={{ duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.4) }}
          style={{ 
            willChange: isMobile ? "opacity" : "opacity, transform",
            transform: isMobile ? "none" : "translateZ(0)"
          }}
          suppressHydrationWarning
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-3">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">{language === "en" ? "LIS Solutions" : "LBYS Çözümleri"}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-neutral-body max-w-3xl mx-auto">
            {t(`${translationKey}.features.subtitle`)}
          </p>
        </motion.div>

        {/* Solutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
          {[
            {
              id: "orderEntry",
              title: t(`${translationKey}.features.orderEntry.title`),
              icon: FileText,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.orderEntry.description`),
              detail: t(`${translationKey}.features.orderEntry.detail`),
            },
            {
              id: "resultManagement",
              title: t(`${translationKey}.features.resultManagement.title`),
              icon: BarChart3,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.resultManagement.description`),
              detail: t(`${translationKey}.features.resultManagement.detail`),
            },
            {
              id: "instrumentInterface",
              title: t(`${translationKey}.features.instrumentInterface.title`),
              icon: FlaskConical,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.instrumentInterface.description`),
              detail: t(`${translationKey}.features.instrumentInterface.detail`),
            },
            {
              id: "qualityControl",
              title: t(`${translationKey}.features.qualityControl.title`),
              icon: CheckCircle2,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.qualityControl.description`),
              detail: t(`${translationKey}.features.qualityControl.detail`),
            },
            {
              id: "workflowManagement",
              title: t(`${translationKey}.features.workflowManagement.title`),
              icon: RefreshCw,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.workflowManagement.description`),
              detail: t(`${translationKey}.features.workflowManagement.detail`),
            },
            {
              id: "billing",
              title: t(`${translationKey}.features.billing.title`),
              icon: CreditCard,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.billing.description`),
              detail: t(`${translationKey}.features.billing.detail`),
            },
            {
              id: "reporting",
              title: t(`${translationKey}.features.reporting.title`),
              icon: TrendingUp,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.reporting.description`),
              detail: t(`${translationKey}.features.reporting.detail`),
            },
            {
              id: "integration",
              title: t(`${translationKey}.features.integration.title`),
              icon: Link2,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.integration.description`),
              detail: t(`${translationKey}.features.integration.detail`),
            },
            {
              id: "webAccess",
              title: t(`${translationKey}.features.webAccess.title`),
              icon: Globe,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t(`${translationKey}.features.webAccess.description`),
              detail: t(`${translationKey}.features.webAccess.detail`),
            },
          ].map((feature, idx) => {
            const FeatureIcon = feature.icon;
            const isExpanded = expandedFeatureId === feature.id;

            return (
              <React.Fragment key={feature.id}>
                {/* Card */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={mounted && isMobile ? { opacity: 1 } : {}}
                  whileInView={mounted && !isMobile ? { opacity: 1, y: 0 } : {}}
                  viewport={{ once: true, margin: isMobile ? "0px" : "-20px" }}
                  transition={{ 
                    delay: isMobile ? 0 : (prefersReducedMotion ? 0 : idx * 0.05),
                    duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.3),
                    ease: "easeOut"
                  }}
                  style={{ 
                    willChange: isMobile ? "opacity" : "opacity, transform",
                    transform: isMobile ? "none" : "translateZ(0)"
                  }}
                  suppressHydrationWarning
                  className="bg-white rounded-xl border border-gray-200/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 group"
                >
                  {/* Header - Always Visible */}
                  <button
                    onClick={() => toggleFeatureExpanded(feature.id)}
                    className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isExpanded 
                          ? "bg-primary text-white shadow-md" 
                          : `bg-gradient-to-br ${feature.iconBgClass} group-hover:from-slate-100 group-hover:to-slate-50`
                      }`}>
                        <FeatureIcon className={`w-7 h-7 transition-colors ${isExpanded ? "text-white" : `${feature.iconColorClass} group-hover:text-slate-600`}`} strokeWidth={2.5} />
                      </div>
                      
                      {/* Title */}
                      <h3 className={`text-lg font-bold transition-colors leading-tight ${
                        isExpanded 
                          ? "text-primary" 
                          : "text-gray-900 group-hover:text-primary"
                      }`}>
                        {feature.title}
                      </h3>
                    </div>

                    {/* Chevron Icon */}
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4 mt-1"
                    >
                      <ChevronDown className={`w-6 h-6 transition-colors ${isExpanded ? "text-primary" : "text-gray-400"}`} strokeWidth={2.5} />
                    </motion.div>
                  </button>
                </motion.div>

                {/* Expandable Detail Panel - Below the clicked card, full width */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`feature-panel-${feature.id}`}
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 20 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden scroll-mt-24"
                    >
                      <div className="bg-gradient-to-br from-blue-50/90 via-slate-50/90 to-white rounded-xl border-2 border-primary/30 shadow-2xl p-8 md:p-10 lg:p-12 relative overflow-hidden">
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                          backgroundImage: `radial-gradient(circle at 2px 2px, #1e40af 1px, transparent 0)`,
                          backgroundSize: '40px 40px'
                        }}></div>
                        <div className="relative z-10">
                          {/* Header Section */}
                          <div className="flex items-start gap-6 mb-12">
                            <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-xl`}>
                              <FeatureIcon className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                                {feature.title}
                              </h3>
                              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl font-bold mb-5">
                                {feature.subtitle}
                              </p>
                              {feature.detail && (
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-4xl font-medium">
                                  {feature.detail}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Core Features Section - Combined with Architecture */}
      <section id="core-features" className="mx-auto max-w-7xl px-4 md:px-10 py-20 md:py-28 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted && isMobile ? { opacity: 1 } : {}}
          whileInView={mounted && !isMobile ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
          transition={{ 
            duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.6),
            ease: "easeOut"
          }}
          style={{ 
            willChange: isMobile ? "opacity" : "opacity, transform",
            transform: isMobile ? "none" : "translateZ(0)"
          }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-3">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">{language === "en" ? "LIS Core Features" : "LBYS Temel Özellikler"}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
          <p className="text-lg text-neutral-body max-w-3xl mx-auto">
            {language === "en" ? "Comprehensive LIS solution for laboratory management" : "Laboratuvar yönetimi için kapsamlı LBYS çözümü"}
          </p>
        </motion.div>

        {/* Cards Grid - Sarus HBS Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            // Core Features from tabs
            ...tabs.map(tab => ({
              id: tab.id,
              title: tab.title,
              subtitle: tab.subtitle,
              icon: tab.icon,
            })),
            // Architecture features
            {
              id: "scalable",
              title: t(`${translationKey}.architecture.scalable.title`),
              subtitle: t(`${translationKey}.architecture.scalable.description`),
              icon: TrendingUp,
            },
            {
              id: "integration",
              title: t(`${translationKey}.architecture.integration.title`),
              subtitle: t(`${translationKey}.architecture.integration.description`),
              icon: Link2,
            },
            {
              id: "security",
              title: t(`${translationKey}.architecture.security.title`),
              subtitle: t(`${translationKey}.architecture.security.description`),
              icon: Lock,
            },
            {
              id: "realTime",
              title: t(`${translationKey}.architecture.realTime.title`),
              subtitle: t(`${translationKey}.architecture.realTime.description`),
              icon: Zap,
            },
            {
              id: "customizable",
              title: t(`${translationKey}.architecture.customizable.title`),
              subtitle: t(`${translationKey}.architecture.customizable.description`),
              icon: Settings,
            },
            {
              id: "multiSite",
              title: t(`${translationKey}.architecture.multiSite.title`),
              subtitle: t(`${translationKey}.architecture.multiSite.description`),
              icon: Building2,
            },
          ].map((item, idx) => {
            const TabIcon = item.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={mounted && isMobile ? { opacity: 1 } : {}}
                whileInView={mounted && !isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
                transition={{ 
                  delay: isMobile ? 0 : (prefersReducedMotion ? 0 : idx * 0.05),
                  duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.3)
                }}
                style={{ 
                  willChange: isMobile ? "opacity" : "opacity, transform",
                  transform: isMobile ? "none" : "translateZ(0)"
                }}
                suppressHydrationWarning
                className="bg-white rounded-xl border border-gray-200/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/40 group"
              >
                <div className="flex items-start gap-4 p-6">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 bg-gradient-to-br from-slate-50 to-slate-50 group-hover:from-slate-100 group-hover:to-slate-50">
                    <TabIcon className="w-7 h-7 transition-colors text-slate-500 group-hover:text-slate-600" strokeWidth={2.5} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-neutral-body leading-relaxed">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="w-full px-4 md:px-6 py-12 md:py-16 bg-background">
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

      {/* Use Cases Section */}
      <section className="mx-auto max-w-7xl px-4 md:px-10 py-20 md:py-28 bg-background-alt">
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
              initial={{ opacity: 0 }}
              animate={isMobile ? { opacity: 1 } : {}}
              whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: isMobile ? "0px" : "-50px" }}
              transition={{ 
                delay: isMobile ? 0 : (prefersReducedMotion ? 0 : idx * 0.1),
                duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.3)
              }}
              style={{ 
                willChange: isMobile ? "opacity" : "opacity, transform",
                transform: isMobile ? "none" : "translateZ(0)"
              }}
              whileHover={{ y: -2 }}
              className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h4>
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Story Section */}
      <section id="success-story" className="relative py-20 md:py-28 overflow-hidden">
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-10">
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

