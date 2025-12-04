"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { JobPosting } from "@/lib/types/careers";
import Link from "next/link";

export default function JobDetailPage({ jobId }: { jobId: string }) {
  const { language } = useI18n();
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch("/api/careers/jobs");
      const data = await response.json();
      const foundJob = data.jobs.find((j: JobPosting) => j.id === jobId);
      setJob(foundJob || null);
    } catch (error) {
      console.error("Failed to fetch job:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-heading mb-4">
            {language === "en" ? "Job Not Found" : "İş İlanı Bulunamadı"}
          </h1>
          <Link
            href={language === "en" ? "/en/careers" : "/kariyer"}
            className="text-primary hover:underline"
          >
            {language === "en" ? "Back to Careers" : "Kariyer Sayfasına Dön"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link
          href={language === "en" ? "/en/careers" : "/kariyer"}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {language === "en" ? "Back to Careers" : "Kariyer Sayfasına Dön"}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-neutral-border rounded-xl p-8 md:p-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-heading mb-6">
            {language === "en" ? job.titleEn : job.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-neutral-body mb-8 pb-8 border-b border-neutral-border">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {language === "en" ? job.locationEn : job.location}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {language === "en" ? job.departmentEn : job.department}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === "en" ? job.typeEn : job.type}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {language === "en" ? job.remoteEn : job.remote}
            </span>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold text-neutral-heading mb-4">
              {language === "en" ? "Job Description" : "İş Tanımı"}
            </h2>
            <p className="text-neutral-body leading-relaxed whitespace-pre-line">
              {language === "en" ? job.descriptionEn : job.description}
            </p>
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-heading mb-4">
                {language === "en" ? "Requirements" : "Gereksinimler"}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-body">
                {(language === "en" ? job.requirementsEn : job.requirements).map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-heading mb-4">
                {language === "en" ? "Benefits" : "Yan Haklar"}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-neutral-body">
                {(language === "en" ? job.benefitsEn : job.benefits).map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-8 border-t border-neutral-border">
            <a
              href={`mailto:careers@teknoritma.com?subject=${encodeURIComponent(
                language === "en" ? `Application: ${job.titleEn}` : `Başvuru: ${job.title}`
              )}`}
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-lg"
            >
              {language === "en" ? "Apply Now" : "Şimdi Başvur"}
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


