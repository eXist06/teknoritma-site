"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import {
  Zap, Settings, Layers, Link2, Globe, Trophy, Shield, TrendingUp, Stethoscope, Heart, Monitor, Wrench, FileText, Smartphone, Brain, Network
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
  const [mounted, setMounted] = useState(false);


  const tabs = [
    {
      id: "integrated-structure",
      title: language === "en" ? "Integrated Structure" : "Bütünleşik Yapı",
      icon: Layers,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en" 
        ? "Single system approach instead of fragmented solutions"
        : "Parça parça çözümler yerine tek sistem yaklaşımı",
      detail: language === "en"
        ? "Sarus EMR manages clinical, administrative and financial processes not as separate applications, but within a single integrated structure. All components operate on a common core and provide a consistent, sustainable system architecture across the institution."
        : "Sarus EMR; klinik, idari ve finansal süreçleri ayrı uygulamalar olarak değil, tek ve bütünleşik bir yapı içinde yönetir. Tüm bileşenler ortak bir çekirdek üzerinde çalışır ve kurum genelinde tutarlı, sürdürülebilir bir sistem mimarisi sağlar.",
    },
    {
      id: "ai-integration",
      title: language === "en" ? "AI Tools Integration" : "AI Araçları Entegrasyon",
      icon: Brain,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Full integration with AI tools across different clinical areas"
        : "Farklı klinik alanlarda AI araçları ile tam entegrasyon",
      detail: language === "en"
        ? ""
        : "",
    },
    {
      id: "end-to-end-solution",
      title: language === "en" ? "End-to-End Solution" : "Uçtan Uca Çözüm",
      icon: Network,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Comprehensive solution across mobile, PC, and bedside monitors"
        : "Mobil, PC ve hasta başı monitörlerde kapsamlı çözüm",
      detail: language === "en"
        ? ""
        : "",
    },
    {
      id: "scalable-structure",
      title: language === "en" ? "Scalable Structure" : "Ölçeklenebilir Yapı",
      icon: TrendingUp,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Scalable from mega hospitals and national structures to single-center hospitals"
        : "Mega hastaneler ve ulusal yapılardan tek merkezli hastanelere kadar ölçeklenebilir",
      detail: language === "en"
        ? "Sarus EMR, designed considering high user numbers and intensive transaction volumes, delivers performance, continuity and scalability in large-scale hospitals and multi-center healthcare structures."
        : "Yüksek kullanıcı sayıları ve yoğun işlem hacimleri göz önünde bulundurularak tasarlanan Sarus EMR, büyük ölçekli hastaneler ve çok merkezli sağlık yapılarında performans, süreklilik ve büyüyebilirlik sunar.",
    },
    {
      id: "standards",
      title: language === "en" ? "Standards" : "Standartlar",
      icon: Globe,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Compliance with international healthcare informatics standards"
        : "Uluslararası sağlık bilişimi standartlarıyla uyum",
      detail: language === "en"
        ? "Thanks to its structure compatible with international standards such as HL7, FHIR and DICOM, Sarus EMR enables secure and manageable data exchange with laboratory, imaging systems, medical devices and third-party software."
        : "HL7, FHIR ve DICOM gibi uluslararası standartlarla uyumlu yapısı sayesinde Sarus EMR; laboratuvar, görüntüleme sistemleri, tıbbi cihazlar ve üçüncü parti yazılımlarla güvenli ve yönetilebilir veri alışverişi sağlar.",
    },
    {
      id: "strong-clinical-components",
      title: language === "en" ? "Strong Clinical Components" : "Güçlü Klinik Bileşenler",
      icon: Stethoscope,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Design centered on clinical workflows"
        : "Klinik iş akışlarını merkeze alan tasarım",
      detail: language === "en"
        ? "Sarus EMR offers comprehensive clinical components shaped according to the daily clinical needs of physicians and healthcare personnel. It provides a user experience that supports speed, accuracy and patient safety in clinical processes."
        : "Sarus EMR, hekim ve sağlık personelinin günlük klinik ihtiyaçlarına göre şekillendirilmiş kapsamlı klinik bileşenler sunar. Klinik süreçlerde hız, doğruluk ve hasta güvenliğini destekleyen bir kullanım deneyimi sağlar.",
    },
    {
      id: "security",
      title: language === "en" ? "Security" : "Güvenlik",
      icon: Shield,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Enterprise-level data security and auditability"
        : "Kurumsal düzeyde veri güvenliği ve denetlenebilirlik",
      detail: language === "en"
        ? "All operations are made traceable through role-based authorization, access control and detailed logging mechanisms. This structure meets data security, regulatory compliance and corporate governance requirements."
        : "Rol bazlı yetkilendirme, erişim kontrolü ve detaylı kayıt (log) mekanizmaları ile tüm işlemler izlenebilir hale getirilir. Bu yapı, veri güvenliği, mevzuata uyum ve kurumsal yönetişim gereksinimlerini karşılar.",
    },
    {
      id: "integration",
      title: language === "en" ? "Integration Layer" : "Entegrasyon Katmanı",
      icon: Link2,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Sarus ICP enables seamless integration between different systems, medical devices, and third-party applications"
        : "Sarus ICP, farklı sistemler, tıbbi cihazlar ve üçüncü parti uygulamalar arasında sorunsuz entegrasyon sağlar",
      detail: language === "en"
        ? ""
        : "",
    },
    {
      id: "patient-centered",
      title: language === "en" ? "Patient-Centered Structure" : "Hasta Odaklı Yapı",
      icon: Heart,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Patient-centered design that prioritizes patient safety and care quality"
        : "Hasta güvenliği ve bakım kalitesini ön planda tutan hasta odaklı tasarım",
      detail: language === "en"
        ? ""
        : "",
    },
    {
      id: "user-friendly",
      title: language === "en" ? "User-Friendly Screens" : "Kullanıcı Dostu Ekranlar",
      icon: Monitor,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Intuitive and easy-to-use interface designed for healthcare professionals"
        : "Sağlık profesyonelleri için tasarlanmış sezgisel ve kullanımı kolay arayüz",
      detail: language === "en"
        ? ""
        : "",
    },
    {
      id: "easy-installation",
      title: language === "en" ? "Easy Installation" : "Kolay Kurulum",
      icon: Wrench,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Streamlined installation process with minimal configuration requirements"
        : "Minimum yapılandırma gereksinimleri ile sadeleştirilmiş kurulum süreci",
      detail: language === "en"
        ? ""
        : "",
    },
    {
      id: "dynamic-forms",
      title: language === "en" ? "Dynamic Clinical Forms" : "Dinamik Klinik Formlar",
      icon: FileText,
      iconBgClass: "bg-slate-50",
      iconColorClass: "text-slate-500",
      subtitle: language === "en"
        ? "Flexible and customizable clinical forms that adapt to different clinical workflows"
        : "Farklı klinik iş akışlarına uyum sağlayan esnek ve özelleştirilebilir klinik formlar",
      detail: language === "en"
        ? ""
        : "",
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

  // Track active navigation item based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["enterprise-solutions", "core-features", "success-story"];
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
      if (["enterprise-solutions", "core-features", "success-story"].includes(hash)) {
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
      <section className="relative pt-24 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-br from-background via-background-alt to-background">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ 
                duration: prefersReducedMotion ? 0 : (isMobile ? 0.1 : 0.6),
                ease: "easeOut"
              }}
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

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                <span className="text-primary">Sarus</span>{" "}
                <span className="text-neutral-heading">{t(`${translationKey}.productName`)}</span>
              </h1>

              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-heading mb-8 leading-tight tracking-tight">
                {t(`${translationKey}.tagline`)}
              </p>

              <p className="text-lg md:text-xl text-neutral-body leading-relaxed mb-6 font-medium">
                {t(`${translationKey}.description`)}
              </p>

              {t(`${translationKey}.descriptionSecond`) && (
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
              )}

              {/* Demo Request Button */}
              <div className="flex flex-wrap gap-4">
                <Link href={`${basePath}/demo-talep`}>
                  <motion.button
                    whileHover={isMobile || prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={isMobile || prefersReducedMotion ? {} : { scale: 0.95 }}
                    style={{ willChange: isMobile ? "auto" : "transform" }}
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
                    whileHover={isMobile || prefersReducedMotion ? {} : { scale: 1.05 }}
                    whileTap={isMobile || prefersReducedMotion ? {} : { scale: 0.95 }}
                    style={{ willChange: isMobile ? "auto" : "transform" }}
                    className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                  >
                    {t(`${translationKey}.explore`)}
                  </motion.button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: isMobile ? 1 : 0.9 }}
              animate={mounted ? { opacity: 1, scale: 1 } : {}}
              transition={{ 
                delay: isMobile ? 0 : (prefersReducedMotion ? 0 : 0.3),
                duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.6)
              }}
              style={{ 
                willChange: isMobile ? "opacity" : "opacity, transform",
                transform: isMobile ? "none" : "translateZ(0)"
              }}
              suppressHydrationWarning
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
      <section id="navigation" className="w-full bg-white sticky top-16 md:top-20 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 md:px-10">
          <nav className="flex overflow-x-auto scrollbar-hide items-center justify-start md:justify-center">
            {[
              {
                id: "enterprise-solutions",
                href: "#enterprise-solutions",
                label: language === "en" ? "Sarus EMR Solutions" : "Sarus HBS Çözümleri",
                icon: Layers,
              },
              {
                id: "core-features",
                href: "#core-features",
                label: language === "en" ? "Core Features" : "Temel Özellikler",
                icon: Zap,
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

      {/* Enterprise Solutions */}
      <section id="enterprise-solutions" className="py-24 md:py-36 bg-gradient-to-b from-background via-blue-50/20 to-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-heading mb-6 tracking-tight">
              <span className="text-primary">Sarus</span>{" "}
              <span className="text-neutral-heading">{language === "en" ? "EMR Solutions" : "HBS Çözümleri"}</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-body max-w-3xl mx-auto font-medium leading-relaxed">
              {language === "en" ? "Comprehensive enterprise solutions for modern healthcare facilities" : "Modern sağlık kuruluşları için kapsamlı kurumsal çözümler"}
            </p>
          </motion.div>

          {/* Enterprise Solutions Section */}
          <EnterpriseSolutionsSection />
        </div>
      </section>

      {/* Core Features Section */}
      <section id="core-features" className="mx-auto max-w-7xl px-4 md:px-10 py-24 md:py-36 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isMobile ? { opacity: 1 } : {}}
          whileInView={isMobile ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: isMobile ? "0px" : "-30px" }}
          transition={{ 
            duration: isMobile ? 0.1 : (prefersReducedMotion ? 0 : 0.4),
            ease: "easeOut"
          }}
          style={{ 
            willChange: isMobile ? "opacity" : "opacity, transform",
            transform: isMobile ? "none" : "translateZ(0)"
          }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-heading mb-6 tracking-tight">
            <span className="text-primary">Sarus</span>{" "}
            <span className="text-neutral-heading">{t(`${translationKey}.productName`)}</span>{" "}
            <span className="text-neutral-heading">{language === "en" ? "Core Features" : "Temel Özellikler"}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.map((tab, idx) => {
            const TabIcon = tab.icon;

            return (
              <motion.div
                key={tab.id}
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
                      {tab.title}
                    </h4>
                    <p className="text-sm text-neutral-body leading-relaxed">
                      {tab.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Success Story Section */}
      <section id="success-story" className="relative py-24 md:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-10 space-y-20">
          {/* Ankara City Hospital */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/bilkent.jpg"
                alt={language === "en" ? "Ankara City Hospital" : "Ankara Şehir Hastanesi"}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/30 via-neutral-800/25 to-neutral-900/30"></div>
            </div>
            
            <div className="relative z-10 px-8 md:px-12 py-20 md:py-24 min-h-[650px] md:min-h-[750px] flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : (isMobile ? 0.3 : 0.6),
                  ease: "easeOut"
                }}
                style={{ willChange: isMobile ? "opacity" : "opacity, transform" }}
                className="text-center flex justify-center mb-12"
              >
                {/* Text container with overlay ONLY behind text */}
                <div className="relative inline-block">
                  <div className="relative px-8 md:px-10 py-7 md:py-9">
                    {/* Enterprise overlay - background style */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/75 via-blue-900/65 to-neutral-900/75 rounded-xl -z-10 backdrop-blur-sm"></div>
                    <div className="absolute inset-0 bg-blue-500/25 rounded-xl -z-10"></div>
                    
                    <div className="relative z-10">
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">
                        {language === "en" ? "Ankara City Hospital" : "Ankara Şehir Hastanesi"}
                      </h2>
                      <p className="text-base md:text-lg text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
                        {language === "en" 
                          ? "Sarus EHR has been successfully serving the Ankara City Hospital project, recognized among the world's Mega Hospitals, since 2018."
                          : "Sarus HBS, dünyada Mega Hastaneler arasında gösterilen, Ankara Şehir Hastanesi projesinde 2018 yılından bu yana başarılı şekilde hizmet vermeye devam ediyor."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { 
                    value: language === "en" ? "35,000+" : "35.000+", 
                    label: language === "en" ? "Daily Outpatient Visits" : "Günlük Ayaktan Hasta" 
                  },
                  { 
                    value: language === "en" ? "10,000+" : "10.000+", 
                    label: language === "en" ? "Users" : "Kullanıcı" 
                  },
                  { 
                    value: language === "en" ? "4,000+" : "4.000+", 
                    label: language === "en" ? "Beds" : "Yatak" 
                  },
                  { 
                    value: language === "en" ? "60+" : "60+", 
                    label: language === "en" ? "End-to-End Integrated Applications" : "Uçtan Uca Entegre Uygulama" 
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ 
                      delay: prefersReducedMotion ? 0 : (isMobile ? 0 : idx * 0.1),
                      duration: prefersReducedMotion ? 0 : (isMobile ? 0.25 : 0.5),
                      ease: "easeOut"
                    }}
                    style={{ 
                      willChange: isMobile ? "opacity" : "opacity, transform",
                      transform: "translateZ(0)"
                    }}
                    className={`bg-white/98 backdrop-blur-md rounded-xl border border-neutral-200/50 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-center min-h-[140px] flex flex-col justify-center ${
                      idx === 0 ? 'px-10 md:px-12 py-6 md:py-7' : 'p-6 md:p-7'
                    }`}
                  >
                    <div className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-600 to-accent mb-3 whitespace-nowrap ${
                      idx === 0 ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-3xl md:text-4xl lg:text-5xl'
                    }`}>
                      {stat.value}
                    </div>
                    <p className="text-sm md:text-base font-semibold text-neutral-700 leading-tight">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Istanbul Bahcelievler Hospital */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            {/* Background Image - Cropped from top and bottom for better framing */}
            <div className="absolute inset-0 z-0 -my-10 md:-my-14">
              <img
                src="/bahceli.jpg"
                alt={language === "en" ? "Istanbul Bahcelievler Hospital" : "İstanbul Bahçelievler Hastanesi"}
                className="w-full h-full object-cover"
              />
              {/* Subtle overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/30 via-neutral-800/25 to-neutral-900/30"></div>
            </div>
            
            {/* Badge - Top left with trophy icon and two-line text - Enterprise Design */}
            <motion.div
              initial={{ opacity: 0, scale: isMobile || prefersReducedMotion ? 1 : 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : (isMobile ? 0.3 : 0.5),
                delay: prefersReducedMotion ? 0 : (isMobile ? 0 : 0.2)
              }}
              style={{ willChange: isMobile ? "opacity" : "opacity, transform" }}
              className="absolute top-8 md:top-12 left-6 md:left-10 z-20"
            >
              <div className="bg-gradient-to-br from-white via-white to-neutral-50/80 backdrop-blur-lg rounded-2xl px-8 md:px-10 py-6 md:py-7 shadow-2xl flex items-start gap-5 md:gap-6 border border-neutral-300/60 hover:shadow-3xl transition-shadow duration-300">
                {/* Trophy icon with background circle */}
                <div className="flex-shrink-0 mt-1">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                    <Trophy className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                  <span className="text-lg md:text-xl font-bold text-neutral-900 leading-tight tracking-tight whitespace-nowrap">
                    {language === "en" ? "Istanbul Bahcelievler Hospital" : "İstanbul Bahçelievler Hastanesi"}
                  </span>
                  <span className="text-sm md:text-base font-semibold text-primary leading-tight tracking-wide uppercase whitespace-nowrap">
                    {language === "en" 
                      ? "HIMSS EMRAM / O-EMRAM Stage 7"
                      : "HIMSS EMRAM / O-EMRAM Seviye 7"
                    }
                  </span>
                </div>
              </div>
            </motion.div>
            
            {/* Empty space for layout consistency */}
            <div className="relative z-10 px-8 md:px-12 pt-8 md:pt-12 pb-20 md:pb-24 min-h-[650px] md:min-h-[750px]">
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="demo"
        className="bg-gradient-to-br from-primary via-primary-dark to-primary text-white py-20 md:py-28 mt-12"
      >
        <div className="mx-auto max-w-5xl px-4 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : (isMobile ? 0.25 : 0.4),
              ease: "easeOut"
            }}
            style={{ willChange: isMobile ? "opacity" : "opacity, transform" }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
          >
            {t(`${translationKey}.cta.title`)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-blue-100/90 max-w-2xl mx-auto text-xl md:text-2xl font-medium leading-relaxed"
          >
            {t(`${translationKey}.cta.description`)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: isMobile || prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ 
              delay: prefersReducedMotion ? 0 : (isMobile ? 0 : 0.2),
              duration: prefersReducedMotion ? 0 : (isMobile ? 0.25 : 0.4),
              ease: "easeOut"
            }}
            style={{ willChange: isMobile ? "opacity" : "opacity, transform" }}
            className="mt-6 flex justify-center"
          >
            <Link href={`${basePath}/demo-talep`}>
              <motion.button
                whileHover={isMobile || prefersReducedMotion ? {} : { scale: 1.05 }}
                whileTap={isMobile || prefersReducedMotion ? {} : { scale: 0.95 }}
                style={{ willChange: isMobile ? "auto" : "transform" }}
                className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-primary hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
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
