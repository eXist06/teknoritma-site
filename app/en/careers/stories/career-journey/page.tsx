"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CareerJourneyPageEn() {
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
              Empowering growth: Career journey
            </h1>
          </motion.div>
        </div>
      </section>

      <article className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl h-64 md:h-96 mb-8 flex items-center justify-center">
              <span className="text-neutral-body text-lg">Story Image</span>
            </div>
            <p className="text-xl text-neutral-body leading-relaxed mb-6">
              Embarking on a career journey with Teknoritma has been a transformative experience. Watch to learn more about the remarkable growth.
            </p>
            <div className="space-y-6 text-neutral-body leading-relaxed">
              <p>
                At Teknoritma, we believe in investing in our people. From day one, you'll have access to mentorship programs, technical training, and opportunities to work on challenging projects.
              </p>
              <p>
                Our career development framework helps you identify your strengths, set goals, and create a personalized growth plan. Whether you want to become a technical expert or move into leadership, we support your journey.
              </p>
              <p>
                Many of our team members have grown from junior positions to senior roles, and some have transitioned into different areas of expertise. Your career path is yours to shape.
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}





