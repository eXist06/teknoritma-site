"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SarusHubItem, SarusHubItemType } from "@/lib/types/sarus-hub";

const typeLabels: Record<SarusHubItemType, { tr: string; en: string }> = {
  "case-study": { tr: "Vaka Çalışması", en: "Case Study" },
  news: { tr: "Haber", en: "News" },
  insight: { tr: "İçgörü", en: "Insight" },
  event: { tr: "Etkinlik", en: "Event" },
};

const typeColors: Record<SarusHubItemType, string> = {
  "case-study": "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  news: "bg-sky-500/10 text-sky-400 ring-sky-500/30",
  insight: "bg-violet-500/10 text-violet-400 ring-violet-500/30",
  event: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
};

function formatDate(dateStr: string, locale: "tr" | "en" = "tr") {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

interface SarusHubHeroProps {
  featured?: SarusHubItem;
  language?: "tr" | "en";
  showLink?: boolean;
}

export default function SarusHubHero({ 
  featured, 
  language = "tr",
  showLink = true 
}: SarusHubHeroProps) {
  const labels = typeLabels;
  const isEnglish = language === "en";
  
  const heroContent = featured ? (
    <div className="relative w-full h-[108px] md:h-[126px] overflow-hidden">
      {featured.video ? (
        <video
          src={featured.video}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          onError={(e) => {
            console.error("Video yüklenemedi:", featured.video);
            const target = e.target as HTMLVideoElement;
            target.style.display = "none";
          }}
        />
      ) : featured.primaryImage || featured.image ? (
        <img
          src={featured.primaryImage || featured.image || ""}
          alt={featured.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error("Görsel yüklenemedi:", featured.primaryImage || featured.image);
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <svg className="w-24 h-24 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {featured.video && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-medium">
          🎥 {isEnglish ? "Video" : "Video"}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 lg:p-8 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <motion.div 
            className="mb-2 flex items-center gap-3 text-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] ring-1 backdrop-blur-sm bg-white/20 ${typeColors[featured.type]}`}
            >
              {labels[featured.type][language]}
            </span>
            <span className="text-white/80 text-xs">{formatDate(featured.publishedAt, language)}</span>
            {featured.readingMinutes && (
              <span className="text-white/80 text-xs">
                • {featured.readingMinutes} {isEnglish ? "min" : "dk"}
              </span>
            )}
          </motion.div>
          <motion.h2 
            className="mb-2 text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight group-hover:text-primary/90 transition-colors line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {featured.title}
          </motion.h2>
          <motion.p 
            className="mb-3 text-sm md:text-base text-white/80 leading-relaxed font-normal tracking-normal max-w-4xl line-clamp-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {featured.summary}
          </motion.p>
          {showLink && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-primary transition-colors">
                {isEnglish ? "Read more" : "Detayı gör"}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="relative w-full h-[108px] md:h-[126px] overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1 
          className="mb-2 text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Sarus Hub
        </motion.h1>
        <motion.p 
          className="text-base md:text-lg text-white/80 leading-relaxed font-normal tracking-normal max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {isEnglish 
            ? "News from Sarus; field experiences and application examples"
            : "Sarus'tan haberler; sahada edinilen deneyimler ve uygulama örnekleri"
          }
        </motion.p>
      </div>
    </div>
  );

  if (featured && showLink) {
    return (
      <section className="mb-6">
        <Link
          href={`/${language === "en" ? "en/" : ""}sarus-hub/${featured.slug}`}
          className="group relative block overflow-hidden bg-white hover:shadow-lg transition-all rounded-b-2xl"
        >
          {heroContent}
        </Link>
      </section>
    );
  }

  return (
    <section className="mb-6">
      <div className="rounded-b-2xl overflow-hidden">
        {heroContent}
      </div>
    </section>
  );
}

