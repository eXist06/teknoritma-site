export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

export const timelineItems: TimelineItem[] = [
  {
    year: "2003",
    title: "İlk web tabanlı sistem",
    description:
      "Türkiye'nin ilk %100 web tabanlı hastane bilgi sistemi Sarus'un kullanıma alınması. Bu dönemde web tabanlı mimarinin sağlık bilişiminde öncü uygulaması gerçekleştirildi.",
  },
  {
    year: "2006",
    title: "1000+ yataklı ilk kurulum",
    description:
      "1000 yatak üzeri kapasiteye sahip kamu ve şehir hastanelerinde SarusHIS'in devreye alınması. Büyük ölçekli kurumlarda sistemin performans ve ölçeklenebilirlik yetenekleri kanıtlandı.",
  },
  {
    year: "2017",
    title: "Türkiye'nin ilk şehir hastanesi",
    description:
      "Ankara'daki ilk şehir hastanesinde klinik ve idari süreçlerin Sarus ile yürütülmeye başlaması. Modern sağlık komplekslerinde entegre bilgi yönetiminin başarılı uygulaması.",
  },
  {
    year: "2019",
    title: "Dünyanın en büyük hastanelerinden biri",
    description:
      "Tek seferde açılan, çok yüksek yatak kapasiteli sağlık kompleksinin Sarus altyapısıyla devreye alınması. Bu proje, sistemin en büyük ölçekli kurulumlarından biri olarak kayıtlara geçti.",
  },
];

