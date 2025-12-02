export type Product = {
  id: string;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  category: string;
  features?: string[];
};

export const products: Product[] = [
  {
    id: "sarus-his",
    name: "SarusHIS",
    shortName: "Hastane Bilgi Yönetim Sistemi",
    tagline: "Kapsamlı Hastane Bilgi Sistemi",
    description:
      "SarusHIS, hastanelerin verimliliğini artırmak için tıbbi, idari ve mali süreçleri sorunsuz bir şekilde entegre eden kapsamlı bir Hastane Bilgi Sistemidir. Türkiye'nin ilk %100 web tabanlı hastane bilgi sistemi olarak, modern sağlık kurumlarının dijital dönüşümünde öncü rol oynar.",
    category: "Ana Ürün",
    features: [
      "Tıbbi, idari ve mali süreçlerin entegrasyonu",
      "%100 web tabanlı mimari",
      "iOS ve Android mobil uygulama desteği",
      "Microsoft .NET teknolojisi ve TÜBİTAK desteği",
      "Çok katmanlı yapı ile verimli hastane süreçleri",
      "Dijital Sağlık Platformu ile entegrasyon",
    ],
  },
  {
    id: "sarus-pacs",
    name: "SarusPACS",
    shortName: "Görüntü Arşivleme ve İletişim Sistemi",
    tagline: "Tıbbi görüntüler için güçlü ve ölçeklenebilir PACS altyapısı",
    description:
      "HTML5 tabanlı, WADO streaming destekli, tarayıcı bağımsız PACS çözümü. DICOM, HL7 ve IHE çalışma profilleri ile uyumlu, çoklu tesis ve yüksek hacimli görüntü akışı için tasarlanmıştır.",
    category: "Görüntüleme",
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
    description:
      "Hastane ve bağımsız laboratuvarlar için web tabanlı laboratuvar bilgi yönetim sistemi. Numune kabul, çalışma, onay ve raporlama süreçlerini uçtan uca dijitalleştirir.",
    category: "Laboratuvar",
    features: [
      "Geniş cihaz entegrasyon kütüphanesi",
      "Kan alma sıramatik ve pnömatik sistemlerle uyum",
      "Web tarayıcı üzerinden kurulum gerektirmeden erişim",
    ],
  },
  {
    id: "sarus-depo",
    name: "Sarus Depo & Satınalma",
    tagline: "Hastane envanter ve tedarik zinciri yönetimi",
    description:
      "Depo, satınalma, stok takibi ve tedarik zinciri süreçlerini yöneten modül. Eczane ve klinik birimlerle entegre çalışarak otomatik sipariş ve sevkiyat süreçlerini destekler.",
    category: "Operasyon",
  },
  {
    id: "sarus-randevu",
    name: "Sarus Randevu",
    tagline: "Hasta randevu ve poliklinik yönetim sistemi",
    description:
      "Poliklinik randevu süreçlerini dijitalleştiren, hasta ve hekim uygunluk takibini yapan, SMS ve e-posta bildirimleri ile entegre çalışan randevu yönetim modülü.",
    category: "Hasta Yönetimi",
  },
];

