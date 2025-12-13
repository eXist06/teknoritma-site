import { LucideIcon, Building2, Network, Stethoscope, Scan, FlaskConical } from "lucide-react";

export type Segment = {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: LucideIcon;
};

export const segments: Segment[] = [
  {
    id: "hospitals",
    title: "Hastaneler",
    titleEn: "Hospitals",
    description:
      "Kamu, özel ve eğitim-araştırma hastaneleri için kapsamlı hastane bilgi sistemi çözümleri. Yüksek hasta hacimli kurumlar için performanslı ve sürdürülebilir mimari.",
    descriptionEn:
      "Comprehensive hospital information system solutions for public, private, and teaching-research hospitals. High-performance and sustainable architecture for high-volume institutions.",
    icon: Building2,
  },
  {
    id: "health-groups",
    title: "Zincir Sağlık Grupları",
    titleEn: "Healthcare Groups",
    description:
      "Zincir yapıda sağlık grupları için standartlaşan süreçler, tekil veri havuzu ve merkezi yönetim. Çok merkezli kurulumlar ve entegre raporlama çözümleri.",
    descriptionEn:
      "Standardized processes, unified data pool, and centralized management for healthcare groups. Multi-center installations and integrated reporting solutions.",
    icon: Network,
  },
  {
    id: "clinics",
    title: "Zincir Klinikler",
    titleEn: "Clinic Chains",
    description:
      "Zincir klinikler için bulut tabanlı EMR çözümleri. Multi-tenant mimari ile esnek ve ölçeklenebilir yapı. Merkezi yönetim ve standartlaşmış süreçler.",
    descriptionEn:
      "Cloud-based EMR solutions for clinic chains. Flexible and scalable structure with multi-tenant architecture. Centralized management and standardized processes.",
    icon: Stethoscope,
  },
  {
    id: "imaging-centers",
    title: "Görüntüleme Merkezleri",
    titleEn: "Imaging Centers",
    description:
      "Görüntüleme merkezleri ve radyoloji birimleri için PACS çözümleri. DICOM uyumlu, web tabanlı görüntüleme ve arşivleme sistemi. Teletıp entegrasyonu desteği.",
    descriptionEn:
      "PACS solutions for imaging centers and radiology units. DICOM-compliant, web-based imaging and archiving system. Telemedicine integration support.",
    icon: Scan,
  },
  {
    id: "laboratories",
    title: "Laboratuvar Merkezleri",
    titleEn: "Laboratory Centers",
    description:
      "Hastane ve bağımsız laboratuvarlar için laboratuvar bilgi sistemi. Numune yönetimi, cihaz entegrasyonu ve otomatik raporlama. Geniş cihaz entegrasyon kütüphanesi.",
    descriptionEn:
      "Laboratory information system for hospital and independent laboratories. Sample management, device integration, and automated reporting. Extensive device integration library.",
    icon: FlaskConical,
  },
];

