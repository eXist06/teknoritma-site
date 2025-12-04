"use client";

import { footerLinks } from "@/content/site";
import Logo from "./Logo";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { language, t } = useI18n();
  const basePath = language === "en" ? "/en" : "";
  return (
    <footer className="bg-gradient-to-br from-neutral-heading to-neutral-heading/95 text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-neutral-300 leading-relaxed mb-6 max-w-md">
              {t("footer.description")}
            </p>
            <div className="space-y-2 text-sm text-neutral-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@teknoritma.com.tr" className="hover:text-white transition-colors">
                  info@teknoritma.com.tr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+903122270015" className="hover:text-white transition-colors">
                  +90 312 227 00 15
                </a>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-neutral-300">
                  Hacettepe Teknokent, 1596. Cadde<br />
                  Çankaya / Ankara
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <a 
                  href="https://www.linkedin.com/company/teknoritma-yazılım-hizmetleri-a-ş" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3">
              <li>
                <a href={`${basePath}#products`} className="text-neutral-300 hover:text-white transition-colors">
                  {t("footer.products")}
                </a>
              </li>
              <li>
                <a href={`${basePath}#projects`} className="text-neutral-300 hover:text-white transition-colors">
                  {t("footer.projects")}
                </a>
              </li>
              <li>
                <a href={`${basePath}#support`} className="text-neutral-300 hover:text-white transition-colors">
                  {t("footer.support")}
                </a>
              </li>
              <li>
                <a href={`${basePath}#contact`} className="text-neutral-300 hover:text-white transition-colors">
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-3">
              {language === "en" ? (
                <>
                  <li>
                    <a
                      href="/en/legal/privacy"
                      className="text-neutral-300 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/en/legal/cookie-policy"
                      className="text-neutral-300 hover:text-white transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/en/legal/terms"
                      className="text-neutral-300 hover:text-white transition-colors"
                    >
                      Terms of Service
                    </a>
                  </li>
                </>
              ) : (
                footerLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.href}
                      className="text-neutral-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-400">
              {t("footer.copyright").replace("{year}", new Date().getFullYear().toString())}
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-400">
              <span>{t("footer.madeIn")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


