"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Zap, Shield, Sparkles, Link2, Gem, Scan, Target, Database, Server, CheckCircle2, Settings, Trophy, Rocket, Globe, RefreshCw, Radio, Plug } from "lucide-react";

export default function SarusPacsPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("design-goals");

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
      const sections = ["design-goals", "ecosystem", "enterprise", "achievements"];
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
      if (["design-goals", "ecosystem", "enterprise", "achievements"].includes(hash)) {
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
      <section id="navigation" className="w-full bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <nav className="flex flex-wrap items-center justify-center">
            {[
              {
                id: "design-goals",
                href: "#design-goals",
                label: t("pacs.why.title"),
                icon: Target,
              },
              {
                id: "ecosystem",
                href: "#ecosystem",
                label: language === "en" ? "Architecture" : "Mimari",
                icon: Settings,
              },
              {
                id: "enterprise",
                href: "#enterprise",
                label: language === "en" ? "Enterprise" : "Enterprise",
                icon: Zap,
              },
              {
                id: "achievements",
                href: "#achievements",
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
                        : 'text-gray-600 group-hover:text-primary'
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

      {/* Why Sarus PACS */}
      <section id="design-goals" className="mx-auto max-w-7xl px-4 md:px-10 py-16 md:py-24 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-3">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">PACS</span>{" "}
            <span className="text-neutral-heading">{t("pacs.why.title")}</span>
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
                {(() => {
                  const IconComponent = tab.icon;
                  return <IconComponent className={`w-7 h-7 ${tab.iconColorClass}`} strokeWidth={2.5} />;
                })()}
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

      {/* Ecosystem */}
      <section id="ecosystem" className="mx-auto max-w-6xl px-4 md:px-10 py-16 md:py-24 bg-background">
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

      {/* Enterprise Features & Integration */}
      <section id="enterprise" className="relative border-t border-neutral-border bg-gradient-to-b from-white via-background-alt/30 to-white overflow-hidden">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
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
      <section id="achievements" className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/bilkent.jpg"
            alt="Bilkent Şehir Hastanesi"
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
