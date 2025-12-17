import { Metadata } from "next";
import TimelineSection from "@/components/TimelineSection";

export const metadata: Metadata = {
  title: "Hakkımızda | Teknoritma",
  description: "Teknoritma olarak sağlık sektöründe dijital dönüşümün öncüsüyüz.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-white to-accent/5 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6 leading-tight">
              Sağlık sektöründe dijital dönüşümün öncüsü
            </h1>
            <p className="text-xl md:text-2xl text-neutral-body leading-relaxed">
              Teknoritma olarak, hastanelerin ve sağlık kuruluşlarının dijital dönüşüm yolculuğunda güvenilir ortağıyız.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                Misyonumuz
              </h2>
              <p className="text-lg text-neutral-body leading-relaxed">
                Sağlık sektöründe teknolojinin gücünü kullanarak, hastanelerin ve sağlık kuruluşlarının 
                operasyonel verimliliğini artırmak ve hasta bakım kalitesini yükseltmek.
              </p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
                Vizyonumuz
              </h2>
              <p className="text-lg text-neutral-body leading-relaxed">
                Türkiye ve bölgede sağlık teknolojileri alanında lider bir şirket olmak, 
                yenilikçi çözümlerimizle sağlık ekosistemine değer katmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="py-16 md:py-24 bg-neutral-light/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
            Değerlerimiz
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-neutral-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">İnovasyon</h3>
              <p className="text-neutral-body">
                Sürekli gelişen teknolojileri takip ederek, sektöre yenilikçi çözümler sunuyoruz.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-neutral-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Güvenilirlik</h3>
              <p className="text-neutral-body">
                Müşterilerimizle uzun vadeli ilişkiler kurarak, güvenilir bir teknoloji ortağı olmayı hedefliyoruz.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-neutral-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Müşteri Odaklılık</h3>
              <p className="text-neutral-body">
                Müşteri ihtiyaçlarını anlayarak, onlara en uygun çözümleri sunmak önceliğimizdir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">200+</div>
              <div className="text-neutral-body">Proje</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">20+</div>
              <div className="text-neutral-body">Yıllık Deneyim</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">80+</div>
              <div className="text-neutral-body">Uzman Ekip</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5</div>
              <div className="text-neutral-body">Ülke</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">7/24</div>
              <div className="text-neutral-body">Destek</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id="story" className="py-16 md:py-24 bg-neutral-light/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-8 text-center">
            Hikayemiz
          </h2>
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-neutral-body leading-relaxed text-center">
            <p>
              Teknoritma, sağlık sektöründe dijital dönüşümün öncüsü olarak, hastanelerin ve sağlık kuruluşlarının 
              teknoloji ihtiyaçlarını karşılamak üzere kuruldu. Yıllar içinde, sektördeki deneyimimiz ve 
              müşteri odaklı yaklaşımımız sayesinde, Türkiye'nin önde gelen sağlık teknolojileri şirketlerinden 
              biri haline geldik ve çözümlerimizi 5 farklı ülkeye yaygınlaştırmayı başardık.
            </p>
            <p>
              Sarus HIS sistemimiz ile binlerce sağlık profesyoneline ulaşıyoruz ve milyonlarca hastanın 
              süreçlerini onlar için kolaylaştırıyoruz. Mega hastane projelerinden küçük özel hastanelere kadar 
              geniş bir yelpazede hizmet veriyor, her projede müşterilerimizin başarısı için çalışıyoruz.
            </p>
            <p>
              Enerjimiz, profesyonelliğimiz ve deneyimimizle, sağlık teknolojilerinin geleceğini şekillendirmeye 
              devam ediyoruz. Geleceği birlikte şekillendirelim!
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <TimelineSection />

      {/* Standards */}
      <section id="standards" className="py-16 md:py-24 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-12 text-center">
            Standartlarımız
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* SPICE - İlk sırada */}
            <div className="group relative bg-gradient-to-br from-primary/10 via-white to-accent/10 rounded-2xl p-6 border-2 border-primary/20 hover:border-primary hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">SPICE</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Yazılım süreç iyileştirme ve yetenek belirleme standardı ile kaliteli yazılım geliştirme.
                </p>
              </div>
            </div>
            
            {/* ISO 27001 - 2. sırada */}
            <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/50 rounded-2xl p-6 border-2 border-blue-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">ISO 27001</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Bilgi güvenliği yönetim sistemi sertifikası ile verilerinizi güvende tutuyoruz.
                </p>
              </div>
            </div>

            {/* HIMSS - 3. sırada */}
            <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 rounded-2xl p-6 border-2 border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">HIMSS EMRAM/O-EMRAM 7</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Certified SP (Service Provider) - En yüksek seviye elektronik sağlık kaydı olgunluk seviyesi.
                </p>
                <p className="text-sm font-semibold text-blue-900 mt-3">
                  Istanbul Bahcelievler Devlet Hastanesi
                </p>
              </div>
            </div>

            {/* HIPAA */}
            <div className="group relative bg-gradient-to-br from-purple-50 via-white to-purple-50/50 rounded-2xl p-6 border-2 border-purple-200/50 hover:border-purple-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">HIPAA Uyumluluğu</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Hasta verilerinin gizliliği ve güvenliği için uluslararası standartlara uyum sağlıyoruz.
                </p>
              </div>
            </div>

            {/* KVKK */}
            <div className="group relative bg-gradient-to-br from-amber-50 via-white to-amber-50/50 rounded-2xl p-6 border-2 border-amber-200/50 hover:border-amber-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">KVKK Uyumluluğu</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Kişisel verilerin korunması kanununa tam uyumlu sistemler geliştiriyoruz.
                </p>
              </div>
            </div>

            {/* ISO 9001 */}
            <div className="group relative bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 rounded-2xl p-6 border-2 border-indigo-200/50 hover:border-indigo-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">ISO 9001</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Kalite yönetim sistemi ile sürekli iyileştirme ve mükemmellik hedefliyoruz.
                </p>
              </div>
            </div>

            {/* HL7 FHIR */}
            <div className="group relative bg-gradient-to-br from-rose-50 via-white to-rose-50/50 rounded-2xl p-6 border-2 border-rose-200/50 hover:border-rose-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">HL7 FHIR</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  Sağlık verilerinin standart formatlarda paylaşımı için uluslararası protokollere uyum.
                </p>
              </div>
            </div>

            {/* Sürekli İnovasyon */}
            <div className="group relative bg-gradient-to-br from-violet-50 via-white to-violet-50/50 rounded-2xl p-6 border-2 border-violet-200/50 hover:border-violet-400 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-20 h-20 bg-violet-200/20 rounded-full blur-2xl -z-0"></div>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg mx-auto">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Sürekli İnovasyon</h3>
                <p className="text-sm text-neutral-body leading-relaxed">
                  En son teknolojileri takip ederek, çözümlerimizi sürekli geliştiriyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}






