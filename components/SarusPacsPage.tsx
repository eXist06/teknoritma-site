"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Zap, Shield, Sparkles, Link2, Gem, Scan, Database, Server, CheckCircle2, Settings, Trophy, Rocket, Globe, RefreshCw, Radio, Plug, Layers, Monitor, Mic, FileText, Stethoscope, ChevronDown } from "lucide-react";

export default function SarusPacsPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("solutions");
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedSolutionId, setExpandedSolutionId] = useState<string | null>(null);

  const tabs = [
    {
      id: "fastViewing",
      title: t("pacs.why.fastViewing.title"),
      icon: Zap,
      iconBgClass: "bg-sky-50",
      iconColorClass: "text-sky-600",
      subtitle: t("pacs.why.fastViewing.description"),
      detail: t("pacs.why.fastViewing.detail"),
    },
    {
      id: "reliableWorkflows",
      title: t("pacs.why.reliableWorkflows.title"),
      icon: Shield,
      iconBgClass: "bg-emerald-50",
      iconColorClass: "text-emerald-600",
      subtitle: t("pacs.why.reliableWorkflows.description"),
      detail: t("pacs.why.reliableWorkflows.detail"),
    },
    {
      id: "seamlessUX",
      title: t("pacs.why.seamlessUX.title"),
      icon: Sparkles,
      iconBgClass: "bg-indigo-50",
      iconColorClass: "text-indigo-600",
      subtitle: t("pacs.why.seamlessUX.description"),
      detail: t("pacs.why.seamlessUX.detail"),
    },
    {
      id: "integration",
      title: t("pacs.why.integration.title"),
      icon: Link2,
      iconBgClass: "bg-amber-50",
      iconColorClass: "text-amber-600",
      subtitle: t("pacs.why.integration.description"),
      detail: t("pacs.why.integration.detail"),
    },
    {
      id: "investment",
      title: t("pacs.why.investment.title"),
      icon: Gem,
      iconBgClass: "bg-cyan-50",
      iconColorClass: "text-cyan-600",
      subtitle: t("pacs.why.investment.description"),
      detail: t("pacs.why.investment.detail"),
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
      const sections = ["solutions", "core-features", "architecture", "success-story"];
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
      if (["solutions", "core-features", "architecture", "success-story"].includes(hash)) {
        setActiveNavItem(hash);
      }
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSolutionExpanded = (id: string) => {
    const newExpandedId = expandedSolutionId === id ? null : id;
    setExpandedSolutionId(newExpandedId);
    
    // Scroll to expanded panel after state update
    if (newExpandedId) {
      // Wait for animation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(`solution-panel-${newExpandedId}`);
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
      <section className="relative pt-20 pb-20 md:pt-24 md:pb-32 overflow-hidden bg-gradient-to-br from-background via-background-alt to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
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
                {t("pacs.backToHome")}
              </Link>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-primary">Sarus</span>{" "}
                <span className="text-neutral-heading">PACS</span>
              </h1>

              <p className="text-2xl md:text-3xl font-semibold text-neutral-heading mb-6">
                {t("pacs.tagline")}
              </p>

              <p className="text-lg md:text-xl text-neutral-body leading-relaxed mb-4">
                {t("pacs.description")}
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
                      {t("pacs.descriptionSecond")}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-primary hover:text-primary-dark font-semibold text-sm md:text-base transition-colors flex items-center gap-2"
                >
                  {isDescriptionExpanded ? t("pacs.collapseText") : t("pacs.expandText")}
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
                    {t("pacs.requestDemo")}
                  </motion.button>
                </Link>
                <a 
                  href="#navigation"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById('navigation');
                    if (element) {
                      // Calculate position to center the navigation section in viewport
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
                    {t("pacs.explore")}
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
                  src="/pacs-workstation.png"
                  alt={language === "en" ? "Sarus PACS Workstation" : "Sarus PACS İş İstasyonu"}
                  className="w-full h-full object-cover"
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
                id: "solutions",
                href: "#solutions",
                label: language === "en" ? "Sarus PACS Solutions" : "Sarus PACS Çözümleri",
                icon: Stethoscope,
              },
              {
                id: "core-features",
                href: "#core-features",
                label: language === "en" ? "Core Features" : "Temel Özellikler",
                icon: Layers,
              },
              {
                id: "architecture",
                href: "#architecture",
                label: language === "en" ? "Architecture" : "Mimari",
                icon: Layers,
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
      <section id="solutions" className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 bg-background">
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
            <span className="text-neutral-heading">{language === "en" ? "PACS Solutions" : "PACS Çözümleri"}</span>
          </h2>
          <p className="text-lg md:text-xl text-neutral-body max-w-3xl mx-auto mt-4">
            {t("pacs.solutions.subtitle")}
          </p>
          <div className="w-20 h-0.5 bg-primary mx-auto mt-4"></div>
        </motion.div>

        {/* Solutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
          {[
            {
              id: "webViewer",
              title: t("pacs.solutions.webViewer.title"),
              icon: Monitor,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t("pacs.solutions.webViewer.description"),
              detail: t("pacs.solutions.webViewer.detail"),
            },
            {
              id: "workstation",
              title: t("pacs.solutions.workstation.title"),
              icon: Monitor,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t("pacs.solutions.workstation.description"),
              detail: t("pacs.solutions.workstation.detail"),
            },
            {
              id: "telemedicine",
              title: t("pacs.solutions.telemedicine.title"),
              icon: Stethoscope,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t("pacs.solutions.telemedicine.description"),
              detail: t("pacs.solutions.telemedicine.detail"),
            },
            {
              id: "audioManager",
              title: t("pacs.solutions.audioManager.title"),
              icon: Mic,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t("pacs.solutions.audioManager.description"),
              detail: t("pacs.solutions.audioManager.detail"),
            },
            {
              id: "ris",
              title: t("pacs.solutions.ris.title"),
              icon: FileText,
              iconBgClass: "bg-slate-50",
              iconColorClass: "text-slate-500",
              subtitle: t("pacs.solutions.ris.description"),
              detail: t("pacs.solutions.ris.detail"),
            },
          ].map((solution, idx) => {
            const SolutionIcon = solution.icon;
            const isExpanded = expandedSolutionId === solution.id;

            return (
              <React.Fragment key={solution.id}>
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
                    onClick={() => toggleSolutionExpanded(solution.id)}
                    className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isExpanded 
                          ? "bg-primary text-white shadow-md" 
                          : `bg-gradient-to-br ${solution.iconBgClass} group-hover:from-slate-100 group-hover:to-slate-50`
                      }`}>
                        <SolutionIcon className={`w-7 h-7 transition-colors ${isExpanded ? "text-white" : `${solution.iconColorClass} group-hover:text-slate-600`}`} strokeWidth={2.5} />
                      </div>
                      
                      {/* Title */}
                      <h3 className={`text-lg font-bold transition-colors leading-tight ${
                        isExpanded 
                          ? "text-primary" 
                          : "text-gray-900 group-hover:text-primary"
                      }`}>
                        {solution.title}
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
                      id={`solution-panel-${solution.id}`}
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
                              <SolutionIcon className="w-10 h-10 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
                                {solution.title}
                              </h3>
                              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl font-bold mb-5">
                                {solution.subtitle}
                              </p>
                              {solution.detail && (
                                <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-4xl font-medium">
                                  {solution.detail}
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

      {/* Core Features Section */}
      <section id="core-features" className="mx-auto max-w-7xl px-4 md:px-10 py-24 md:py-36 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted && isMobile ? { opacity: 1 } : {}}
          whileInView={mounted && !isMobile ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: true, margin: isMobile ? "0px" : "-30px" }}
          transition={{ 
            duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.4),
            ease: "easeOut"
          }}
          style={{ 
            willChange: isMobile ? "opacity" : "opacity, transform",
            transform: isMobile ? "none" : "translateZ(0)"
          }}
          suppressHydrationWarning
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-heading mb-6 tracking-tight">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">PACS</span>{" "}
            <span className="text-neutral-heading">{language === "en" ? "Core Features" : "Temel Özellikler"}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            // Design Goals (from tabs)
            ...tabs.map(tab => ({
              id: tab.id,
              title: tab.title,
              icon: tab.icon,
              subtitle: tab.subtitle,
            })),
            // Enterprise Features
            {
              id: "dicom",
              title: t("pacs.enterpriseFeatures.dicom.title"),
              icon: Link2,
              subtitle: t("pacs.enterpriseFeatures.dicom.description"),
            },
            {
              id: "availability",
              title: t("pacs.enterpriseFeatures.availability.title"),
              icon: Zap,
              subtitle: t("pacs.enterpriseFeatures.availability.description"),
            },
            {
              id: "performance",
              title: t("pacs.enterpriseFeatures.performance.title"),
              icon: Rocket,
              subtitle: t("pacs.enterpriseFeatures.performance.description"),
            },
            {
              id: "security",
              title: t("pacs.enterpriseFeatures.security.title"),
              icon: Shield,
              subtitle: t("pacs.enterpriseFeatures.security.description"),
            },
            {
              id: "vendorNeutral",
              title: t("pacs.enterpriseFeatures.vendorNeutral.title"),
              icon: Globe,
              subtitle: t("pacs.enterpriseFeatures.vendorNeutral.description"),
            },
            {
              id: "teleradiology",
              title: t("pacs.enterpriseFeatures.teleradiology.title"),
              icon: Radio,
              subtitle: t("pacs.enterpriseFeatures.teleradiology.description"),
            },
            {
              id: "autoSync",
              title: t("pacs.integration.autoSync"),
              icon: RefreshCw,
              subtitle: t("pacs.integration.benefit1"),
            },
            {
              id: "clinicalIntegration",
              title: t("pacs.integration.clinicalIntegration"),
              icon: Plug,
              subtitle: t("pacs.integration.benefit2"),
            },
            {
              id: "standardWorkflow",
              title: t("pacs.integration.standardWorkflow"),
              icon: Settings,
              subtitle: t("pacs.integration.benefit3"),
            },
          ].map((feature, idx) => {
            const FeatureIcon = feature.icon;

            return (
              <motion.div
                key={feature.id}
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
                    <FeatureIcon className="w-7 h-7 transition-colors text-slate-500 group-hover:text-slate-600" strokeWidth={2.5} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-neutral-body leading-relaxed">
                      {feature.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Ecosystem */}
      <section id="architecture" className="mx-auto max-w-6xl px-4 md:px-10 py-16 md:py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-4">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">PACS</span>{" "}
            <span className="text-neutral-heading">{t("pacs.products.title")}</span>
          </h2>
          <p className="text-lg text-neutral-body max-w-3xl mx-auto">
            {t("pacs.ecosystem.subtitle")}
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Layer 1 - Viewing and Reporting Layer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
            <div className="pl-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"></div>
                <h3 className="text-xl md:text-2xl font-semibold text-neutral-heading">
                  {t("pacs.ecosystem.layer1.title")}
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: t("pacs.ecosystem.layer1.webViewer.title"),
                    text: t("pacs.ecosystem.layer1.webViewer.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer1.workstation.title"),
                    text: t("pacs.ecosystem.layer1.workstation.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer1.telemedicine.title"),
                    text: t("pacs.ecosystem.layer1.telemedicine.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer1.audioManager.title"),
                    text: t("pacs.ecosystem.layer1.audioManager.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer1.ris.title"),
                    text: t("pacs.ecosystem.layer1.ris.description"),
                  },
                ].map((item, idx) => (
                  <Card key={idx} title={item.title} text={item.text} layer={1} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Layer 2 - Capture, Routing and Integration Layer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-accent to-accent/50 rounded-full"></div>
            <div className="pl-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-accent shadow-lg shadow-accent/50"></div>
                <h3 className="text-xl md:text-2xl font-semibold text-neutral-heading">
                  {t("pacs.ecosystem.layer2.title")}
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: t("pacs.ecosystem.layer2.worklist.title"),
                    text: t("pacs.ecosystem.layer2.worklist.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer2.dicomRouter.title"),
                    text: t("pacs.ecosystem.layer2.dicomRouter.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer2.hl7Router.title"),
                    text: t("pacs.ecosystem.layer2.hl7Router.description"),
                  },
                ].map((item, idx) => (
                  <Card key={idx} title={item.title} text={item.text} layer={2} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Layer 3 - Storage, Archive and File Management Layer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/70 to-primary/30 rounded-full"></div>
            <div className="pl-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-primary/70 shadow-lg shadow-primary/30"></div>
                <h3 className="text-xl md:text-2xl font-semibold text-neutral-heading">
                  {t("pacs.ecosystem.layer3.title")}
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    title: t("pacs.ecosystem.layer3.imageServer.title"),
                    text: t("pacs.ecosystem.layer3.imageServer.description"),
                  },
                  {
                    title: t("pacs.ecosystem.layer3.fileRepo.title"),
                    text: t("pacs.ecosystem.layer3.fileRepo.description"),
                  },
                ].map((item, idx) => (
                  <Card key={idx} title={item.title} text={item.text} layer={3} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise section removed - merged into Core Features */}
      <section id="enterprise" className="relative border-t border-neutral-border bg-gradient-to-b from-white via-background-alt/30 to-white overflow-hidden hidden">
        {/* Decorative background elements */}
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
              <span className="text-neutral-heading">PACS</span>{" "}
              <span className="text-neutral-heading">{t("pacs.enterpriseFeatures.title")}</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-neutral-body max-w-3xl mx-auto leading-relaxed">
              {t("pacs.integration.description")}
            </p>
          </motion.div>

          <div className="space-y-4 md:space-y-6">
            {[
              {
                icon: Link2,
                type: "light",
                title: t("pacs.enterpriseFeatures.dicom.title"),
                description: t("pacs.enterpriseFeatures.dicom.description"),
              },
              {
                icon: Zap,
                type: "dark",
                title: t("pacs.enterpriseFeatures.availability.title"),
                description: t("pacs.enterpriseFeatures.availability.description"),
              },
              {
                icon: Rocket,
                type: "light",
                title: t("pacs.enterpriseFeatures.performance.title"),
                description: t("pacs.enterpriseFeatures.performance.description"),
              },
              {
                icon: Shield,
                type: "dark",
                title: t("pacs.enterpriseFeatures.security.title"),
                description: t("pacs.enterpriseFeatures.security.description"),
              },
              {
                icon: Globe,
                type: "light",
                title: t("pacs.enterpriseFeatures.vendorNeutral.title"),
                description: t("pacs.enterpriseFeatures.vendorNeutral.description"),
              },
              {
                icon: Radio,
                type: "dark",
                title: t("pacs.enterpriseFeatures.teleradiology.title"),
                description: t("pacs.enterpriseFeatures.teleradiology.description"),
              },
              {
                icon: RefreshCw,
                type: "light",
                title: t("pacs.integration.autoSync"),
                description: t("pacs.integration.benefit1"),
              },
              {
                icon: Plug,
                type: "dark",
                title: t("pacs.integration.clinicalIntegration"),
                description: t("pacs.integration.benefit2"),
              },
              {
                icon: Settings,
                type: "light",
                title: t("pacs.integration.standardWorkflow"),
                description: t("pacs.integration.benefit3"),
              },
            ].map((item, idx) => {
              const IconComponent = item.icon;
              const isEven = idx % 2 === 0;
              const isLight = item.type === "light";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  className={`group relative rounded-lg border-l-2 ${
                    isLight 
                      ? 'bg-neutral-50/50 border-neutral-300 hover:bg-neutral-100/50' 
                      : 'bg-neutral-100/50 border-neutral-400 hover:bg-neutral-200/50'
                  } overflow-hidden transition-all duration-300`}
                >
                  <div className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 p-4 md:p-6 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Icon Section */}
                    <div className={`flex-shrink-0 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                      <div className={`relative h-12 w-12 md:h-14 md:w-14 rounded-lg ${
                        isLight 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'bg-primary/20 border-primary/30'
                      } border flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-primary" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`flex-1 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                      <h3 className={`text-lg md:text-xl font-semibold ${
                        isLight ? 'text-neutral-700' : 'text-neutral-800'
                      } mb-2 group-hover:text-neutral-900 transition-colors duration-300`}>
                        {item.title}
                      </h3>
                      <p className={`text-sm md:text-base ${
                        isLight ? 'text-neutral-600' : 'text-neutral-700'
                      } leading-relaxed`}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Connecting line */}
                  {idx < 8 && (
                    <div className={`absolute ${isEven ? 'left-8 md:left-10' : 'right-8 md:right-10'} bottom-0 w-0.5 h-4 md:h-6 ${
                      isLight ? 'bg-neutral-300' : 'bg-neutral-400'
                    } opacity-40`}></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-6xl px-4 md:px-10 py-16 md:py-24 bg-background-alt">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-6">
            {t("pacs.useCases.title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: t("pacs.useCases.singleCenter.title"),
              description: t("pacs.useCases.singleCenter.description"),
            },
            {
              title: t("pacs.useCases.cityHospitals.title"),
              description: t("pacs.useCases.cityHospitals.description"),
            },
            {
              title: t("pacs.useCases.imagingCenters.title"),
              description: t("pacs.useCases.imagingCenters.description"),
            },
            {
              title: t("pacs.useCases.teleradiology.title"),
              description: t("pacs.useCases.teleradiology.description"),
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
              className="bg-white rounded-2xl border border-neutral-border p-6 shadow-sm"
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

      {/* Statistics Section */}
      <section id="success-story" className="relative py-24 md:py-36 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bilkent.jpg"
            alt={language === "en" ? "Bilkent City Hospital" : "Bilkent Şehir Hastanesi"}
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/40 via-neutral-800/35 to-neutral-900/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t("pacs.stats.title")}
            </h2>
            <p className="text-lg text-white/90 max-w-4xl mx-auto leading-relaxed">
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
                className="bg-white/95 backdrop-blur-sm rounded-xl border border-neutral-border p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center"
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-lg text-white font-semibold">
              {t("pacs.stats.archive")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-background-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-4">
              {t("pacs.testimonials.title")}
            </h2>
            <p className="text-xl text-neutral-body max-w-3xl mx-auto">
              {t("pacs.testimonials.subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
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
            ].map((testimonial, idx) => (
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
                    <h4 className="text-lg md:text-xl font-bold text-neutral-heading mb-1">
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
            {t("pacs.cta.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-blue-100 max-w-2xl mx-auto text-lg"
          >
            {t("pacs.cta.description")}
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
                {t("pacs.requestDemo")}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

type ValueCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  detail?: string;
  iconBgClass?: string;
  iconColorClass?: string;
};

function ValueCard({
  icon,
  title,
  subtitle,
  detail,
  iconBgClass = "bg-sky-50",
  iconColorClass = "text-sky-600",
}: ValueCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border-2 border-neutral-border/60 bg-white p-5 md:p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBgClass} shadow-sm`}>
          <div className={`${iconColorClass} text-xl`}>{icon}</div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-semibold text-neutral-heading mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm md:text-base text-neutral-body leading-relaxed mb-3">
            {subtitle}
          </p>
          {detail && (
            <p className="text-xs md:text-sm text-neutral-body/75 font-medium leading-relaxed">
              {detail}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

type CardProps = {
  title: string;
  text: string;
  layer?: number;
};

function Card({ title, text, layer = 0 }: CardProps) {
  const layerStyles = {
    1: {
      border: "border-l-4 border-l-primary",
      bg: "bg-gradient-to-br from-primary/5 to-white",
      hover: "hover:shadow-primary/20",
    },
    2: {
      border: "border-l-4 border-l-accent",
      bg: "bg-gradient-to-br from-accent/5 to-white",
      hover: "hover:shadow-accent/20",
    },
    3: {
      border: "border-l-4 border-l-primary/70",
      bg: "bg-gradient-to-br from-primary/10 to-white",
      hover: "hover:shadow-primary/20",
    },
  };

  const style = layerStyles[layer as keyof typeof layerStyles] || {
    border: "border border-neutral-border",
    bg: "bg-white",
    hover: "",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className={`rounded-2xl ${style.bg} shadow-sm ${style.border} border-neutral-border p-4 md:p-6 hover:shadow-lg transition-all ${style.hover}`}
    >
      <h4 className="text-base md:text-lg font-semibold text-neutral-heading mb-2">
        {title}
      </h4>
      <p className="text-sm text-neutral-body leading-relaxed">{text}</p>
    </motion.div>
  );
}

type FeatureProps = {
  title: string;
  children: React.ReactNode;
};

function FeatureItem({ title, children }: FeatureProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="rounded-2xl bg-background-alt border border-neutral-border p-4 md:p-6"
    >
      <h4 className="text-lg md:text-xl font-semibold text-neutral-heading mb-2">
        {title}
      </h4>
      <p className="text-sm text-neutral-body leading-relaxed">{children}</p>
    </motion.div>
  );
}
