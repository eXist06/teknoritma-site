"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function DemoRequestForm() {
  const { language, t } = useI18n();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    product: "",
    message: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const products = language === "en" 
    ? ["Sarus HIS", "Sarus Cloud", "Sarus EMR", "Sarus LIS", "Sarus PACS", "General Inquiry"]
    : ["Sarus HIS", "Sarus Bulut", "Sarus EMR", "Sarus LIS", "Sarus PACS", "Genel Bilgi"];

  const handleSendVerificationCode = async () => {
    if (!formData.name || !formData.email || !formData.organization || !formData.phone) {
      setMessage({ 
        type: "error", 
        text: language === "en" 
          ? "Please fill in all required fields (Name, Email, Organization, Phone)" 
          : "Lütfen tüm zorunlu alanları doldurun (Ad, E-posta, Kurum, Telefon)" 
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/demo-request/send-verification", {
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
      const response = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          verificationCode,
          language, // Include language in request
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
            setMessage({ 
              type: "success", 
              text: language === "en" 
                ? "Demo request submitted successfully! We'll contact you soon." 
                : "Demo talebiniz gönderildi! En kısa sürede sizinle iletişime geçeceğiz." 
            });
            setFormData({ name: "", email: "", organization: "", phone: "", product: "", message: "" });
            setVerificationCode("");
            setStep("form");
            // Redirect to home page after 2 seconds
            setTimeout(() => {
              window.location.href = language === "en" ? "/en" : "/";
            }, 2000);
      } else {
        setMessage({ 
          type: "error", 
          text: data.error || (language === "en" ? "Failed to submit demo request" : "Demo talebi gönderilemedi") 
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-neutral-border p-6 md:p-8 space-y-4 shadow-lg"
    >
      <h3 className="text-xl font-bold text-neutral-heading mb-4">
        {language === "en" ? "Request a Demo" : "Demo Talep Et"}
      </h3>
      
      {message && (
        <div className={`p-3 rounded-lg ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {step === "form" ? (
        <form className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Name *" : "Ad Soyad *"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Email *" : "E-posta *"}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Organization *" : "Kurum *"}
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Phone *" : "Telefon *"}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              {language === "en" ? "Product of Interest" : "İlgilendiğiniz Ürün"}
            </label>
            <select
              value={formData.product}
              onChange={(e) => setFormData({ ...formData, product: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{language === "en" ? "Select a product" : "Bir ürün seçin"}</option>
              {products.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              {language === "en" ? "Message" : "Mesaj"}
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder={language === "en" ? "Tell us about your needs..." : "İhtiyaçlarınızı bize bildirin..."}
            />
          </div>

          <button
            type="button"
            onClick={handleSendVerificationCode}
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading 
              ? (language === "en" ? "Sending Code..." : "Kod Gönderiliyor...") 
              : (language === "en" ? "Send Verification Code" : "Doğrulama Kodu Gönder")}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndSubmit} className="space-y-4">
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
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading 
                ? (language === "en" ? "Submitting..." : "Gönderiliyor...") 
                : (language === "en" ? "Verify & Submit" : "Doğrula ve Gönder")}
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

