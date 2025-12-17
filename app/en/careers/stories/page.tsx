"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { CareersContent } from "@/lib/types/careers";
import Link from "next/link";

export default function StoriesPageEn() {
  const { language } = useI18n();
  const [content, setContent] = useState<CareersContent | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

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
    }
  };

  const stories = content?.exploreLife?.stories?.map((s) => ({
    title: language === "en" ? s.titleEn : s.title,
    description: language === "en" ? s.descriptionEn : s.description,
    url: s.url,
  })) || [
    {
      title: "A day in the life as a Software Engineer",
      description: "Join our team member as they share what it's like to work in software development at Teknoritma's Ankara office.",
      url: "/en/careers/stories/software-engineer-day",
    },
    {
      title: "5 reasons to join Teknoritma",
      description: "There are countless reasons people choose Teknoritma; the collaborative people, the breadth and depth of opportunities, and so much more.",
      url: "/en/careers/stories/5-reasons",
    },
    {
      title: "Empowering growth: Career journey",
      description: "Embarking on a career journey with Teknoritma has been a transformative experience. Watch to learn more about the remarkable growth.",
      url: "/en/careers/stories/career-journey",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Link
              href="/en/careers"
              className="inline-flex items-center text-primary hover:underline mb-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Careers
            </Link>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading mb-4 leading-tight">
              {content?.exploreLife?.titleEn || "Reasons to Join Teknoritma"}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-body">
              Discover what makes Teknoritma a great place to work
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {stories.map((story, index) => (
              <motion.a
                key={index}
                href={story.url}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group border border-neutral-border"
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <span className="text-neutral-body">{story.title}</span>
                </div>
                <h3 className="text-xl font-bold text-neutral-heading mb-2 group-hover:text-primary transition-colors">
                  {story.title}
                </h3>
                <p className="text-neutral-body mb-4 leading-relaxed">{story.description}</p>
                <span className="text-primary font-medium group-hover:underline">
                  Read more ›
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}









