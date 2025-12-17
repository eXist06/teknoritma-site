"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { SystemSettings, EmailProvider, AdminUser, UserRole } from "@/lib/types/admin";
import { MailingSubscriber } from "@/lib/types/mailing";
import UserEditForm from "@/components/UserEditForm";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<MailingSubscriber[]>([]);
  const [showMailingList, setShowMailingList] = useState(false);
  const [showEmailQueue, setShowEmailQueue] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [emailQueue, setEmailQueue] = useState<any[]>([]);
  const [expandedQueueItem, setExpandedQueueItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ik" | "general">("all");
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "ik" as UserRole,
  });
  const [showAddSubscriber, setShowAddSubscriber] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    email: "",
    name: "",
    organization: "",
    category: ["general"] as ("ik" | "general")[],
  });
  const [settings, setSettings] = useState<SystemSettings>({
    email: {
      provider: "smtp",
      enabled: false,
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      smtpSecure: false,
      apiKey: "",
      apiSecret: "",
      fromEmail: "",
      fromName: "",
      mailjetApiKey: "",
      mailjetApiSecret: "",
      sendgridApiKey: "",
      sesRegion: "us-east-1",
      sesAccessKeyId: "",
      sesSecretAccessKey: "",
    },
    siteName: "",
    siteUrl: "",
  });
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check authorization
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/me");
        if (!response.ok) {
          router.push("/admin/login");
          return;
        }

        const data = await response.json();
        const role: UserRole = data.user?.role;

        // Sadece admin erişebilir
        if (role !== "admin") {
          router.push("/admin");
          return;
        }

        setAuthorized(true);
      } catch {
        router.push("/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          // Ensure email property exists with defaults
          const defaultEmailSettings = {
            provider: "smtp" as const,
            enabled: false,
            smtpHost: "",
            smtpPort: 587,
            smtpUser: "",
            smtpPassword: "",
            smtpSecure: false,
            apiKey: "",
            apiSecret: "",
            fromEmail: "",
            fromName: "",
            mailjetApiKey: "",
            mailjetApiSecret: "",
            sendgridApiKey: "",
            sesRegion: "us-east-1",
            sesAccessKeyId: "",
            sesSecretAccessKey: "",
          };

          setSettings({
            email: {
              ...defaultEmailSettings,
              ...(data.settings.email || {}), // Merge if exists
            },
            siteName: data.settings.siteName || "",
            siteUrl: data.settings.siteUrl || "",
          });
        }
      })
      .catch((error) => {
        console.error("Failed to load settings:", error);
      });
  }, []);

  const loadSubscribers = async () => {
    try {
      const response = await fetch("/api/admin/mailing-list");
      if (response.ok) {
        const data = await response.json();
        const allSubscribers = data.subscribers || [];
        // Filter by category
        const filtered = selectedCategory === "all" 
          ? allSubscribers
          : allSubscribers.filter((s: MailingSubscriber) => {
              if (Array.isArray(s.category)) {
                return s.category.includes(selectedCategory);
              }
              return s.category === selectedCategory;
            });
        setSubscribers(filtered);
      }
    } catch (error) {
      console.error("Failed to load subscribers:", error);
    }
  };

  useEffect(() => {
    if (showMailingList) {
      loadSubscribers();
    }
  }, [showMailingList, selectedCategory]);

  const loadEmailQueue = async () => {
    try {
      const response = await fetch("/api/admin/email-queue");
      if (response.ok) {
        const data = await response.json();
        setEmailQueue(data.queue?.items || []);
      }
    } catch (error) {
      console.error("Failed to load email queue:", error);
    }
  };

  useEffect(() => {
    if (showEmailQueue) {
      loadEmailQueue();
    }
  }, [showEmailQueue]);

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
  };

  useEffect(() => {
    if (showUserManagement) {
      loadUsers();
    }
  }, [showUserManagement]);

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      setMessage("Lütfen tüm alanları doldurun");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage("✅ Kullanıcı başarıyla eklendi!");
        setNewUser({ username: "", email: "", password: "", role: "ik" });
        setShowAddUser(false);
        await loadUsers();
      } else {
        let errorMessage = data.error || "Kullanıcı eklenemedi";
        if (data.error?.includes("already exists")) {
          if (data.error.includes("Email")) {
            errorMessage = "Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta adresi deneyin.";
          } else if (data.error.includes("Username")) {
            errorMessage = "Bu kullanıcı adı zaten kullanılıyor. Lütfen farklı bir kullanıcı adı deneyin.";
          }
        }
        setMessage(`❌ Hata: ${errorMessage}`);
      }
    } catch (error) {
      setMessage("❌ Bir hata oluştu");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleUpdateUser = async (user: AdminUser, updates: Partial<AdminUser & { password?: string }>) => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, ...updates }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage("✅ Kullanıcı başarıyla güncellendi!");
        setEditingUser(null);
        await loadUsers();
      } else {
        setMessage(`❌ Hata: ${data.error || "Kullanıcı güncellenemedi"}`);
      }
    } catch (error) {
      setMessage("❌ Bir hata oluştu");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage("✅ Kullanıcı başarıyla silindi!");
        await loadUsers();
      } else {
        setMessage(`❌ Hata: ${data.error || "Kullanıcı silinemedi"}`);
      }
    } catch (error) {
      setMessage("❌ Bir hata oluştu");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleProcessQueue = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/email-queue", {
        method: "POST",
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`✅ Queue işlendi: ${data.result?.succeeded || 0} başarılı, ${data.result?.failed || 0} başarısız`);
        await loadEmailQueue();
      } else {
        setMessage(`❌ Hata: ${data.error || "Queue işlenemedi"}`);
      }
    } catch (error) {
      setMessage("❌ Bir hata oluştu");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleDeleteQueueItem = async (id: string) => {
    if (!confirm("Bu öğeyi queue'dan silmek istediğinize emin misiniz?")) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/email-queue?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMessage("✅ Queue öğesi silindi!");
        await loadEmailQueue();
      } else {
        setMessage(`❌ Hata: ${response.statusText}`);
      }
    } catch (error) {
      setMessage("❌ Bir hata oluştu");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Bu aboneyi silmek istediğinize emin misiniz?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/mailing-list?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage("✅ Abone başarıyla silindi!");
        await loadSubscribers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ Hata: ${data.error || "Abone silinemedi"}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error: any) {
      console.error("Failed to delete subscriber:", error);
      setMessage(`❌ Bir hata oluştu: ${error?.message || String(error)}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriber.email) {
      setMessage("Email adresi zorunludur");
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        email: newSubscriber.email,
        name: newSubscriber.name || undefined,
        organization: newSubscriber.organization || undefined,
        category: newSubscriber.category,
        source: "manual",
        tags: [],
      };
      console.log("[ADD SUBSCRIBER] Sending request:", requestBody);

      const response = await fetch("/api/admin/mailing-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log("[ADD SUBSCRIBER] Response status:", response.status);
      console.log("[ADD SUBSCRIBER] Response ok:", response.ok);

      let data;
      try {
        const text = await response.text();
        console.log("[ADD SUBSCRIBER] Response text:", text);
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        console.error("[ADD SUBSCRIBER] JSON parse error:", parseError);
        setMessage(`❌ Hata: Yanıt parse edilemedi`);
        setTimeout(() => setMessage(""), 5000);
        setLoading(false);
        return;
      }

      console.log("[ADD SUBSCRIBER] Response data:", data);

      if (response.ok && data.success) {
        setMessage("✅ Abone başarıyla eklendi!");
        setNewSubscriber({ email: "", name: "", organization: "", category: ["general"] });
        setShowAddSubscriber(false);
        await loadSubscribers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        console.error("[ADD SUBSCRIBER] Error response:", response.status, data);
        const errorMsg = data.error || data.message || `HTTP ${response.status}: Abone eklenemedi`;
        setMessage(`❌ Hata: ${errorMsg}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error: any) {
      console.error("[ADD SUBSCRIBER] Exception:", error);
      setMessage(`❌ Bir hata oluştu: ${error?.message || String(error)}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Failed to save settings");
      }
    } catch (error) {
      setMessage("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage("Please enter an email address");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage(`✅ ${data.message || "Test email sent successfully!"}${data.log ? `\n\nLog: ${data.log}` : ""}`);
        setTimeout(() => setMessage(""), 10000);
      } else {
        setMessage(`❌ ${data.error || "Failed to send test email"}${data.log ? `\n\nLog: ${data.log}` : ""}`);
      }
    } catch (error) {
      setMessage("Error sending test email");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Yükleniyor...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-primary hover:underline mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Admin
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-neutral-heading">
                  System Settings
                </h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowMailingList(!showMailingList);
                      setShowEmailQueue(false);
                      setShowUserManagement(false);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {showMailingList ? "← Ayarlara Dön" : "📧 Mailing Listesi"}
                  </button>
                  <button
                    onClick={() => {
                      setShowEmailQueue(!showEmailQueue);
                      setShowMailingList(false);
                      setShowUserManagement(false);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    {showEmailQueue ? "← Ayarlara Dön" : "📬 Email Queue"}
                  </button>
                  <button
                    onClick={() => {
                      setShowUserManagement(!showUserManagement);
                      setShowMailingList(false);
                      setShowEmailQueue(false);
                    }}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    {showUserManagement ? "← Ayarlara Dön" : "👥 Kullanıcı Yönetimi"}
                  </button>
                </div>
              </div>

          {showMailingList && (
            <div className="border border-neutral-border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-heading">
                  Mailing Listesi Aboneleri
                </h2>
                <button
                  onClick={() => setShowAddSubscriber(!showAddSubscriber)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAddSubscriber ? "← İptal" : "+ Abone Ekle"}
                </button>
              </div>

              {/* Add Subscriber Form */}
              {showAddSubscriber && (
                <div className="bg-neutral-light rounded-lg p-4 mb-4 border border-neutral-border">
                  <h3 className="font-medium text-neutral-heading mb-3">Yeni Abone Ekle</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newSubscriber.email}
                        onChange={(e) =>
                          setNewSubscriber({ ...newSubscriber, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="ornek@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kategori *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newSubscriber.category) ? newSubscriber.category.includes("general") : newSubscriber.category === "general"}
                            onChange={(e) => {
                              const currentCategories = Array.isArray(newSubscriber.category) 
                                ? newSubscriber.category 
                                : newSubscriber.category ? [newSubscriber.category] : [];
                              if (e.target.checked) {
                                if (!currentCategories.includes("general")) {
                                  setNewSubscriber({
                                    ...newSubscriber,
                                    category: [...currentCategories, "general"] as ("ik" | "general")[],
                                  });
                                }
                              } else {
                                setNewSubscriber({
                                  ...newSubscriber,
                                  category: currentCategories.filter(c => c !== "general") as ("ik" | "general")[],
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span>Genel Bildirimler</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={Array.isArray(newSubscriber.category) ? newSubscriber.category.includes("ik") : newSubscriber.category === "ik"}
                            onChange={(e) => {
                              const currentCategories = Array.isArray(newSubscriber.category) 
                                ? newSubscriber.category 
                                : newSubscriber.category ? [newSubscriber.category] : [];
                              if (e.target.checked) {
                                if (!currentCategories.includes("ik")) {
                                  setNewSubscriber({
                                    ...newSubscriber,
                                    category: [...currentCategories, "ik"] as ("ik" | "general")[],
                                  });
                                }
                              } else {
                                setNewSubscriber({
                                  ...newSubscriber,
                                  category: currentCategories.filter(c => c !== "ik") as ("ik" | "general")[],
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <span>IK Aboneleri</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ad
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.name}
                        onChange={(e) =>
                          setNewSubscriber({ ...newSubscriber, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Ad Soyad"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Kurum
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.organization}
                        onChange={(e) =>
                          setNewSubscriber({ ...newSubscriber, organization: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Kurum Adı"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleAddSubscriber}
                      disabled={loading || !newSubscriber.email}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {loading ? "Ekleniyor..." : "Ekle"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSubscriber(false);
                        setNewSubscriber({ email: "", name: "", organization: "", category: ["general"] });
                      }}
                      className="px-4 py-2 bg-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-border/80 transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}
              
              {/* Category Filter */}
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-neutral-light text-neutral-heading hover:bg-neutral-border"
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => setSelectedCategory("ik")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "ik"
                      ? "bg-primary text-white"
                      : "bg-neutral-light text-neutral-heading hover:bg-neutral-border"
                  }`}
                >
                  IK Aboneleri
                </button>
                <button
                  onClick={() => setSelectedCategory("general")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "general"
                      ? "bg-primary text-white"
                      : "bg-neutral-light text-neutral-heading hover:bg-neutral-border"
                  }`}
                >
                  Genel Bildirimler
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Email ile ara..."
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  onChange={async (e) => {
                    const search = e.target.value.toLowerCase();
                    const response = await fetch("/api/admin/mailing-list");
                    if (response.ok) {
                      const data = await response.json();
                      const allSubscribers = data.subscribers || [];
                      const filtered = allSubscribers.filter((s: MailingSubscriber) => {
                        let matchesCategory = true;
                        if (selectedCategory !== "all") {
                          if (Array.isArray(s.category)) {
                            matchesCategory = s.category.includes(selectedCategory);
                          } else {
                            matchesCategory = s.category === selectedCategory;
                          }
                        }
                        const matchesSearch = !search || 
                          s.email.toLowerCase().includes(search) ||
                          s.name?.toLowerCase().includes(search) ||
                          s.organization?.toLowerCase().includes(search);
                        return matchesCategory && matchesSearch;
                      });
                      setSubscribers(filtered);
                    }
                  }}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-light border-b border-neutral-border">
                      <th className="px-4 py-2 text-left text-sm font-medium">Email</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Ad</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Kurum</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Kategori</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Kaynak</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Tarih</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-neutral-body">
                          Henüz abone yok
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((subscriber) => (
                        <tr
                          key={subscriber.id}
                          className="border-b border-neutral-border hover:bg-neutral-light/50"
                        >
                          <td className="px-4 py-2 text-sm">{subscriber.email}</td>
                          <td className="px-4 py-2 text-sm">{subscriber.name || "-"}</td>
                          <td className="px-4 py-2 text-sm">{subscriber.organization || "-"}</td>
                          <td className="px-4 py-2 text-sm">
                            {Array.isArray(subscriber.category) ? (
                              <div className="flex gap-1 flex-wrap">
                                {subscriber.category.map((cat, idx) => (
                                  <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${
                                    cat === "ik"
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-green-100 text-green-800"
                                  }`}>
                                    {cat === "ik" ? "IK" : "Genel"}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                subscriber.category === "ik"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {subscriber.category === "ik" ? "IK" : "Genel"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                              {subscriber.source === "contact"
                                ? "İletişim"
                                : subscriber.source === "demo"
                                ? "Demo"
                                : subscriber.source === "talent-network"
                                ? "Talent Network"
                                : "Manuel"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-body">
                            {new Date(subscriber.subscribedAt).toLocaleDateString("tr-TR")}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showEmailQueue && (
            <div className="border border-neutral-border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-heading">
                  Email Queue ({emailQueue.length} öğe)
                </h2>
                <button
                  onClick={handleProcessQueue}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "İşleniyor..." : "🔄 Queue'yu İşle"}
                </button>
              </div>
              
              <div className="mb-4 text-sm text-neutral-body">
                <p>Başarısız email gönderimleri burada tutulur. Her gün otomatik olarak tekrar denenir.</p>
                <p className="mt-1">Manuel olarak "Queue'yu İşle" butonuna tıklayarak da işleyebilirsiniz.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-light border-b border-neutral-border">
                      <th className="px-4 py-2 text-left text-sm font-medium">To</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Subject</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Attempts</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Next Retry</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Error</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Created</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emailQueue.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-neutral-body">
                          Queue boş - Tüm emailler başarıyla gönderildi! ✅
                        </td>
                      </tr>
                    ) : (
                      emailQueue.map((item: any) => (
                        <React.Fragment key={item.id}>
                          <tr
                            className="border-b border-neutral-border hover:bg-neutral-light/50 cursor-pointer"
                            onClick={() => setExpandedQueueItem(expandedQueueItem === item.id ? null : item.id)}
                          >
                            <td className="px-4 py-2 text-sm">{item.to}</td>
                            <td className="px-4 py-2 text-sm">{item.subject}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                item.status === "sent"
                                  ? "bg-green-100 text-green-800"
                                  : item.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {item.status === "sent" ? "Gönderildi" : item.status === "failed" ? "Başarısız" : "Bekliyor"}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">{item.attempts}/{item.maxAttempts}</td>
                            <td className="px-4 py-2 text-sm text-neutral-body">
                              {item.nextRetryAt 
                                ? new Date(item.nextRetryAt).toLocaleString("tr-TR")
                                : "-"}
                            </td>
                            <td className="px-4 py-2 text-sm text-red-600 max-w-xs truncate" title={item.error}>
                              {item.error || "-"}
                            </td>
                            <td className="px-4 py-2 text-sm text-neutral-body">
                              {new Date(item.createdAt).toLocaleString("tr-TR")}
                            </td>
                            <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDeleteQueueItem(item.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Sil
                              </button>
                            </td>
                          </tr>
                          {expandedQueueItem === item.id && (item.senderName || item.senderEmail || item.senderPhone || item.messageContent) && (
                            <tr className="bg-neutral-light/30">
                              <td colSpan={8} className="px-4 py-4">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-neutral-heading mb-2">Gönderen Bilgileri</h4>
                                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    {item.senderName && (
                                      <div>
                                        <span className="font-medium text-neutral-heading">Ad:</span>{" "}
                                        <span className="text-neutral-body">{item.senderName}</span>
                                      </div>
                                    )}
                                    {item.senderEmail && (
                                      <div>
                                        <span className="font-medium text-neutral-heading">E-posta:</span>{" "}
                                        <span className="text-neutral-body">{item.senderEmail}</span>
                                      </div>
                                    )}
                                    {item.senderPhone && (
                                      <div>
                                        <span className="font-medium text-neutral-heading">Telefon:</span>{" "}
                                        <span className="text-neutral-body">{item.senderPhone}</span>
                                      </div>
                                    )}
                                  </div>
                                  {item.messageContent && (
                                    <div className="mt-3">
                                      <span className="font-medium text-neutral-heading">Mesaj İçeriği:</span>
                                      <div className="mt-1 p-3 bg-white border border-neutral-border rounded-lg text-sm text-neutral-body whitespace-pre-wrap">
                                        {item.messageContent}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {showUserManagement && (
            <div className="border border-neutral-border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-heading">
                  Kullanıcı Yönetimi ({users.length} kullanıcı)
                </h2>
                <button
                  onClick={() => {
                    setShowAddUser(!showAddUser);
                    setEditingUser(null);
                    setNewUser({ username: "", email: "", password: "", role: "ik" });
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAddUser ? "← İptal" : "+ Kullanıcı Ekle"}
                </button>
              </div>

              {showAddUser && (
                <div className="border border-neutral-border rounded-lg p-4 mb-4 space-y-3">
                  <h3 className="font-medium text-neutral-heading mb-3">Yeni Kullanıcı Ekle</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Kullanıcı Adı *</label>
                      <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="kullaniciadi"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">E-posta *</label>
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Şifre *</label>
                      <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Şifre"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rol *</label>
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      >
                        <option value="admin">Admin - Tam Yetki</option>
                        <option value="ik">IK - İnsan Kaynakları</option>
                        <option value="knowledge-base">Bilgi Merkezi - Knowledge Base</option>
                        <option value="sarus-hub">Sarus-HUB - İçerik Yönetimi</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleAddUser}
                    disabled={loading || !newUser.username || !newUser.email || !newUser.password}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {loading ? "Ekleniyor..." : "Ekle"}
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-light border-b border-neutral-border">
                      <th className="px-4 py-2 text-left text-sm font-medium">Kullanıcı Adı</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">E-posta</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Rol</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">İlk Giriş</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Oluşturulma</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-neutral-body">
                          Henüz kullanıcı yok
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b border-neutral-border hover:bg-neutral-light/50"
                        >
                          <td className="px-4 py-2 text-sm">{user.username}</td>
                          <td className="px-4 py-2 text-sm">{user.email}</td>
                          <td className="px-4 py-2 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800"
                                : user.role === "ik"
                                ? "bg-blue-100 text-blue-800"
                                : user.role === "sarus-hub"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {user.role === "admin" 
                                ? "Admin" 
                                : user.role === "ik" 
                                ? "IK" 
                                : user.role === "sarus-hub"
                                ? "Sarus-HUB"
                                : "Bilgi Merkezi"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            {user.isFirstLogin ? (
                              <span className="text-yellow-600 font-medium">Evet</span>
                            ) : (
                              <span className="text-green-600">Hayır</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-body">
                            {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowAddUser(false);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {editingUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-neutral-heading">Kullanıcı Düzenle</h3>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="p-2 hover:bg-neutral-light rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                    <UserEditForm
                      user={editingUser}
                      onSave={(updates) => {
                        handleUpdateUser(editingUser, updates);
                      }}
                      onCancel={() => setEditingUser(null)}
                      loading={loading}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {!showMailingList && !showEmailQueue && !showUserManagement && (
            <>

          {/* Email Settings */}
          <div className="border border-neutral-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-heading mb-4">
              Email Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="emailEnabled"
                  checked={settings?.email?.enabled ?? false}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: { ...settings.email, enabled: e.target.checked },
                    })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="emailEnabled" className="font-medium">
                  Enable Email Service
                </label>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Provider
                </label>
                <select
                  value={settings.email.provider}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      email: {
                        ...settings.email,
                        provider: e.target.value as EmailProvider,
                      },
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                >
                  <option value="smtp">SMTP</option>
                  <option value="mailjet">Mailjet</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="ses">AWS SES</option>
                </select>
              </div>

              {/* Common Settings */}
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    From Email *
                  </label>
                  <input
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email: { ...settings.email, fromEmail: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    From Name *
                  </label>
                  <input
                    type="text"
                    value={settings.email.fromName}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        email: { ...settings.email, fromName: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* SMTP Settings */}
              {settings.email.provider === "smtp" && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium text-neutral-heading">SMTP Configuration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SMTP Host *
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: { ...settings.email, smtpHost: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SMTP Port *
                      </label>
                      <input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              smtpPort: parseInt(e.target.value) || 587,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SMTP User *
                      </label>
                      <input
                        type="text"
                        value={settings.email.smtpUser}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: { ...settings.email, smtpUser: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        SMTP Password *
                      </label>
                      <input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              smtpPassword: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="smtpSecure"
                      checked={settings.email.smtpSecure}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email: { ...settings.email, smtpSecure: e.target.checked },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="smtpSecure" className="text-sm">
                      Use SSL/TLS (usually for port 465)
                    </label>
                  </div>
                </div>
              )}

              {/* Mailjet Settings */}
              {settings.email.provider === "mailjet" && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium text-neutral-heading">Mailjet Configuration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        API Key *
                      </label>
                      <input
                        type="text"
                        value={settings.email.mailjetApiKey || settings.email.apiKey}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              mailjetApiKey: e.target.value,
                              apiKey: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Your Mailjet API Key"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        API Secret *
                      </label>
                      <input
                        type="password"
                        value={settings.email.mailjetApiSecret || settings.email.apiSecret}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              mailjetApiSecret: e.target.value,
                              apiSecret: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Your Mailjet API Secret"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-neutral-body">
                    You can find your API credentials in your Mailjet account dashboard.
                  </p>
                </div>
              )}

              {/* SendGrid Settings */}
              {settings.email.provider === "sendgrid" && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium text-neutral-heading">SendGrid Configuration</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      API Key *
                    </label>
                    <input
                      type="password"
                      value={settings.email.sendgridApiKey || settings.email.apiKey}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email: {
                            ...settings.email,
                            sendgridApiKey: e.target.value,
                            apiKey: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      placeholder="SG.xxxxxxxxxxxxx"
                    />
                    <p className="text-xs text-neutral-body mt-1">
                      Create an API key in SendGrid Settings → API Keys
                    </p>
                  </div>
                </div>
              )}

              {/* AWS SES Settings */}
              {settings.email.provider === "ses" && (
                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium text-neutral-heading">AWS SES Configuration</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Region *
                    </label>
                    <select
                      value={settings.email.sesRegion || "us-east-1"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          email: { ...settings.email, sesRegion: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    >
                      <option value="us-east-1">US East (N. Virginia)</option>
                      <option value="us-west-2">US West (Oregon)</option>
                      <option value="eu-west-1">EU (Ireland)</option>
                      <option value="eu-central-1">EU (Frankfurt)</option>
                      <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Access Key ID *
                      </label>
                      <input
                        type="text"
                        value={settings.email.sesAccessKeyId || settings.email.apiKey}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              sesAccessKeyId: e.target.value,
                              apiKey: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Secret Access Key *
                      </label>
                      <input
                        type="password"
                        value={settings.email.sesSecretAccessKey || settings.email.apiSecret}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: {
                              ...settings.email,
                              sesSecretAccessKey: e.target.value,
                              apiSecret: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Test Email */}
              <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2">
                  Test Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="test@example.com"
                    className="flex-1 px-4 py-2 border border-neutral-border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={loading || !testEmail}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                  >
                    Send Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
          <div className="border border-neutral-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-neutral-heading mb-4">
              General Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    setSettings({ ...settings, siteName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) =>
                    setSettings({ ...settings, siteUrl: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg mb-4 ${
                message.includes("success")
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

