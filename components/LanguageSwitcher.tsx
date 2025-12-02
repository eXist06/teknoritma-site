"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-border p-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage("tr")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
          language === "tr"
            ? "bg-primary text-white shadow-md"
            : "text-neutral-body hover:text-neutral-heading"
        }`}
      >
        TR
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
          language === "en"
            ? "bg-primary text-white shadow-md"
            : "text-neutral-body hover:text-neutral-heading"
        }`}
      >
        EN
      </motion.button>
    </div>
  );
}

