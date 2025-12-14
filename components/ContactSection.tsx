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
          ? "Please fill in all required fields (Name, Email, Message)" 
          : "Lütfen tüm zorunlu alanları doldurun (Ad, E-posta, Mesaj)" 
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
            ? "Verification code sent to your email. Please check your inbox." 
            : "Doğrulama kodu e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin." 
        });
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || (language === "en" ? "Failed to send verification code" : "Doğrulama kodu gönderilemedi") 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "An error occurred. Please try again." 
          : "Bir hata oluştu. Lütfen tekrar deneyin." 
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
          ? "Please enter a valid 6-digit verification code" 
          : "Lütfen geçerli bir 6 haneli doğrulama kodu girin" 
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
            ? "Message sent successfully! We'll get back to you soon." 
            : "Mesajınız gönderildi! En kısa sürede size dönüş yapacağız." 
        });
        setFormData({ name: "", email: "", organization: "", message: "" });
        setVerificationCode("");
        setStep("form");
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || (language === "en" ? "Failed to send message" : "Mesaj gönderilemedi") 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "An error occurred. Please try again." 
          : "Bir hata oluştu. Lütfen tekrar deneyin." 
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <section id="contact" className="py-20 md:py-28 bg-background scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-4">
              {t("contact.title")}
            </h2>
            <p className="text-lg text-neutral-body mb-8 leading-relaxed">
              {t("contact.description")}
            </p>
            <div className="space-y-3 text-neutral-body">
              <div>
                E-posta:{" "}
                <a
                  href="mailto:info@teknoritma.com.tr"
                  className="text-primary hover:underline font-mono"
                >
                  info@teknoritma.com.tr
                </a>
              </div>
              <div>Telefon: +90 312 227 00 15</div>
              <div>
                {language === "en" ? "Address: " : "Adres: "}
                Hacettepe Teknoloji Geliştirme Bölgesi, Üniversiteler Mahallesi, 1596. Cadde, Safir C Blok (Bina No:6), 3. Kat, No:35, Beytepe/Çankaya/Ankara, 06800 Türkiye
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
              <h3 className="text-lg font-bold text-neutral-heading mb-6">
                {language === "en" ? "Quick Contact Form" : "Hızlı iletişim formu"}
              </h3>
              
              {message && (
                <div className={`p-3 rounded-lg mb-4 ${
                  message.type === "success" 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {message.text}
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
                    className="w-full px-6 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (language === "en" ? "Sending Code..." : "Kod Gönderiliyor...") : (language === "en" ? "Send Verification Code" : "Doğrulama Kodu Gönder")}
                    {!loading && <span className="inline-block ml-2">→</span>}
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      {language === "en" 
                        ? `A verification code has been sent to ${formData.email}. Please enter the 6-digit code below.` 
                        : `${formData.email} adresine bir doğrulama kodu gönderildi. Lütfen aşağıya 6 haneli kodu girin.`}
                    </p>
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
                      className="flex-1 px-6 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (language === "en" ? "Sending..." : "Gönderiliyor...") : t("contact.send")}
                      {!loading && <span className="inline-block ml-2">→</span>}
                    </motion.button>
                  </div>
                </>
              )}
              <p className="text-xs text-neutral-muted text-center pt-2">
                {language === "en" 
                  ? "The information you provide through this form will only be used to contact you and evaluate your project."
                  : "Form üzerinden ilettiğiniz bilgiler yalnızca sizinle iletişim kurmak ve proje değerlendirmesi yapmak için kullanılacaktır."}
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}


