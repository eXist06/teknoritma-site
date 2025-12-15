"use client";

import { I18nProvider } from "@/lib/i18n";
import StructuredData from "@/components/StructuredData";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <StructuredData />
      {children}
    </I18nProvider>
  );
}
