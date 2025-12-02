"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, t } = useI18n();
  
  const getNavItems = () => {
    const base = language === "en" ? "/en" : "";
    return [
      { label: t("nav.home"), href: `${base}#hero` },
      { label: t("nav.products"), href: `${base}#products` },
      { label: t("nav.sarus"), href: `${base}#projects` },
      { label: t("nav.projects"), href: `${base}#projects` },
      { label: t("nav.about"), href: `${base}#about` },
      { label: t("nav.contact"), href: `${base}#contact` },
    ];
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-neutral-border/50 shadow-md">
      <div className="max-w-7xl mx-auto px-0 md:px-5">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href={`${language === "en" ? "/en" : ""}#hero`} className="flex items-center group pl-5 md:pl-5">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {getNavItems().map((item, index) => (
              <a
                key={`${item.href}-${index}`}
                href={item.href}
                className="relative px-4 py-2.5 text-sm font-normal text-neutral-body hover:text-neutral-heading transition-all duration-300 rounded-lg group tracking-wide uppercase hover:bg-primary/5"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Buttons and Language Switcher */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-6 py-3 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 tracking-wide uppercase overflow-hidden group"
            >
              <span className="relative z-10">{t("cta.requestDemo")}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center gap-1.5">
              <span
                className={`block h-0.5 w-full bg-neutral-heading transition-all ${
                  isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-neutral-heading transition-all ${
                  isMobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-neutral-heading transition-all ${
                  isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="py-4 space-y-2">
                {getNavItems().map((item, index) => (
                  <a
                    key={`${item.href}-${index}`}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-normal text-neutral-body hover:text-neutral-heading hover:bg-primary-light rounded-lg transition-all duration-300 tracking-wide uppercase"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 space-y-2">
                  <div className="flex justify-center mb-2">
                    <LanguageSwitcher />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-primary rounded-full tracking-wide uppercase shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                  >
                    {t("cta.requestDemo")}
                  </motion.button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

