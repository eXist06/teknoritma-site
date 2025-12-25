"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const { language, t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  
  // Default placeholder based on language
  const defaultPlaceholder = language === "en" ? "Write content..." : "İçerik yazın...";
  const finalPlaceholder = placeholder || defaultPlaceholder;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: 'prose-img',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
          class: "text-primary underline hover:text-primary-dark",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const handleImageUpload = async (file: File) => {
    // Client-side validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      alert(language === "en" 
        ? "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed."
        : "Geçersiz dosya türü. Sadece JPEG, PNG, WebP ve GIF görselleri yüklenebilir.");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert(language === "en"
        ? "File size exceeds 10MB limit. Please use a smaller image."
        : "Dosya boyutu 10MB limitini aşıyor. Lütfen daha küçük bir görsel kullanın.");
      return;
    }

    // Show size selection modal
    setPendingFile(file);
    setShowSizeModal(true);
  };

  const handleImageUploadWithSize = async (file: File, selectedSize: string) => {
    setUploading(true);
    setUploadProgress(0);
    setShowSizeModal(false);
    setPendingFile(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("size", selectedSize);

      const response = await fetch("/api/sarus-hub/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url && editor) {
        // Insert image with size attribute using insertContent for data attributes
        const imageHtml = `<img src="${data.url}" data-size="${selectedSize}" class="prose-img" alt="Uploaded image" />`;
        editor.chain().focus().insertContent(imageHtml).run();
        setUploadProgress(100);
      } else {
        alert(data.error || (language === "en" ? "Failed to upload image" : "Resim yüklenemedi"));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert(language === "en" 
        ? "An error occurred while uploading the image"
        : "Resim yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-neutral-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-neutral-light border-b border-neutral-border">
        {/* Text formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("bold") ? "bg-primary/20 text-primary" : ""
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("italic") ? "bg-primary/20 text-primary" : ""
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("strike") ? "bg-primary/20 text-primary" : ""
          }`}
        >
          <s>S</s>
        </button>

        <div className="w-px h-6 bg-neutral-border" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("bulletList") ? "bg-primary/20 text-primary" : ""
          }`}
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("orderedList") ? "bg-primary/20 text-primary" : ""
          }`}
        >
          1.
        </button>

        <div className="w-px h-6 bg-neutral-border" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => {
            if (editor.isActive("heading", { level: 2 })) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level: 2 }).run();
            }
          }}
          className={`p-2 rounded hover:bg-neutral-border text-sm ${
            editor.isActive("heading", { level: 2 }) ? "bg-primary/20 text-primary" : ""
          }`}
          title="Başlık 2 (H2)"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => {
            if (editor.isActive("heading", { level: 3 })) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().setHeading({ level: 3 }).run();
            }
          }}
          className={`p-2 rounded hover:bg-neutral-border text-sm ${
            editor.isActive("heading", { level: 3 }) ? "bg-primary/20 text-primary" : ""
          }`}
          title="Başlık 3 (H3)"
        >
          H3
        </button>

        <div className="w-px h-6 bg-neutral-border" />

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt(language === "en" ? "Link URL:" : "Link URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("link") ? "bg-primary/20 text-primary" : ""
          }`}
          title={language === "en" ? "Add link" : "Link ekle"}
        >
          🔗
        </button>

        {/* Image upload */}
        <label className="cursor-pointer relative" title={language === "en" ? "Upload image (max 10MB)" : "Görsel yükle (maks 10MB)"}>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file);
              }
            }}
            disabled={uploading}
          />
          <span
            className={`p-2 rounded hover:bg-neutral-border block ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "⏳" : "🖼️"}
          </span>
          {uploading && uploadProgress > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-border rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </label>

        <div className="w-px h-6 bg-neutral-border" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-neutral-border"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-neutral-border"
        >
          ↷
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[300px] max-h-[600px] overflow-y-auto tiptap-editor"
      />

      {/* Image Size Selection Modal */}
      {showSizeModal && pendingFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => {
          setShowSizeModal(false);
          setPendingFile(null);
        }}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-neutral-heading mb-4">
              {language === "en" ? "Select Image Size" : "Görsel Boyutu Seçin"}
            </h3>
            <p className="text-sm text-neutral-body mb-6">
              {language === "en" 
                ? "Choose how the image should appear in the content:" 
                : "Görselin içerikte nasıl görünmesini istediğinizi seçin:"}
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleImageUploadWithSize(pendingFile, "small")}
                className="p-4 border-2 border-neutral-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">
                  {language === "en" ? "Small" : "Küçük"}
                </div>
                <div className="text-sm text-neutral-body">40%</div>
              </button>
              
              <button
                onClick={() => handleImageUploadWithSize(pendingFile, "medium")}
                className="p-4 border-2 border-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">
                  {language === "en" ? "Medium" : "Orta"}
                </div>
                <div className="text-sm text-neutral-body">60%</div>
                <div className="text-xs text-primary mt-1">
                  {language === "en" ? "Recommended" : "Önerilen"}
                </div>
              </button>
              
              <button
                onClick={() => handleImageUploadWithSize(pendingFile, "large")}
                className="p-4 border-2 border-neutral-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">
                  {language === "en" ? "Large" : "Büyük"}
                </div>
                <div className="text-sm text-neutral-body">80%</div>
              </button>
              
              <button
                onClick={() => handleImageUploadWithSize(pendingFile, "full")}
                className="p-4 border-2 border-neutral-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="font-semibold text-neutral-heading mb-1">
                  {language === "en" ? "Full" : "Tam"}
                </div>
                <div className="text-sm text-neutral-body">100%</div>
              </button>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSizeModal(false);
                  setPendingFile(null);
                }}
                className="flex-1 px-4 py-2 border border-neutral-border rounded-lg hover:bg-neutral-light transition-colors"
              >
                {language === "en" ? "Cancel" : "İptal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


