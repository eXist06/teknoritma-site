"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import {
  Zap, Settings, Layers, RefreshCw, Trophy,
  ClipboardList, ClipboardCheck, BarChart3, Microscope, CheckCircle2,
  FileEdit, CreditCard, TrendingUp, Link2, Globe, Lock,
  Users, Calendar, BedDouble, LayoutGrid, Activity,
  Heart, FileText, Stethoscope, Search, Pill, Receipt, FlaskConical, Scan,
  Clock, Building2, Hospital, AlertCircle, UserCheck, Video,
  Clipboard, PenTool, Eye, Syringe, FileCheck,
  Workflow, Dna, Dumbbell, Utensils,
  UserCog, Droplets, ShoppingCart,
  Warehouse, Package, Database, BarChart2, Server, Baby
} from "lucide-react";
import { moduleHierarchy } from "@/data/moduleHierarchy";
import type { ModuleNode } from "@/types/modules";
import { IntegratedSystemCard } from "./IntegratedSystemCard";
import { ModuleCard } from "./ModuleCard";

export default function SarusHISPage() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  const translationKey = "sarus";
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("core-features");
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());
  const [activeDomainId, setActiveDomainId] = useState("clinical-care");
  
  // Get all modules from translations for lookup
  const resourcePlanning: any = t("sarus.modules.resourcePlanning");
  const medical: any = t("sarus.modules.medical");
  const clinic: any = t("sarus.modules.clinic");
  const administrative: any = t("sarus.modules.administrative");
  
  // Create a flat map of all modules for lookup
  const allModulesMap = new Map();
  [...(clinic?.modules || []), ...(medical?.modules || []), ...(resourcePlanning?.modules || []), ...(administrative?.modules || [])].forEach((mod: any) => {
    if (mod.id) allModulesMap.set(mod.id, mod);
  });

  // ID mapping for modules that have different IDs in hierarchy vs translations
  const moduleIdMapping: Record<string, string> = {
    "central-local-appointment": "appointment-system",
    "emergency": "emergency-management",
    "icu": "intensive-care",
    "nursing": "nursing-management",
    "radiotherapy-chemo-diag": "radiotherapy-chemotherapy",
    "ris": "radiology-ris",
    "procurement-fixed-assets": "procurement-assets",
    "sterilization-logistics": "sterilization",
    "genetics-lab": "genetics",
  };

  // Module image mapping - Removed, using only icons now
  const moduleImageMap: Record<string, string> = {};

  // Healthicons mapping - User provided mapping
  const moduleHealthIconMap: Record<string, { icon: string; category: string; variant?: 'outline' | 'filled' }> = {
    // Clinical Core Journey
    "central-local-appointment": { icon: "calendar", category: "objects" },
    "reception": { icon: "admissions", category: "specialties" },
    "policlinic": { icon: "hospital", category: "places" },
    "inpatient": { icon: "inpatient", category: "devices" },
    "emergency": { icon: "critical_care", category: "specialties" },
    "icu": { icon: "ecmo", category: "devices" },
    "nursing": { icon: "nurse", category: "people" },
    "telemedicine": { icon: "mobile", category: "devices" },
    "patient-monitoring": { icon: "observation", category: "devices" },
    "patient-chart": { icon: "medical_records", category: "specialties" },
    "doctor-notes": { icon: "i_note_action", category: "symbols" }, // Note icon
    "examination": { icon: "stethoscope", category: "devices" },
    "medication": { icon: "medicines", category: "medications" },
    "prescription": { icon: "prescription_document", category: "objects" },
    "lab-integration": { icon: "microscope", category: "devices" },
    "radiology-integration": { icon: "radiology", category: "specialties" },
    "operating-rooms": { icon: "ecmo", category: "devices" },
    
    // Clinical Specialties
    "oncology": { icon: "oncology", category: "specialties" },
    "orthopedics": { icon: "orthopaedics", category: "specialties" },
    "gynecology": { icon: "gynecology", category: "specialties" },
    "oral-dental": { icon: "tooth", category: "body" },
    "hemodialysis": { icon: "nephrology", category: "specialties" },
    "ivf": { icon: "obstetricsmonia", category: "specialties" },
    "physiotherapy": { icon: "physical_therapy", category: "specialties" },
    "diet": { icon: "hot_meal", category: "nutrition" },
    "social-services": { icon: "social_work", category: "specialties" },
    "medical-board": { icon: "i_groups_perspective_crowd", category: "people" },
    "mortuary": { icon: "ui_folder", category: "symbols" },
    
    // Diagnostics
    "laboratory": { icon: "medical_sample", category: "devices" },
    "blood-center": { icon: "blood_transfusion", category: "symbols" },
    "genetics-lab": { icon: "enzyme", category: "body" },
    "pathology": { icon: "microscope", category: "devices" },
    "ris": { icon: "radiology", category: "specialties" },
    "pacs": { icon: "radiology", category: "specialties" },
    "nuclear-medicine": { icon: "radiology", category: "specialties" }, // Nuclear medicine icon not found, using radiology
    "radiotherapy-chemo-diag": { icon: "blood_bag", category: "blood" },
    "pharmacy": { icon: "pharmacy", category: "specialties" },
    
    // Admin & Enterprise
    "revolving-funds": { icon: "finance_dept", category: "specialties" },
    "cash-desk": { icon: "money_bag", category: "objects" },
    "appointment": { icon: "calendar", category: "objects" },
    "bed-management": { icon: "hospitalized", category: "devices" },
    "room-tracking": { icon: "inpatient", category: "devices" },
    "resource-planning": { icon: "chart_bar", category: "graphs" },
    "stock-tracking": { icon: "chart_bar_stacked", category: "graphs" },
    "procurement-fixed-assets": { icon: "coins", category: "objects" },
    "equipment-tracking": { icon: "machinery", category: "vehicles" },
    "cleaning-laundry": { icon: "cleaning", category: "objects" },
    "sterilization-logistics": { icon: "surgical_sterilization", category: "devices" },
    "human-resources": { icon: "human_resoruces", category: "specialties" },
    "records-archives": { icon: "book", category: "objects" },
    "statistics-reporting": { icon: "chart_line", category: "graphs" },
    "system-management": { icon: "interoperability", category: "symbols" },
  };

  // Helper function to get healthicon local path
  // Healthicons structure: svg/{variant}-24px/{category}/{icon_name}.svg
  // Icon names are in snake_case format
  const getHealthIconUrl = (iconName: string, category: string, variant: 'outline' | 'filled' = 'outline'): string | null => {
    try {
      // Convert icon name to snake_case (healthicons uses underscores)
      const snakeIconName = iconName.toLowerCase().replace(/\s+/g, '_').replace(/-/g, '_');
      
      // Path format: /icons/healthicons/svg/{variant}/{category}/{icon_name}.svg
      return `/icons/healthicons/svg/${variant}/${category}/${snakeIconName}.svg`;
    } catch (error) {
      console.warn(`Failed to create healthicon path for ${iconName}:`, error);
      return null;
    }
  };

  // Module visual icon mapping - Modül ID'sine göre görsel icon'ları
  const moduleVisualIconMap: Record<string, any> = {
    // Clinical Core Journey
    "central-local-appointment": Clock,
    "reception": Building2,
    "policlinic": Hospital,
    "inpatient": BedDouble,
    "emergency": AlertCircle,
    "icu": Activity, // Heart monitor alternative
    "nursing": UserCheck,
    "telemedicine": Video,
    "patient-monitoring": Activity,
    "patient-chart": Clipboard,
    "doctor-notes": PenTool,
    "examination": Eye,
    "medication": Pill,
    "prescription": FileCheck,
    "lab-integration": FlaskConical,
    "radiology-integration": Scan,
    "operating-rooms": Heart, // Will use Heart as alternative
    "appointment-system": Clock,
    
    // Clinical Specialties
    "oncology": Dna,
    "orthopedics": Activity,
    "gynecology": Heart,
    "oral-dental": Users,
    "hemodialysis": Droplets,
    "ivf": Baby,
    "physiotherapy": Dumbbell,
    "diet": Utensils,
    "social-services": Users,
    "medical-board": ClipboardCheck,
    "mortuary": Package, // Alternative for Coffin
    
    // Diagnostics
    "laboratory": FlaskConical,
    "blood-center": Droplets,
    "genetics-lab": Dna,
    "pathology": Microscope,
    "ris": Scan, // Alternative for XRay
    "pacs": Scan,
    "nuclear-medicine": AlertCircle, // Alternative for Radioactive
    "radiotherapy-chemo-diag": Zap, // Alternative for Atom
    "pharmacy": Pill,
    "transfusion": Droplets,
    
    // Admin & Enterprise
    "revolving-funds": CreditCard,
    "cash-desk": Receipt,
    "appointment": Calendar,
    "bed-management": BedDouble,
    "room-tracking": LayoutGrid,
    "resource-planning": Settings,
    "stock-tracking": Warehouse,
    "procurement-fixed-assets": ShoppingCart,
    "equipment-tracking": Package,
    "cleaning-laundry": RefreshCw, // Alternative for WashingMachine
    "sterilization-logistics": RefreshCw,
    "human-resources": UserCog,
    "records-archives": Database,
    "statistics-reporting": BarChart2,
    "system-management": Server,
  };

  // Map module hierarchy with translations
  const enrichModuleNode = (node: ModuleNode): any => {
    if (node.type === "module") {
      // Try direct ID match first, then try mapped ID
      const mappedId = moduleIdMapping[node.id] || node.id;
      const translationData = allModulesMap.get(mappedId) || allModulesMap.get(node.id);
      
      // Get visual icon (for large icon display) - önce healthicon, yoksa Lucide icon
      const lucideIcon = moduleVisualIconMap[node.id] || moduleVisualIconMap[mappedId];
      const healthIconData = moduleHealthIconMap[node.id] || moduleHealthIconMap[mappedId];
      
      // Healthicon URL'i oluştur
      const healthIconUrl = healthIconData 
        ? getHealthIconUrl(healthIconData.icon, healthIconData.category, healthIconData.variant || 'outline')
        : null;
      
      return {
        ...node,
        title: translationData?.title || node.name,
        shortDescription: translationData?.shortDescription || "",
        description: translationData?.description || translationData?.shortDescription || "",
        icon: translationData?.icon || "FileText",
        image: null, // Images removed, using only icons
        visualIcon: lucideIcon || FileText, // Fallback to Lucide icon
        healthIconUrl: healthIconUrl, // Healthicon URL for SVG display
      };
    }
    
    if (node.children) {
      return {
        ...node,
        children: node.children.map(enrichModuleNode),
      };
    }
    
    return node;
  };

  const enrichedHierarchy = moduleHierarchy.map(enrichModuleNode);

  // Domain and cluster translations
  const domainTranslations: Record<string, { tr: string; en: string; descTr?: string; descEn?: string }> = {
    "clinical-care": {
      tr: "Tıbbi Modüller",
      en: "Clinical Care (EMR Core)",
      descTr: "Temel EMR iş akışları: muayeneler, hemşirelik, uzman bakım, tele-sağlık.",
      descEn: "Core EMR workflows: encounters, nursing, specialty care, telehealth."
    },
    "diagnostics-package": {
      tr: "Tetkik-Tedavi Modülleri",
      en: "Diagnostics Package (LIS / RIS / PACS)",
      descTr: "Laboratuvar, görüntüleme, patoloji, eczane ve transfüzyon hizmetleri.",
      descEn: "Laboratory, imaging, pathology, pharmacy and transfusion services."
    },
    "admin-enterprise": {
      tr: "İdari ve Finansal Modüller",
      en: "Administrative & Enterprise",
      descTr: "Gelir döngüsü, lojistik, İK, kayıtlar ve sistem yönetimi.",
      descEn: "Revenue cycle, logistics, HR, records and system management."
    }
  };

  const clusterTranslations: Record<string, { tr: string; en: string }> = {
    "clinical-core-journey": { tr: "Temel Hasta Yolculuğu ve Klinik İş Akışı", en: "Core Patient Journey & Clinical Workflow" },
    "clinical-surgical": { tr: "Cerrahi ve Prosedürel Bakım", en: "Surgical & Procedural Care" },
    "clinical-specialties": { tr: "Uzman Modüller", en: "Specialty Clinical Programs" },
    "diagnostics-lab": { tr: "Laboratuvar ve Transfüzyon", en: "Laboratory & Transfusion" },
    "diagnostics-pathology": { tr: "Patoloji ve Sitoloji", en: "Pathology & Cytology" },
    "diagnostics-imaging": { tr: "Görüntüleme ve Radyoloji", en: "Imaging & Radiology" },
    "diagnostics-onco": { tr: "Onkoloji Tanı ve Planlama", en: "Oncology Diagnostics & Planning" },
    "diagnostics-pharmacy": { tr: "Eczane ve İlaç Yönetimi", en: "Pharmacy & Medication Management" },
    "admin-revenue-cycle": { tr: "Hasta Yönetimi ve Gelir Döngüsü", en: "Patient Administration & Revenue Cycle" },
    "admin-resource-planning": { tr: "Kaynak Planlama ve Programlama", en: "Resource Planning & Scheduling" },
    "admin-logistics": { tr: "Malzeme Yönetimi ve Lojistik", en: "Materials Management & Logistics" },
    "admin-hr": { tr: "İK", en: "Human Capital Management" },
    "admin-info-governance": { tr: "Bilgi Yönetimi, Raporlama ve BT", en: "Information Governance, Reporting & IT" },
  };

  const toggleCluster = (clusterId: string) => {
    setExpandedClusters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clusterId)) {
        newSet.delete(clusterId);
      } else {
        newSet.add(clusterId);
      }
      return newSet;
    });
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  // Icon mapping
  const iconMap: Record<string, any> = {
    Users, Calendar, BedDouble, LayoutGrid, Activity, ClipboardCheck,
    Heart, FileText, Stethoscope, Search, Pill, Receipt, FlaskConical, Scan,
    Clock, Building2, Hospital, AlertCircle, UserCheck, Video,
    Clipboard, PenTool, Eye, Syringe, FileCheck,
    Workflow, Dna, Baby, Dumbbell, Utensils,
    UserCog, Droplets, ShoppingCart,
    Warehouse, Package, Database, BarChart2, Server,
  };

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
      const sections = ["core-features", "platform-features", "architecture", "modules", "enterprise-solutions"];
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
      if (["core-features", "platform-features", "architecture", "modules", "enterprise-solutions"].includes(hash)) {
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
              {
                id: "modules",
                href: "#modules",
                label: language === "en" ? "Modules" : "Modüller",
                icon: ClipboardCheck,
              },
              {
                id: "enterprise-solutions",
                href: "#enterprise-solutions",
                label: language === "en" ? "Enterprise Solutions" : "Kurumsal Çözümler",
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tabs.map((tab, idx) => {
            const TabIcon = tab.icon;
            return (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -2 }}
                className={`group relative bg-white border border-gray-200 rounded-lg p-6 md:p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${
                  activeTab === idx
                    ? "border-primary shadow-md"
                    : "shadow-sm"
                }`}
              >
                {activeTab === idx && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary rounded-t-lg"></div>
                )}
                <div className="mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${tab.iconBgClass} transition-transform duration-300 group-hover:scale-105`}>
                    <TabIcon className={`${tab.iconColorClass} w-6 h-6`} strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                    {tab.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-3">
                    {tab.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <IntegratedSystemCard
              icon={LayoutGrid}
              title={language === "en" ? "Integrated Solutions" : "Entegre Çözümler"}
              features={[
                language === "en" ? "Software development and process design (Sterilization, Laundry, Chemotherapy, TPN, Catering, Cleaning Waste Management, etc.)" : "Yazılım geliştirme ve süreç tasarımı (Sterilizasyon, Çamaşır, Kemoterapi, TPN, Catering, Temizlik, Atık Yönetimi, vb.)",
                language === "en" ? "Central management of Information Digital Signage screens and information flow to HIMS" : "Bilgi Dijital Tabela ekranlarının merkezi yönetimi ve HIMS'e bilgi akışı"
              ]}
              gradient="bg-gradient-to-r from-blue-600 to-cyan-600"
              delay={0.1}
            />

            <IntegratedSystemCard
              icon={Link2}
              title={language === "en" ? "Integration" : "Entegrasyon"}
              features={[
                language === "en" ? "Integration infrastructure design compliant to Service Oriented Architecture (SOA)" : "Hizmet Odaklı Mimari (SOA) uyumlu entegrasyon altyapı tasarımı",
                language === "en" ? "Management of all integrations by Gateway, ESB and RFID systems" : "Tüm entegrasyonların Gateway, ESB ve RFID sistemleri ile yönetimi"
              ]}
              gradient="bg-gradient-to-r from-sky-600 to-blue-600"
              delay={0.2}
            />

            <IntegratedSystemCard
              icon={Globe}
              title={language === "en" ? "Mobile Solutions" : "Mobil Çözümler"}
              features={[
                language === "en" ? "Mobile solutions in blood-taking points and Chemotherapy" : "Kan alma noktaları ve Kemoterapi'de mobil çözümler",
                language === "en" ? "Tablet usage in emergency service, intensive care and inpatient services" : "Acil servis, yoğun bakım ve yatan hasta hizmetlerinde tablet kullanımı",
                language === "en" ? "Mobile application for pneumatic system" : "Pnömatik sistem için mobil uygulama",
                language === "en" ? "Mobile patient assistant and Location/Way finding application" : "Mobil hasta asistanı ve Konum/Yol bulma uygulaması"
              ]}
              gradient="bg-gradient-to-r from-cyan-600 to-blue-600"
              delay={0.3}
            />

            <IntegratedSystemCard
              icon={Pill}
              title={language === "en" ? "Patient-Drug Usage Safety" : "Hasta-İlaç Kullanım Güvenliği"}
              features={[
                language === "en" ? "Wristband for inpatient and chemotherapy patients" : "Yatan hasta ve kemoterapi hastaları için bileklik",
                language === "en" ? "Ensuring patient-drug usage safety by reading of drug QR code, administering personnel ID card" : "İlaç QR kodu ve uygulayıcı personel kimlik kartı okunarak hasta-ilaç kullanım güvenliğinin sağlanması"
              ]}
              gradient="bg-gradient-to-r from-blue-700 to-indigo-600"
              delay={0.4}
            />

            <IntegratedSystemCard
              icon={Activity}
              title={language === "en" ? "Operating Room Management" : "Ameliyathane Yönetimi"}
              features={[
                language === "en" ? "Patient and operation validation check in operating rooms by reading of patient wristband with use of sterile PCs" : "Steril PC'ler kullanılarak hasta bilekliği okunarak ameliyathanelerde hasta ve operasyon doğrulama kontrolü",
                language === "en" ? "Operation management by reading QR code of consumables in operating rooms" : "Ameliyathanelerde tüketim malzemelerinin QR kodunun okunması ile operasyon yönetimi"
              ]}
              gradient="bg-gradient-to-r from-indigo-600 to-blue-600"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* Modules Section - Mega Menu */}
      <section id="modules" className="py-20 md:py-32 bg-gradient-to-b from-background via-background-alt/30 to-background relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white/80 backdrop-blur-xl p-6 lg:p-10 shadow-2xl border border-neutral-border/50"
          >
            <div className="flex flex-col gap-8">
              {/* Domain kartları - üstte yan yana */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-neutral-heading">
                  {language === "en" ? "Modules & Solutions" : "Modüller ve Çözümler"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {enrichedHierarchy.map((domain: any) => {
                    const domainTranslation = domainTranslations[domain.id] || { tr: domain.name, en: domain.name, descTr: domain.description, descEn: domain.description };
                    const domainName = language === "en" ? domainTranslation.en : domainTranslation.tr;
                    const domainDesc = language === "en" ? domainTranslation.descEn : domainTranslation.descTr;
                    const isActive = domain.id === activeDomainId;

                    const domainColors = {
                      "clinical-care": { 
                        active: "bg-gradient-to-br from-emerald-500 to-green-600 text-white border-emerald-400 shadow-lg", 
                        inactive: "bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 text-slate-700 hover:text-emerald-900 border-slate-200 hover:border-emerald-300",
                        icon: Stethoscope,
                        iconActive: "text-white",
                        iconInactive: "text-emerald-600"
                      },
                      "diagnostics-package": { 
                        active: "bg-gradient-to-br from-blue-500 to-cyan-600 text-white border-blue-400 shadow-lg", 
                        inactive: "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 text-slate-700 hover:text-blue-900 border-slate-200 hover:border-blue-300",
                        icon: FlaskConical,
                        iconActive: "text-white",
                        iconInactive: "text-blue-600"
                      },
                      "admin-enterprise": { 
                        active: "bg-gradient-to-br from-slate-500 to-slate-600 text-white border-slate-400 shadow-lg", 
                        inactive: "bg-white hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:border-slate-300",
                        icon: ClipboardCheck,
                        iconActive: "text-white",
                        iconInactive: "text-slate-600"
                      },
                    };
                    const colors = domainColors[domain.id as keyof typeof domainColors] || domainColors["clinical-care"];
                    const DomainIcon = colors.icon;

                    return (
                      <motion.button
                        key={domain.id}
                        onClick={() => {
                          setActiveDomainId(domain.id);
                          // Mobilde modüllerin gösterildiği ilk yere scroll et
                          if (isMobile) {
                            setTimeout(() => {
                              // Önce domain içeriğinin başladığı yere bak
                              const domainContent = document.getElementById(`domain-content-${domain.id}`);
                              if (domainContent) {
                                const elementRect = domainContent.getBoundingClientRect();
                                const absoluteElementTop = elementRect.top + window.pageYOffset;
                                // Navigation bar yüksekliği + biraz padding
                                const offset = 120;
                                window.scrollTo({
                                  top: absoluteElementTop - offset,
                                  behavior: 'smooth'
                                });
                              } else {
                                // Fallback: modüller bölümüne scroll et
                                const modulesSection = document.getElementById('modules');
                                if (modulesSection) {
                                  const elementRect = modulesSection.getBoundingClientRect();
                                  const absoluteElementTop = elementRect.top + window.pageYOffset;
                                  const offset = 120;
                                  window.scrollTo({
                                    top: absoluteElementTop - offset,
                                    behavior: 'smooth'
                                  });
                                }
                              }
                            }, 150); // State güncellenmesi ve render için gecikme
                          }
                        }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`rounded-xl px-6 py-5 text-left transition-all duration-300 border-2 relative overflow-hidden group cursor-pointer ${
                          isActive ? colors.active : colors.inactive
                        }`}
                      >
                        {/* Hover gradient overlay */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                        
                        <div className="flex flex-col gap-3 relative z-10">
                          <div className={`flex items-center gap-3 ${isActive ? colors.iconActive : colors.iconInactive}`}>
                            <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-current/10'} transition-colors`}>
                              <DomainIcon className="w-6 h-6" strokeWidth={2.5} />
                            </div>
                            <div className="font-bold text-base lg:text-lg">{domainName}</div>
                          </div>
                          {domainDesc && (
                            <div className={`text-sm font-normal leading-relaxed ${isActive ? 'text-white/90' : 'text-slate-600'}`}>
                              {domainDesc}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Seçili domain'in içeriği */}
              <div id={`domain-content-${activeDomainId}`} className="space-y-8 mt-4">
                {(() => {
                  const activeDomain = enrichedHierarchy.find((d: any) => d.id === activeDomainId);
                  if (!activeDomain) return null;

                  const domainTranslation = domainTranslations[activeDomain.id] || { tr: activeDomain.name, en: activeDomain.name, descTr: activeDomain.description, descEn: activeDomain.description };
                  const domainName = language === "en" ? domainTranslation.en : domainTranslation.tr;
                  const domainDesc = language === "en" ? domainTranslation.descEn : domainTranslation.descTr;

                  const domainTheme = {
                    "clinical-care": { 
                      gradient: "from-emerald-500 to-green-600",
                      bgLight: "bg-emerald-50",
                      border: "border-emerald-200",
                      text: "text-emerald-700",
                      badge: "bg-emerald-100 text-emerald-700 border-emerald-200"
                    },
                    "diagnostics-package": { 
                      gradient: "from-blue-500 to-cyan-600",
                      bgLight: "bg-blue-50",
                      border: "border-blue-200",
                      text: "text-blue-700",
                      badge: "bg-blue-100 text-blue-700 border-blue-200"
                    },
                    "admin-enterprise": { 
                      gradient: "from-blue-600 via-sky-500 to-cyan-500",
                      bgLight: "bg-blue-50",
                      border: "border-blue-200",
                      text: "text-blue-700",
                      badge: "bg-blue-100 text-blue-700 border-blue-200"
                    },
                  };
                  const theme = domainTheme[activeDomain.id as keyof typeof domainTheme] || domainTheme["clinical-care"];

                  // Admin-enterprise için özel görünüm
                  const isAdminEnterprise = activeDomain.id === "admin-enterprise";
                  
                  const filteredClusters = activeDomain.children?.filter((cluster: any) => {
                    // Türkçe'de cerrahi cluster'ını gizle
                    if (language !== "en" && cluster.id === "clinical-surgical" && (!cluster.children || cluster.children.length === 0)) {
                      return false;
                    }
                    // Boş cluster'ları gizle
                    return cluster.children && cluster.children.length > 0;
                  }) || [];

                  return (
                    <>
                      <motion.header 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-baseline justify-between gap-4 pb-6 border-b-2 border-gray-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-1 h-12 bg-gradient-to-b ${theme.gradient} rounded-full`}></div>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-neutral-heading">
                              {domainName}
                            </h3>
                          </div>
                          {domainDesc && (
                            <p className="text-base text-slate-600 leading-relaxed pl-4">
                              {domainDesc}
                            </p>
                          )}
                        </div>
                      </motion.header>

                      {isAdminEnterprise ? (
                        // Admin-enterprise için: Cluster başlıkları altında modül kartları (mavi tonları)
                        <div className="space-y-10">
                          {filteredClusters.map((cluster: any, clusterIdx: number) => {
                            const clusterTranslation = clusterTranslations[cluster.id] || { tr: cluster.name, en: cluster.name };
                            const clusterTitle = language === "en" ? clusterTranslation.en : clusterTranslation.tr;

                            // Modülleri alfabetik olarak sırala
                            const sortedModules = [...(cluster.children || [])].sort((a: any, b: any) => {
                              const titleA = (a.title || a.name || "").toLowerCase();
                              const titleB = (b.title || b.name || "").toLowerCase();
                              return titleA.localeCompare(titleB, language === "tr" ? "tr" : "en");
                            });

                            return (
                              <motion.div
                                key={cluster.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: clusterIdx * 0.1 }}
                                className="space-y-6"
                              >
                                {/* Cluster Başlığı */}
                                <div className="flex items-center gap-4 pb-3 border-b-2 border-blue-200">
                                  <div className="w-1 h-10 bg-gradient-to-b from-blue-600 via-sky-500 to-cyan-500 rounded-full"></div>
                                  <h4 className="text-2xl md:text-3xl font-bold text-blue-900">
                                    {clusterTitle}
                                  </h4>
                                  <span className="ml-auto text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                    {sortedModules.length} {language === "en" ? "modules" : "modül"}
                                  </span>
                                </div>

                                {/* Modül Kartları Grid */}
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {sortedModules.map((mod: any, modIdx: number) => {
                                    const IconComponent = iconMap[mod.icon] || FileText;
                                    return (
                                      <ModuleCard
                                        key={mod.id}
                                        icon={IconComponent}
                                        title={mod.title || mod.name}
                                        description={mod.shortDescription || mod.description}
                                        gradient="bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500"
                                        delay={(clusterIdx * 0.1) + (modIdx * 0.03)}
                                        image={mod.image}
                                        visualIcon={mod.visualIcon}
                                        healthIconUrl={mod.healthIconUrl}
                                      />
                                    );
                                  })}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        // Diğer domain'ler için: Cluster başlıkları altında modül kartları
                        <div className="space-y-10">
                          {filteredClusters.map((cluster: any, clusterIdx: number) => {
                            const clusterTranslation = clusterTranslations[cluster.id] || { tr: cluster.name, en: cluster.name };
                            const clusterTitle = language === "en" ? clusterTranslation.en : clusterTranslation.tr;

                            // Modülleri alfabetik olarak sırala
                            const sortedModules = [...(cluster.children || [])].sort((a: any, b: any) => {
                              const titleA = (a.title || a.name || "").toLowerCase();
                              const titleB = (b.title || b.name || "").toLowerCase();
                              return titleA.localeCompare(titleB, language === "tr" ? "tr" : "en");
                            });

                            return (
                              <motion.div
                                key={cluster.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: clusterIdx * 0.1 }}
                                className="space-y-6"
                              >
                                {/* Cluster Başlığı */}
                                <div className="flex items-center gap-4 pb-3 border-b-2 border-gray-200">
                                  <div className={`w-1 h-10 bg-gradient-to-b ${theme.gradient} rounded-full`}></div>
                                  <h4 className="text-2xl md:text-3xl font-bold text-neutral-heading">
                                    {clusterTitle}
                                  </h4>
                                  <span className="ml-auto text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                    {sortedModules.length} {language === "en" ? "modules" : "modül"}
                                  </span>
                                </div>

                                {/* Modül Kartları Grid */}
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {sortedModules.map((mod: any, modIdx: number) => {
                                    const IconComponent = iconMap[mod.icon] || FileText;
                                    return (
                                      <ModuleCard
                                        key={mod.id}
                                        icon={IconComponent}
                                        title={mod.title || mod.name}
                                        description={mod.shortDescription || mod.description}
                                        gradient={`bg-gradient-to-r ${theme.gradient}`}
                                        delay={(clusterIdx * 0.1) + (modIdx * 0.03)}
                                        image={mod.image}
                                        visualIcon={mod.visualIcon}
                                        healthIconUrl={mod.healthIconUrl}
                                      />
                                    );
                                  })}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
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
