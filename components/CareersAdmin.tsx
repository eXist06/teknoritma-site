"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { JobPosting, CareersContent } from "@/lib/types/careers";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CareersAdmin() {
  const { language } = useI18n();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"jobs" | "content">("jobs");
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [content, setContent] = useState<CareersContent | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Determine current language from pathname
  const currentLang = pathname?.startsWith("/en") ? "en" : "tr";
  const adminPathTR = "/admin/careers";
  const adminPathEN = "/en/admin/careers";
  const otherLangPath = currentLang === "en" ? adminPathTR : adminPathEN;

  useEffect(() => {
    fetchJobs();
    fetchContent();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/careers/jobs");
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch("/api/careers/content");
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    }
  };

  const handleSaveJob = async (job: JobPosting) => {
    try {
      const method = job.id && jobs.some((j) => j.id === job.id) ? "PUT" : "POST";
      const response = await fetch("/api/careers/jobs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });

      if (response.ok) {
        await fetchJobs();
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Failed to save job:", error);
      alert("Failed to save job");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`/api/careers/jobs?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchJobs();
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job");
    }
  };

  const handleSaveContent = async () => {
    if (!content) return;

    try {
      const response = await fetch("/api/careers/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setIsEditingContent(false);
        alert("Content saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      alert("Failed to save content");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-neutral-heading">
              {currentLang === "en" ? "Careers Admin Panel" : "Kariyer Yönetim Paneli"}
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-neutral-border rounded-lg p-1">
                <Link
                  href={adminPathTR}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    currentLang === "tr"
                      ? "bg-primary text-white"
                      : "text-neutral-body hover:bg-neutral-light"
                  }`}
                >
                  🇹🇷 TR
                </Link>
                <Link
                  href={adminPathEN}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    currentLang === "en"
                      ? "bg-primary text-white"
                      : "text-neutral-body hover:bg-neutral-light"
                  }`}
                >
                  🇬🇧 EN
                </Link>
              </div>
              <div className="flex gap-2">
                <Link
                  href={currentLang === "en" ? "/en/admin/settings" : "/admin/settings"}
                  className="px-4 py-2 bg-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-border/80 transition-colors text-sm font-medium"
                >
                  {currentLang === "en" ? "⚙️ Settings" : "⚙️ Ayarlar"}
                </Link>
                <button
                  onClick={async () => {
                    await fetch("/api/admin/auth/logout", { method: "POST" });
                    window.location.href = "/admin/login";
                  }}
                  className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  {currentLang === "en" ? "Logout" : "Çıkış"}
                </button>
                <Link
                  href={currentLang === "en" ? "/en/careers" : "/kariyer"}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  {currentLang === "en" ? "← Back to Careers" : "← Kariyer Sayfasına Dön"}
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-neutral-border mb-6">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "jobs"
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-body hover:text-neutral-heading"
              }`}
            >
              {currentLang === "en" ? "Job Postings" : "İş İlanları"}
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === "content"
                  ? "text-primary border-b-2 border-primary"
                  : "text-neutral-body hover:text-neutral-heading"
              }`}
            >
              {currentLang === "en" ? "Page Content" : "Sayfa İçeriği"}
            </button>
          </div>

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-heading">
                  {currentLang === "en" ? "Job Postings" : "İş İlanları"}
                </h2>
                <button
                  onClick={() =>
                    setSelectedJob({
                      id: "",
                      title: "",
                      titleEn: "",
                      department: "",
                      departmentEn: "",
                      location: "",
                      locationEn: "",
                      type: "full-time",
                      typeEn: "Full-time",
                      remote: "office",
                      remoteEn: "Office-based",
                      description: "",
                      descriptionEn: "",
                      requirements: [],
                      requirementsEn: [],
                      benefits: [],
                      benefitsEn: [],
                      createdAt: "",
                      updatedAt: "",
                      isActive: true,
                    })
                  }
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {currentLang === "en" ? "+ Add New Job" : "+ Yeni İş İlanı Ekle"}
                </button>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border border-neutral-border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-neutral-heading mb-2">
                          {currentLang === "en" ? job.titleEn : job.title}
                        </h3>
                        <div className="flex gap-4 text-sm text-neutral-body mb-2">
                          <span>{currentLang === "en" ? job.departmentEn : job.department}</span>
                          <span>•</span>
                          <span>{currentLang === "en" ? job.locationEn : job.location}</span>
                          <span>•</span>
                          <span>{currentLang === "en" ? job.typeEn : job.type}</span>
                          <span>•</span>
                          <span>{currentLang === "en" ? job.remoteEn : job.remote}</span>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            job.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {job.isActive
                            ? currentLang === "en"
                              ? "Active"
                              : "Aktif"
                            : currentLang === "en"
                            ? "Inactive"
                            : "Pasif"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedJob(job)}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          {currentLang === "en" ? "Edit" : "Düzenle"}
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          {currentLang === "en" ? "Delete" : "Sil"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {jobs.length === 0 && (
                  <div className="text-center py-12 text-neutral-body">
                    {currentLang === "en"
                      ? "No job postings yet. Click 'Add New Job' to create one."
                      : "Henüz iş ilanı yok. Yeni bir tane oluşturmak için 'Yeni İş İlanı Ekle' butonuna tıklayın."}
                  </div>
                )}
              </div>

              {/* Job Edit Modal */}
              {selectedJob && (
                <JobEditModal
                  job={selectedJob}
                  onSave={handleSaveJob}
                  onClose={() => setSelectedJob(null)}
                  language={currentLang}
                />
              )}
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && content && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-neutral-heading">
                  {currentLang === "en" ? "Page Content" : "Sayfa İçeriği"}
                </h2>
                <div className="flex gap-2">
                  {isEditingContent ? (
                    <>
                      <button
                        onClick={handleSaveContent}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        {currentLang === "en" ? "Save" : "Kaydet"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingContent(false);
                          fetchContent();
                        }}
                        className="px-6 py-2 bg-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-border/80 transition-colors"
                      >
                        {currentLang === "en" ? "Cancel" : "İptal"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditingContent(true)}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      {currentLang === "en" ? "Edit Content" : "İçeriği Düzenle"}
                    </button>
                  )}
                </div>
              </div>

              <ContentEditor
                content={content}
                onChange={setContent}
                language={language}
                isEditing={isEditingContent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function JobEditModal({
  job,
  onSave,
  onClose,
  language,
}: {
  job: JobPosting;
  onSave: (job: JobPosting) => void;
  onClose: () => void;
  language: string;
}) {
  const [formData, setFormData] = useState<JobPosting>(job);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-neutral-heading">
            {language === "en" ? "Edit Job" : "İş İlanını Düzenle"}
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-body hover:text-neutral-heading"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Title (TR)" : "Başlık (TR)"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Title (EN)" : "Başlık (EN)"}
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Department (TR)" : "Departman (TR)"}
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Department (EN)" : "Departman (EN)"}
              </label>
              <input
                type="text"
                value={formData.departmentEn}
                onChange={(e) => setFormData({ ...formData, departmentEn: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Location (TR)" : "Konum (TR)"}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Location (EN)" : "Konum (EN)"}
              </label>
              <input
                type="text"
                value={formData.locationEn}
                onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Job Type" : "İş Tipi"}
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const type = e.target.value as JobPosting["type"];
                  const typeEnMap: Record<JobPosting["type"], JobPosting["typeEn"]> = {
                    "full-time": "Full-time",
                    "part-time": "Part-time",
                    contract: "Contract",
                    internship: "Internship",
                  };
                  setFormData({
                    ...formData,
                    type,
                    typeEn: typeEnMap[type],
                  });
                }}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              >
                <option value="full-time">{language === "en" ? "Full-time" : "Tam Zamanlı"}</option>
                <option value="part-time">{language === "en" ? "Part-time" : "Yarı Zamanlı"}</option>
                <option value="contract">{language === "en" ? "Contract" : "Sözleşmeli"}</option>
                <option value="internship">{language === "en" ? "Internship" : "Stajyerlik"}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                {language === "en" ? "Remote/Office" : "Uzaktan/Ofis"}
              </label>
              <select
                value={formData.remote}
                onChange={(e) => {
                  const remote = e.target.value as JobPosting["remote"];
                  const remoteEnMap: Record<JobPosting["remote"], JobPosting["remoteEn"]> = {
                    remote: "Remote",
                    hybrid: "Hybrid",
                    office: "Office-based",
                  };
                  setFormData({
                    ...formData,
                    remote,
                    remoteEn: remoteEnMap[remote],
                  });
                }}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              >
                <option value="remote">{language === "en" ? "Remote" : "Uzaktan"}</option>
                <option value="hybrid">{language === "en" ? "Hybrid" : "Hibrit"}</option>
                <option value="office">{language === "en" ? "Office-based" : "Ofis Tabanlı"}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              {language === "en" ? "Description (TR)" : "Açıklama (TR)"}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              {language === "en" ? "Description (EN)" : "Açıklama (EN)"}
            </label>
            <textarea
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              {language === "en" ? "Requirements (TR) - One per line" : "Gereksinimler (TR) - Her satıra bir"}
            </label>
            <textarea
              value={formData.requirements.join("\n")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requirements: e.target.value.split("\n").filter((line) => line.trim()),
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              {language === "en" ? "Requirements (EN) - One per line" : "Gereksinimler (EN) - Her satıra bir"}
            </label>
            <textarea
              value={formData.requirementsEn.join("\n")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requirementsEn: e.target.value.split("\n").filter((line) => line.trim()),
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-32"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-neutral-heading">
              {language === "en" ? "Active" : "Aktif"}
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-neutral-border text-neutral-heading rounded-lg hover:bg-neutral-border/80 transition-colors"
            >
              {language === "en" ? "Cancel" : "İptal"}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              {language === "en" ? "Save" : "Kaydet"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ImageUpload({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/careers/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.url) {
        onChange(data.url);
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-heading">{label}</label>
      {value && (
        <div className="relative w-full h-48 border border-neutral-border rounded-lg overflow-hidden mb-2">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full px-4 py-2 border border-neutral-border rounded-lg text-sm"
      />
      {uploading && <p className="text-sm text-neutral-body">Uploading...</p>}
    </div>
  );
}

function ContentEditor({
  content,
  onChange,
  language,
  isEditing,
}: {
  content: CareersContent;
  onChange: (content: CareersContent) => void;
  language: string;
  isEditing: boolean;
}) {
  const currentLang = language === "en" ? "en" : "tr";

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="border border-neutral-border rounded-lg p-4">
          <h3 className="font-bold text-neutral-heading mb-2">Hero Section</h3>
          <p className="text-neutral-body">
            <strong>TR:</strong> {content.hero.title}
          </p>
          <p className="text-neutral-body">
            <strong>EN:</strong> {content.hero.titleEn}
          </p>
        </div>
        <div className="border border-neutral-border rounded-lg p-4">
          <h3 className="font-bold text-neutral-heading mb-2">Unleash Potential</h3>
          <p className="text-neutral-body">
            <strong>TR:</strong> {content.unleashPotential.title}
          </p>
          <p className="text-neutral-body">
            <strong>EN:</strong> {content.unleashPotential.titleEn}
          </p>
        </div>
        <div className="border border-neutral-border rounded-lg p-4">
          <h3 className="font-bold text-neutral-heading mb-2">Featured Careers</h3>
          <p className="text-neutral-body">
            {content.featuredCareers.categories.length} categories
          </p>
        </div>
        <div className="border border-neutral-border rounded-lg p-4">
          <h3 className="font-bold text-neutral-heading mb-2">Testimonials</h3>
          <p className="text-neutral-body">
            {content.testimonials.length} testimonials
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Hero Section */}
      <div className="border border-neutral-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-neutral-heading mb-4">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Title (TR)
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, title: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Title (EN)
            </label>
            <input
              type="text"
              value={content.hero.titleEn}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, titleEn: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Subtitle (TR)
            </label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, subtitle: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Subtitle (EN)
            </label>
            <input
              type="text"
              value={content.hero.subtitleEn}
              onChange={(e) =>
                onChange({
                  ...content,
                  hero: { ...content.hero, subtitleEn: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Unleash Potential Section */}
      <div className="border border-neutral-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-neutral-heading mb-4">
          {currentLang === "en" ? "Unleash Potential Section" : "Potansiyelinizi Ortaya Çıkarın Bölümü"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Title (TR)
            </label>
            <input
              type="text"
              value={content.unleashPotential.title}
              onChange={(e) =>
                onChange({
                  ...content,
                  unleashPotential: { ...content.unleashPotential, title: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Title (EN)
            </label>
            <input
              type="text"
              value={content.unleashPotential.titleEn}
              onChange={(e) =>
                onChange({
                  ...content,
                  unleashPotential: { ...content.unleashPotential, titleEn: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Paragraphs (TR) - One per line
            </label>
            <textarea
              value={content.unleashPotential.paragraphs.join("\n")}
              onChange={(e) =>
                onChange({
                  ...content,
                  unleashPotential: {
                    ...content.unleashPotential,
                    paragraphs: e.target.value.split("\n").filter((p) => p.trim()),
                  },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-32"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-heading mb-2">
              Paragraphs (EN) - One per line
            </label>
            <textarea
              value={content.unleashPotential.paragraphsEn.join("\n")}
              onChange={(e) =>
                onChange({
                  ...content,
                  unleashPotential: {
                    ...content.unleashPotential,
                    paragraphsEn: e.target.value.split("\n").filter((p) => p.trim()),
                  },
                })
              }
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-32"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                CTA Text (TR)
              </label>
              <input
                type="text"
                value={content.unleashPotential.ctaText}
                onChange={(e) =>
                  onChange({
                    ...content,
                    unleashPotential: { ...content.unleashPotential, ctaText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                CTA Text (EN)
              </label>
              <input
                type="text"
                value={content.unleashPotential.ctaTextEn}
                onChange={(e) =>
                  onChange({
                    ...content,
                    unleashPotential: { ...content.unleashPotential, ctaTextEn: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Careers */}
      <div className="border border-neutral-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-heading">
            {currentLang === "en" ? "Featured Careers" : "Öne Çıkan Kariyerler"}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (TR)
              </label>
              <input
                type="text"
                value={content.featuredCareers.title}
                onChange={(e) =>
                  onChange({
                    ...content,
                    featuredCareers: { ...content.featuredCareers, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (EN)
              </label>
              <input
                type="text"
                value={content.featuredCareers.titleEn}
                onChange={(e) =>
                  onChange({
                    ...content,
                    featuredCareers: { ...content.featuredCareers, titleEn: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-4">
            {content.featuredCareers.categories.map((category, index) => (
              <div key={category.id} className="border border-neutral-border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-neutral-heading">
                    Category {category.id + 1}
                  </h4>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Title (TR)
                    </label>
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => {
                        const newCategories = [...content.featuredCareers.categories];
                        newCategories[index] = { ...category, title: e.target.value };
                        onChange({
                          ...content,
                          featuredCareers: { ...content.featuredCareers, categories: newCategories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      value={category.titleEn}
                      onChange={(e) => {
                        const newCategories = [...content.featuredCareers.categories];
                        newCategories[index] = { ...category, titleEn: e.target.value };
                        onChange({
                          ...content,
                          featuredCareers: { ...content.featuredCareers, categories: newCategories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Description (TR)
                    </label>
                    <textarea
                      value={category.description}
                      onChange={(e) => {
                        const newCategories = [...content.featuredCareers.categories];
                        newCategories[index] = { ...category, description: e.target.value };
                        onChange({
                          ...content,
                          featuredCareers: { ...content.featuredCareers, categories: newCategories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Description (EN)
                    </label>
                    <textarea
                      value={category.descriptionEn}
                      onChange={(e) => {
                        const newCategories = [...content.featuredCareers.categories];
                        newCategories[index] = { ...category, descriptionEn: e.target.value };
                        onChange({
                          ...content,
                          featuredCareers: { ...content.featuredCareers, categories: newCategories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <ImageUpload
                    value={category.image}
                    onChange={(url) => {
                      const newCategories = [...content.featuredCareers.categories];
                      newCategories[index] = { ...category, image: url };
                      onChange({
                        ...content,
                        featuredCareers: { ...content.featuredCareers, categories: newCategories },
                      });
                    }}
                    label="Category Image"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="border border-neutral-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-neutral-heading mb-4">
          {currentLang === "en" ? "Culture Section" : "Kültür Bölümü"}
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (TR)
              </label>
              <input
                type="text"
                value={content.culture?.title || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    culture: {
                      ...(content.culture || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      title: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (EN)
              </label>
              <input
                type="text"
                value={content.culture?.titleEn || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    culture: {
                      ...(content.culture || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      titleEn: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Description (TR)
              </label>
              <textarea
                value={content.culture?.description || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    culture: {
                      ...(content.culture || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      description: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Description (EN)
              </label>
              <textarea
                value={content.culture?.descriptionEn || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    culture: {
                      ...(content.culture || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      descriptionEn: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Additional Description (TR)
              </label>
              <textarea
                value={content.culture?.additionalDescription || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    culture: {
                      ...(content.culture || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      additionalDescription: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Additional Description (EN)
              </label>
              <textarea
                value={content.culture?.additionalDescriptionEn || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    culture: {
                      ...(content.culture || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      additionalDescriptionEn: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
          </div>
          <ImageUpload
            value={content.culture?.image}
            onChange={(url) =>
              onChange({
                ...content,
                culture: {
                  ...(content.culture || {
                    title: "",
                    titleEn: "",
                    description: "",
                    descriptionEn: "",
                  }),
                  image: url,
                },
              })
            }
            label="Culture Image"
          />
        </div>
      </div>

      {/* Belonging Section */}
      <div className="border border-neutral-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-neutral-heading mb-4">
          {currentLang === "en" ? "Belonging Section" : "Aidiyet Bölümü"}
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (TR)
              </label>
              <input
                type="text"
                value={content.belonging?.title || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    belonging: {
                      ...(content.belonging || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      title: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (EN)
              </label>
              <input
                type="text"
                value={content.belonging?.titleEn || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    belonging: {
                      ...(content.belonging || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      titleEn: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Description (TR)
              </label>
              <textarea
                value={content.belonging?.description || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    belonging: {
                      ...(content.belonging || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      description: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Description (EN)
              </label>
              <textarea
                value={content.belonging?.descriptionEn || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    belonging: {
                      ...(content.belonging || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      descriptionEn: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Additional Description (TR)
              </label>
              <textarea
                value={content.belonging?.additionalDescription || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    belonging: {
                      ...(content.belonging || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      additionalDescription: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Additional Description (EN)
              </label>
              <textarea
                value={content.belonging?.additionalDescriptionEn || ""}
                onChange={(e) =>
                  onChange({
                    ...content,
                    belonging: {
                      ...(content.belonging || {
                        title: "",
                        titleEn: "",
                        description: "",
                        descriptionEn: "",
                      }),
                      additionalDescriptionEn: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
          </div>
          <ImageUpload
            value={content.belonging?.image}
            onChange={(url) =>
              onChange({
                ...content,
                belonging: {
                  ...(content.belonging || {
                    title: "",
                    titleEn: "",
                    description: "",
                    descriptionEn: "",
                  }),
                  image: url,
                },
              })
            }
            label="Belonging Image"
          />
        </div>
      </div>

      {/* Testimonials */}
      <div className="border border-neutral-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-heading">
            {currentLang === "en" ? "Testimonials" : "Referanslar"}
          </h3>
        </div>
        <div className="space-y-4">
          {content.testimonials.map((testimonial, index) => (
            <div key={index} className="border border-neutral-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-neutral-heading">
                  Testimonial {index + 1}
                </h4>
                <button
                  onClick={() => {
                    const newTestimonials = content.testimonials.filter((_, i) => i !== index);
                    onChange({
                      ...content,
                      testimonials: newTestimonials,
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {currentLang === "en" ? "Delete" : "Sil"}
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Quote (TR)
                  </label>
                  <textarea
                    value={testimonial.quote}
                    onChange={(e) => {
                      const newTestimonials = [...content.testimonials];
                      newTestimonials[index] = { ...testimonial, quote: e.target.value };
                      onChange({
                        ...content,
                        testimonials: newTestimonials,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Quote (EN)
                  </label>
                  <textarea
                    value={testimonial.quoteEn}
                    onChange={(e) => {
                      const newTestimonials = [...content.testimonials];
                      newTestimonials[index] = { ...testimonial, quoteEn: e.target.value };
                      onChange({
                        ...content,
                        testimonials: newTestimonials,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg h-20"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...testimonial, name: e.target.value };
                        onChange({
                          ...content,
                          testimonials: newTestimonials,
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Role (TR)
                    </label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...testimonial, role: e.target.value };
                        onChange({
                          ...content,
                          testimonials: newTestimonials,
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Role (EN)
                    </label>
                    <input
                      type="text"
                      value={testimonial.roleEn}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...testimonial, roleEn: e.target.value };
                        onChange({
                          ...content,
                          testimonials: newTestimonials,
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Department (TR)
                    </label>
                    <input
                      type="text"
                      value={testimonial.department}
                      onChange={(e) => {
                        const newTestimonials = [...content.testimonials];
                        newTestimonials[index] = { ...testimonial, department: e.target.value };
                        onChange({
                          ...content,
                          testimonials: newTestimonials,
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Department (EN)
                  </label>
                  <input
                    type="text"
                    value={testimonial.departmentEn}
                    onChange={(e) => {
                      const newTestimonials = [...content.testimonials];
                      newTestimonials[index] = { ...testimonial, departmentEn: e.target.value };
                      onChange({
                        ...content,
                        testimonials: newTestimonials,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newTestimonial = {
                quote: "",
                quoteEn: "",
                name: "",
                role: "",
                roleEn: "",
                department: "",
                departmentEn: "",
              };
              onChange({
                ...content,
                testimonials: [...content.testimonials, newTestimonial],
              });
            }}
            className="w-full px-4 py-2 border-2 border-dashed border-neutral-border rounded-lg hover:border-primary transition-colors text-neutral-body"
          >
            + {currentLang === "en" ? "Add Testimonial" : "Referans Ekle"}
          </button>
        </div>
      </div>

      {/* Company Cards */}
      <div className="border border-neutral-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-neutral-heading mb-4">
          {currentLang === "en" ? "Company Cards" : "Şirket Kartları"}
        </h3>
        <div className="space-y-4">
          {content.companyCards.map((card, index) => (
            <div key={index} className="border border-neutral-border rounded-lg p-4">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Title (TR)
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => {
                      const newCards = [...content.companyCards];
                      newCards[index] = { ...card, title: e.target.value };
                      onChange({
                        ...content,
                        companyCards: newCards,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Title (EN)
                  </label>
                  <input
                    type="text"
                    value={card.titleEn}
                    onChange={(e) => {
                      const newCards = [...content.companyCards];
                      newCards[index] = { ...card, titleEn: e.target.value };
                      onChange({
                        ...content,
                        companyCards: newCards,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Description (TR)
                  </label>
                  <textarea
                    value={card.description}
                    onChange={(e) => {
                      const newCards = [...content.companyCards];
                      newCards[index] = { ...card, description: e.target.value };
                      onChange({
                        ...content,
                        companyCards: newCards,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Description (EN)
                  </label>
                  <textarea
                    value={card.descriptionEn}
                    onChange={(e) => {
                      const newCards = [...content.companyCards];
                      newCards[index] = { ...card, descriptionEn: e.target.value };
                      onChange({
                        ...content,
                        companyCards: newCards,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Link Text (TR)
                  </label>
                  <input
                    type="text"
                    value={card.linkText}
                    onChange={(e) => {
                      const newCards = [...content.companyCards];
                      newCards[index] = { ...card, linkText: e.target.value };
                      onChange({
                        ...content,
                        companyCards: newCards,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    Link Text (EN)
                  </label>
                  <input
                    type="text"
                    value={card.linkTextEn}
                    onChange={(e) => {
                      const newCards = [...content.companyCards];
                      newCards[index] = { ...card, linkTextEn: e.target.value };
                      onChange({
                        ...content,
                        companyCards: newCards,
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  />
                </div>
              </div>
              <div className="mt-4">
                <ImageUpload
                  value={card.image}
                  onChange={(url) => {
                    const newCards = [...content.companyCards];
                    newCards[index] = { ...card, image: url };
                    onChange({
                      ...content,
                      companyCards: newCards,
                    });
                  }}
                  label="Card Image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Talent Network */}
      <div className="border border-neutral-border rounded-lg p-6">
        <h3 className="text-xl font-bold text-neutral-heading mb-4">
          {currentLang === "en" ? "Talent Network Section" : "Yetenek Ağı Bölümü"}
        </h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (TR)
              </label>
              <input
                type="text"
                value={content.talentNetwork.title}
                onChange={(e) =>
                  onChange({
                    ...content,
                    talentNetwork: { ...content.talentNetwork, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title (EN)
              </label>
              <input
                type="text"
                value={content.talentNetwork.titleEn}
                onChange={(e) =>
                  onChange({
                    ...content,
                    talentNetwork: { ...content.talentNetwork, titleEn: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Description (TR)
              </label>
              <textarea
                value={content.talentNetwork.description}
                onChange={(e) =>
                  onChange({
                    ...content,
                    talentNetwork: { ...content.talentNetwork, description: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Description (EN)
              </label>
              <textarea
                value={content.talentNetwork.descriptionEn}
                onChange={(e) =>
                  onChange({
                    ...content,
                    talentNetwork: { ...content.talentNetwork, descriptionEn: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Button Text (TR)
              </label>
              <input
                type="text"
                value={content.talentNetwork.buttonText}
                onChange={(e) =>
                  onChange({
                    ...content,
                    talentNetwork: { ...content.talentNetwork, buttonText: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Button Text (EN)
              </label>
              <input
                type="text"
                value={content.talentNetwork.buttonTextEn}
                onChange={(e) =>
                  onChange({
                    ...content,
                    talentNetwork: { ...content.talentNetwork, buttonTextEn: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Explore Life Stories */}
      <div className="border border-neutral-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral-heading">
            {currentLang === "en" ? "Explore Life Stories" : "Yaşam Hikayeleri"}
          </h3>
        </div>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Section Title (TR)
              </label>
              <input
                type="text"
                value={content.exploreLife.title}
                onChange={(e) =>
                  onChange({
                    ...content,
                    exploreLife: { ...content.exploreLife, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Section Title (EN)
              </label>
              <input
                type="text"
                value={content.exploreLife.titleEn}
                onChange={(e) =>
                  onChange({
                    ...content,
                    exploreLife: { ...content.exploreLife, titleEn: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
          </div>
          {content.exploreLife.stories.map((story, index) => (
            <div key={index} className="border border-neutral-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-neutral-heading">
                  Story {index + 1}
                </h4>
                <button
                  onClick={() => {
                    const newStories = content.exploreLife.stories.filter((_, i) => i !== index);
                    onChange({
                      ...content,
                      exploreLife: { ...content.exploreLife, stories: newStories },
                    });
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {currentLang === "en" ? "Delete" : "Sil"}
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Title (TR)
                    </label>
                    <input
                      type="text"
                      value={story.title}
                      onChange={(e) => {
                        const newStories = [...content.exploreLife.stories];
                        newStories[index] = { ...story, title: e.target.value };
                        onChange({
                          ...content,
                          exploreLife: { ...content.exploreLife, stories: newStories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      value={story.titleEn}
                      onChange={(e) => {
                        const newStories = [...content.exploreLife.stories];
                        newStories[index] = { ...story, titleEn: e.target.value };
                        onChange({
                          ...content,
                          exploreLife: { ...content.exploreLife, stories: newStories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Description (TR)
                    </label>
                    <textarea
                      value={story.description}
                      onChange={(e) => {
                        const newStories = [...content.exploreLife.stories];
                        newStories[index] = { ...story, description: e.target.value };
                        onChange({
                          ...content,
                          exploreLife: { ...content.exploreLife, stories: newStories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-heading mb-2">
                      Description (EN)
                    </label>
                    <textarea
                      value={story.descriptionEn}
                      onChange={(e) => {
                        const newStories = [...content.exploreLife.stories];
                        newStories[index] = { ...story, descriptionEn: e.target.value };
                        onChange({
                          ...content,
                          exploreLife: { ...content.exploreLife, stories: newStories },
                        });
                      }}
                      className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-heading mb-2">
                    URL
                  </label>
                  <input
                    type="text"
                    value={story.url}
                    onChange={(e) => {
                      const newStories = [...content.exploreLife.stories];
                      newStories[index] = { ...story, url: e.target.value };
                      onChange({
                        ...content,
                        exploreLife: { ...content.exploreLife, stories: newStories },
                      });
                    }}
                    className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                  />
                </div>
                <div className="mt-4">
                  <ImageUpload
                    value={story.image}
                    onChange={(url) => {
                      const newStories = [...content.exploreLife.stories];
                      newStories[index] = { ...story, image: url };
                      onChange({
                        ...content,
                        exploreLife: { ...content.exploreLife, stories: newStories },
                      });
                    }}
                    label="Story Image"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newStory = {
                title: "",
                titleEn: "",
                description: "",
                descriptionEn: "",
                url: "",
              };
              onChange({
                ...content,
                exploreLife: {
                  ...content.exploreLife,
                  stories: [...content.exploreLife.stories, newStory],
                },
              });
            }}
            className="w-full px-4 py-2 border-2 border-dashed border-neutral-border rounded-lg hover:border-primary transition-colors text-neutral-body"
          >
            + {currentLang === "en" ? "Add Story" : "Hikaye Ekle"}
          </button>
        </div>
      </div>
    </div>
  );
}

