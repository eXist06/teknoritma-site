"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminDashboardPageEn() {
  const router = useRouter();

  useEffect(() => {
    // Token kontrolü
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/check-first-login");
        if (!response.ok) {
          router.push("/en/admin/login");
        }
      } catch {
        router.push("/en/admin/login");
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-neutral-heading mb-6">
            Admin Dashboard
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/en/admin/careers"
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 hover:shadow-lg transition-shadow border border-neutral-border"
            >
              <h2 className="text-xl font-bold text-neutral-heading mb-2">
                Careers Management
              </h2>
              <p className="text-neutral-body">
                Manage job postings and careers page content
              </p>
            </Link>
            <Link
              href="/en/admin/settings"
              className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 hover:shadow-lg transition-shadow border border-neutral-border"
            >
              <h2 className="text-xl font-bold text-neutral-heading mb-2">
                System Settings
              </h2>
              <p className="text-neutral-body">
                Configure email settings and system preferences
              </p>
            </Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/auth/logout", { method: "POST" });
                window.location.href = "/en/admin/login";
              }}
              className="bg-red-50 text-red-600 rounded-xl p-6 hover:shadow-lg transition-shadow border border-red-200 text-left"
            >
              <h2 className="text-xl font-bold mb-2">Logout</h2>
              <p className="text-sm">Sign out from admin panel</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

