"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function SoftwareEngineerDayPage() {
  const { language } = useI18n();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link
            href={language === "en" ? "/en/careers/stories" : "/kariyer/hikayeler"}
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {language === "en" ? "Back to Stories" : "Hikayelere Dön"}
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-heading mb-6 leading-tight">
              {language === "en" ? "A day in the life as a Software Engineer" : "Yazılım Mühendisi olarak bir gün"}
            </h1>
          </motion.div>
        </div>
      </section>

      <article className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 md:h-96 mb-8 flex items-center justify-center">
              <span className="text-neutral-body text-lg">
                {language === "en" ? "Story Image" : "Hikaye Görseli"}
              </span>
            </div>
            <p className="text-xl text-neutral-body leading-relaxed mb-6">
              {language === "en"
                ? "Join our team member as they share what it's like to work in software development at Teknoritma's Ankara office."
                : "Teknoritma'nın Ankara ofisinde yazılım geliştirmede çalışmanın nasıl bir şey olduğunu ekibimizden bir üye paylaşıyor."}
            </p>
            <div className="space-y-6 text-neutral-body leading-relaxed">
              <p>
                {language === "en"
                  ? "Every morning starts with a team standup where we discuss our progress and plan the day ahead. The collaborative atmosphere at Teknoritma makes it easy to share ideas and get support from colleagues."
                  : "Her sabah, ilerlememizi tartıştığımız ve günü planladığımız bir ekip toplantısıyla başlıyor. Teknoritma'daki işbirlikçi atmosfer, fikirleri paylaşmayı ve meslektaşlardan destek almayı kolaylaştırıyor."}
              </p>
              <p>
                {language === "en"
                  ? "Working on healthcare technology means every line of code we write has the potential to improve patient outcomes. This sense of purpose drives us to deliver high-quality solutions."
                  : "Sağlık teknolojisi üzerinde çalışmak, yazdığımız her satır kodun hasta sonuçlarını iyileştirme potansiyeline sahip olduğu anlamına geliyor. Bu amaç duygusu, yüksek kaliteli çözümler sunmamızı sağlıyor."}
              </p>
              <p>
                {language === "en"
                  ? "The best part of working here is the continuous learning opportunities. Whether it's new technologies, best practices, or healthcare domain knowledge, there's always something new to explore."
                  : "Burada çalışmanın en iyi yanı, sürekli öğrenme fırsatları. Yeni teknolojiler, en iyi uygulamalar veya sağlık alanı bilgisi olsun, keşfedilecek her zaman yeni bir şey var."}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}





