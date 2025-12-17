"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { SystemSettings, EmailProvider } from "@/lib/types/admin";
import { MailingSubscriber } from "@/lib/types/mailing";

export default function AdminSettingsPageEn() {
  const [subscribers, setSubscribers] = useState<MailingSubscriber[]>([]);
  const [showMailingList, setShowMailingList] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ik" | "general">("all");
  const [showAddSubscriber, setShowAddSubscriber] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    email: "",
    name: "",
    organization: "",
    category: "general" as "ik" | "general",
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
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          // DB'den gelen email ayarlarını al
          const dbEmailSettings = data.settings.email || {};
          
          // Default değerlerle merge et (eksik alanları tamamla)
          const mergedEmailSettings = {
            provider: (dbEmailSettings.provider || "smtp") as EmailProvider,
            enabled: dbEmailSettings.enabled ?? false,
            smtpHost: dbEmailSettings.smtpHost || "",
            smtpPort: dbEmailSettings.smtpPort || 587,
            smtpUser: dbEmailSettings.smtpUser || "",
            smtpPassword: dbEmailSettings.smtpPassword || "",
            smtpSecure: dbEmailSettings.smtpSecure ?? false,
            apiKey: dbEmailSettings.apiKey || "",
            apiSecret: dbEmailSettings.apiSecret || "",
            fromEmail: dbEmailSettings.fromEmail || "",
            fromName: dbEmailSettings.fromName || "",
            mailjetApiKey: dbEmailSettings.mailjetApiKey || dbEmailSettings.apiKey || "",
            mailjetApiSecret: dbEmailSettings.mailjetApiSecret || dbEmailSettings.apiSecret || "",
            sendgridApiKey: dbEmailSettings.sendgridApiKey || dbEmailSettings.apiKey || "",
            sesRegion: dbEmailSettings.sesRegion || "us-east-1",
            sesAccessKeyId: dbEmailSettings.sesAccessKeyId || dbEmailSettings.apiKey || "",
            sesSecretAccessKey: dbEmailSettings.sesSecretAccessKey || dbEmailSettings.apiSecret || "",
          };

          setSettings({
            email: mergedEmailSettings,
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
          : allSubscribers.filter((s: MailingSubscriber) => s.category === selectedCategory);
        setSubscribers(filtered);
        return allSubscribers; // Return all for search functionality
      }
      return [];
    } catch (error) {
      console.error("Failed to load subscribers:", error);
      return [];
    }
  };

  useEffect(() => {
    if (showMailingList) {
      loadSubscribers();
    }
  }, [showMailingList, selectedCategory]);

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/mailing-list?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setMessage("✅ Subscriber deleted successfully!");
        await loadSubscribers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`❌ Error: ${data.error || "Failed to delete subscriber"}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error: any) {
      console.error("Failed to delete subscriber:", error);
      setMessage(`❌ An error occurred: ${error?.message || String(error)}`);
      setTimeout(() => setMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriber.email) {
      setMessage("Email address is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/mailing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newSubscriber.email,
          name: newSubscriber.name || undefined,
          organization: newSubscriber.organization || undefined,
          category: newSubscriber.category,
          source: "manual",
          tags: [],
        }),
      });

      const data = await response.json();
      console.log("[ADD SUBSCRIBER] Response:", data);

      if (response.ok && data.success) {
        setMessage("✅ Subscriber added successfully!");
        setNewSubscriber({ email: "", name: "", organization: "", category: "general" });
        setShowAddSubscriber(false);
        await loadSubscribers();
        setTimeout(() => setMessage(""), 3000);
      } else {
        console.error("[ADD SUBSCRIBER] Error:", data);
        setMessage(`❌ Error: ${data.error || "Failed to add subscriber"}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (error: any) {
      console.error("[ADD SUBSCRIBER] Exception:", error);
      setMessage(`❌ An error occurred: ${error?.message || String(error)}`);
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

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="mb-6">
          <Link
            href="/en/admin"
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
            <button
              onClick={() => setShowMailingList(!showMailingList)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {showMailingList ? "← Back to Settings" : "📧 Mailing List"}
            </button>
          </div>

          {showMailingList && (
            <div className="border border-neutral-border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-neutral-heading">
                  Mailing List Subscribers
                </h2>
                <button
                  onClick={() => setShowAddSubscriber(!showAddSubscriber)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAddSubscriber ? "← Cancel" : "+ Add Subscriber"}
                </button>
              </div>

              {/* Add Subscriber Form */}
              {showAddSubscriber && (
                <div className="bg-neutral-light rounded-lg p-4 mb-4 border border-neutral-border">
                  <h3 className="font-medium text-neutral-heading mb-3">Add New Subscriber</h3>
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
                        placeholder="example@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Category *
                      </label>
                      <select
                        value={newSubscriber.category}
                        onChange={(e) =>
                          setNewSubscriber({
                            ...newSubscriber,
                            category: e.target.value as "ik" | "general",
                          })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                      >
                        <option value="general">General Notifications</option>
                        <option value="ik">HR Subscribers</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.name}
                        onChange={(e) =>
                          setNewSubscriber({ ...newSubscriber, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Full Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.organization}
                        onChange={(e) =>
                          setNewSubscriber({ ...newSubscriber, organization: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                        placeholder="Organization Name"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={handleAddSubscriber}
                      disabled={loading || !newSubscriber.email}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                      {loading ? "Adding..." : "Add"}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddSubscriber(false);
                        setNewSubscriber({ email: "", name: "", organization: "", category: "general" });
                      }}
                      className="px-4 py-2 bg-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-border/80 transition-colors"
                    >
                      Cancel
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
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory("ik")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "ik"
                      ? "bg-primary text-white"
                      : "bg-neutral-light text-neutral-heading hover:bg-neutral-border"
                  }`}
                >
                  HR Subscribers
                </button>
                <button
                  onClick={() => setSelectedCategory("general")}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedCategory === "general"
                      ? "bg-primary text-white"
                      : "bg-neutral-light text-neutral-heading hover:bg-neutral-border"
                  }`}
                >
                  General Notifications
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by email..."
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  onChange={async (e) => {
                    const search = e.target.value.toLowerCase();
                    const response = await fetch("/api/admin/mailing-list");
                    if (response.ok) {
                      const data = await response.json();
                      const allSubscribers = data.subscribers || [];
                      const filtered = allSubscribers.filter((s: MailingSubscriber) => {
                        const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
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
                      <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Organization</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Category</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Source</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Date</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-neutral-body">
                          No subscribers yet
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
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              subscriber.category === "ik"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {subscriber.category === "ik" ? "HR" : "General"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                              {subscriber.source === "contact"
                                ? "Contact"
                                : subscriber.source === "demo"
                                ? "Demo"
                                : subscriber.source === "talent-network"
                                ? "Talent Network"
                                : "Manual"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-sm text-neutral-body">
                            {new Date(subscriber.subscribedAt).toLocaleDateString("en-US")}
                          </td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
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

          {!showMailingList && (
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
                  checked={settings.email.enabled}
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
              className={`p-3 rounded-lg mb-4 whitespace-pre-wrap ${
                message.includes("✅") || message.includes("success")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
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
