"use client";

import { useState, useEffect, useRef } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle images in rich text content
  useEffect(() => {
    if (!contentRef.current) return;

    const images = contentRef.current.querySelectorAll('img');
    
    images.forEach((img) => {
      // Skip if already has error handler
      if (img.hasAttribute('data-error-handled')) return;

      img.setAttribute('data-error-handled', 'true');
      
      // Apply object-contain style to content images
      const imgElement = img as HTMLImageElement;
      imgElement.style.objectFit = 'contain';
      imgElement.style.maxWidth = '100%';
      imgElement.style.maxHeight = '100%';
      imgElement.style.width = 'auto';
      imgElement.style.height = 'auto';
      if (!imgElement.classList.contains('bg-gradient-to-br')) {
        imgElement.classList.add('bg-gradient-to-br', 'from-primary/5', 'to-accent/5');
      }
      
      const handleError = (e: Event) => {
        const target = e.target as HTMLImageElement;
        const originalSrc = target.src;
        console.error("Content içindeki görsel yüklenemedi:", originalSrc);
        
        // Hide broken image
        target.style.display = "none";
        
        // Create placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'flex items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-neutral-border';
        placeholder.innerHTML = `
          <div class="text-center">
            <svg class="w-12 h-12 mx-auto mb-2 opacity-50 text-neutral-body" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-sm text-neutral-body">Görsel yüklenemedi</p>
          </div>
        `;
        
        // Insert placeholder after the broken image
        if (target.parentNode) {
          target.parentNode.insertBefore(placeholder, target.nextSibling);
        }
      };

      const handleLoad = () => {
        // Image loaded successfully, ensure it's visible
        const target = img as HTMLImageElement;
        target.style.display = "";
        // Ensure object-contain for content images
        if (!target.style.objectFit) {
          target.style.objectFit = "contain";
          target.style.maxWidth = "100%";
          target.style.maxHeight = "100%";
        }
      };

      img.addEventListener('error', handleError);
      img.addEventListener('load', handleLoad);
      
      // If image is already broken, trigger error handler
      if (img.complete && img.naturalHeight === 0) {
        handleError({ target: img } as any);
      }
    });

    // Cleanup function
    return () => {
      images.forEach((img) => {
        img.removeEventListener('error', () => {});
        img.removeEventListener('load', () => {});
      });
    };
  }, [content]);

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
              <div key={idx} className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-48 object-contain bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.open(img, "_blank")}
                  onError={(e) => {
                    console.error("Galeri görseli yüklenemedi:", img);
                    const target = e.target as HTMLImageElement;
                    const container = target.parentElement;
                    if (container) {
                      target.style.display = "none";
                      if (!container.querySelector('.image-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body';
                        placeholder.innerHTML = '<div class="text-center"><svg class="w-8 h-8 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs">Görsel yüklenemedi</p></div>';
                        container.appendChild(placeholder);
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        );

      case "carousel":
        return (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-contain bg-gradient-to-br from-primary/5 to-accent/5 transition-opacity duration-500 ${
                  idx === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                onError={(e) => {
                  console.error("Carousel görseli yüklenemedi:", img);
                  const target = e.target as HTMLImageElement;
                  const container = target.parentElement;
                  if (container && idx === currentImageIndex) {
                    target.style.display = "none";
                    if (!container.querySelector('.image-placeholder')) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body';
                      placeholder.innerHTML = '<div class="text-center"><svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm">Görsel yüklenemedi</p></div>';
                      container.appendChild(placeholder);
                    }
                  }
                }}
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
              <div key={idx} className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden">
                <img
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-64 object-contain bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg shadow-md"
                  onError={(e) => {
                    console.error("Grid görseli yüklenemedi:", img);
                    const target = e.target as HTMLImageElement;
                    const container = target.parentElement;
                    if (container) {
                      target.style.display = "none";
                      if (!container.querySelector('.image-placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body';
                        placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm">Görsel yüklenemedi</p></div>';
                        container.appendChild(placeholder);
                      }
                    }
                  }}
                />
              </div>
            ))}
          </div>
        );

      case "cover":
      default:
        return (
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/5 to-accent/5">
            <img
              src={allImages[0]}
              alt="Featured"
              className="w-full h-full object-contain bg-gradient-to-br from-primary/5 to-accent/5"
              onError={(e) => {
                console.error("Resim yüklenemedi:", allImages[0]);
                const target = e.target as HTMLImageElement;
                const container = target.parentElement;
                if (container) {
                  target.style.display = "none";
                  // Show placeholder if not already shown
                  if (!container.querySelector('.image-placeholder')) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body';
                    placeholder.innerHTML = '<div class="text-center"><svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm">Görsel yüklenemedi</p></div>';
                    container.appendChild(placeholder);
                  }
                }
              }}
              onLoad={(e) => {
                // Remove placeholder if image loads successfully
                const target = e.target as HTMLImageElement;
                const container = target.parentElement;
                if (container) {
                  const placeholder = container.querySelector('.image-placeholder');
                  if (placeholder) {
                    placeholder.remove();
                  }
                }
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
              className="w-full h-full object-contain bg-black"
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
        ref={contentRef}
        className="prose prose-lg max-w-none prose-headings:text-neutral-heading prose-p:text-neutral-body prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-heading prose-img:rounded-lg prose-img:shadow-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}


