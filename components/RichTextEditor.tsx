"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "İçerik yazın...",
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
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
    if (!file.type.startsWith("image/")) {
      alert("Sadece resim dosyaları yüklenebilir.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/sarus-hub/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url && editor) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || "Resim yüklenemedi");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Resim yüklenirken bir hata oluştu");
    } finally {
      setUploading(false);
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
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-neutral-border text-sm ${
            editor.isActive("heading", { level: 2 }) ? "bg-primary/20 text-primary" : ""
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-neutral-border text-sm ${
            editor.isActive("heading", { level: 3 }) ? "bg-primary/20 text-primary" : ""
          }`}
        >
          H3
        </button>

        <div className="w-px h-6 bg-neutral-border" />

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Link URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-neutral-border ${
            editor.isActive("link") ? "bg-primary/20 text-primary" : ""
          }`}
        >
          🔗
        </button>

        {/* Image upload */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
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
        className="min-h-[300px] max-h-[600px] overflow-y-auto"
      />
    </div>
  );
}


