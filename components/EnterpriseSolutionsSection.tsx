"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Link2, Globe, Pill, Activity, ChevronDown, Stethoscope, Building2, DollarSign, Brain } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface EnterpriseSolution {
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  bulletsTr?: string[];
  bulletsEn?: string[];
}

export const EnterpriseSolutionsSection: React.FC = () => {
  const { language } = useI18n();
  const isEn = language === "en";
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const enterpriseSolutions: EnterpriseSolution[] = [
    {
      id: "clinical-applications",
      icon: Stethoscope,
      titleTr: "Klinik Uygulamalar",
      titleEn: "Clinical Applications",
      descriptionTr: "Ayaktan/yatan hasta süreçleri, klinik branş modülleri ve temel klinik iş akışları",
      descriptionEn: "Outpatient/inpatient processes, clinical specialty modules and core clinical workflows",
      bulletsTr: [
        "Randevu ve kabul süreçleri: Acil, Ayaktan Hasta, Yatan Hasta, Danışma/Bilgi Masası",
        "Poliklinik, Yatan Hasta, Yoğun Bakım, Acil, Hemşirelik, Teletıp modülleri",
        "Branş modülleri: Onkoloji, Ortopedi, Kadın Doğum, Ağız & Diş, Psikoloji, Diyet, FTR, IVF, Hemodiyaliz vb.",
        "Laboratuvar, Kan Merkezi, Genetik, Patoloji, Radyoloji entegrasyonlu klinik akışlar",
      ],
      bulletsEn: [
        "Appointment and admission processes: Emergency, Outpatient, Inpatient, Consultation/Information Desk",
        "Outpatient Clinic, Inpatient, Intensive Care, Emergency, Nursing, Telemedicine modules",
        "Specialty modules: Oncology, Orthopedics, Obstetrics & Gynecology, Oral & Dental, Psychology, Dietetics, Physical Therapy, IVF, Hemodialysis, etc.",
        "Clinical workflows integrated with Laboratory, Blood Bank, Genetics, Pathology, Radiology (RIS/PACS)",
      ],
    },
    {
      id: "administrative-applications",
      icon: Building2,
      titleTr: "Yönetsel Uygulamalar",
      titleEn: "Administrative Applications",
      descriptionTr: "Satınalma, stok/lojistik, hizmet yönetimi",
      descriptionEn: "Procurement, inventory/logistics, service management",
      bulletsTr: [
        "Satınalma yönetimi: satınalma, ihale, tedarikçiler",
        "Stok/varlık yönetimi: demirbaş, envanter, lojistik, kaynak planlama",
        "Hizmet yönetimi: ameliyathane, temizlik, yemek, yazılım platformu, atık yönetimi",
        "İK yönetimi: personel, bordro, eğitim, planlama, performans göstergeleri",
        "Kalite yönetimi ve Cihaz yönetimi (maliyet, bakım, onarım, kalibrasyon, takip)",
      ],
      bulletsEn: [
        "Procurement management: purchasing, tendering, suppliers",
        "Inventory/asset management: fixed assets, inventory, logistics, resource planning",
        "Service management: operating room, cleaning, catering, software platform, waste management",
        "HR management: personnel, payroll, training, planning, KPIs",
        "Quality management and Device management (cost, maintenance, repair, calibration, tracking)",
      ],
    },
    {
      id: "financial-applications",
      icon: DollarSign,
      titleTr: "Finansal Uygulamalar",
      titleEn: "Financial Applications",
      descriptionTr: "Faturalama, sigorta, maliyet, vezne ve döner sermaye süreçleri",
      descriptionEn: "Billing, insurance, cost, cash desk and revolving fund processes",
      bulletsTr: [
        "Finans yönetimi: faturalama, sigorta, maliyet ve kaynak planlama",
        "Döner sermaye, faturalama ve finansal işlemler modülü",
        "Vezne modülü",
        "İstatistik ve raporlama ile finansal görünürlük",
      ],
      bulletsEn: [
        "Financial management: billing, insurance, cost and resource planning",
        "Revolving fund, billing and financial transactions module",
        "Cash Desk module",
        "Financial visibility with statistics and reporting",
      ],
    },
    {
      id: "clinical-decision-support",
      icon: Brain,
      titleTr: "Klinik Karar Destek Sistemleri",
      titleEn: "Clinical Decision Support Systems",
      descriptionTr: "Karar destek, kalite ve performans izleme katmanı",
      descriptionEn: "Decision support, quality and performance monitoring layer",
      bulletsTr: [
        "Karar Destek Sistemi bileşenleri",
        "Klinik süreçlerde hata azaltma ve verimlilik izleme yaklaşımı",
        "Performans göstergeleri ile planlama ve performans takibi",
      ],
      bulletsEn: [
        "Decision Support System (DSS) components",
        "Error reduction and efficiency monitoring approach in clinical processes",
        "Planning and performance tracking with KPIs",
      ],
    },
    {
      id: "integrated-solutions",
      icon: LayoutGrid,
      titleTr: "Entegre Çözümler",
      titleEn: "Integrated Solutions",
      descriptionTr: "Hastane operasyonlarını destekleyen uçtan uca özel süreç ve ekran yönetimi",
      descriptionEn: "End-to-end custom process and screen management supporting hospital operations",
      bulletsTr: [
        "Sterilizasyon, çamaşırhane, kemoterapi, TPN, yemek, temizlik, atık yönetimi gibi süreçler için yazılım geliştirme ve süreç tasarımı",
        "Bilgilendirme ekranlarının merkezi yönetimi ve HBS'ye bilgi akışı",
      ],
      bulletsEn: [
        "Software development and process design for processes such as sterilization, laundry, chemotherapy, TPN, catering, cleaning, waste management",
        "Central management of Information (Digital Signage) screens and information flow to HIS",
      ],
    },
    {
      id: "integration",
      icon: Link2,
      titleTr: "Entegrasyon",
      titleEn: "Integration",
      descriptionTr: "SOA uyumlu entegrasyon altyapısı ve standartlara uygun veri akışı",
      descriptionEn: "SOA-compliant integration infrastructure and standards-compliant data flow",
      bulletsTr: [
        "SOA uyumlu entegrasyon altyapısı tasarımı",
        "Gateway / ESB / RFID ile tüm entegrasyonların yönetimi",
        "HL7 ve DICOM gibi standartlarla Radyoloji Bilgi Sistemi, Görüntü Arşivleme ve İletişim Sistemi, Laboratuvar Bilgi Sistemi ve 3. parti sistem entegrasyonları",
      ],
      bulletsEn: [
        "SOA-compliant integration infrastructure design",
        "Management of all integrations with Gateway / ESB / RFID",
        "RIS/PACS/LIS and third-party system integrations with standards such as HL7 and DICOM",
      ],
    },
    {
      id: "mobile-solutions",
      icon: Globe,
      titleTr: "Mobil Çözümler",
      titleEn: "Mobile Solutions",
      descriptionTr: "Saha operasyonlarında hız, doğruluk ve klinik verimlilik için mobil kullanım",
      descriptionEn: "Mobile usage for speed, accuracy and clinical efficiency in field operations",
      bulletsTr: [
        "Kan alma noktaları ve kemoterapide mobil çözümler",
        "Acil, yoğun bakım ve servislerde tablet kullanımı",
        "Pnömatik sistem için mobil uygulama",
        "Mobil hasta asistanı ve konum/yön bulma uygulaması",
      ],
      bulletsEn: [
        "Mobile solutions at blood collection points and chemotherapy",
        "Tablet usage in emergency, intensive care and wards",
        "Mobile application for pneumatic system",
        "Mobile patient assistant and location/wayfinding application",
      ],
    },
    {
      id: "patient-drug-safety",
      icon: Pill,
      titleTr: "Hasta-İlaç Kullanım Güvenliği",
      titleEn: "Patient-Drug Usage Safety",
      descriptionTr: "Bileklik, QR ve personel doğrulama ile ilaç uygulama güvenliği",
      descriptionEn: "Medication administration safety with wristband, QR and staff verification",
      bulletsTr: [
        "Yatan hasta ve kemoterapi hastaları için bileklik kullanımı",
        "İlaç QR kodu + uygulayan personel kimlik kartı ile hasta-ilaç güvenliği",
      ],
      bulletsEn: [
        "Wristband usage for inpatient and chemotherapy patients",
        "Patient-drug safety with medication QR code + administering staff ID card",
      ],
    },
    {
      id: "operating-room",
      icon: Activity,
      titleTr: "Ameliyathane Yönetimi",
      titleEn: "Operating Room Management",
      descriptionTr: "Ameliyat doğrulama, sarf yönetimi ve steril kullanım senaryoları",
      descriptionEn: "Surgery verification, consumables management and sterile usage scenarios",
      bulletsTr: [
        "Ameliyathanede hasta ve operasyon doğrulama: bileklik okuma + steril PC kullanımı",
        "Sarf yönetimi: ameliyathanede sarf malzemelerinin QR kod ile yönetimi",
        "Ameliyathane süreçleri: ameliyathane, sterilizasyon, post-op akışları",
      ],
      bulletsEn: [
        "Patient and operation verification in operating room: wristband reading + sterile PC usage",
        "Consumables management: QR code management of consumables in operating room",
        "Operating room processes: operating room, sterilization, post-op workflows",
      ],
    },
  ];

  const toggleExpanded = (id: string) => {
    const newExpandedId = expandedId === id ? null : id;
    setExpandedId(newExpandedId);
    
    // Scroll to expanded panel after state update
    if (newExpandedId) {
      // Wait for animation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(`detail-panel-${newExpandedId}`);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
      {enterpriseSolutions.map((solution, idx) => {
        const IconComponent = solution.icon;
        const title = isEn ? solution.titleEn : solution.titleTr;
        const description = isEn ? solution.descriptionEn : solution.descriptionTr;
        const bullets = isEn ? solution.bulletsEn : solution.bulletsTr;
        const isExpanded = expandedId === solution.id;

        // Calculate grid position for this card
        const cardIndex = idx;
        const isLastInRow = (cardIndex + 1) % 3 === 0 || (cardIndex + 1) === enterpriseSolutions.length;

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
                onClick={() => toggleExpanded(solution.id)}
                className="w-full flex items-start justify-between p-6 text-left hover:bg-gray-50/50 transition-all duration-200"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isExpanded 
                      ? "bg-primary text-white shadow-md" 
                      : `bg-gradient-to-br from-slate-50 to-slate-50 group-hover:from-slate-100 group-hover:to-slate-50`
                  }`}>
                    <IconComponent className={`w-7 h-7 transition-colors ${isExpanded ? "text-white" : "text-slate-500 group-hover:text-slate-600"}`} strokeWidth={2.5} />
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-lg font-bold transition-colors leading-tight ${
                    isExpanded 
                      ? "text-primary" 
                      : "text-gray-900 group-hover:text-primary"
                  }`}>
                    {title}
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
                  id={`detail-panel-${solution.id}`}
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
                      <div className="flex items-start gap-6 mb-10">
                        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                          <IconComponent className="w-10 h-10 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5 leading-tight tracking-tight">
                            {title}
                          </h3>
                          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl font-semibold">
                            {description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Features Section */}
                      {bullets && bullets.length > 0 && (
                        <div className="mt-10 pt-10 border-t-2 border-primary/20">
                          <h4 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
                            {isEn ? "Key Features" : "Temel Özellikler"}
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            {bullets.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} className="flex items-start gap-3 text-base md:text-lg text-gray-800">
                                <span className="text-primary text-xl mt-1 flex-shrink-0">●</span>
                                <span className="font-medium leading-relaxed">
                                  {bullet}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        );
      })}
    </div>
  );
};


