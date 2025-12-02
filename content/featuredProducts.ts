export type FeaturedSlide = {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  bullets: string[];
};

export const featuredSlides: FeaturedSlide[] = [
  {
    id: "sarus-his",
    productId: "sarus-his",
    title: "Modern hastaneler için entegre bilgi yönetimi.",
    subtitle: "Türkiye'nin ilk %100 web tabanlı hastane bilgi sistemi.",
    bullets: [
      "Klinik + idari süreçleri tek platformda toplar",
      "Poliklinik, yataklı servis, acil, ameliyathane, eczane, depo, faturalama",
      "Şehir hastaneleri ve yüksek yatak kapasiteli kurumlarda aktif kullanım",
    ],
  },
  {
    id: "sarus-pacs",
    productId: "sarus-pacs",
    title: "Tıbbi görüntüler için güçlü ve ölçeklenebilir PACS altyapısı.",
    subtitle: "HTML5, WADO streaming ve çok merkezli kurulum desteği.",
    bullets: [
      "DICOM, HL7, IHE profilleri ile uyumlu, mobil cihaz desteğine sahip yapı",
      "Web görüntüleyici ile platformdan bağımsız kullanım",
      "Radyolog ve hekimlerin istedikleri yerden güvenle erişebildiği modern dijital arşiv",
    ],
  },
  {
    id: "sarus-lis",
    productId: "sarus-lis",
    title: "Laboratuvar süreçlerinin uçtan uca dijital yönetimi.",
    subtitle: "Bölgenin ilk %100 web tabanlı laboratuvar bilgi yönetim sistemlerinden biri.",
    bullets: [
      "Numune sıramatik, pnömatik sistemler ve cihaz entegrasyonları ile uçtan uca süreç yönetimi",
      "Numune kabul, çalışma, onay ve raporlama süreçlerini tek arayüzde toplar",
      "Geniş cihaz entegrasyon yelpazesi ve web tabanlı mimarisiyle standart, hızlı ve güvenli çalışma ortamı",
    ],
  },
];

