"use client";

import { useState } from "react";
import { ImageDisplayStyle } from "@/lib/types/sarus-hub";

interface SarusHubContentProps {
  content: string;
  image?: string;
  primaryImage?: string;
  images?: string[];
  imageDisplayStyle?: ImageDisplayStyle;
  video?: string;
}

export default function SarusHubContent({
  content,
  image,
  primaryImage,
  images,
  imageDisplayStyle = "cover",
  video,
}: SarusHubContentProps) {
  const [videoError, setVideoError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Determine which images to show
  const allImages = images && images.length > 0 
    ? images 
    : (primaryImage || image ? [primaryImage || image] : []);

  const renderImages = () => {
    if (!allImages || allImages.length === 0) return null;

    switch (imageDisplayStyle) {
      case "gallery":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.open(img, "_blank")}
              />
            ))}
          </div>
        );

      case "carousel":
        return (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  idx === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % allImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  →
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        );

      case "grid":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            ))}
          </div>
        );

      case "cover":
      default:
        return (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            <img
              src={allImages[0]}
              alt="Featured"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Resim yüklenemedi:", allImages[0]);
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Images based on display style */}
      {renderImages()}

      {/* Video */}
      {video && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black mb-6">
          {videoError ? (
            <div className="flex items-center justify-center h-full p-8">
              <div className="text-center text-white">
                <p className="text-lg font-semibold mb-2">Video yüklenemedi</p>
                <p className="text-sm text-gray-300 mb-4">
                  Video formatı tarayıcınız tarafından desteklenmiyor olabilir.
                </p>
                <p className="text-xs text-gray-400">
                  Lütfen MP4 formatında video yükleyin. (.mov dosyaları bazı tarayıcılarda çalışmayabilir)
                </p>
                <a
                  href={video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-sm"
                >
                  Videoyu İndir
                </a>
              </div>
            </div>
          ) : (
            <video
              controls
              className="w-full h-full"
              src={video}
              onError={() => {
                console.error("Video yüklenemedi:", video);
                setVideoError(true);
              }}
              preload="metadata"
            >
              <source src={video} type="video/mp4" />
              <source src={video} type="video/webm" />
              <source src={video} type="video/quicktime" />
              Tarayıcınız video etiketini desteklemiyor.
            </video>
          )}
        </div>
      )}

      {/* Rich Text Content */}
      <div
        className="prose prose-lg max-w-none prose-headings:text-neutral-heading prose-p:text-neutral-body prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-heading prose-img:rounded-lg prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}


