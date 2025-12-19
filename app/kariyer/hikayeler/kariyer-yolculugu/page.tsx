"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CareersContent } from "@/lib/types/careers";

export default function CareerJourneyPage() {
  const { language } = useI18n();
  const [content, setContent] = useState<CareersContent | null>(null);
  const storyUrl = language === "en" ? "/en/careers/stories/career-journey" : "/kariyer/hikayeler/kariyer-yolculugu";

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/careers/content?t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  const story = content?.exploreLife?.stories?.find((s) => s.url === storyUrl);

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
              {story 
                ? (language === "en" ? story.titleEn : story.title)
                : (language === "en" ? "Empowering growth: Career journey" : "Büyümeyi güçlendirmek: Kariyer yolculuğu")
              }
            </h1>
          </motion.div>
        </div>
      </section>

      <article className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="prose prose-lg max-w-none">
            {story?.image ? (
              <div className="rounded-xl h-64 md:h-96 mb-8 overflow-hidden">
                <img 
                  src={story.image} 
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 md:h-96 mb-8 flex items-center justify-center">
                <span className="text-neutral-body text-lg">
                  {language === "en" ? "Story Image" : "Hikaye Görseli"}
                </span>
              </div>
            )}
            {story?.description && (
              <div 
                className="prose prose-lg max-w-none text-neutral-body leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: (language === "en" 
                    ? (story.descriptionEn || story.description)
                    : story.description).replace(/\n/g, '<br />')
                }}
              />
            )}
          </div>
        </div>
      </article>
    </div>
  );
}









