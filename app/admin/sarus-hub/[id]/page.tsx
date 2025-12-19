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
    primaryImage: "",
    images: [],
    imageDisplayStyle: "cover",
    video: "",
    language: "tr",
  });
  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [multipleImagesUploading, setMultipleImagesUploading] = useState(false);

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

  const handleImageUpload = async (file: File, setAsPrimary: boolean = false, inputElement?: HTMLInputElement) => {
    setImageUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/sarus-hub/upload-image", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        if (setAsPrimary) {
          setFormData((prev) => ({ 
            ...prev, 
            primaryImage: data.url,
            image: data.url, // Legacy support
          }));
        } else {
          setFormData((prev) => {
            const currentImages = prev.images || [];
            return { 
              ...prev, 
              images: [...currentImages, data.url],
            };
          });
        }
        // Input'u temizle ki aynı dosya tekrar seçilebilsin
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        throw new Error(data.error || "Resim yüklenemedi: URL alınamadı");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      const errorMessage = error?.message || error?.error || "Resim yüklenirken bir hata oluştu";
      alert(`Resim yükleme hatası: ${errorMessage}`);
      // Hata durumunda da input'u temizle
      if (inputElement) {
        inputElement.value = "";
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files: FileList, inputElement?: HTMLInputElement) => {
    setMultipleImagesUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          const response = await fetch("/api/sarus-hub/upload-image", {
            method: "POST",
            body: uploadFormData,
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch {
              errorData = { error: errorText || `HTTP ${response.status}` };
            }
            console.error(`Upload failed for ${file.name}:`, errorData);
            return null;
          }
          
          const data = await response.json();
          return data.url ? data.url : null;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          return null;
        }
      });

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(Boolean) as string[];
      if (uploadedUrls.length > 0) {
        setFormData((prev) => {
          const currentImages = prev.images || [];
          return { 
            ...prev, 
            images: [...currentImages, ...uploadedUrls],
          };
        });
        // Input'u temizle
        if (inputElement) {
          inputElement.value = "";
        }
        
        // Eğer bazı dosyalar yüklenemediyse kullanıcıyı bilgilendir
        if (uploadedUrls.length < files.length) {
          alert(`${uploadedUrls.length}/${files.length} görsel başarıyla yüklendi. Bazı görseller yüklenemedi.`);
        }
      } else {
        alert("Hiçbir resim yüklenemedi");
        // Hata durumunda da input'u temizle
        if (inputElement) {
          inputElement.value = "";
        }
      }
    } catch (error) {
      console.error("Multiple image upload error:", error);
      alert("Resimler yüklenirken bir hata oluştu");
      // Hata durumunda da input'u temizle
      if (inputElement) {
        inputElement.value = "";
      }
    } finally {
      setMultipleImagesUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    const currentImages = formData.images || [];
    const isPrimary = formData.primaryImage === imageUrl;
    
    setFormData({
      ...formData,
      images: currentImages.filter(img => img !== imageUrl),
      primaryImage: isPrimary ? undefined : formData.primaryImage,
      image: isPrimary ? undefined : formData.image, // Legacy
    });
  };

  const handleSetPrimaryImage = (imageUrl: string) => {
    setFormData({
      ...formData,
      primaryImage: imageUrl,
      image: imageUrl, // Legacy support
    });
  };

  const handleVideoUpload = async (file: File, inputElement?: HTMLInputElement) => {
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
        // Input'u temizle
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert(data.error || "Video yüklenemedi");
        // Hata durumunda da input'u temizle
        if (inputElement) {
          inputElement.value = "";
        }
      }
    } catch (error) {
      console.error("Video upload error:", error);
      alert("Video yüklenirken bir hata oluştu");
      // Hata durumunda da input'u temizle
      if (inputElement) {
        inputElement.value = "";
      }
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
          <div className="space-y-6 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Medya</h2>
            
            {/* Primary Image */}
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Ana Görsel (Kart Önizlemesi)
              </label>
              {formData.primaryImage && (
                <div className="relative mb-2">
                  <img
                    src={formData.primaryImage}
                    alt="Primary"
                    className="w-full h-64 object-cover rounded-lg border border-neutral-border"
                    onError={(e) => {
                      console.error("Görsel yüklenemedi:", formData.primaryImage);
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const container = target.parentElement;
                      if (container && !container.querySelector('.image-error')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'image-error w-full h-64 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg';
                        errorDiv.innerHTML = '<div class="text-center text-red-600"><p class="text-sm font-medium">Görsel yüklenemedi</p><p class="text-xs mt-1">' + formData.primaryImage + '</p></div>';
                        container.appendChild(errorDiv);
                      }
                    }}
                    onLoad={(e) => {
                      // Görsel yüklendiğinde error mesajını kaldır
                      const target = e.target as HTMLImageElement;
                      const container = target.parentElement;
                      if (container) {
                        const errorDiv = container.querySelector('.image-error');
                        if (errorDiv) {
                          errorDiv.remove();
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(formData.primaryImage!)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 z-10"
                  >
                    Kaldır
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    ✓ Ana Görsel
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const inputElement = e.target as HTMLInputElement;
                  if (file) {
                    handleImageUpload(file, true, inputElement);
                  }
                }}
                disabled={imageUploading}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
              {imageUploading && <p className="text-sm text-neutral-body mt-2">Yükleniyor...</p>}
            </div>

            {/* Multiple Images */}
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Ek Görseller
              </label>
              {(formData.images && formData.images.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-neutral-border"
                        onError={(e) => {
                          console.error("Görsel yüklenemedi:", img);
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const container = target.parentElement;
                          if (container && !container.querySelector('.image-error')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'image-error w-full h-32 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg';
                            errorDiv.innerHTML = '<p class="text-xs text-red-600 text-center">Görsel yüklenemedi</p>';
                            container.appendChild(errorDiv);
                          }
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          const container = target.parentElement;
                          if (container) {
                            const errorDiv = container.querySelector('.image-error');
                            if (errorDiv) {
                              errorDiv.remove();
                            }
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors rounded-lg flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSetPrimaryImage(img)}
                          className="opacity-0 group-hover:opacity-100 bg-primary text-white px-2 py-1 rounded text-xs hover:bg-primary-dark"
                          title="Ana görsel yap"
                        >
                          ⭐ Ana
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          title="Kaldır"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  const inputElement = e.target as HTMLInputElement;
                  if (files && files.length > 0) {
                    handleMultipleImageUpload(files, inputElement);
                  }
                }}
                disabled={multipleImagesUploading}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              />
              {multipleImagesUploading && <p className="text-sm text-neutral-body mt-2">Yükleniyor...</p>}
            </div>

            {/* Image Display Style */}
            {(formData.images && formData.images.length > 0) && (
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Görsel Gösterim Tarzı
                </label>
                <select
                  value={formData.imageDisplayStyle || "cover"}
                  onChange={(e) => setFormData({ ...formData, imageDisplayStyle: e.target.value as any })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                >
                  <option value="cover">Kapak (Tek görsel, tam ekran)</option>
                  <option value="gallery">Galeri (Küçük önizlemeler)</option>
                  <option value="carousel">Karusel (Kaydırılabilir)</option>
                  <option value="grid">Izgara (Grid düzeni)</option>
                </select>
              </div>
            )}

            {/* Video */}
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Video
              </label>
              {formData.video && (
                <div className="relative mb-2">
                  <video
                    src={formData.video}
                    controls
                    className="w-full rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, video: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Kaldır
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const inputElement = e.target as HTMLInputElement;
                  if (file) {
                    handleVideoUpload(file, inputElement);
                  }
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

