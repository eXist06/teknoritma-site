"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserRole } from "@/lib/types/admin";

interface HealthCheck {
  name: string;
  status: "ok" | "error";
  message: string;
  details?: any;
}

interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  checks: HealthCheck[];
}

export default function AdminDashboardPageEn() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [healthCheck, setHealthCheck] = useState<HealthCheckResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    // Token kontrolü ve role bilgisi
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/check-first-login");
        if (!response.ok) {
          router.push("/en/admin/login");
          return;
        }

        // Get user role
        const userResponse = await fetch("/api/admin/auth/me");
        if (!userResponse.ok) {
          router.push("/en/admin/login");
          return;
        }

        const data = await userResponse.json();
        setUserRole(data.user?.role || null);
      } catch {
        router.push("/en/admin/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchHealthCheck = async () => {
    setHealthLoading(true);
    try {
      const response = await fetch("/api/admin/health-check");
      if (response.ok) {
        const data = await response.json();
        setHealthCheck(data);
      }
    } catch (error) {
      console.error("Health check failed:", error);
    } finally {
      setHealthLoading(false);
    }
  };

  useEffect(() => {
    // Fetch health check on mount if user has access
    if (!loading && (userRole === "admin" || userRole === "sarus-hub")) {
      fetchHealthCheck();
    }
  }, [loading, userRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-neutral-body">Loading...</div>
      </div>
    );
  }

  const isAdmin = userRole === "admin";
  const isIK = userRole === "ik";
  const isSarusHub = userRole === "sarus-hub";

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
            {(isAdmin || isIK) && (
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
            )}
            {isAdmin && (
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
            )}
            {(isAdmin || isSarusHub) && (
              <Link
                href="/en/admin/sarus-hub"
                className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-6 hover:shadow-lg transition-shadow border border-neutral-border"
              >
                <h2 className="text-xl font-bold text-neutral-heading mb-2">
                  Sarus-HUB
                </h2>
                <p className="text-neutral-body">
                  Content management: case studies, news, insights
                </p>
              </Link>
            )}
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

          {/* Sarus-HUB Health Check */}
          {(isAdmin || isSarusHub) && (
            <div className="mt-8 pt-8 border-t border-neutral-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-heading">
                  Sarus-HUB System Health Check
                </h2>
                <button
                  onClick={fetchHealthCheck}
                  disabled={healthLoading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {healthLoading ? "Checking..." : "Refresh"}
                </button>
              </div>

              {healthCheck ? (
                <div className="space-y-3">
                  <div className={`p-4 rounded-lg border-2 ${
                    healthCheck.status === "ok" 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xl ${healthCheck.status === "ok" ? "text-green-600" : "text-red-600"}`}>
                        {healthCheck.status === "ok" ? "✓" : "✗"}
                      </span>
                      <span className={`font-bold ${healthCheck.status === "ok" ? "text-green-700" : "text-red-700"}`}>
                        Overall Status: {healthCheck.status === "ok" ? "OK" : "ERROR"}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-body">
                      Last check: {new Date(healthCheck.timestamp).toLocaleString("en-US")}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {healthCheck.checks.map((check, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          check.status === "ok"
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`text-lg ${check.status === "ok" ? "text-green-600" : "text-red-600"}`}>
                            {check.status === "ok" ? "✓" : "✗"}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-heading mb-1">
                              {check.name}
                            </h3>
                            <p className={`text-sm ${check.status === "ok" ? "text-green-700" : "text-red-700"}`}>
                              {check.message}
                            </p>
                            {check.details && (
                              <p className="text-xs text-neutral-body mt-1">
                                {typeof check.details === "object" 
                                  ? JSON.stringify(check.details, null, 2)
                                  : check.details}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : healthLoading ? (
                <div className="text-center py-8 text-neutral-body">
                  Checking...
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-body">
                  Health check not started
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


