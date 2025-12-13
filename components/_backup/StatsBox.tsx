"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "Ankara Şehir Hastanesi", value: "", isTitle: true },
  { label: "4000+", value: "yatak", isTitle: false },
  { label: "35.000", value: "günlük hasta", isTitle: false },
  { label: "10000+", value: "radyoloji çekimi", isTitle: false },
  { label: "200.000", value: "Test parametresi", isTitle: false },
];

function TypingText({ text, delay, speed = 50 }: { text: string; delay: number; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, speed]);

  return (
    <span>
      {displayedText}
      {isTyping && displayedText.length < text.length && (
        <span className="inline-block w-0.5 h-5 bg-primary ml-1 animate-pulse">|</span>
      )}
    </span>
  );
}

export default function StatsBox() {
  const [showBox, setShowBox] = useState(false);
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    // Sayfa yüklendikten 2 saniye sonra göster
    const showTimer = setTimeout(() => {
      setShowBox(true);
    }, 2000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showBox) return;
    
    // Her item arasında delay
    const itemTimer = setTimeout(() => {
      if (currentItem < stats.length) {
        setCurrentItem(currentItem + 1);
      }
    }, currentItem === 0 ? 500 : 1500);

    return () => clearTimeout(itemTimer);
  }, [showBox, currentItem]);

  if (!showBox) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed right-8 top-[100px] z-20 hidden xl:block"
    >
      <div className="relative bg-white/98 backdrop-blur-xl border-l-4 border-primary shadow-2xl rounded-l-2xl p-6 pl-8 mr-0 overflow-hidden w-[320px]">
        {/* Digital grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:8px_8px] opacity-50" />
        
        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-l-2xl bg-gradient-to-l from-primary/20 via-transparent to-transparent opacity-50" />
        
        {/* Digital scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
          animate={{
            y: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Glitch effect overlay */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" />
        </div>
        
        <div className="relative space-y-4">
          {stats.map((stat, index) => {
            const isVisible = index < currentItem;
            if (!isVisible) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`${
                  stat.isTitle
                    ? "pb-3 border-b-2 border-primary/20"
                    : "flex items-baseline gap-2"
                }`}
              >
                {stat.isTitle ? (
                  <h3 className="text-lg font-bold text-primary uppercase tracking-wide font-mono">
                    <TypingText text={stat.label} delay={index * 1500} speed={80} />
                  </h3>
                ) : (
                  <>
                    <span className="text-2xl font-extrabold text-neutral-heading font-mono">
                      <TypingText text={stat.label} delay={index * 1500} speed={60} />
                    </span>
                    <span className="text-sm text-neutral-body font-medium">
                      <TypingText text={stat.value} delay={index * 1500 + stat.label.length * 60} speed={40} />
                    </span>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Animated pulse effect on left border */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary rounded-full animate-pulse" />
        
        {/* Digital corner accents */}
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/50" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary/50" />
        
        {/* Flowing data stream effect */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent"
          animate={{
            y: ["-100%", "200%"],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}











