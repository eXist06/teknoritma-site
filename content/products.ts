export type ProductCategory = 
  | "Klinik Uygulamaları"
  | "Tetkik/Tedavi Uygulamaları"
  | "Karar Destek Uygulamaları"
  | "Kaynak Planlama Uygulamaları";

export type Product = {
  id: string;
  name: string;
  nameEn?: string; // İngilizce isim
  shortName?: string;
  tagline: string;
  taglineEn?: string; // İngilizce tagline
  description: string;
  descriptionEn?: string; // İngilizce açıklama
  category: string;
  categoryEn?: string; // İngilizce kategori
  productCategory?: ProductCategory; // Yeni kategori sistemi
  features?: string[];
  featuresEn?: string[]; // İngilizce özellikler
};

export const products: Product[] = [
  {
    id: "sarus-his",
    name: "Sarus HBS", // Türkçe için
    nameEn: "Sarus EMR", // İngilizce için
    shortName: "Hastane Bilgi Yönetim Sistemi",
    tagline: "Akıllı Hastane Bilgi Sistemi",
    description:
      "Sarus HBS, hastanelerin klinik, idari ve finansal operasyonlarını tek bir entegre platform altında birleştirerek operasyonel verimliliği artıran, uçtan uca bir Hastane Bilgi Sistemidir. %100 web tabanlı mimarisi sayesinde esnek, ölçeklenebilir ve merkezi olarak yönetilebilir bir yapı sunar. Gelişmiş akıllı iş akışları, karar destek mekanizmaları ve otomasyon yetenekleri ile modern sağlık kurumlarının dijital dönüşüm süreçlerini destekler; klinik kaliteyi, operasyonel sürekliliği ve mali kontrolü aynı anda güçlendirir.",
    descriptionEn:
      "Sarus EMR is an end-to-end Hospital Information System that increases operational efficiency by unifying hospitals' clinical, administrative, and financial operations under a single integrated platform. Thanks to its 100% web-based architecture, it offers a flexible, scalable, and centrally manageable structure. With advanced intelligent workflows, decision support mechanisms, and automation capabilities, it supports the digital transformation processes of modern healthcare institutions; simultaneously strengthening clinical quality, operational continuity, and financial control.",
    category: "Ana Ürün",
    categoryEn: "Main Product",
    taglineEn: "Smart Hospital Information System",
    productCategory: "Klinik Uygulamaları",
    features: [
      "Tıbbi, idari ve mali süreçlerin entegrasyonu",
      "%100 web tabanlı mimari",
      "iOS ve Android mobil uygulama desteği",
      "Çok katmanlı yapı ile verimli hastane süreçleri",
      "Dijital Sağlık Platformu ile entegrasyon",
    ],
    featuresEn: [
      "Integration of medical, administrative, and financial processes",
      "100% web-based architecture",
      "iOS and Android mobile application support",
      "Efficient hospital processes with multi-layered structure",
      "Integration with Digital Health Platform",
    ],
  },
  {
    id: "sarus-pacs",
    name: "SarusPACS",
    shortName: "Görüntü Arşivleme ve İletişim Sistemi",
    tagline: "Tıbbi görüntüler için güçlü ve ölçeklenebilir PACS altyapısı",
    taglineEn: "Powerful and scalable PACS infrastructure for medical imaging",
    description:
      "HTML5 tabanlı, WADO streaming destekli, tarayıcı bağımsız PACS çözümü. DICOM, HL7 ve IHE çalışma profilleri ile uyumlu, çoklu tesis ve yüksek hacimli görüntü akışı için tasarlanmıştır.",
    descriptionEn:
      "HTML5-based, WADO streaming supported, browser-independent PACS solution. Compatible with DICOM, HL7, and IHE working profiles, designed for multi-facility and high-volume image flow.",
    category: "Görüntüleme",
    categoryEn: "Imaging",
    productCategory: "Tetkik/Tedavi Uygulamaları",
    features: [
      "Web görüntüleyici ile platformdan bağımsız kullanım",
      "DICOM storage, query/retrieve, worklist ve MPPS desteği",
      "Teletıp ve e-Nabız entegrasyonuna hazır altyapı",
    ],
  },
  {
    id: "sarus-lis",
    name: "SarusLIS",
    shortName: "Laboratuvar Bilgi Sistemi",
    tagline: "Laboratuvar süreçlerinin uçtan uca dijital yönetimi",
    taglineEn: "End-to-end digital management of laboratory processes",
    description:
      "Hastane ve bağımsız laboratuvarlar için web tabanlı laboratuvar bilgi yönetim sistemi. Numune kabul, çalışma, onay ve raporlama süreçlerini uçtan uca dijitalleştirir.",
    descriptionEn:
      "Web-based laboratory information management system for hospitals and independent laboratories. Digitizes sample acceptance, processing, approval, and reporting processes end-to-end.",
    category: "Laboratuvar",
    categoryEn: "Laboratory",
    productCategory: "Tetkik/Tedavi Uygulamaları",
    features: [
      "Geniş cihaz entegrasyon kütüphanesi",
      "Kan alma sıramatik ve pnömatik sistemlerle uyum",
      "Web tarayıcı üzerinden kurulum gerektirmeden erişim",
    ],
  },
  {
    id: "sarus-depo",
    name: "Sarus Depo & Satınalma",
    nameEn: "Sarus Warehouse & Procurement",
    tagline: "Hastane envanter ve tedarik zinciri yönetimi",
    taglineEn: "Hospital inventory and supply chain management",
    description:
      "Depo, satınalma, stok takibi ve tedarik zinciri süreçlerini yöneten modül. Eczane ve klinik birimlerle entegre çalışarak otomatik sipariş ve sevkiyat süreçlerini destekler.",
    descriptionEn:
      "Module that manages warehouse, procurement, inventory tracking, and supply chain processes. Supports automated ordering and shipping processes by working integrated with pharmacy and clinical units.",
    category: "Operasyon",
    categoryEn: "Operations",
    productCategory: "Kaynak Planlama Uygulamaları",
  },
  {
    id: "sarus-randevu",
    name: "Sarus Randevu",
    nameEn: "Sarus Appointment",
    tagline: "Hasta randevu ve poliklinik yönetim sistemi",
    taglineEn: "Patient appointment and outpatient management system",
    description:
      "Poliklinik randevu süreçlerini dijitalleştiren, hasta ve hekim uygunluk takibini yapan, SMS ve e-posta bildirimleri ile entegre çalışan randevu yönetim modülü.",
    descriptionEn:
      "Appointment management module that digitizes outpatient appointment processes, tracks patient and physician availability, and works integrated with SMS and email notifications.",
    category: "Hasta Yönetimi",
    categoryEn: "Patient Management",
    productCategory: "Klinik Uygulamaları",
  },
  {
    id: "sarus-cloud",
    name: "Sarus Bulut",
    nameEn: "Sarus Cloud",
    tagline: "Azure Ready, Multi-tenant Cloud EMR Çözümü",
    taglineEn: "Azure Ready, Multi-tenant Cloud EMR Solution",
    description:
      "Sarus Bulut, ayakta tedavi hizmetleri için tasarlanmış, Azure Ready ve multi-tenant mimariye sahip modern bir EMR (Elektronik Hasta Kaydı) çözümüdür. Kurumsal bulut ortamlarından küçük kliniklere kadar ölçeklenebilir yapısı ile esnek çalışma ortamı sunar.",
    descriptionEn:
      "Sarus Cloud is a modern EMR (Electronic Medical Record) solution designed for ambulatory care, featuring Azure Ready and multi-tenant architecture. With its flexible structure that can work in private cloud (enterprise cloud) environments, including organization-owned datacenters, as well as any cloud environment, it scales from small clinics to large health groups.",
    category: "Bulut",
    categoryEn: "Cloud",
    productCategory: "Klinik Uygulamaları",
  },
  {
    id: "sarus-lbs",
    name: "Sarus LBS",
    nameEn: "Sarus LIS",
    tagline: "Laboratuvar Bilgi Sistemi",
    taglineEn: "Laboratory Information System",
    description:
      "Hastane ve bağımsız laboratuvarlar için web tabanlı laboratuvar bilgi yönetim sistemi. Numune kabul, çalışma, onay ve raporlama süreçlerini uçtan uca dijitalleştirir.",
    descriptionEn:
      "Web-based laboratory information management system for hospitals and independent laboratories. Digitizes sample acceptance, processing, approval, and reporting processes end-to-end.",
    category: "Laboratuvar",
    categoryEn: "Laboratory",
    productCategory: "Tetkik/Tedavi Uygulamaları",
  },
];

