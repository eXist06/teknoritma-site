"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { translations } from "./translations";
import { getRouteInLanguage } from "./route-mapping";

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
  // Initialize with default, will be set correctly in useEffect to avoid hydration mismatch
  const [language, setLanguageState] = useState<Language>("tr");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if URL starts with /en
    if (pathname.startsWith("/en")) {
      setLanguageState("en");
    } else {
      setLanguageState("tr");
    }
    setIsInitialized(true);
  }, [pathname]);


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const targetPath = getRouteInLanguage(pathname, lang);
    router.push(targetPath);
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
