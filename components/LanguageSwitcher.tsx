"use client";

import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1 bg-neutral-100 rounded-full p-1">
      <motion.button
        onClick={() => setLanguage("tr")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
          language === "tr"
            ? "bg-primary text-white shadow-md"
            : "text-neutral-body hover:text-neutral-heading"
        }`}
      >
        TR
      </motion.button>
      <motion.button
        onClick={() => setLanguage("en")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 ${
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
