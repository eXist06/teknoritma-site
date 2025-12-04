"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupRequired, setSetupRequired] = useState(false);

  useEffect(() => {
    // Setup kontrolü
    fetch("/api/admin/auth/check-setup")
      .then((res) => res.json())
      .then((data) => {
        if (!data.setup) {
          setSetupRequired(true);
        }
      })
      .catch(() => {
        setSetupRequired(true);
      });
  }, []);

  const handleSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth/setup", {
        method: "POST",
      });
      if (response.ok) {
        setSetupRequired(false);
        alert("Initial admin user created. Username: ik, Password: 516708");
      } else {
        setError("Setup failed");
      }
    } catch (error) {
      setError("Setup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requiresPasswordChange) {
          router.push("/admin/change-password");
        } else {
          router.push("/admin");
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (setupRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-light">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
        >
          <h2 className="text-2xl font-bold mb-4">Initial Setup Required</h2>
          <p className="text-neutral-body mb-6">
            Click the button below to create the initial admin user.
          </p>
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}
          <button
            onClick={handleSetup}
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Setting up..." : "Setup Admin"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-neutral-heading mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

