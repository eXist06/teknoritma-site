"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations } from "./translations";

type Language = "tr" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [language, setLanguageState] = useState<Language>("tr");

  useEffect(() => {
    // Check if URL starts with /en
    if (pathname.startsWith("/en")) {
      setLanguageState("en");
    } else {
      setLanguageState("tr");
    }
  }, [pathname]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    let currentPath = pathname;
    // Remove /en prefix if exists
    if (currentPath.startsWith("/en")) {
      currentPath = currentPath.replace(/^\/en/, "") || "/";
    }
    // Remove /tr prefix if exists (for consistency)
    if (currentPath.startsWith("/tr")) {
      currentPath = currentPath.replace(/^\/tr/, "") || "/";
    }
    
    if (lang === "en") {
      router.push(`/en${currentPath}`);
    } else {
      router.push(currentPath);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
