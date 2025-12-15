"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { X, Cookie, Settings } from "lucide-react";

export default function CookieConsent() {
  const { language, t } = useI18n();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [necessaryCookies, setNecessaryCookies] = useState(true); // Always true, cannot be disabled
  const [analyticsCookies, setAnalyticsCookies] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      const consentData = JSON.parse(consent);
      setAnalyticsCookies(consentData.analytics === true);
    }
  }, []);

  const handleAccept = () => {
    const consentData = {
      necessary: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie_consent", JSON.stringify(consentData));
    setAnalyticsCookies(true);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleReject = () => {
    const consentData = {
      necessary: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie_consent", JSON.stringify(consentData));
    setAnalyticsCookies(false);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSaveSettings = () => {
    const consentData = {
      necessary: true,
      analytics: analyticsCookies,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie_consent", JSON.stringify(consentData));
    setShowBanner(false);
    setShowSettings(false);
  };

  if (!showBanner) return null;

  const basePath = language === "en" ? "/en" : "";
  const cookiePolicyPath = language === "en" ? "/en/legal/cookie-policy" : "/yasal/cerez-politikasi";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-6 md:p-8">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                    {t("cookieConsent.title")}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                    {t("cookieConsent.message")}{" "}
                    <Link
                      href={cookiePolicyPath}
                      className="text-primary hover:text-primary-dark underline font-medium"
                    >
                      {t("cookieConsent.learnMore")}
                    </Link>
                  </p>
                </div>
                <button
                  onClick={() => setShowBanner(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAccept}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                >
                  {t("cookieConsent.accept")}
                </button>
                <button
                  onClick={handleReject}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  {t("cookieConsent.reject")}
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  {t("cookieConsent.settings")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {t("cookieConsent.settings")}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Necessary Cookies - Always enabled */}
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t("cookieConsent.necessary")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("cookieConsent.necessaryDesc")}
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={necessaryCookies}
                      disabled
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {t("cookieConsent.analytics")}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {t("cookieConsent.analyticsDesc")}
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={analyticsCookies}
                      onChange={(e) => setAnalyticsCookies(e.target.checked)}
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                >
                  {language === "en" ? "Save Preferences" : "Tercihleri Kaydet"}
                </button>
                <Link
                  href={cookiePolicyPath}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors text-center"
                >
                  {t("cookieConsent.learnMore")}
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
