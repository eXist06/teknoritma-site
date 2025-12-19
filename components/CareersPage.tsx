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
  const [talentFormData, setTalentFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobCategory: "",
    city: "",
    remoteWorkplace: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [talentFormStep, setTalentFormStep] = useState<"form" | "verify">("form");
  const [talentVerificationCode, setTalentVerificationCode] = useState("");
  const [talentFormSubmitting, setTalentFormSubmitting] = useState(false);
  const [talentFormMessage, setTalentFormMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<JobPosting[]>([]);
  const [noJobsMessage, setNoJobsMessage] = useState<{ show: boolean; text: string } | null>(null);

  useEffect(() => {
    fetchJobs();
    fetchContent();
  }, []);

  useEffect(() => {
    let filtered = [...jobs];
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          (language === "en" ? job.titleEn : job.title).toLowerCase().includes(keyword) ||
          (language === "en" ? job.descriptionEn : job.description).toLowerCase().includes(keyword) ||
          (language === "en" ? job.departmentEn : job.department).toLowerCase().includes(keyword)
      );
    }
    if (searchLocation.trim()) {
      const location = searchLocation.toLowerCase();
      filtered = filtered.filter((job) =>
        (language === "en" ? job.locationEn : job.location).toLowerCase().includes(location)
      );
    }
    setFilteredJobs(filtered);
  }, [jobs, searchKeyword, searchLocation, language]);

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
      // Add cache-busting timestamp to prevent browser cache
      const response = await fetch(`/api/careers/content?t=${Date.now()}`, {
        cache: "no-store",
      });
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

  // Helper function to convert title to slug
  const titleToSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Get job categories from content (dynamic)
  const jobCategories = content?.featuredCareers?.categories || [];

  const testimonials = content?.testimonials?.map((t) => ({
    quote: language === "en" ? t.quoteEn : t.quote,
    name: t.name,
    role: language === "en" ? t.roleEn : t.role,
    department: language === "en" ? t.departmentEn : t.department,
    photo: t.photo,
  })) || (language === "en"
    ? [
        {
          quote: "At Teknoritma, I'm at the forefront of healthcare innovation, surrounded by inspiring, collaborative individuals who continuously push the boundaries of what's possible.",
          name: "Ahmet Yılmaz",
          role: "Senior Software Engineer",
          department: "Product Development",
          photo: undefined
        },
        {
          quote: "Teknoritma invests in me, awakens my talent, and helps me develop skills for new opportunities. Everything I do contributes to the improvement of patients' health and well-being.",
          name: "Ayşe Demir",
          role: "Clinical Systems Specialist",
          department: "Implementation",
          photo: undefined
        },
        {
          quote: "Working here means being part of a team that's transforming healthcare through technology. The impact we make is real and meaningful.",
          name: "Mehmet Kaya",
          role: "Data Analytics Lead",
          department: "Analytics",
          photo: undefined
        }
      ]
    : [
        {
          quote: "Teknoritma'da, sağlık teknolojisinin ön saflarında yer alıyorum. İlham verici ve işbirlikçi bir ekiple çalışmak, sürekli olarak mümkün olanın sınırlarını zorlamamı sağlıyor.",
          name: "Ahmet Yılmaz",
          role: "Kıdemli Yazılım Mühendisi",
          department: "Ürün Geliştirme",
          photo: undefined
        },
        {
          quote: "Teknoritma bana yatırım yapıyor, yeteneklerimi ortaya çıkarıyor ve yeni fırsatlar için becerilerimi geliştirmeme yardımcı oluyor. Yaptığım her şey hastaların sağlığı ve refahının iyileştirilmesine katkıda bulunuyor.",
          name: "Ayşe Demir",
          role: "Klinik Sistemler Uzmanı",
          department: "Uygulama",
          photo: undefined
        },
        {
          quote: "Burada çalışmak, teknoloji aracılığıyla sağlık hizmetlerini dönüştüren bir ekibin parçası olmak demek. Yaptığımız etki gerçek ve anlamlı.",
          name: "Mehmet Kaya",
          role: "Veri Analitiği Lideri",
          department: "Analitik",
          photo: undefined
        }
      ]);

  const stories = content?.exploreLife?.stories?.map((s) => ({
    title: language === "en" ? s.titleEn : s.title,
    description: language === "en" ? s.descriptionEn : s.description,
    url: s.url,
    image: s.image,
  })) || (language === "en"
    ? [
        {
          title: "A day in the life as a Software Engineer",
          description: "Join our team member as they share what it's like to work in software development at Teknoritma's Ankara office.",
          url: "/en/careers/stories/software-engineer-day",
          image: undefined
        },
        {
          title: "5 reasons to join Teknoritma",
          description: "There are countless reasons people choose Teknoritma; the collaborative people, the breadth and depth of opportunities, and so much more.",
          url: "/en/careers/stories/5-reasons",
          image: undefined
        },
        {
          title: "Empowering growth: Career journey",
          description: "Embarking on a career journey with Teknoritma has been a transformative experience. Watch to learn more about the remarkable growth.",
          url: "/en/careers/stories/career-journey",
          image: undefined
        }
      ]
    : [
        {
          title: "Yazılım Mühendisi olarak bir gün",
          description: "Teknoritma'nın Ankara ofisinde yazılım geliştirmede çalışmanın nasıl bir şey olduğunu ekibimizden bir üye paylaşıyor.",
          url: "/kariyer/hikayeler/yazilim-muhendisi-gunu",
          image: undefined
        },
        {
          title: "Teknoritma'ya katılmanın 5 nedeni",
          description: "İnsanların Teknoritma'yı seçmesinin sayısız nedeni var; işbirlikçi insanlar, fırsatların genişliği ve derinliği ve çok daha fazlası.",
          url: "/kariyer/hikayeler/5-neden",
          image: undefined
        },
        {
          title: "Büyümeyi güçlendirmek: Kariyer yolculuğu",
          description: "Teknoritma ile bir kariyer yolculuğuna çıkmak dönüştürücü bir deneyim oldu. Dikkat çekici büyümeyi öğrenmek için izleyin.",
          url: "/kariyer/hikayeler/kariyer-yolculugu",
          image: undefined
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
            className="text-center mb-10 md:mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading mb-4 leading-tight">
              {content?.hero?.title 
                ? (language === "en" ? content.hero.titleEn : content.hero.title)
                : (language === "en" ? (
                    <>
                      Let's create a healthier<br />
                      world together
                    </>
                  ) : (
                    <>
                      Birlikte daha sağlıklı<br />
                      bir dünya yaratalım
                    </>
                  ))
              }
            </h1>
            <p className="text-xl md:text-2xl text-neutral-body">
              {content?.hero?.subtitle
                ? (language === "en" ? content.hero.subtitleEn : content.hero.subtitle)
                : (language === "en" ? "Start right here at Teknoritma." : "Teknoritma'da başlayın.")
              }
            </p>
          </motion.div>

          {/* Talent Network CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <a
              href="#talent-network"
              onClick={(e) => {
                e.preventDefault();
                const talentNetworkSection = document.getElementById("talent-network");
                if (talentNetworkSection) {
                  talentNetworkSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
            >
              {language === "en" ? "Join our Talent Network" : "Yetenek Ağımıza Katılın"}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Unleash Your Potential */}
      <section className="py-16 md:py-24 bg-blue-50/30">
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
              href="#jobs"
              onClick={(e) => {
                e.preventDefault();
                const activeJobs = filteredJobs.length > 0 ? filteredJobs : jobs;
                if (activeJobs.length > 0) {
                  const jobsSection = document.getElementById("jobs");
                  if (jobsSection) {
                    jobsSection.scrollIntoView({ behavior: "smooth" });
                  }
                } else {
                  setNoJobsMessage({
                    show: true,
                    text: language === "en" 
                      ? "There are currently no open positions available." 
                      : "Şu an için açık pozisyon bulunmamaktadır."
                  });
                  setTimeout(() => {
                    setNoJobsMessage(null);
                  }, 5000);
                }
              }}
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
            {noJobsMessage && noJobsMessage.show && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center"
              >
                <p className="text-yellow-800 font-medium">{noJobsMessage.text}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Careers */}
      <section className="py-16 md:py-24 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-10 md:mb-12 text-center">
            {content?.featuredCareers
              ? language === "en"
                ? content.featuredCareers.titleEn
                : content.featuredCareers.title
              : language === "en"
              ? "Featured careers"
              : "Öne çıkan kariyerler"}
          </h2>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedCategory === category.id
                    ? "bg-primary text-white shadow-md scale-105"
                    : "bg-white text-neutral-heading hover:bg-primary/10 hover:border-primary/50 hover:shadow-md border border-neutral-border active:scale-95"
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
            className="bg-white rounded-2xl shadow-lg p-6 md:p-10 lg:p-12"
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
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 md:h-80 overflow-hidden">
                {content?.featuredCareers?.categories[selectedCategory]?.image ? (
                  <img
                    src={content.featuredCareers.categories[selectedCategory].image}
                    alt={content.featuredCareers.categories[selectedCategory].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-neutral-body text-lg">
                      {language === "en" ? "Category Image" : "Kategori Görseli"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-blue-50/30">
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
              {testimonials[currentTestimonial].photo && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={testimonials[currentTestimonial].photo}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              )}
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
      <section className="py-16 md:py-24 bg-blue-100/40">
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
                className="bg-white rounded-xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-48 mb-6 overflow-hidden">
                  {card.image ? (
                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-body">{card.title}</span>
                    </div>
                  )}
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
                  {language === "en" ? card.linkTextEn : card.linkText}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-16 md:py-24 bg-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-6">
              {language === "en" ? "Culture" : "Kültür"}
            </h2>
            <p className="text-lg md:text-xl text-neutral-body mb-4 leading-relaxed">
              {content?.companyCards?.[1]
                ? language === "en"
                  ? content.companyCards[1].descriptionEn
                  : content.companyCards[1].description
                : language === "en"
                ? "Our passion to make an impact is fueled by the strength of the people we work with, our curiosity to bring new ideas to life, and our focus on always doing better."
                : "Etki yaratma tutkumuz; birlikte çalıştığımız insanların gücü, yeni fikirleri hayata geçirme merakımız ve her zaman daha iyisini yapmaya odaklanmamızla beslenir."}
            </p>
            <p className="text-lg md:text-xl text-neutral-body leading-relaxed">
              {language === "en"
                ? "At Teknoritma, we believe that our culture is our greatest asset. It's what drives us to innovate, collaborate, and make a meaningful impact in healthcare technology."
                : "Teknoritma'da, kültürümüzün en büyük varlığımız olduğuna inanıyoruz. Sağlık teknolojisinde yenilik yapmamızı, işbirliği kurmamızı ve anlamlı bir etki yaratmamızı sağlayan budur."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Belonging Section */}
      <section id="belonging" className="py-16 md:py-24 bg-blue-100/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {content?.belonging?.image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img
                  src={content.belonging.image}
                  alt={content.belonging.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-6">
                {content?.belonging?.title
                  ? language === "en"
                    ? content.belonging.titleEn
                    : content.belonging.title
                  : language === "en"
                  ? "Belonging at Teknoritma"
                  : "Teknoritma'da Aidiyet"}
              </h2>
              <p className="text-lg md:text-xl text-neutral-body mb-4 leading-relaxed">
                {content?.belonging?.description
                  ? language === "en"
                    ? content.belonging.descriptionEn
                    : content.belonging.description
                  : content?.companyCards?.[2]
                  ? language === "en"
                    ? content.companyCards[2].descriptionEn
                    : content.companyCards[2].description
                  : language === "en"
                  ? "Experience a culture of belonging, where different experiences and perspectives spark innovation."
                  : "Farklı deneyimlerin ve bakış açılarının yeniliği tetiklediği bir aidiyet kültürü yaşayın."}
              </p>
              {content?.belonging?.additionalDescription && (
                <p className="text-lg md:text-xl text-neutral-body leading-relaxed">
                  {language === "en"
                    ? content.belonging.additionalDescriptionEn || content.belonging.additionalDescription
                    : content.belonging.additionalDescription}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Talent Network Form */}
      <section id="talent-network" className="py-16 md:py-24 bg-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12"
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
            className="bg-neutral-light rounded-2xl p-6 md:p-10 lg:p-12"
            onSubmit={async (e) => {
              e.preventDefault();
              
              if (talentFormStep === "form") {
                // Step 1: Send verification code
                if (!talentFormData.email) {
                  setTalentFormMessage({ type: "error", text: language === "en" ? "Email is required" : "E-posta gereklidir" });
                  return;
                }
                if (cvFile && cvFile.type !== "application/pdf") {
                  setTalentFormMessage({ type: "error", text: language === "en" ? "CV must be a PDF file" : "CV PDF formatında olmalıdır" });
                  return;
                }
                
                setTalentFormSubmitting(true);
                setTalentFormMessage(null);
                
                try {
                  const response = await fetch("/api/careers/talent-network/send-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: talentFormData.email }),
                  });
                  
                  const data = await response.json();
                  
                  if (response.ok && data.success) {
                    setTalentFormStep("verify");
                    setTalentFormMessage({
                      type: "success",
                      text: language === "en" 
                        ? "Verification code sent to your email. Please check your inbox." 
                        : "Doğrulama kodu e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.",
                    });
                  } else {
                    setTalentFormMessage({
                      type: "error",
                      text: data.error || (language === "en" ? "Failed to send verification code" : "Doğrulama kodu gönderilemedi"),
                    });
                  }
                } catch (error) {
                  setTalentFormMessage({
                    type: "error",
                    text: language === "en" ? "An error occurred. Please try again." : "Bir hata oluştu. Lütfen tekrar deneyin.",
                  });
                } finally {
                  setTalentFormSubmitting(false);
                }
              } else {
                // Step 2: Verify code and submit form
                if (!talentVerificationCode || talentVerificationCode.length !== 6) {
                  setTalentFormMessage({
                    type: "error",
                    text: language === "en" 
                      ? "Please enter a valid 6-digit verification code" 
                      : "Lütfen geçerli bir 6 haneli doğrulama kodu girin",
                  });
                  return;
                }
                
                setTalentFormSubmitting(true);
                setTalentFormMessage(null);
                
                try {
                  const formData = new FormData();
                  formData.append("firstName", talentFormData.firstName);
                  formData.append("lastName", talentFormData.lastName);
                  formData.append("email", talentFormData.email);
                  formData.append("phone", talentFormData.phone);
                  formData.append("jobCategory", talentFormData.jobCategory);
                  formData.append("city", talentFormData.city);
                  formData.append("remoteWorkplace", talentFormData.remoteWorkplace);
                  formData.append("verificationCode", talentVerificationCode);
                  if (cvFile) {
                    formData.append("cv", cvFile);
                  }

                  const response = await fetch("/api/careers/talent-network", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await response.json();
                  
                  if (response.ok) {
                    setTalentFormMessage({
                      type: "success",
                      text: language === "en" ? "Thank you! We'll keep you updated on new opportunities." : "Teşekkürler! Yeni fırsatlar hakkında sizi bilgilendireceğiz.",
                    });
                    setTalentFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      jobCategory: "",
                      city: "",
                      remoteWorkplace: "",
                    });
                    setCvFile(null);
                    setTalentVerificationCode("");
                    setTalentFormStep("form");
                  } else {
                    setTalentFormMessage({
                      type: "error",
                      text: data.error || (language === "en" ? "Something went wrong. Please try again." : "Bir hata oluştu. Lütfen tekrar deneyin."),
                    });
                  }
                } catch (error) {
                  setTalentFormMessage({
                    type: "error",
                    text: language === "en" ? "Something went wrong. Please try again." : "Bir hata oluştu. Lütfen tekrar deneyin.",
                  });
                } finally {
                  setTalentFormSubmitting(false);
                }
              }
            }}
          >
            {talentFormStep === "form" ? (
              <>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      {language === "en" ? "First Name" : "Ad"}
                    </label>
                    <input
                      type="text"
                      value={talentFormData.firstName}
                      onChange={(e) => setTalentFormData({ ...talentFormData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      {language === "en" ? "Last Name" : "Soyad"}
                    </label>
                    <input
                      type="text"
                      value={talentFormData.lastName}
                      onChange={(e) => setTalentFormData({ ...talentFormData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    {language === "en" ? "Email*" : "E-posta*"}
                  </label>
                  <input
                    type="email"
                    value={talentFormData.email}
                    onChange={(e) => setTalentFormData({ ...talentFormData, email: e.target.value })}
                    placeholder={language === "en" ? "Email" : "E-posta"}
                    required
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    {language === "en" ? "Phone*" : "Cep Telefonu*"}
                  </label>
                  <input
                    type="tel"
                    value={talentFormData.phone}
                    onChange={(e) => setTalentFormData({ ...talentFormData, phone: e.target.value })}
                    placeholder={language === "en" ? "Phone number" : "Cep telefonu"}
                    required
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    {language === "en" ? "CV (PDF only)" : "CV (Sadece PDF)"}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="cv-upload"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && file.type !== "application/pdf") {
                          setTalentFormMessage({ 
                            type: "error", 
                            text: language === "en" ? "CV must be a PDF file" : "CV PDF formatında olmalıdır" 
                          });
                          e.target.value = "";
                          return;
                        }
                        setCvFile(file);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full px-4 py-3 border border-neutral-border rounded-lg bg-white flex items-center justify-between">
                      <span className="text-neutral-body text-sm">
                        {cvFile 
                          ? cvFile.name 
                          : (language === "en" ? "Choose File" : "Dosya Seçin")
                        }
                      </span>
                      <span className="text-primary text-sm font-medium">
                        {language === "en" ? "Browse" : "Gözat"}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-neutral-body">
                    {language === "en" ? "Please upload your CV in PDF format" : "Lütfen CV'nizi PDF formatında yükleyin"}
                  </p>
                </div>
              </>
            ) : (
              <div className="mb-4 md:mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    {language === "en" 
                      ? `Verification code sent to ${talentFormData.email}. Please check your inbox and enter the code below.`
                      : `Doğrulama kodu ${talentFormData.email} adresine gönderildi. Lütfen gelen kutunuzu kontrol edin ve aşağıya kodu girin.`}
                  </p>
                </div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  {language === "en" ? "Verification Code*" : "Doğrulama Kodu*"}
                </label>
                <input
                  type="text"
                  value={talentVerificationCode}
                  onChange={(e) => setTalentVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder={language === "en" ? "Enter 6-digit code" : "6 haneli kodu girin"}
                  maxLength={6}
                  required
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => {
                    setTalentFormStep("form");
                    setTalentVerificationCode("");
                    setTalentFormMessage(null);
                  }}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  {language === "en" ? "← Back to form" : "← Forma dön"}
                </button>
              </div>
            )}
            {talentFormStep === "form" && (
              <>
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    {language === "en" ? "Job Category" : "İş Kategorisi"}
                  </label>
                  <select
                    value={talentFormData.jobCategory}
                    onChange={(e) => setTalentFormData({ ...talentFormData, jobCategory: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{language === "en" ? "Select a Job Category" : "Bir İş Kategorisi Seçin"}</option>
                    {jobCategories.map((category) => {
                      const categoryTitle = language === "en" ? category.titleEn : category.title;
                      const categorySlug = titleToSlug(categoryTitle);
                      return (
                        <option key={category.id} value={categorySlug}>
                          {categoryTitle}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-4 md:mb-6">
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    {language === "en" ? "City" : "Şehir"}
                  </label>
                  <input
                    type="text"
                    value={talentFormData.city}
                    onChange={(e) => setTalentFormData({ ...talentFormData, city: e.target.value })}
                    placeholder={language === "en" ? "Type to Search for a Location" : "Konum Aramak İçin Yazın"}
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="mb-6 md:mb-8">
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    {language === "en" ? "Remote / Workplace" : "Uzaktan / İş Yeri"}
                  </label>
                  <select
                    value={talentFormData.remoteWorkplace}
                    onChange={(e) => setTalentFormData({ ...talentFormData, remoteWorkplace: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">{language === "en" ? "Select..." : "Seçin..."}</option>
                    <option value="remote">{language === "en" ? "REMOTE" : "UZAKTAN"}</option>
                    <option value="hybrid">{language === "en" ? "HYBRID" : "HİBRİT"}</option>
                    <option value="office">{language === "en" ? "OFFICE-BASED" : "OFİS TABANLI"}</option>
                  </select>
                </div>
              </>
            )}
            {talentFormMessage && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  talentFormMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {talentFormMessage.text}
              </div>
            )}
            <button
              type="submit"
              disabled={talentFormSubmitting}
              className="w-full px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {talentFormSubmitting
                ? language === "en"
                  ? talentFormStep === "form" ? "Sending..." : "Submitting..."
                  : talentFormStep === "form" ? "Gönderiliyor..." : "İşleniyor..."
                : talentFormStep === "form"
                ? (language === "en" ? "Send Verification Code" : "Doğrulama Kodu Gönder")
                : (language === "en" ? "Submit Application" : "Başvuruyu Gönder")}
            </button>
          </motion.form>
        </div>
      </section>

      {/* Explore Life at Teknoritma */}
      <section className="py-16 md:py-24 bg-blue-100/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-10 md:mb-12 text-center">
            {content?.exploreLife
              ? language === "en"
                ? content.exploreLife.titleEn
                : content.exploreLife.title
              : language === "en"
              ? "Explore life at Teknoritma"
              : "Teknoritma'da yaşamı keşfedin"}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {stories.map((story, index) => (
              <motion.a
                key={index}
                href={story.url}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-5 md:p-6 hover:shadow-xl transition-shadow group"
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-48 mb-4 overflow-hidden">
                  {story.image ? (
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-neutral-body">{story.title}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold text-neutral-heading mb-2 group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-neutral-body mb-4 leading-relaxed overflow-hidden" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis'
                }}>{story.description}</p>
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
      {(filteredJobs.length > 0 || jobs.length > 0) && (
        <section id="jobs" className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-heading">
                {language === "en" ? "Open Positions" : "Açık Pozisyonlar"}
              </h2>
              {(searchKeyword || searchLocation) && (
                <button
                  onClick={() => {
                    setSearchKeyword("");
                    setSearchLocation("");
                    setFilteredJobs([]);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  {language === "en" ? "Clear filters" : "Filtreleri temizle"}
                </button>
              )}
            </div>
            {filteredJobs.length === 0 && (searchKeyword || searchLocation) ? (
              <div className="text-center py-12">
                <p className="text-lg text-neutral-body">
                  {language === "en"
                    ? "No jobs found matching your search criteria."
                    : "Arama kriterlerinize uygun iş bulunamadı."}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {(filteredJobs.length > 0 ? filteredJobs : jobs).map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="bg-white border border-neutral-border rounded-xl p-5 md:p-6 lg:p-8 hover:shadow-lg transition-shadow"
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
            )}
          </div>
        </section>
      )}
    </div>
  );
}

