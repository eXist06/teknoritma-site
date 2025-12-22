"use client";

import { motion, AnimatePresence } from "framer-motion";
import { metrics } from "@/content/site";
import AnimatedCounter from "./AnimatedCounter";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useState, useEffect, useRef } from "react";
import Orb from "./Orb";
import Threads from "./Threads";
import VantaGlobe from "./VantaGlobe";

export default function Hero() {
  const { language, t } = useI18n();
  const [mounted, setMounted] = useState(false);
  // Only compute basePath after mount to avoid hydration mismatch
  const basePath = mounted && language === "en" ? "/en" : "";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [videoDuration, setVideoDuration] = useState(18000); // Default 18 seconds
  const [showSlogan, setShowSlogan] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const totalSlides = 3;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Set mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get video duration when video loads and handle video events
  // This effect runs whenever currentSlide changes to 0 or videoRef changes
  useEffect(() => {
    if (!mounted || currentSlide !== 0 || !videoRef.current) return;
    
    const video = videoRef.current;
    
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        // Convert to milliseconds
        const durationMs = Math.round(video.duration * 1000);
        setVideoDuration(durationMs);
      }
    };
    
    const handleTimeUpdate = () => {
      if (video.duration && !isNaN(video.duration) && isFinite(video.duration)) {
        const currentTime = video.currentTime;
        const duration = video.duration;
        // Show slogan in last 7 seconds (5 + 2)
        if (currentTime >= duration - 7) {
          setShowSlogan(true);
        } else if (currentTime < duration - 7) {
          // Hide slogan if we're not in the last 7 seconds
          setShowSlogan(false);
        }
      }
    };
    
    const handleEnded = () => {
      // When video ends, move to next slide immediately
      // Only if we're still on slide 0 (prevent race conditions)
      if (currentSlide === 0) {
        setShowSlogan(false);
        setCurrentSlide((prev) => (prev + 1) % 3);
      }
    };
    
    const handlePlay = () => {
      // Ensure timeupdate fires when video starts playing
      handleTimeUpdate();
      // Mark video as started for navigation visibility
      setVideoStarted(true);
    };
    
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    
    // If video already has metadata
    if (video.readyState >= 1 && video.duration) {
      handleLoadedMetadata();
    }
    
    // Force initial timeupdate check
    handleTimeUpdate();
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
    };
  }, [mounted, currentSlide]);

  // Reset slogan visibility and video state when slide changes
  useEffect(() => {
    if (currentSlide !== 0) {
      setShowSlogan(false);
      setVideoStarted(false);
      // Pause video immediately when leaving slide 0 to prevent showing start frame
      if (videoRef.current) {
        videoRef.current.pause();
        // Keep video at current position, don't reset to prevent showing start frame
      }
    } else {
      // Reset video and slogan when returning to slide 0
      setShowSlogan(false); // Reset slogan first - it will show again when video reaches last 7 seconds
      
      // Use a small delay to ensure video element is in DOM
      const resetVideo = () => {
        if (videoRef.current && currentSlide === 0) {
          // Reset video to start
          videoRef.current.currentTime = 0;
          videoRef.current.playbackRate = 1.0; // Reset playback rate
          
          // Video element is recreated with new key, so we just need to ensure it plays
          // The onCanPlay and onLoadedData handlers will handle playing
          // Just ensure video is at the start
          if (videoRef.current.currentTime > 0.1) {
            videoRef.current.currentTime = 0;
          }
        }
      };
      
      // Small delay to ensure DOM is ready
      setTimeout(resetVideo, 100);
    }
  }, [currentSlide]);

  // Auto-advance slides 2 and 3 after 12 seconds
  useEffect(() => {
    // Only auto-advance for slides 1 and 2 (currentSlide === 1 or 2)
    if (currentSlide === 1 || currentSlide === 2) {
      const timer = setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 12000); // 12 seconds

      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentSlide, totalSlides]);


  // Touch handlers for swipe - only on carousel container
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <>
    {/* SEO H1 - Görsel olarak gizli ama semantic olarak H1 */}
    {language === "tr" && (
      <h1 className="sr-only">Sarus Hastane Bilgi Sistemi (HBYS)</h1>
    )}
    {language === "en" && (
      <h1 className="sr-only">Sarus EMR & EHR – Enterprise Hospital Information System</h1>
    )}
    <section
      id="hero"
      className={`relative min-h-[85vh] flex items-start overflow-visible ${
        currentSlide === 0 
          ? "bg-transparent"
          : currentSlide === 2
          ? "bg-gradient-to-br from-background via-background-alt to-background"
          : "bg-white"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video Background - Only for slide 1 */}
      {mounted && currentSlide === 0 && (
        <div className="absolute inset-0 overflow-visible pointer-events-none" suppressHydrationWarning>
          <motion.div
            key={`video-slide-1-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            suppressHydrationWarning
            className="absolute inset-0 -bottom-1"
          >
            <div className="absolute left-0 top-0 right-0 bottom-0">
              <video
                key={`video-${currentSlide}`}
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover object-center"
                preload="metadata"
                onCanPlay={() => {
                  // Ensure video plays when it's ready and we're on slide 0
                  if (videoRef.current && currentSlide === 0) {
                    // Only play if video is at the start (not at the end)
                    if (videoRef.current.currentTime < 0.1 || videoRef.current.paused) {
                      videoRef.current.play().catch(() => {
                        // Ignore play errors
                      });
                    }
                  }
                }}
                onLoadedData={() => {
                  // When video data is loaded and we're on slide 0, ensure it plays
                  if (videoRef.current && currentSlide === 0 && videoRef.current.paused) {
                    videoRef.current.play().catch(() => {
                      // Ignore play errors
                    });
                  }
                }}
              >
                <source src="/web3.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Overlay for readability - applied to entire video */}
              <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Threads Background - Only for slide 2 */}
      {mounted && currentSlide === 1 && (
        <div className="absolute inset-0 overflow-hidden bg-white z-0" suppressHydrationWarning>
          <AnimatePresence mode="wait">
            <motion.div
              key="threads-slide-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              suppressHydrationWarning
              className="absolute inset-0 z-0"
            >
              <Threads 
                color={[0.2, 0.4, 0.8]} 
                amplitude={1.2} 
                distance={0.75} 
                enableMouseInteraction={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Background for slide 3 - Vanta.js Globe Effect */}
      {mounted && currentSlide === 2 && (
        <div className="absolute inset-0 overflow-hidden z-0" suppressHydrationWarning>
          <AnimatePresence mode="wait">
            <motion.div
              key="bg-slide-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              suppressHydrationWarning
              className="absolute inset-0 z-0"
            >
              <VantaGlobe
                color={0x1e3a8a}
                color2={0x991b1b}
                backgroundColor={0xf7f7f7}
                mouseControls={true}
                touchControls={true}
                gyroControls={false}
                minHeight={200}
                minWidth={200}
                scale={1}
                scaleMobile={1}
                maxDistance={0}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Modern Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-accent/12 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Navigation Controls - Bottom center */}
      {mounted && (currentSlide === 0 ? videoStarted : true) && (
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 md:gap-4">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2 items-center">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentSlide === index
                    ? "w-2 h-2 bg-primary"
                    : "w-2 h-2 bg-primary/50 hover:bg-primary/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        </div>
      )}

      <div className="relative z-20 px-5 md:px-10 pt-8 md:pt-12 pb-6 md:pb-8 w-full h-full">
        {/* Carousel Container - Full width and height */}
        <div className="relative w-full h-full min-h-[calc(85vh-8rem)]" suppressHydrationWarning>
          <AnimatePresence mode="wait">
            {/* Slide 1: Sarus */}
            {mounted && currentSlide === 0 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                suppressHydrationWarning
                className="max-w-2xl relative ml-8 md:ml-16 mt-8 md:mt-10"
              >
            {/* Title - Show in last 7 seconds of video */}
            {showSlogan && (
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading leading-[1.1] tracking-tight flex flex-col mb-6 md:mb-8 relative z-10"
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
            )}
              </motion.div>
            )}
            

            {/* Slide 2: Teknoritma */}
            {mounted && currentSlide === 1 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                suppressHydrationWarning
                className="space-y-8 max-w-2xl relative ml-8 md:ml-16 mt-10 md:mt-12 z-30"
              >
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading leading-[1.1] tracking-tight flex flex-col mb-6 md:mb-8"
                >
                  <span className="mb-1 md:mb-1.5 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-[0.1em] md:tracking-[0.15em] font-black">
                    Sarus
                  </span>
                  <span className="text-4xl md:text-5xl lg:text-6xl flex flex-col break-words overflow-visible gap-0.5 md:gap-1 max-w-4xl">
                    <span className="whitespace-normal leading-normal text-neutral-heading">
                      {language === "en" 
                        ? (
                          <>
                            The{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Next Wave</span>{" "}
                            of Healthcare
                          </>
                        )
                        : (
                          <>
                            Sağlıkta dijital{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">dönüşümün</span>{" "}
                            lideri
                          </>
                        )}
                    </span>
                  </span>
                </motion.h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg md:text-xl lg:text-2xl font-normal text-neutral-heading leading-tight max-w-2xl tracking-tight"
                >
                  {language === "en"
                    ? "Sarus EMR & EHR unifies clinical, administrative, and financial workflows within a single Hospital Information System."
                    : "Sarus HBYS (Hastane Bilgi Sistemi), klinik, idari ve finansal süreçleri tek bir platformda bütünleştirir. Sağlık tesisleri için uçtan uca entegre bir dijital sağlık bilişimi altyapısı sunar."}
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-4 pt-2 mt-4 md:mt-5"
                >
                  <Link href={language === "en" ? "/en/products/sarus-emr" : "/urunler/sarus"}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all duration-300 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40"
                    >
                      {language === "en" ? "Learn More" : "Daha Fazla Bilgi"}
                      <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </motion.button>
                  </Link>
                  <a href={`${basePath}#contact`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                    >
                      {language === "en" ? "Contact Us" : "İletişim"}
                    </motion.button>
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* Slide 3: Beyond Boundaries */}
            {mounted && currentSlide === 2 && (
              <motion.div
                key="slide-3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                suppressHydrationWarning
                className="space-y-8 max-w-2xl relative ml-8 md:ml-16 mt-10 md:mt-12 z-30"
              >
                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-neutral-heading leading-[1.1] tracking-tight flex flex-col mb-4 md:mb-6"
                >
                  <span className="mb-1 md:mb-1.5 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-[0.1em] md:tracking-[0.15em] font-black">
                    Sarus
                  </span>
                  {language === "tr" && (
                    <span className="text-4xl md:text-5xl lg:text-6xl text-neutral-heading">
                      {t("hero.slide3.title")}
                    </span>
                  )}
                </motion.h1>

                {/* Subtitle - Only for English, styled as slogan */}
                {language === "en" && (
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-neutral-heading mb-6 md:mb-8"
                  >
                    {t("hero.slide3.subtitle")}
                  </motion.h2>
                )}

                {/* Bullet Points */}
                <motion.ul
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-col gap-3 md:gap-4 list-none"
                >
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex items-start gap-3 text-lg md:text-xl text-neutral-heading"
                  >
                    <span className="text-primary text-xl md:text-2xl mt-0.5">●</span>
                    <span className="font-semibold leading-relaxed">{t("hero.slide3.bullets.multilang")}</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex items-start gap-3 text-lg md:text-xl text-neutral-heading"
                  >
                    <span className="text-primary text-xl md:text-2xl mt-0.5">●</span>
                    <span className="font-semibold leading-relaxed">{t("hero.slide3.bullets.integration")}</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="flex items-start gap-3 text-lg md:text-xl text-neutral-heading"
                  >
                    <span className="text-primary text-xl md:text-2xl mt-0.5">●</span>
                    <span className="font-semibold leading-relaxed">{t("hero.slide3.bullets.project")}</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex items-start gap-3 text-lg md:text-xl text-neutral-heading"
                  >
                    <span className="text-primary text-xl md:text-2xl mt-0.5">●</span>
                    <span className="font-semibold leading-relaxed">{t("hero.slide3.bullets.compliance")}</span>
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
                  <a href={`${basePath}#contact`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 border-neutral-border text-neutral-heading rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300 hover:bg-primary/5"
                    >
                      {language === "en" ? "Contact Us" : "İletişim"}
                    </motion.button>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>

    {/* Metrics - Blue background section after hero */}
    <section className="relative w-full bg-gradient-to-br from-primary via-primary to-primary-dark py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 lg:gap-16">
          {metrics.map((metric, idx) => {
            let labelKey = "users";
            if (metric.value.includes("80") || metric.value.includes("60")) labelKey = "patients";
            if (metric.value.includes("40")) labelKey = "applications";
            if (metric.value.includes("HIMSS")) labelKey = "himss";
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={mounted ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.9 + idx * 0.1 }}
                suppressHydrationWarning
                className="group text-center min-w-0"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-2 md:mb-3 break-words overflow-visible">
                  {metric.value.includes("+") || 
                   metric.value.includes("%") || 
                   metric.value.includes("/") || 
                   metric.value.includes("HIMSS") ||
                   metric.value.includes(",") ? (
                    <span className="inline-flex items-baseline whitespace-nowrap text-white">{metric.value}</span>
                  ) : (
                    <span className="text-white">
                      <AnimatedCounter target={parseInt(metric.value.replace(/,/g, "")) || 0} />
                    </span>
                  )}
                </div>
                <div className="text-xs md:text-sm lg:text-base font-medium tracking-wide text-white/90 leading-relaxed break-words px-1">
                  {labelKey === "himss" ? (
                    <div className="space-y-0 font-medium tracking-wide">
                      <div>EMRAM/O-EMRAM</div>
                      <div>{language === "en" ? "Stage 7" : "Seviye 7"}</div>
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
    </section>
    </>
  );
}

