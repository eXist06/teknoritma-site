"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function FirstLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify">("email");
  const [emailPrefix, setEmailPrefix] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fullEmail = emailPrefix ? `${emailPrefix}@teknoritma.com.tr` : "";

  const handleSendPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!emailPrefix.trim()) {
      setError("Email hesap ismi gerekli");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/auth/first-login/send-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Şifreniz email adresinize gönderildi. Lütfen email'inizi kontrol edin.");
        setStep("verify");
      } else {
        setError(data.error || "Şifre gönderilemedi");
      }
    } catch (error) {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!password.trim()) {
      setError("Şifre gerekli");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/auth/first-login/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fullEmail, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Token is set as HttpOnly cookie by the server
        // Redirect to password change page
        router.push("/admin/change-password");
      } else {
        setError(data.error || "Şifre doğrulanamadı");
      }
    } catch (error) {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-neutral-heading mb-6 text-center">
          İlk Kurulum - Admin Oluştur
        </h1>

        {step === "email" ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>İlk kurulum:</strong> Sistemde henüz admin kullanıcı yok. 
                Teknoritma.com.tr email adresinizle ilk admin kullanıcısını oluşturun. 
                Şifreniz otomatik oluşturulup email adresinize gönderilecektir.
              </p>
            </div>

            <form onSubmit={handleSendPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Email Hesap İsmi <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={emailPrefix}
                    onChange={(e) => setEmailPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))}
                    placeholder="cem.salas"
                    className="flex-1 px-4 py-2 border border-neutral-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  <span className="px-4 py-2 bg-neutral-light border border-l-0 border-neutral-border rounded-r-lg text-neutral-body">
                    @teknoritma.com.tr
                  </span>
                </div>
                <p className="text-xs text-neutral-body mt-1">
                  Tam email: <strong>{fullEmail || "..."}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !emailPrefix.trim()}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? "Şifre Gönderiliyor..." : "Şifre Gönder"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Şifre <strong>{fullEmail}</strong> adresine gönderildi. 
                Lütfen email'inizi kontrol edin ve aşağıya gönderilen şifreyi girin.
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Email Adresinize Gönderilen Şifre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifreyi buraya girin"
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-mono text-center text-lg tracking-wider"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                    setError("");
                    setMessage("");
                  }}
                  className="flex-1 px-6 py-3 border-2 border-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Geri
                </button>
                <button
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {loading ? "Doğrulanıyor..." : "Şifreyi Doğrula"}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

