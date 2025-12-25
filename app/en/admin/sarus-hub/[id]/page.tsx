"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";
import { SarusHubItem, SarusHubItemType, SarusHubItemStatus, SarusHubItemLanguage } from "@/lib/types/sarus-hub";
import { UserRole } from "@/lib/types/admin";

const typeLabels: Record<SarusHubItemType, string> = {
  "case-study": "Case Study",
  news: "News",
  insight: "Insight",
  event: "Event",
};

export default function AdminSarusHubEditPageEN() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [authorized, setAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
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
    language: "en",
  });
  const [tagInput, setTagInput] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [multipleImagesUploading, setMultipleImagesUploading] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);
  const [pendingInputElement, setPendingInputElement] = useState<HTMLInputElement | null>(null);

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

        // Sarus-hub veya admin erişebilir
        if (role !== "admin" && role !== "sarus-hub") {
          router.push("/en/admin");
          return;
        }

        setAuthorized(true);
        if (!isNew) {
          fetchItem();
        }
      } catch {
        router.push("/en/admin/login");
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, [id, isNew, router]);

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
    // Client-side validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.");
      if (inputElement) inputElement.value = "";
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size exceeds 10MB limit. Please use a smaller image.");
      if (inputElement) inputElement.value = "";
      return;
    }

    // Show size selection modal
    setPendingFile(file);
    setIsPrimaryImage(setAsPrimary);
    setPendingInputElement(inputElement || null);
    setShowSizeModal(true);
  };

  const handleImageUploadWithSize = async (file: File, selectedSize: string, setAsPrimary: boolean = false, inputElement?: HTMLInputElement | null) => {
    setImageUploading(true);
    setShowSizeModal(false);
    setPendingFile(null);
    setPendingInputElement(null);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("size", selectedSize);

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
        // Clear input so same file can be selected again
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        throw new Error(data.error || "Failed to upload image: URL not received");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      const errorMessage = error?.message || error?.error || "An error occurred while uploading image";
      alert(`Image upload error: ${errorMessage}`);
      // Clear input on error
      if (inputElement) {
        inputElement.value = "";
      }
    } finally {
      setImageUploading(false);
    }
  };

  const handleMultipleImageUpload = async (files: FileList, inputElement?: HTMLInputElement) => {
    // Client-side validation for all files
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    const invalidFiles: string[] = [];
    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        invalidFiles.push(`${file.name}: Invalid file type`);
      } else if (file.size > maxSize) {
        invalidFiles.push(`${file.name}: Exceeds 10MB limit`);
      }
    });

    if (invalidFiles.length > 0) {
      alert("Some files are invalid:\n" + invalidFiles.join("\n"));
      if (inputElement) inputElement.value = "";
      return;
    }

    // Show size selection modal for multiple files
    setPendingFiles(Array.from(files));
    setPendingInputElement(inputElement || null);
    setIsPrimaryImage(false);
    setShowSizeModal(true);
  };

  const handleMultipleImageUploadWithSize = async (files: File[], selectedSize: string, inputElement?: HTMLInputElement | null) => {
    setMultipleImagesUploading(true);
    setShowSizeModal(false);
    setPendingFiles([]);
    setPendingInputElement(null);
    
    try {
      const uploadPromises = files.map(async (file) => {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);
          uploadFormData.append("size", selectedSize);
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
        // Clear input
        if (inputElement) {
          inputElement.value = "";
        }
        
        // Inform user if some files failed to upload
        if (uploadedUrls.length < files.length) {
          alert(`${uploadedUrls.length}/${files.length} images uploaded successfully. Some images failed to upload.`);
        }
      } else {
        alert("No images were uploaded");
        // Clear input on error
        if (inputElement) {
          inputElement.value = "";
        }
      }
    } catch (error) {
      console.error("Multiple image upload error:", error);
      alert("An error occurred while uploading images");
      // Clear input on error
      if (inputElement) {
        inputElement.value = "";
      }
    } finally {
      setMultipleImagesUploading(false);
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setFormData((prev) => {
      const currentImages = prev.images || [];
      const isPrimary = prev.primaryImage === imageUrl;
      
      return {
        ...prev,
        images: currentImages.filter((img) => img !== imageUrl),
        primaryImage: isPrimary ? "" : prev.primaryImage,
        image: isPrimary ? "" : prev.image, // Legacy support
      };
    });
  };

  const handleSetPrimaryImage = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      primaryImage: imageUrl,
      image: imageUrl, // Legacy support
    }));
  };

  const handleVideoUpload = async (file: File, inputElement?: HTMLInputElement) => {
    // Client-side validation
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid file type. Only MP4, WebM, and QuickTime videos are allowed.");
      if (inputElement) inputElement.value = "";
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert("File size exceeds 100MB limit. Please use a smaller video.");
      if (inputElement) inputElement.value = "";
      return;
    }

    setVideoUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/sarus-hub/upload-video", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        setFormData((prev) => ({ ...prev, video: data.url }));
        // Clear input
        if (inputElement) {
          inputElement.value = "";
        }
      } else {
        alert(data.error || "Failed to upload video");
        // Clear input on error
        if (inputElement) {
          inputElement.value = "";
        }
      }
    } catch (error) {
      console.error("Video upload error:", error);
      alert("An error occurred while uploading video");
      // Clear input on error
      if (inputElement) {
        inputElement.value = "";
      }
    } finally {
      setVideoUploading(false);
    }
  };

  const handleSave = async (status: SarusHubItemStatus) => {
    if (!formData.title || !formData.slug || !formData.summary || !formData.content) {
      alert("Please fill in all required fields (title, slug, summary, content)");
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
      const url = "/api/sarus-hub/content";
      const body = isNew ? payload : { id, ...payload };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/en/admin/sarus-hub");
      } else {
        alert(data.error || "Failed to save content");
      }
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <header className="mb-6">
          <button
            onClick={() => router.push("/en/admin/sarus-hub")}
            className="text-sm text-neutral-body hover:text-primary mb-4"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-neutral-heading">
            {isNew ? "Create New Content" : "Edit Content"}
          </h1>
        </header>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Basic Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Content Type *
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
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as SarusHubItemLanguage })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                >
                  <option value="tr">Turkish</option>
                  <option value="en">English</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                placeholder="Content title"
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
                placeholder="content-url-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary || ""}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
                placeholder="Short summary"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Content</h2>
            <RichTextEditor
              content={formData.content || ""}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          {/* Additional Info */}
          <div className="space-y-4 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Additional Information</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Hospital
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
                  Country
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
                  placeholder="Add tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  Add
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
                  Reading Time (minutes)
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
                  Author
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
                Mark as featured content
              </label>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-6 rounded-lg border border-neutral-border p-6">
            <h2 className="text-lg font-semibold text-neutral-heading">Media</h2>
            
            {/* Primary Image */}
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Primary Image (Card Preview)
              </label>
              {formData.primaryImage && (
                <div className="relative mb-2">
                <img
                    src={formData.primaryImage}
                    alt="Primary"
                    className="w-full h-64 object-cover rounded-lg border border-neutral-border"
                    onError={(e) => {
                      console.error("Image failed to load:", formData.primaryImage);
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const container = target.parentElement;
                      if (container && !container.querySelector('.image-error')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'image-error w-full h-64 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg';
                        errorDiv.innerHTML = '<div class="text-center text-red-600"><p class="text-sm font-medium">Image failed to load</p><p class="text-xs mt-1">' + formData.primaryImage + '</p></div>';
                        container.appendChild(errorDiv);
                      }
                    }}
                    onLoad={(e) => {
                      // Remove error message when image loads successfully
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
                    Remove
                  </button>
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    ✓ Primary Image
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
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
              <p className="text-xs text-neutral-body mt-1">Maximum file size: 10MB (JPEG, PNG, WebP, GIF)</p>
              {imageUploading && <p className="text-sm text-neutral-body mt-2">Uploading...</p>}
            </div>

            {/* Multiple Images */}
            <div>
              <label className="block text-sm font-medium text-neutral-heading mb-2">
                Additional Images
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
                          console.error("Image failed to load:", img);
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const container = target.parentElement;
                          if (container && !container.querySelector('.image-error')) {
                            const errorDiv = document.createElement('div');
                            errorDiv.className = 'image-error w-full h-32 flex items-center justify-center bg-red-50 border border-red-200 rounded-lg';
                            errorDiv.innerHTML = '<p class="text-xs text-red-600 text-center">Image failed to load</p>';
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
                          title="Set as primary"
                        >
                          ⭐ Primary
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          title="Remove"
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
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
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
              <p className="text-xs text-neutral-body mt-1">Maximum file size: 10MB (JPEG, PNG, WebP, GIF)</p>
              {multipleImagesUploading && <p className="text-sm text-neutral-body mt-2">Uploading...</p>}
            </div>

            {/* Image Display Style */}
            {(formData.images && formData.images.length > 0) && (
              <div>
                <label className="block text-sm font-medium text-neutral-heading mb-2">
                  Image Display Style
                </label>
                <select
                  value={formData.imageDisplayStyle || "cover"}
                  onChange={(e) => setFormData({ ...formData, imageDisplayStyle: e.target.value as any })}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                >
                  <option value="cover">Cover (Single image, full screen)</option>
                  <option value="gallery">Gallery (Small thumbnails)</option>
                  <option value="carousel">Carousel (Scrollable)</option>
                  <option value="grid">Grid (Grid layout)</option>
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
                    Remove
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
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
              <p className="text-xs text-neutral-body mt-1">Maximum file size: 100MB (MP4, WebM, QuickTime)</p>
              {videoUploading && <p className="text-sm text-neutral-body mt-2">Uploading...</p>}
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
              {saving ? "Saving..." : "Save as Draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Image Size Selection Modal */}
      {showSizeModal && (pendingFile || pendingFiles.length > 0) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => {
          setShowSizeModal(false);
          setPendingFile(null);
          setPendingFiles([]);
          setPendingInputElement(null);
        }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-neutral-heading mb-4">
              Select Image Size
            </h3>
            <p className="text-sm text-neutral-body mb-6">
              {pendingFiles.length > 0 
                ? `Select size for ${pendingFiles.length} images:` 
                : "Choose how the image should appear on the page:"}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => {
                  if (pendingFile) {
                    handleImageUploadWithSize(pendingFile, "small", isPrimaryImage, pendingInputElement);
                  } else if (pendingFiles.length > 0) {
                    handleMultipleImageUploadWithSize(pendingFiles, "small", pendingInputElement);
                  }
                }}
                className="p-4 border-2 border-neutral-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">Small</div>
                <div className="text-sm text-neutral-body">40%</div>
              </button>
              
              <button
                onClick={() => {
                  if (pendingFile) {
                    handleImageUploadWithSize(pendingFile, "medium", isPrimaryImage, pendingInputElement);
                  } else if (pendingFiles.length > 0) {
                    handleMultipleImageUploadWithSize(pendingFiles, "medium", pendingInputElement);
                  }
                }}
                className="p-4 border-2 border-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">Medium</div>
                <div className="text-sm text-neutral-body">60%</div>
                <div className="text-xs text-primary mt-1">Recommended</div>
              </button>
              
              <button
                onClick={() => {
                  if (pendingFile) {
                    handleImageUploadWithSize(pendingFile, "large", isPrimaryImage, pendingInputElement);
                  } else if (pendingFiles.length > 0) {
                    handleMultipleImageUploadWithSize(pendingFiles, "large", pendingInputElement);
                  }
                }}
                className="p-4 border-2 border-neutral-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">Large</div>
                <div className="text-sm text-neutral-body">80%</div>
              </button>
              
              <button
                onClick={() => {
                  if (pendingFile) {
                    handleImageUploadWithSize(pendingFile, "full", isPrimaryImage, pendingInputElement);
                  } else if (pendingFiles.length > 0) {
                    handleMultipleImageUploadWithSize(pendingFiles, "full", pendingInputElement);
                  }
                }}
                className="p-4 border-2 border-neutral-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">Full</div>
                <div className="text-sm text-neutral-body">100%</div>
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSizeModal(false);
                  setPendingFile(null);
                  setPendingFiles([]);
                  setPendingInputElement(null);
                }}
                className="flex-1 px-4 py-2 border border-neutral-border rounded-lg hover:bg-neutral-light transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


