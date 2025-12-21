"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useState } from "react";

export default function ContactSection() {
  const { language, t } = useI18n();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSendVerificationCode = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "Please complete all required fields to continue." 
          : "Devam etmek için lütfen tüm zorunlu alanları doldurun." 
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep("verify");
        setMessage({ 
          type: "success", 
          text: language === "en" 
            ? "Verification code has been sent to your email address. Please check your inbox and enter the code below." 
            : "Doğrulama kodu e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edip aşağıya kodu girin." 
        });
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || (language === "en" ? "Unable to send verification code. Please try again." : "Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.") 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "An unexpected error occurred. Please try again or contact us directly." 
          : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya doğrudan bizimle iletişime geçin." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "Please enter the 6-digit verification code sent to your email." 
          : "Lütfen e-posta adresinize gönderilen 6 haneli doğrulama kodunu girin." 
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          verificationCode,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({ 
          type: "success", 
          text: language === "en" 
            ? "Thank you for your inquiry. We have received your message and will respond within 24-48 hours." 
            : "İletişim talebiniz için teşekkür ederiz. Mesajınız alınmıştır ve 24-48 saat içinde size dönüş yapacağız." 
        });
        setFormData({ name: "", email: "", organization: "", phone: "", message: "" });
        setVerificationCode("");
        setStep("form");
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || (language === "en" ? "Unable to send your message. Please verify your information and try again." : "Mesajınız gönderilemedi. Lütfen bilgilerinizi kontrol edip tekrar deneyin.") 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "An unexpected error occurred. Please try again or contact us directly." 
          : "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin veya doğrudan bizimle iletişime geçin." 
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-6 leading-tight tracking-tight">
              {t("contact.title")}
            </h2>
            <p className="text-lg md:text-xl text-neutral-body mb-10 leading-relaxed max-w-2xl">
              {t("contact.description")}
            </p>
            <div className="space-y-5 text-neutral-body">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-muted mb-1">
                    {language === "en" ? "Email" : "E-posta"}
                  </div>
                  <a
                    href="mailto:info@teknoritma.com.tr"
                    className="text-primary hover:underline font-medium"
                  >
                    info@teknoritma.com.tr
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-muted mb-1">
                    {language === "en" ? "Phone" : "Telefon"}
                  </div>
                  <a href="tel:+903122270015" className="text-neutral-heading hover:text-primary font-medium">
                    +90 312 227 00 15
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-muted mb-1">
                    {language === "en" ? "Address" : "Adres"}
                  </div>
                  <div className="text-neutral-heading leading-relaxed">
                    Hacettepe Teknoloji Geliştirme Bölgesi, Üniversiteler Mahallesi, 1596. Cadde, Safir C Blok (Bina No:6), 3. Kat, No:35, Beytepe/Çankaya/Ankara, 06800 Türkiye
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-background-alt rounded-3xl border border-neutral-border p-10 space-y-5 shadow-xl overflow-hidden"
            onSubmit={handleVerifyAndSubmit}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-neutral-heading mb-8">
                {language === "en" ? "Contact Form" : "İletişim Formu"}
              </h3>
              
              {message && (
                <div className={`p-4 rounded-xl mb-6 border-l-4 ${
                  message.type === "success" 
                    ? "bg-green-50/50 text-green-900 border-green-500" 
                    : "bg-red-50/50 text-red-900 border-red-500"
                }`}>
                  <div className="flex items-start gap-3">
                    {message.type === "success" ? (
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                  </div>
                </div>
              )}

              {step === "form" ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t("contact.name")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    <input
                      type="text"
                      placeholder={language === "en" ? "Organization" : "Kurum"}
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder={t("contact.email")}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder={language === "en" ? "Phone" : "Telefon"}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <textarea
                    rows={5}
                    placeholder={t("contact.message")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                  />
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{language === "en" ? "Sending..." : "Gönderiliyor..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === "en" ? "Send Verification Code" : "Doğrulama Kodu Gönder"}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="bg-blue-50/50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium text-blue-900 leading-relaxed">
                        {language === "en" 
                          ? `A verification code has been sent to ${formData.email}. Please check your inbox and enter the 6-digit code below.` 
                          : `${formData.email} adresine bir doğrulama kodu gönderildi. Lütfen gelen kutunuzu kontrol edip aşağıya 6 haneli kodu girin.`}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      {language === "en" ? "Verification Code *" : "Doğrulama Kodu *"}
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      required
                      maxLength={6}
                      placeholder="000000"
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl tracking-widest font-mono"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("form");
                        setVerificationCode("");
                        setMessage(null);
                      }}
                      className="flex-1 px-4 py-2 border border-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-light transition-colors"
                    >
                      {language === "en" ? "Back" : "Geri"}
                    </button>
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      type="submit"
                      disabled={loading || verificationCode.length !== 6}
                      className="flex-1 px-6 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>{language === "en" ? "Sending..." : "Gönderiliyor..."}</span>
                        </>
                      ) : (
                        <>
                          <span>{t("contact.send")}</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </>
              )}
              <p className="text-xs text-neutral-muted text-center pt-4 border-t border-neutral-border">
                {language === "en" 
                  ? "By submitting this form, you agree to our privacy policy. Your information will be used solely for communication and project evaluation purposes."
                  : "Bu formu göndererek gizlilik politikamızı kabul etmiş olursunuz. Bilgileriniz yalnızca iletişim ve proje değerlendirmesi amacıyla kullanılacaktır."}
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}


