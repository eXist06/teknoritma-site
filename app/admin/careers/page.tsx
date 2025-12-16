"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CareersAdmin from "@/components/CareersAdmin";
import { UserRole } from "@/lib/types/admin";

export default function AdminCareersPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/me");
        if (!response.ok) {
          router.push("/admin/login");
          return;
        }

        const data = await response.json();
        const role: UserRole = data.user?.role;

        // Admin ve IK rolleri erişebilir
        if (role !== "admin" && role !== "ik") {
          router.push("/admin");
          return;
        }

        setAuthorized(true);
      } catch {
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Yükleniyor...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <CareersAdmin />;
}




