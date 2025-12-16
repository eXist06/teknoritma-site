"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CareersAdmin from "@/components/CareersAdmin";
import { UserRole } from "@/lib/types/admin";

export default function AdminCareersPageEN() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/me");
        if (!response.ok) {
          router.push("/en/admin/login");
          return;
        }

        const data = await response.json();
        const role: UserRole = data.user?.role;

        // Admin and IK roles can access
        if (role !== "admin" && role !== "ik") {
          router.push("/en/admin");
          return;
        }

        setAuthorized(true);
      } catch {
        router.push("/en/admin/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <CareersAdmin />;
}










