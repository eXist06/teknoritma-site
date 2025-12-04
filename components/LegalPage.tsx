"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function LegalPage({ type }: { type: "kvkk" | "cookie" | "terms" }) {
  const { language } = useI18n();

  const content = {
    kvkk: {
      tr: {
        title: "KVKK Aydınlatma Metni",
        lastUpdated: "Son Güncelleme: Aralık 2024",
        sections: [
          {
            title: "1. Veri Sorumlusu",
            content: `Teknoritma Yazılım Hizmetleri A.Ş. ("Teknoritma" veya "Şirket"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla kişisel verilerinizi aşağıda belirtilen çerçevede işlemektedir.`,
          },
          {
            title: "2. Kişisel Verilerin İşlenme Amaçları",
            content: `Kişisel verileriniz, aşağıdaki amaçlarla işlenebilmektedir:
- Web sitesi hizmetlerinin sunulması ve iyileştirilmesi
- İletişim taleplerinizin karşılanması
- Yasal yükümlülüklerin yerine getirilmesi
- İş geliştirme ve pazarlama faaliyetlerinin yürütülmesi
- Müşteri ilişkileri yönetimi`,
          },
          {
            title: "3. İşlenen Kişisel Veriler",
            content: `İşlenen kişisel veriler şunlardır:
- Kimlik bilgileri (ad, soyad)
- İletişim bilgileri (e-posta, telefon, adres)
- İşlem güvenliği bilgileri (IP adresi, çerez bilgileri)
- Müşteri işlem bilgileri`,
          },
          {
            title: "4. Kişisel Verilerin Aktarılması",
            content: `Kişisel verileriniz, yasal yükümlülüklerin yerine getirilmesi ve hizmetlerin sunulması amacıyla, yasal düzenlemelerle sınırlı olarak, iş ortaklarımız ve hizmet sağlayıcılarımızla paylaşılabilir.`,
          },
          {
            title: "5. Kişisel Verilerin Saklanma Süresi",
            content: `Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal saklama sürelerine uygun olarak saklanmaktadır.`,
          },
          {
            title: "6. KVKK Kapsamındaki Haklarınız",
            content: `KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
- Kişisel verilerinizin işlenip işlenmediğini öğrenme
- İşlenmişse bilgi talep etme
- İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
- Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme
- Eksik veya yanlış işlenmişse düzeltilmesini isteme
- KVKK'da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme
- Aktarıldığı üçüncü kişilere bildirilmesini isteme
- İşlenmesine itiraz etme
- Zarara uğraması halinde zararın giderilmesini talep etme`,
          },
          {
            title: "7. İletişim",
            content: `KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki iletişim kanallarını kullanabilirsiniz:
E-posta: kvkk@teknoritma.com.tr
Adres: Hacettepe Teknokent, 1596. Cadde, Çankaya / Ankara`,
          },
        ],
      },
      en: {
        title: "Privacy Policy",
        lastUpdated: "Last Updated: December 2024",
        sections: [
          {
            title: "1. Data Controller",
            content: `Teknoritma Yazılım Hizmetleri A.Ş. ("Teknoritma" or "Company"), as the data controller in accordance with Law No. 6698 on the Protection of Personal Data ("KVKK"), processes your personal data within the framework specified below.`,
          },
          {
            title: "2. Purposes of Processing Personal Data",
            content: `Your personal data may be processed for the following purposes:
- Providing and improving website services
- Fulfilling your communication requests
- Fulfilling legal obligations
- Conducting business development and marketing activities
- Customer relationship management`,
          },
          {
            title: "3. Processed Personal Data",
            content: `The personal data processed includes:
- Identity information (name, surname)
- Contact information (email, phone, address)
- Transaction security information (IP address, cookie information)
- Customer transaction information`,
          },
          {
            title: "4. Transfer of Personal Data",
            content: `Your personal data may be shared with our business partners and service providers, limited to legal regulations, for the purpose of fulfilling legal obligations and providing services.`,
          },
          {
            title: "5. Retention Period of Personal Data",
            content: `Your personal data is retained for the period required by the processing purpose and in accordance with legal retention periods.`,
          },
          {
            title: "6. Your Rights Under KVKK",
            content: `In accordance with Article 11 of KVKK, you have the following rights:
- Learn whether your personal data is processed
- Request information if processed
- Learn the purpose of processing and whether it is used for its intended purpose
- Know the third parties to whom it is transferred domestically or abroad
- Request correction if processed incorrectly or incompletely
- Request deletion or destruction within the framework of the conditions set forth in KVKK
- Request notification to third parties to whom it is transferred
- Object to processing
- Request compensation for damages in case of damage`,
          },
          {
            title: "7. Contact",
            content: `To exercise your rights under KVKK, you can use the following contact channels:
Email: kvkk@teknoritma.com.tr
Address: Hacettepe Teknokent, 1596. Cadde, Çankaya / Ankara`,
          },
        ],
      },
    },
    cookie: {
      tr: {
        title: "Çerez Politikası",
        lastUpdated: "Son Güncelleme: Aralık 2024",
        sections: [
          {
            title: "1. Çerez Nedir?",
            content: `Çerezler, web sitelerini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet, akıllı telefon vb.) kaydedilen küçük metin dosyalarıdır. Çerezler, web sitesinin düzgün çalışmasını sağlar ve kullanıcı deneyimini iyileştirir.`,
          },
          {
            title: "2. Çerez Türleri",
            content: `Web sitemizde aşağıdaki çerez türleri kullanılmaktadır:
- Zorunlu Çerezler: Web sitesinin temel işlevlerinin çalışması için gereklidir.
- Performans Çerezleri: Web sitesinin performansını analiz etmek için kullanılır.
- Fonksiyonel Çerezler: Kullanıcı tercihlerini hatırlamak için kullanılır.
- Analitik Çerezler: Web sitesi kullanım istatistiklerini toplamak için kullanılır.`,
          },
          {
            title: "3. Çerez Kullanım Amaçları",
            content: `Çerezler aşağıdaki amaçlarla kullanılmaktadır:
- Web sitesinin düzgün çalışmasını sağlamak
- Kullanıcı tercihlerini hatırlamak
- Web sitesi trafiğini analiz etmek
- Kullanıcı deneyimini iyileştirmek`,
          },
          {
            title: "4. Çerez Yönetimi",
            content: `Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Ancak, bazı çerezlerin devre dışı bırakılması web sitesinin bazı özelliklerinin çalışmamasına neden olabilir.`,
          },
          {
            title: "5. Üçüncü Taraf Çerezler",
            content: `Web sitemizde üçüncü taraf hizmet sağlayıcıların çerezleri de kullanılabilir. Bu çerezlerin kullanımı ilgili üçüncü tarafın gizlilik politikasına tabidir.`,
          },
        ],
      },
      en: {
        title: "Cookie Policy",
        lastUpdated: "Last Updated: December 2024",
        sections: [
          {
            title: "1. What are Cookies?",
            content: `Cookies are small text files that are saved to your device (computer, tablet, smartphone, etc.) when you visit websites. Cookies ensure that the website functions properly and improve the user experience.`,
          },
          {
            title: "2. Types of Cookies",
            content: `The following types of cookies are used on our website:
- Essential Cookies: Required for the basic functions of the website to work.
- Performance Cookies: Used to analyze website performance.
- Functional Cookies: Used to remember user preferences.
- Analytics Cookies: Used to collect website usage statistics.`,
          },
          {
            title: "3. Cookie Usage Purposes",
            content: `Cookies are used for the following purposes:
- Ensuring the website functions properly
- Remembering user preferences
- Analyzing website traffic
- Improving user experience`,
          },
          {
            title: "4. Cookie Management",
            content: `You can manage or delete cookies from your browser settings. However, disabling some cookies may cause some features of the website to not work.`,
          },
          {
            title: "5. Third-Party Cookies",
            content: `Third-party service provider cookies may also be used on our website. The use of these cookies is subject to the relevant third party's privacy policy.`,
          },
        ],
      },
    },
    terms: {
      tr: {
        title: "Kullanım Şartları",
        lastUpdated: "Son Güncelleme: Aralık 2024",
        sections: [
          {
            title: "1. Genel Hükümler",
            content: `Bu kullanım şartları, Teknoritma Yazılım Hizmetleri A.Ş. ("Teknoritma") tarafından işletilen web sitesinin kullanımına ilişkin kuralları belirlemektedir. Web sitemizi kullanarak, bu şartları kabul etmiş sayılırsınız.`,
          },
          {
            title: "2. Kullanım Koşulları",
            content: `Web sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:
- Web sitesini yasalara aykırı amaçlarla kullanmamak
- Web sitesinin içeriğini izinsiz kopyalamamak veya dağıtmamak
- Web sitesinin güvenliğini tehdit edecek faaliyetlerde bulunmamak
- Başkalarının haklarını ihlal edecek içerik paylaşmamak`,
          },
          {
            title: "3. Fikri Mülkiyet Hakları",
            content: `Web sitesindeki tüm içerikler (metin, görsel, logo, tasarım vb.) Teknoritma'nın fikri mülkiyeti altındadır. İzinsiz kullanımı yasaktır ve yasal işlemlere tabi tutulabilir.`,
          },
          {
            title: "4. Sorumluluk Reddi",
            content: `Teknoritma, web sitesinde yer alan bilgilerin doğruluğu, güncelliği veya eksiksizliği konusunda garanti vermemektedir. Web sitesinin kullanımından doğabilecek zararlardan sorumlu tutulamaz.`,
          },
          {
            title: "5. Bağlantılar",
            content: `Web sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu bağlantılar bilgilendirme amaçlıdır ve Teknoritma bu sitelerin içeriğinden sorumlu değildir.`,
          },
          {
            title: "6. Değişiklikler",
            content: `Teknoritma, bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar. Değişiklikler web sitesinde yayınlandığı tarihten itibaren geçerlidir.`,
          },
          {
            title: "7. Uygulanacak Hukuk",
            content: `Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık durumunda Ankara Mahkemeleri yetkilidir.`,
          },
        ],
      },
      en: {
        title: "Terms of Service",
        lastUpdated: "Last Updated: December 2024",
        sections: [
          {
            title: "1. General Provisions",
            content: `These terms of service establish the rules regarding the use of the website operated by Teknoritma Yazılım Hizmetleri A.Ş. ("Teknoritma"). By using our website, you are deemed to have accepted these terms.`,
          },
          {
            title: "2. Terms of Use",
            content: `When using our website, you must comply with the following rules:
- Not to use the website for illegal purposes
- Not to copy or distribute website content without permission
- Not to engage in activities that threaten website security
- Not to share content that violates others' rights`,
          },
          {
            title: "3. Intellectual Property Rights",
            content: `All content on the website (text, images, logos, design, etc.) is the intellectual property of Teknoritma. Unauthorized use is prohibited and may be subject to legal action.`,
          },
          {
            title: "4. Disclaimer",
            content: `Teknoritma does not guarantee the accuracy, currency, or completeness of the information on the website. It cannot be held responsible for any damages that may arise from the use of the website.`,
          },
          {
            title: "5. Links",
            content: `Our website may contain links to third-party websites. These links are for informational purposes and Teknoritma is not responsible for the content of these sites.`,
          },
          {
            title: "6. Changes",
            content: `Teknoritma reserves the right to change these terms of service without prior notice. Changes are effective from the date they are published on the website.`,
          },
          {
            title: "7. Applicable Law",
            content: `These terms of service are subject to the laws of the Republic of Turkey. Ankara Courts are authorized in case of any dispute.`,
          },
        ],
      },
    },
  };

  const pageContent = content[type][language === "en" ? "en" : "tr"];

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link
          href={language === "en" ? "/en" : "/"}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === "en" ? "Back to Home" : "Ana Sayfaya Dön"}
        </Link>

        <div className="bg-white border border-neutral-border rounded-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-4">
            {pageContent.title}
          </h1>
          <p className="text-neutral-body mb-8">{pageContent.lastUpdated}</p>

          <div className="prose max-w-none">
            {pageContent.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-heading mb-4">
                  {section.title}
                </h2>
                <p className="text-neutral-body leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-border">
            <p className="text-sm text-neutral-body">
              {language === "en"
                ? "For questions about this policy, please contact us at:"
                : "Bu politika hakkında sorularınız için lütfen bizimle iletişime geçin:"}
            </p>
            <p className="text-sm text-neutral-body mt-2">
              E-posta: {type === "kvkk" ? "kvkk@teknoritma.com.tr" : "info@teknoritma.com.tr"}
              <br />
              {language === "en" ? "Address" : "Adres"}: Hacettepe Teknokent, 1596. Cadde, Çankaya / Ankara
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}



