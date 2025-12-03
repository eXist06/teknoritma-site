"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { JobPosting, CareersContent } from "@/lib/types/careers";
import Link from "next/link";

export default function CareersPage() {
  const { language, t } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentAward, setCurrentAward] = useState(0);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [content, setContent] = useState<CareersContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchContent();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/careers/jobs?active=true");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/careers/content");
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  };

  // Use dynamic content from API or fallback to defaults
  const categories = content?.featuredCareers?.categories?.map((cat) => ({
    id: cat.id,
    title: language === "en" ? cat.titleEn : cat.title,
    number: String(cat.id + 1),
  })) || (language === "en" 
    ? [
        { id: 0, title: "Software Development", number: "1" },
        { id: 1, title: "Healthcare IT", number: "2" },
        { id: 2, title: "Clinical Systems", number: "3" },
        { id: 3, title: "Data Analytics", number: "4" },
        { id: 4, title: "Project Management", number: "5" },
        { id: 5, title: "Internships", number: "6" },
      ]
    : [
        { id: 0, title: "Yazılım Geliştirme", number: "1" },
        { id: 1, title: "Sağlık Bilişimi", number: "2" },
        { id: 2, title: "Klinik Sistemler", number: "3" },
        { id: 3, title: "Veri Analitiği", number: "4" },
        { id: 4, title: "Proje Yönetimi", number: "5" },
        { id: 5, title: "Stajyerlik", number: "6" },
      ]);

  const testimonials = content?.testimonials?.map((t) => ({
    quote: language === "en" ? t.quoteEn : t.quote,
    name: t.name,
    role: language === "en" ? t.roleEn : t.role,
    department: language === "en" ? t.departmentEn : t.department,
  })) || (language === "en"
    ? [
        {
          quote: "At Teknoritma, I'm at the forefront of healthcare innovation, surrounded by inspiring, collaborative individuals who continuously push the boundaries of what's possible.",
          name: "Ahmet Yılmaz",
          role: "Senior Software Engineer",
          department: "Product Development"
        },
        {
          quote: "Teknoritma invests in me, awakens my talent, and helps me develop skills for new opportunities. Everything I do contributes to the improvement of patients' health and well-being.",
          name: "Ayşe Demir",
          role: "Clinical Systems Specialist",
          department: "Implementation"
        },
        {
          quote: "Working here means being part of a team that's transforming healthcare through technology. The impact we make is real and meaningful.",
          name: "Mehmet Kaya",
          role: "Data Analytics Lead",
          department: "Analytics"
        }
      ]
    : [
        {
          quote: "Teknoritma'da, sağlık teknolojisinin ön saflarında yer alıyorum. İlham verici ve işbirlikçi bir ekiple çalışmak, sürekli olarak mümkün olanın sınırlarını zorlamamı sağlıyor.",
          name: "Ahmet Yılmaz",
          role: "Kıdemli Yazılım Mühendisi",
          department: "Ürün Geliştirme"
        },
        {
          quote: "Teknoritma bana yatırım yapıyor, yeteneklerimi ortaya çıkarıyor ve yeni fırsatlar için becerilerimi geliştirmeme yardımcı oluyor. Yaptığım her şey hastaların sağlığı ve refahının iyileştirilmesine katkıda bulunuyor.",
          name: "Ayşe Demir",
          role: "Klinik Sistemler Uzmanı",
          department: "Uygulama"
        },
        {
          quote: "Burada çalışmak, teknoloji aracılığıyla sağlık hizmetlerini dönüştüren bir ekibin parçası olmak demek. Yaptığımız etki gerçek ve anlamlı.",
          name: "Mehmet Kaya",
          role: "Veri Analitiği Lideri",
          department: "Analitik"
        }
      ]);

  const stories = content?.exploreLife?.stories?.map((s) => ({
    title: language === "en" ? s.titleEn : s.title,
    description: language === "en" ? s.descriptionEn : s.description,
    url: s.url,
  })) || (language === "en"
    ? [
        {
          title: "A day in the life as a Software Engineer",
          description: "Join our team member as they share what it's like to work in software development at Teknoritma's Ankara office.",
          url: "/en/careers/stories/software-engineer-day"
        },
        {
          title: "5 reasons to join Teknoritma",
          description: "There are countless reasons people choose Teknoritma; the collaborative people, the breadth and depth of opportunities, and so much more.",
          url: "/en/careers/stories/5-reasons"
        },
        {
          title: "Empowering growth: Career journey",
          description: "Embarking on a career journey with Teknoritma has been a transformative experience. Watch to learn more about the remarkable growth.",
          url: "/en/careers/stories/career-journey"
        }
      ]
    : [
        {
          title: "Yazılım Mühendisi olarak bir gün",
          description: "Teknoritma'nın Ankara ofisinde yazılım geliştirmede çalışmanın nasıl bir şey olduğunu ekibimizden bir üye paylaşıyor.",
          url: "/kariyer/hikayeler/yazilim-muhendisi-gunu"
        },
        {
          title: "Teknoritma'ya katılmanın 5 nedeni",
          description: "İnsanların Teknoritma'yı seçmesinin sayısız nedeni var; işbirlikçi insanlar, fırsatların genişliği ve derinliği ve çok daha fazlası.",
          url: "/kariyer/hikayeler/5-neden"
        },
        {
          title: "Büyümeyi güçlendirmek: Kariyer yolculuğu",
          description: "Teknoritma ile bir kariyer yolculuğuna çıkmak dönüştürücü bir deneyim oldu. Dikkat çekici büyümeyi öğrenmek için izleyin.",
          url: "/kariyer/hikayeler/kariyer-yolculugu"
        }
      ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading mb-4 leading-tight">
              {language === "en" ? (
                <>
                  Let's create a healthier<br />
                  world together
                </>
              ) : (
                <>
                  Birlikte daha sağlıklı<br />
                  bir dünya yaratalım
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-body">
              {language === "en" ? "Start right here at Teknoritma." : "Teknoritma'da başlayın."}
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-neutral-border/50"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder={language === "en" ? "Keyword Search" : "Anahtar Kelime Ara"}
                className="flex-1 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder={language === "en" ? "City, State, or ZIP" : "Şehir, İl veya Posta Kodu"}
                className="flex-1 px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
                {language === "en" ? "Search Jobs" : "İş Ara"}
              </button>
            </div>
            <p className="mt-4 text-sm text-neutral-body text-center">
              {language === "en" ? (
                <>
                  Not ready to apply? Join our{" "}
                  <a href="#talent-network" className="text-primary hover:underline">Talent Network</a>.
                </>
              ) : (
                <>
                  Başvurmaya hazır değil misiniz?{" "}
                  <a href="#talent-network" className="text-primary hover:underline">Yetenek Ağımıza</a> katılın.
                </>
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Unleash Your Potential */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-6">
              {content?.unleashPotential
                ? language === "en"
                  ? content.unleashPotential.titleEn
                  : content.unleashPotential.title
                : language === "en"
                ? "Unleash your potential"
                : "Potansiyelinizi ortaya çıkarın"}
            </h2>
            {content?.unleashPotential?.paragraphs?.map((paragraph, index) => (
              <p key={index} className="text-lg md:text-xl text-neutral-body mb-4 leading-relaxed">
                {language === "en"
                  ? content.unleashPotential.paragraphsEn[index] || paragraph
                  : paragraph}
              </p>
            )) || (
              <>
                <p className="text-lg md:text-xl text-neutral-body mb-4 leading-relaxed">
                  {language === "en"
                    ? "It takes passion to make the extraordinary possible for patients. Fueled by collaboration, our culture of innovation enables us to explore new possibilities and bring powerful ideas to reality."
                    : "Hastalar için olağanüstü olanı mümkün kılmak tutku gerektirir. İşbirliğiyle beslenen yenilik kültürümüz, yeni olasılıkları keşfetmemize ve güçlü fikirleri gerçeğe dönüştürmemize olanak tanır."}
                </p>
                <p className="text-lg md:text-xl text-neutral-body mb-4 leading-relaxed">
                  {language === "en"
                    ? "When you join our global team, you'll harness the power of unparalleled data, advanced analytics, cutting-edge technologies and deep healthcare and scientific expertise to drive healthcare forward."
                    : "Küresel ekibimize katıldığınızda, sağlık hizmetlerini ileriye taşımak için benzersiz verilerin, gelişmiş analitiklerin, son teknoloji teknolojilerin ve derin sağlık ve bilimsel uzmanlığın gücünden yararlanacaksınız."}
                </p>
                <p className="text-lg md:text-xl text-neutral-body mb-8 leading-relaxed">
                  {language === "en" ? "See where your skills can take you." : "Becerilerinizin sizi nereye götürebileceğini görün."}
                </p>
              </>
            )}
            <a
              href={language === "en" ? "/en/careers#jobs" : "/kariyer#jobs"}
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              {content?.unleashPotential
                ? language === "en"
                  ? content.unleashPotential.ctaTextEn
                  : content.unleashPotential.ctaText
                : language === "en"
                ? "View all jobs"
                : "Tüm işleri görüntüle"}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Featured Careers */}
      <section className="py-16 md:py-24 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-12 text-center">
            {content?.featuredCareers
              ? language === "en"
                ? content.featuredCareers.titleEn
                : content.featuredCareers.title
              : language === "en"
              ? "Featured careers"
              : "Öne çıkan kariyerler"}
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-white"
                    : "bg-white text-neutral-heading hover:bg-neutral-light border border-neutral-border"
                }`}
              >
                <span className="font-bold mr-2">{category.number}</span>
                {category.title}
              </button>
            ))}
          </div>

          {/* Category Content */}
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-4">
                  {content?.featuredCareers?.categories[selectedCategory]
                    ? language === "en"
                      ? content.featuredCareers.categories[selectedCategory].descriptionEn.split(".")[0] + "."
                      : content.featuredCareers.categories[selectedCategory].description.split(".")[0] + "."
                    : language === "en"
                    ? "Make an impact on patient health"
                    : "Hasta sağlığında etki yaratın"}
                </h3>
                <p className="text-lg text-neutral-body mb-6 leading-relaxed">
                  {content?.featuredCareers?.categories[selectedCategory]
                    ? language === "en"
                      ? content.featuredCareers.categories[selectedCategory].descriptionEn
                      : content.featuredCareers.categories[selectedCategory].description
                    : language === "en"
                    ? "Take healthcare technology to the next level. Intelligently connect data, in-house technologies, and analytics to enable evidenced-based solutions that will help reimagine clinical development and improve patient outcomes."
                    : "Sağlık teknolojisini bir sonraki seviyeye taşıyın. Klinik gelişimi yeniden düşünmeye ve hasta sonuçlarını iyileştirmeye yardımcı olacak kanıta dayalı çözümleri etkinleştirmek için verileri, şirket içi teknolojileri ve analitikleri akıllıca bağlayın."}
                </p>
                <a
                  href={language === "en" ? "/en/products/sarus-emr" : "/urunler/sarus"}
                  className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  {language === "en" ? "Learn more" : "Daha fazla bilgi"}
                </a>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 md:h-80 flex items-center justify-center">
                <span className="text-neutral-body text-lg">
                  {language === "en" ? "Category Image" : "Kategori Görseli"}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="p-3 rounded-full bg-neutral-light hover:bg-neutral-border transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="p-3 rounded-full bg-neutral-light hover:bg-neutral-border transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 text-center"
            >
              <p className="text-xl md:text-2xl text-neutral-heading mb-6 italic leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div>
                <h3 className="text-2xl font-bold text-neutral-heading mb-2">
                  {testimonials[currentTestimonial].name}
                </h3>
                <p className="text-lg font-medium text-primary mb-1">
                  {testimonials[currentTestimonial].role}
                </p>
                <p className="text-neutral-body">
                  {testimonials[currentTestimonial].department}
                </p>
              </div>
            </motion.div>

            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentTestimonial === index ? "bg-primary w-8" : "bg-neutral-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Cards */}
      <section className="py-16 md:py-24 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {(content?.companyCards || [
              {
                title: language === "en" ? "Our company" : "Şirketimiz",
                titleEn: "Our company",
                description: language === "en"
                  ? "Creating a healthier world is our purpose. Broad expertise, innovation and powerful capabilities is how we get there."
                  : "Daha sağlıklı bir dünya yaratmak amacımızdır. Geniş uzmanlık, yenilik ve güçlü yetenekler oraya nasıl ulaştığımızdır.",
                descriptionEn: "Creating a healthier world is our purpose. Broad expertise, innovation and powerful capabilities is how we get there.",
                linkText: language === "en" ? "LEARN MORE" : "DAHA FAZLA BİLGİ",
                linkTextEn: "LEARN MORE",
              },
              {
                title: language === "en" ? "Culture" : "Kültür",
                titleEn: "Culture",
                description: language === "en"
                  ? "Our passion to make an impact is fueled by the people we work with, a curiosity to bring new ideas to life, and a focus on always doing better."
                  : "Etki yaratma tutkumuz, birlikte çalıştığımız insanlar, yeni fikirleri hayata geçirme merakı ve her zaman daha iyisini yapmaya odaklanma ile beslenir.",
                descriptionEn: "Our passion to make an impact is fueled by the people we work with, a curiosity to bring new ideas to life, and a focus on always doing better.",
                linkText: language === "en" ? "Learn More" : "Daha Fazla Bilgi",
                linkTextEn: "Learn More",
              },
              {
                title: language === "en" ? "Belonging at Teknoritma" : "Teknoritma'da Aidiyet",
                titleEn: "Belonging at Teknoritma",
                description: language === "en"
                  ? "Experience a culture of belonging, where different experiences and perspectives spark innovation."
                  : "Farklı deneyimlerin ve bakış açılarının yeniliği tetiklediği bir aidiyet kültürü yaşayın.",
                descriptionEn: "Experience a culture of belonging, where different experiences and perspectives spark innovation.",
                linkText: language === "en" ? "Learn More" : "Daha Fazla Bilgi",
                linkTextEn: "Learn More",
              },
            ]).map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-48 mb-6 flex items-center justify-center">
                  <span className="text-neutral-body">{card.title}</span>
                </div>
                <h3 className="text-2xl font-bold text-neutral-heading mb-4">{card.title}</h3>
                <p className="text-neutral-body mb-6 leading-relaxed">{card.description}</p>
                <a 
                  href={language === "en" 
                    ? (index === 0 ? "/en#about" : index === 1 ? "/en/careers#culture" : "/en/careers#belonging")
                    : (index === 0 ? "/#about" : index === 1 ? "/kariyer#culture" : "/kariyer#belonging")
                  } 
                  className="text-primary font-medium hover:underline"
                >
                  {card.link}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Network Form */}
      <section id="talent-network" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-4">
              {content?.talentNetwork
                ? language === "en"
                  ? content.talentNetwork.titleEn
                  : content.talentNetwork.title
                : language === "en"
                ? "Join our Talent Network"
                : "Yetenek Ağımıza Katılın"}
            </h3>
            <p className="text-lg text-neutral-body">
              {content?.talentNetwork
                ? language === "en"
                  ? content.talentNetwork.descriptionEn
                  : content.talentNetwork.description
                : language === "en"
                ? "Let's stay connected. Sign up to receive alerts when new opportunities become available that match your career ambitions."
                : "Bağlantıda kalalım. Kariyer hedeflerinizle eşleşen yeni fırsatlar mevcut olduğunda uyarı almak için kaydolun."}
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-neutral-light rounded-2xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  {language === "en" ? "First Name" : "Ad"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  {language === "en" ? "Last Name" : "Soyad"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Email*" : "E-posta*"}
              </label>
              <input
                type="email"
                placeholder={language === "en" ? "Email" : "E-posta"}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Job Category" : "İş Kategorisi"}
              </label>
              <select className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>{language === "en" ? "Select a Job Category" : "Bir İş Kategorisi Seçin"}</option>
                <option>{language === "en" ? "Software Development" : "Yazılım Geliştirme"}</option>
                <option>{language === "en" ? "Healthcare IT" : "Sağlık Bilişimi"}</option>
                <option>{language === "en" ? "Clinical Systems" : "Klinik Sistemler"}</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "City" : "Şehir"}
              </label>
              <input
                type="text"
                placeholder={language === "en" ? "Type to Search for a Location" : "Konum Aramak İçin Yazın"}
                className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Remote / Workplace" : "Uzaktan / İş Yeri"}
              </label>
              <select className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>{language === "en" ? "Select..." : "Seçin..."}</option>
                <option>{language === "en" ? "REMOTE" : "UZAKTAN"}</option>
                <option>{language === "en" ? "HYBRID" : "HİBRİT"}</option>
                <option>{language === "en" ? "OFFICE-BASED" : "OFİS TABANLI"}</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-lg"
            >
              {content?.talentNetwork
                ? language === "en"
                  ? content.talentNetwork.buttonTextEn
                  : content.talentNetwork.buttonText
                : language === "en"
                ? "Join Our Network"
                : "Ağımıza Katılın"}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Explore Life at Teknoritma */}
      <section className="py-16 md:py-24 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-12 text-center">
            {content?.exploreLife
              ? language === "en"
                ? content.exploreLife.titleEn
                : content.exploreLife.title
              : language === "en"
              ? "Explore life at Teknoritma"
              : "Teknoritma'da yaşamı keşfedin"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.a
                key={index}
                href={story.url}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <span className="text-neutral-body">{story.title}</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-heading mb-2 group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-neutral-body mb-4 leading-relaxed">{story.description}</p>
                <span className="text-primary font-medium group-hover:underline">
                  {language === "en" ? "Read more ›" : "Devamını oku ›"}
                </span>
              </motion.a>
            ))}
          </div>
          <div className="text-center mt-12">
            <a
              href={language === "en" ? "/en/careers/stories" : "/kariyer/hikayeler"}
              className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              {language === "en" ? "View More Stories" : "Daha Fazla Hikaye Görüntüle"}
            </a>
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      {jobs.length > 0 && (
        <section id="jobs" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-12 text-center">
              {language === "en" ? "Open Positions" : "Açık Pozisyonlar"}
            </h2>
            <div className="space-y-6">
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-neutral-border rounded-xl p-6 md:p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-neutral-heading mb-3">
                        {language === "en" ? job.titleEn : job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-body mb-4">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {language === "en" ? job.locationEn : job.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {language === "en" ? job.departmentEn : job.department}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {language === "en" ? job.typeEn : job.type}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          {language === "en" ? job.remoteEn : job.remote}
                        </span>
                      </div>
                      <p className="text-neutral-body mb-4 line-clamp-2">
                        {language === "en" ? job.descriptionEn : job.description}
                      </p>
                      {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-neutral-heading mb-2">
                            {language === "en" ? "Key Requirements:" : "Temel Gereksinimler:"}
                          </p>
                          <ul className="list-disc list-inside text-sm text-neutral-body space-y-1">
                            {(language === "en" ? job.requirementsEn : job.requirements)
                              .slice(0, 3)
                              .map((req, idx) => (
                                <li key={idx}>{req}</li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 md:min-w-[200px]">
                      <Link
                        href={`${language === "en" ? "/en" : ""}/kariyer/${job.id}`}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
                      >
                        {language === "en" ? "View Details" : "Detayları Görüntüle"}
                      </Link>
                      <a
                        href={`mailto:careers@teknoritma.com?subject=${encodeURIComponent(
                          language === "en" ? `Application: ${job.titleEn}` : `Başvuru: ${job.title}`
                        )}`}
                        className="px-6 py-3 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors text-center"
                      >
                        {language === "en" ? "Apply Now" : "Şimdi Başvur"}
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

