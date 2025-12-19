"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { CareersContent } from "@/lib/types/careers";

export default function FiveReasonsPageEn() {
  const [content, setContent] = useState<CareersContent | null>(null);
  const storyUrl = "/en/careers/stories/5-reasons";

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
  const reasons = [
    "Collaborative People: Work with talented individuals who are passionate about healthcare technology",
    "Growth Opportunities: Continuous learning and career development programs",
    "Meaningful Impact: Your work directly improves patient care and healthcare outcomes",
    "Innovation Culture: Be part of cutting-edge projects in healthcare informatics",
    "Work-Life Balance: Flexible working arrangements and supportive team environment",
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-accent/10 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <Link
            href="/en/careers/stories"
            className="inline-flex items-center text-primary hover:underline mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-neutral-heading mb-6 leading-tight">
              {story?.titleEn || "5 reasons to join Teknoritma"}
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
                  alt={story.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 md:h-96 mb-8 flex items-center justify-center">
                <span className="text-neutral-body text-lg">Story Image</span>
              </div>
            )}
            {story?.descriptionEn ? (
              <div 
                className="prose prose-lg max-w-none text-neutral-body leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: (story.descriptionEn || story.description || "").replace(/\n/g, '<br />')
                }}
              />
            ) : (
              <>
                <p className="text-xl text-neutral-body leading-relaxed mb-8">
                  There are countless reasons people choose Teknoritma; the collaborative people, the breadth and depth of opportunities, and so much more.
                </p>
                <div className="space-y-6">
                  {reasons.map((reason, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-neutral-light rounded-xl p-6 border-l-4 border-primary"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {index + 1}
                        </div>
                        <p className="text-lg text-neutral-heading font-medium pt-1">{reason}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}









