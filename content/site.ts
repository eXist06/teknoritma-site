export type NavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  badge: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  locationLine: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Ana Sayfa", href: "#hero" },
  { label: "Ürünler", href: "#products" },
  { label: "Sarus", href: "#projects" },
  { label: "Projeler", href: "#projects" },
  { label: "Hakkımızda", href: "#about" },
  { label: "İletişim", href: "#contact" },
];

export const hero: HeroContent = {
  badge: "Türkiye'nin İlk %100 Web Tabanlı Hastane Bilgi Sistemi",
  title: "Sağlık Bilişiminde Devrim Yaratıyoruz",
  description:
    "20 yılı aşkın sağlık bilişimi deneyimine sahip profesyoneller tarafından kurulan Teknoritma, Sarus Dijital Sağlık Platformu aracılığıyla yenilikçi çözümler sunmaktadır. Türkiye ve çevre bölgelerdeki ilk %100 web tabanlı hastane bilgi sistemi olan Sarus, sağlık profesyonelleri, hastalar ve sağlık tedarikçilerini birbirine bağlayan kapsamlı bir dijital sağlık ekosistemi sunar. Dünyanın en büyük sağlık kampüslerinin tercihi olan platformumuz, sağlık sürekliliğindeki tüm katılımcılar için benzersiz bir dijital deneyim sağlar.",
  primaryCta: "SarusHIS'i İncele",
  secondaryCta: "Tüm Ürünler",
  locationLine: "Ankara · Hacettepe Teknokent · Türkiye, CIS Ülkeleri ve Körfez Bölgesi",
};

export const metrics: Metric[] = [
  { value: "35,000+", label: "sağlık kullanıcısı" },
  { value: "80M+", label: "hasta verisi" },
  { value: "HIMSS", label: "EMRAM/O-EMRAM Level 7" },
];

export const footerLinks: FooterLink[] = [
  { label: "KVKK Aydınlatma Metni", href: "#" },
  { label: "Çerez Politikası", href: "#" },
  { label: "Kullanım Şartları", href: "#" },
];

export const contactSection = {
  title: "Projenizi birlikte planlayalım",
  description:
    "Mevcut HIS/PACS/LIS altyapınızı, hedeflerinizi ve zaman planınızı paylaşın; sizin için örnek bir faz planı ve yol haritası oluşturalım.",
};

