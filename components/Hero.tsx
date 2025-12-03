"use client";

import { motion } from "framer-motion";
import { metrics } from "@/content/site";
import AnimatedCounter from "./AnimatedCounter";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Hero() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-start overflow-hidden bg-gradient-to-br from-background via-background-alt to-background"
    >
      {/* Video Background - Extends behind text, cropped from bottom */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 right-0 bottom-[30%] md:bottom-[25%]">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
            style={{ objectPosition: 'center top' }}
            preload="auto"
          >
            <source src="/Teknoritma.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />
      </div>

      {/* Modern Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-accent/12 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Bottom wave */}
        <svg
          className="absolute bottom-0 w-full h-40"
          viewBox="0 0 1440 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 160L60 140C120 120 240 80 360 70C480 60 600 80 720 85C840 90 960 80 1080 75C1200 70 1320 70 1380 70L1440 70V160H1380C1320 160 1200 160 1080 160C960 160 840 160 720 160C600 160 480 160 360 160C240 160 120 160 60 160H0Z"
            fill="currentColor"
            className="text-background-alt"
          />
        </svg>
      </div>

      <div className="relative z-10 px-5 md:px-10 pt-12 md:pt-16 pb-10 md:pb-16">
        {/* Content - Overlay on video, aligned left */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-2xl relative ml-8 md:ml-16 mt-4 md:mt-6"
        >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading leading-[1.1] tracking-tight flex flex-col mb-6 md:mb-8"
            >
              <span className="mb-1 md:mb-1.5 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-[0.1em] md:tracking-[0.15em] font-black">Sarus</span>
              {language === "en" ? (
                <span className="text-4xl md:text-5xl lg:text-6xl flex flex-wrap items-baseline break-words overflow-visible gap-1 md:gap-1.5 max-w-4xl">
                  <span className="whitespace-normal leading-normal text-neutral-heading mr-2 md:mr-2.5">{t("hero.titlePrefix")}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent whitespace-normal break-words leading-normal">
                    {t("hero.titleHighlight")}
                  </span>
                  <span className="whitespace-normal leading-normal text-neutral-heading -mt-3 md:-mt-4">{t("hero.titleSuffix")}</span>
                </span>
              ) : (
                <span className="text-4xl md:text-5xl lg:text-6xl flex flex-col break-words overflow-visible gap-0.5 md:gap-1 max-w-4xl">
                  <span className="whitespace-normal leading-normal">{t("hero.titlePrefix")}</span>
                  <span className="whitespace-normal break-words leading-relaxed pb-1 md:pb-2 -mt-4 md:-mt-5 flex flex-wrap items-baseline gap-2 md:gap-2.5">
                    <span className="text-neutral-heading">dijital</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">omurgası</span>
                  </span>
                </span>
              )}
            </motion.h1>

            {/* Feature Highlights - Modern Bullet List */}
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-3 md:gap-3.5 -mt-2 md:-mt-3 list-none"
            >
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-3 text-base md:text-lg text-neutral-heading"
              >
                <span className="text-xl">🏆</span>
                <span className="font-medium">{t("hero.badges.himss")}</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="flex items-center gap-3 text-base md:text-lg text-neutral-heading"
              >
                <span className="text-green-600 text-lg">✔</span>
                <span className="font-medium">{t("hero.badges.robust")}</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center gap-3 text-base md:text-lg text-neutral-heading"
              >
                <span className="text-green-600 text-lg">✔</span>
                <span className="font-medium">{t("hero.badges.support")}</span>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center gap-3 text-base md:text-lg text-neutral-heading"
              >
                <span className="text-green-600 text-lg">✔</span>
                <span className="font-medium">{t("hero.badges.ai")}</span>
              </motion.li>
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4 pt-2 mt-4 md:mt-5"
            >
              <Link href={`${basePath}/urunler/sarus`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                >
                  {t("hero.primaryCta")}
                  <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </motion.button>
              </Link>
              <a href={`${basePath}#products`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                >
                  {t("hero.secondaryCta")}
                </motion.button>
              </a>
            </motion.div>
        </motion.div>

        {/* Metrics - Centered on page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 w-full pt-8 border-t border-neutral-border mt-20 md:mt-24"
        >
          <div className="max-w-7xl mx-auto px-5 md:px-10 ml-8 md:ml-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 lg:gap-16">
              {metrics.map((metric, idx) => {
                let labelKey = "users";
                if (metric.value.includes("80")) labelKey = "patients";
                if (metric.value.includes("40")) labelKey = "applications";
                if (metric.value.includes("HIMSS")) labelKey = "himss";
                
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + idx * 0.1 }}
                    className="group text-center min-w-0"
                  >
                    <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent mb-2 md:mb-3 break-words overflow-visible">
                      {metric.value.includes("+") || 
                       metric.value.includes("%") || 
                       metric.value.includes("/") || 
                       metric.value.includes("HIMSS") ||
                       metric.value.includes(",") ? (
                        <span className="block">{metric.value}</span>
                      ) : (
                        <AnimatedCounter target={parseInt(metric.value.replace(/,/g, "")) || 0} />
                      )}
                    </div>
                    <div className="text-xs md:text-sm lg:text-base text-neutral-body leading-relaxed break-words px-1">
                      {labelKey === "himss" ? (
                        <div className="space-y-0">
                          <div>EMRAM/O-EMRAM</div>
                          <div>Level 7</div>
                        </div>
                      ) : (
                        <span className="block">{t(`metrics.${labelKey}`)}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

