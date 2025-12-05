"use client";

import { useI18n } from "@/lib/i18n";
import { useEffect } from "react";

export function LanguageAwareHtml({ children }: { children: React.ReactNode }) {
  const { language } = useI18n();

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  return <>{children}</>;
}






