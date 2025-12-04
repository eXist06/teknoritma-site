"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function CareerJourneyPage() {
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
              {language === "en" ? "Empowering growth: Career journey" : "Büyümeyi güçlendirmek: Kariyer yolculuğu"}
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
                ? "Embarking on a career journey with Teknoritma has been a transformative experience. Watch to learn more about the remarkable growth."
                : "Teknoritma ile bir kariyer yolculuğuna çıkmak dönüştürücü bir deneyim oldu. Dikkat çekici büyümeyi öğrenmek için izleyin."}
            </p>
            <div className="space-y-6 text-neutral-body leading-relaxed">
              <p>
                {language === "en"
                  ? "At Teknoritma, we believe in investing in our people. From day one, you'll have access to mentorship programs, technical training, and opportunities to work on challenging projects."
                  : "Teknoritma'da, insanlarımıza yatırım yapmaya inanıyoruz. İlk günden itibaren, mentorluk programlarına, teknik eğitimlere ve zorlu projelerde çalışma fırsatlarına erişiminiz olacak."}
              </p>
              <p>
                {language === "en"
                  ? "Our career development framework helps you identify your strengths, set goals, and create a personalized growth plan. Whether you want to become a technical expert or move into leadership, we support your journey."
                  : "Kariyer geliştirme çerçevemiz, güçlü yönlerinizi belirlemenize, hedefler belirlemenize ve kişiselleştirilmiş bir büyüme planı oluşturmanıza yardımcı olur. Teknik bir uzman olmak isteyin veya liderliğe geçmek isteyin, yolculuğunuzu destekliyoruz."}
              </p>
              <p>
                {language === "en"
                  ? "Many of our team members have grown from junior positions to senior roles, and some have transitioned into different areas of expertise. Your career path is yours to shape."
                  : "Ekip üyelerimizin birçoğu, junior pozisyonlardan senior rollere büyüdü ve bazıları farklı uzmanlık alanlarına geçiş yaptı. Kariyer yolunuzu şekillendirmek size kalmış."}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}


