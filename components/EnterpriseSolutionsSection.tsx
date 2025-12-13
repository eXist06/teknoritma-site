"use client";

import React, { useState } from "react";
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

  const enterpriseSolutions: EnterpriseSolution[] = [
    {
      id: "clinical-applications",
      icon: Stethoscope,
      titleTr: "Klinik Uygulamalar",
      titleEn: "Clinical Applications",
      descriptionTr: "Klinik süreçlerin dijitalleştirilmesi ve optimizasyonu için kapsamlı uygulama çözümleri. Hasta bakım kalitesini artıran, klinik karar destek sistemleri ile entegre çalışan modüller.",
      descriptionEn: "Comprehensive application solutions for digitization and optimization of clinical processes. Modules that improve patient care quality and work integrated with clinical decision support systems.",
      bulletsTr: [
        "Elektronik hasta kaydı (EHR) ve klinik dokümantasyon",
        "Reçete yönetimi ve ilaç takip sistemleri",
        "Klinik karar destek mekanizmaları",
        "Hasta güvenliği ve kalite yönetimi",
      ],
      bulletsEn: [
        "Electronic health record (EHR) and clinical documentation",
        "Prescription management and medication tracking systems",
        "Clinical decision support mechanisms",
        "Patient safety and quality management",
      ],
    },
    {
      id: "administrative-applications",
      icon: Building2,
      titleTr: "Yönetsel Uygulamalar",
      titleEn: "Administrative Applications",
      descriptionTr: "Hastane yönetim süreçlerinin dijitalleştirilmesi ve otomasyonu için yönetsel uygulama çözümleri. Operasyonel verimliliği artıran, kaynak yönetimini optimize eden sistemler.",
      descriptionEn: "Administrative application solutions for digitization and automation of hospital management processes. Systems that increase operational efficiency and optimize resource management.",
      bulletsTr: [
        "Randevu ve hasta akış yönetimi",
        "Personel ve vardiya planlama sistemleri",
        "Doküman yönetimi ve arşivleme",
        "Raporlama ve analitik araçlar",
      ],
      bulletsEn: [
        "Appointment and patient flow management",
        "Staff and shift planning systems",
        "Document management and archiving",
        "Reporting and analytics tools",
      ],
    },
    {
      id: "financial-applications",
      icon: DollarSign,
      titleTr: "Finansal Uygulamalar",
      titleEn: "Financial Applications",
      descriptionTr: "Hastane finansal süreçlerinin yönetimi ve optimizasyonu için finansal uygulama çözümleri. Gelir döngüsü yönetimi, maliyet kontrolü ve finansal raporlama sistemleri.",
      descriptionEn: "Financial application solutions for management and optimization of hospital financial processes. Revenue cycle management, cost control, and financial reporting systems.",
      bulletsTr: [
        "Gelir döngüsü yönetimi (Revenue Cycle Management)",
        "Faturalama ve tahsilat sistemleri",
        "Maliyet analizi ve bütçe yönetimi",
        "Finansal raporlama ve dashboard'lar",
      ],
      bulletsEn: [
        "Revenue cycle management (RCM)",
        "Billing and collection systems",
        "Cost analysis and budget management",
        "Financial reporting and dashboards",
      ],
    },
    {
      id: "clinical-decision-support",
      icon: Brain,
      titleTr: "Klinik Karar Destek Sistemleri",
      titleEn: "Clinical Decision Support Systems",
      descriptionTr: "Klinisyenlere doğru karar vermelerinde yardımcı olan, kanıta dayalı tıp prensiplerine uygun karar destek sistemleri. Hasta güvenliğini artıran, klinik sonuçları iyileştiren çözümler.",
      descriptionEn: "Decision support systems that help clinicians make the right decisions, in accordance with evidence-based medicine principles. Solutions that increase patient safety and improve clinical outcomes.",
      bulletsTr: [
        "Klinik kılavuz ve protokol yönetimi",
        "İlaç etkileşim ve kontrendikasyon kontrolü",
        "Otomatik uyarı ve hatırlatma sistemleri",
        "Klinik performans metrikleri ve analitik",
      ],
      bulletsEn: [
        "Clinical guideline and protocol management",
        "Drug interaction and contraindication control",
        "Automatic alert and reminder systems",
        "Clinical performance metrics and analytics",
      ],
    },
    {
      id: "integrated-solutions",
      icon: LayoutGrid,
      titleTr: "Entegre Çözümler",
      titleEn: "Integrated Solutions",
      descriptionTr: "Yazılım geliştirme ve süreç tasarımı (Sterilizasyon, Çamaşır, Kemoterapi, TPN, Catering, Temizlik, Atık Yönetimi, vb.)",
      descriptionEn: "Software development and process design (Sterilization, Laundry, Chemotherapy, TPN, Catering, Cleaning Waste Management, etc.)",
      bulletsTr: [
        "Bilgi Dijital Tabela ekranlarının merkezi yönetimi ve HIMS'e bilgi akışı",
        "Süreç optimizasyonu ve otomasyon çözümleri",
        "Entegre sistem mimarisi ile veri akışı yönetimi",
      ],
      bulletsEn: [
        "Central management of Information Digital Signage screens and information flow to HIMS",
        "Process optimization and automation solutions",
        "Integrated system architecture with data flow management",
      ],
    },
    {
      id: "integration",
      icon: Link2,
      titleTr: "Entegrasyon",
      titleEn: "Integration",
      descriptionTr: "Hizmet Odaklı Mimari (SOA) uyumlu entegrasyon altyapı tasarımı",
      descriptionEn: "Integration infrastructure design compliant to Service Oriented Architecture (SOA)",
      bulletsTr: [
        "Tüm entegrasyonların Gateway, ESB ve RFID sistemleri ile yönetimi",
        "RESTful API ve web servis entegrasyonları",
        "Gerçek zamanlı veri senkronizasyonu ve güvenli veri aktarımı",
      ],
      bulletsEn: [
        "Management of all integrations by Gateway, ESB and RFID systems",
        "RESTful API and web service integrations",
        "Real-time data synchronization and secure data transfer",
      ],
    },
    {
      id: "mobile-solutions",
      icon: Globe,
      titleTr: "Mobil Çözümler",
      titleEn: "Mobile Solutions",
      descriptionTr: "Kan alma noktaları ve Kemoterapi'de mobil çözümler",
      descriptionEn: "Mobile solutions in blood-taking points and Chemotherapy",
      bulletsTr: [
        "Acil servis, yoğun bakım ve yatan hasta hizmetlerinde tablet kullanımı",
        "Pnömatik sistem için mobil uygulama",
        "Mobil hasta asistanı ve Konum/Yol bulma uygulaması",
        "Mobil cihazlarda gerçek zamanlı hasta bilgisi erişimi",
      ],
      bulletsEn: [
        "Tablet usage in emergency service, intensive care and inpatient services",
        "Mobile application for pneumatic system",
        "Mobile patient assistant and Location/Way finding application",
        "Real-time patient information access on mobile devices",
      ],
    },
    {
      id: "patient-drug-safety",
      icon: Pill,
      titleTr: "Hasta-İlaç Kullanım Güvenliği",
      titleEn: "Patient-Drug Usage Safety",
      descriptionTr: "Yatan hasta ve kemoterapi hastaları için bileklik",
      descriptionEn: "Wristband for inpatient and chemotherapy patients",
      bulletsTr: [
        "İlaç QR kodu ve uygulayıcı personel kimlik kartı okunarak hasta-ilaç kullanım güvenliğinin sağlanması",
        "Otomatik ilaç dozaj kontrolü ve uyarı sistemi",
        "İlaç etkileşim kontrolü ve yan etki takibi",
      ],
      bulletsEn: [
        "Ensuring patient-drug usage safety by reading of drug QR code, administering personnel ID card",
        "Automatic drug dosage control and alert system",
        "Drug interaction control and side effect tracking",
      ],
    },
    {
      id: "operating-room",
      icon: Activity,
      titleTr: "Ameliyathane Yönetimi",
      titleEn: "Operating Room Management",
      descriptionTr: "Steril PC'ler kullanılarak hasta bilekliği okunarak ameliyathanelerde hasta ve operasyon doğrulama kontrolü",
      descriptionEn: "Patient and operation validation check in operating rooms by reading of patient wristband with use of sterile PCs",
      bulletsTr: [
        "Ameliyathanelerde tüketim malzemelerinin QR kodunun okunması ile operasyon yönetimi",
        "Ameliyat öncesi ve sonrası hasta takibi",
        "Ameliyathane kaynak yönetimi ve planlama",
      ],
      bulletsEn: [
        "Operation management by reading QR code of consumables in operating rooms",
        "Pre and post-operative patient tracking",
        "Operating room resource management and planning",
      ],
    },
  ];

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 group"
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
                      : "bg-gradient-to-br from-primary/10 to-primary/5 text-primary group-hover:from-primary/15 group-hover:to-primary/10"
                  }`}>
                    <IconComponent className={`w-7 h-7 ${isExpanded ? "text-white" : "text-primary"}`} strokeWidth={2.5} />
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
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 20 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-white rounded-xl border-2 border-primary/20 shadow-xl p-8 md:p-10 lg:p-12 relative overflow-hidden">
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
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                            {title}
                          </h3>
                          <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl font-medium">
                            {description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Features Section */}
                      {bullets && bullets.length > 0 && (
                        <div className="mt-10 pt-10 border-t-2 border-primary/20">
                          <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                            {isEn ? "Key Features" : "Temel Özellikler"}
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                            {bullets.map((bullet, bulletIdx) => (
                              <li key={bulletIdx} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/60 transition-colors">
                                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center mt-0.5">
                                  <span className="text-primary text-sm font-bold">✓</span>
                                </div>
                                <span className="text-base md:text-lg text-gray-800 leading-relaxed font-medium flex-1">
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


