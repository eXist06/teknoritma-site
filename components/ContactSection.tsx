"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function ContactSection() {
  const { language, t } = useI18n();
  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
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
                Adres: Hacettepe Teknokent, 1596. Cadde, Çankaya / Ankara
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-background-alt rounded-3xl border border-neutral-border p-10 space-y-5 shadow-xl overflow-hidden"
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-neutral-heading mb-6">
                Hızlı iletişim formu
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={t("contact.name")}
                  className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <input
                  type="text"
                  placeholder={language === "en" ? "Organization" : "Kurum"}
                  className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <input
                type="email"
                placeholder={t("contact.email")}
                className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <textarea
                rows={5}
                placeholder={t("contact.message")}
                className="w-full px-5 py-3.5 rounded-xl border border-neutral-border bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full px-6 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40"
              >
                {t("contact.send")}
                <span className="inline-block ml-2">→</span>
              </motion.button>
              <p className="text-xs text-neutral-muted text-center pt-2">
                Form üzerinden ilettiğiniz bilgiler yalnızca sizinle iletişim
                kurmak ve proje değerlendirmesi yapmak için kullanılacaktır.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}


