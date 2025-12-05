"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { SarusHubItem, SarusHubItemType, SarusHubItemStatus, SarusHubItemLanguage } from "@/lib/types/sarus-hub";

const typeLabels: Record<SarusHubItemType, string> = {
  "case-study": "Vaka Çalışması",
  news: "Haber",
  insight: "İçgörü",
  event: "Etkinlik",
};

export default function AdminSarusHubEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SarusHubItem>>({
    type: "news",
    title: "",
    slug: "",
    summary: "",
    content: "",
    hospital: "",
    country: "",
    segment: "",
    tags: [],
    featured: false,
    readingMinutes: undefined,
    status: "draft",
    author: "",
    image: "",
    video: "",
    language: "tr",
  });
  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchItem();
    }
  }, [id, isNew]);

  const fetchItem = async () => {
    try {
      const response = await fetch("/api/sarus-hub/content");
      const data = await response.json();
      const item = data.items.find((i: SarusHubItem) => i.id === id);
      if (item) {
        setFormData(item);
      }
    } catch (error) {
      console.error("Failed to fetch item:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: formData.slug || generateSlug(title) });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/sarus-hub/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setFormData({ ...formData, image: data.url });
      } else {
        alert(data.error || "Resim yüklenemedi");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Resim yüklenirken bir hata oluştu");
    } finally {
      setImageUploading(false);
    }
  };

  const handleVideoUpload = async (file: File) => {
    setVideoUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/sarus-hub/upload-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setFormData({ ...formData, video: data.url });
      } else {
        alert(data.error || "Video yüklenemedi");
      }
    } catch (error) {
      console.error("Video upload error:", error);
      alert("Video yüklenirken bir hata oluştu");
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSave = async (status: SarusHubItemStatus) => {
    if (!formData.title || !formData.slug || !formData.summary || !formData.content) {
      alert("Lütfen tüm zorunlu alanları doldurun");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        status,
        publishedAt: status === "published" ? new Date().toISOString() : undefined,
      };

      const method = isNew ? "POST" : "PUT";
      const url = isNew ? "/api/sarus-hub/content" : "/api/sarus-hub/content";
      const body = isNew ? payload : { id, ...payload };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/sarus-hub");
      } else {
        alert(data.error || "Kaydetme işlemi başarısız oldu");
      }
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Kaydetme işlemi başarısız oldu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <header className="mb-6">
          <button
            onClick={() => router.push("/admin/sarus-hub")}
            className="text-sm text-neutral-body hover:text-primary mb-4"
          >
            ← Geri dön
          </button>
          <h1 className="text-2xl font-bold text-neutral-heading">
            {isNew ? "Yeni İçerik Oluştur" : "İçeriği Düzenle"}
          </h1>
        </header>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Temel Bilgiler</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  İçerik Türü *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as SarusHubItemType })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                >
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Dil
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as SarusHubItemLanguage })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">İngilizce</option>
                  <option value="mixed">Karışık</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Başlık *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                placeholder="İçerik başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                placeholder="icerik-url-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Özet *
              </label>
              <textarea
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Kısa özet"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">İçerik *</h2>
            <RichTextEditor
              content={formData.content || ""}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Additional Info */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Ek Bilgiler</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Hastane
                </label>
                <input
                  type="text"
                  value={formData.hospital || ""}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Ülke
                </label>
                <input
                  type="text"
                  value={formData.country || ""}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Segment
              </label>
              <input
                type="text"
                value={formData.segment || ""}
                onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                placeholder="Public Hospital, City Hospital, Private Group, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-neutral-border rounded-lg"
                  placeholder="Tag ekle ve Enter'a bas"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Okuma Süresi (dakika)
                </label>
                <input
                  type="number"
                  value={formData.readingMinutes || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      readingMinutes: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Yazar
                </label>
                <input
                  type="text"
                  value={formData.author || ""}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured || false}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm text-neutral-heading">
                Öne çıkan içerik olarak işaretle
              </label>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Medya</h2>
            
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Öne Çıkan Resim
              </label>
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg mb-2"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                disabled={imageUploading}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
              {imageUploading && <p className="text-sm text-neutral-body mt-2">Yükleniyor...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Video
              </label>
              {formData.video && (
                <video
                  src={formData.video}
                  controls
                  className="w-full rounded-lg mb-2"
                />
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleVideoUpload(file);
                }}
                disabled={videoUploading}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
              {videoUploading && <p className="text-sm text-neutral-body mt-2">Yükleniyor...</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-neutral-light text-neutral-heading rounded-lg hover:bg-neutral-border disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Taslak Olarak Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? "Yayınlanıyor..." : "Yayınla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

