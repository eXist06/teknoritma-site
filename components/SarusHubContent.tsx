"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ImageDisplayStyle } from "@/lib/types/sarus-hub";

interface SarusHubContentProps {
  content: string;
  image?: string;
  primaryImage?: string;
  images?: string[];
  imageDisplayStyle?: ImageDisplayStyle;
  video?: string;
  skipPrimaryImage?: boolean;
}

export default function SarusHubContent({
  content,
  image,
  primaryImage,
  images,
  imageDisplayStyle = "cover",
  video,
  skipPrimaryImage = false,
}: SarusHubContentProps) {
  const [videoError, setVideoError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle images in rich text content with lightbox
  useEffect(() => {
    if (!contentRef.current) return;

    const images = contentRef.current.querySelectorAll('img');
    
    images.forEach((img) => {
      // Skip if already has error handler
      if (img.hasAttribute('data-error-handled')) return;

      img.setAttribute('data-error-handled', 'true');
      
      // Apply responsive style to content images
      const imgElement = img as HTMLImageElement;
      
      // Check if image has data-size attribute
      let dataSize = imgElement.getAttribute('data-size');
      
      // Eğer data-size yoksa, default olarak 'medium' ekle (eski görseller için)
      if (!dataSize) {
        dataSize = 'medium';
        imgElement.setAttribute('data-size', dataSize);
      }
      
      // CSS class'ını ekle (prose-img zaten var ama emin olmak için)
      if (!imgElement.classList.contains('prose-img')) {
        imgElement.classList.add('prose-img');
      }
      
      // data-size attribute'una göre max-width'i inline style olarak ekle
      // Inline style, CSS'teki !important kurallarından daha güçlüdür
      const sizeMap: Record<string, string> = {
        'small': '40%',
        'medium': '60%',
        'large': '80%',
        'full': '100%'
      };
      
      const maxWidth = sizeMap[dataSize] || '60%';
      
      // Inline style'ları ayarla - inline style CSS'ten daha güçlü
      // Önce mevcut style'ları temizle (özellikle max-width)
      if (imgElement.style.maxWidth) {
        imgElement.style.removeProperty('max-width');
      }
      
      // Yeni style'ları ekle - inline style zaten CSS'ten daha güçlü
      imgElement.style.objectFit = 'contain';
      imgElement.style.width = 'auto';
      imgElement.style.height = 'auto';
      imgElement.style.display = 'block';
      imgElement.style.margin = '0 auto';
      imgElement.style.cursor = 'pointer';
      imgElement.style.maxWidth = maxWidth; // data-size'a göre max-width ekle - inline style CSS'ten daha güçlü
      
      // Debug: Console'da kontrol et (production'da kaldırılabilir)
      if (process.env.NODE_ENV === 'development') {
        console.log('Image size applied:', { dataSize, maxWidth, src: imgElement.src });
      }
      
      // Remove fixed height constraints
      if (imgElement.style.height && imgElement.style.height !== 'auto') {
        imgElement.style.height = 'auto';
      }
      
      // Add lightbox click handler
      const handleClick = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target as HTMLImageElement;
        const src = target.src;
        
        // Create lightbox overlay
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.onclick = () => overlay.remove();
        
        const image = document.createElement('img');
        image.src = src;
        image.className = 'lightbox-image';
        image.onclick = (e) => e.stopPropagation();
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => overlay.remove();
        
        overlay.appendChild(image);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Cleanup on remove
        const observer = new MutationObserver(() => {
          if (!document.body.contains(overlay)) {
            document.body.style.overflow = '';
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true });
      };
      
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
        // Image loaded successfully, ensure it's visible and apply size
        const target = img as HTMLImageElement;
        
        // data-size attribute'una göre max-width'i tekrar uygula
        const dataSize = target.getAttribute('data-size') || 'medium';
        const sizeMap: Record<string, string> = {
          'small': '40%',
          'medium': '60%',
          'large': '80%',
          'full': '100%'
        };
        const maxWidth = sizeMap[dataSize] || '60%';
        
        target.style.display = "block";
        target.style.objectFit = "contain";
        target.style.width = "auto";
        target.style.height = "auto";
        target.style.margin = "0 auto";
        target.style.cursor = "pointer";
        target.style.maxWidth = maxWidth; // data-size'a göre max-width ekle
      };

      img.addEventListener('click', handleClick);
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
        img.removeEventListener('click', () => {});
        img.removeEventListener('error', () => {});
        img.removeEventListener('load', () => {});
      });
    };
  }, [content]);

  // Determine which images to show
  // If skipPrimaryImage is true, don't include primary image in allImages
  const allImages = images && images.length > 0 
    ? images 
    : (skipPrimaryImage ? [] : (primaryImage || image ? [primaryImage || image] : []));

  const renderImages = () => {
    if (!allImages || allImages.length === 0) return null;
    
    // If skipPrimaryImage is true and display style is cover, don't render primary image
    if (skipPrimaryImage && imageDisplayStyle === "cover") return null;

    switch (imageDisplayStyle) {
      case "gallery":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {allImages.map((img, idx) => (
              <div key={idx} className="relative flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden min-h-[192px]">
                <img
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-auto max-w-full max-h-[300px] object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
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
          <div className="relative w-full flex items-center justify-center rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/5 to-accent/5 min-h-[400px]">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                className={`w-full h-auto max-w-full max-h-[600px] object-contain mx-auto transition-opacity duration-500 ${
                  idx === currentImageIndex ? "opacity-100 relative" : "opacity-0 absolute inset-0"
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
              <div key={idx} className="relative flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden min-h-[256px]">
                <img
                  src={img}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-auto max-w-full max-h-[500px] object-contain rounded-lg shadow-md"
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
          <div className="relative w-full flex items-center justify-center rounded-lg overflow-hidden mb-6 bg-gradient-to-br from-primary/5 to-accent/5 min-h-[400px]">
            <img
              src={allImages[0]}
              alt="Featured"
              className="w-full h-auto max-w-full max-h-[600px] object-contain"
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
        className="prose prose-lg max-w-none 
          prose-headings:text-neutral-heading prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
          prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-5 prose-h2:leading-tight
          prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4 prose-h3:leading-tight
          prose-p:text-neutral-body prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-neutral-heading prose-strong:font-semibold
          prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
          prose-li:mb-2 prose-li:text-neutral-body
          prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6 prose-img:h-auto"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Additional Images Gallery - Show at the end of content */}
      {mounted && images && images.length > 0 && (
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <h3 className="text-2xl font-bold text-neutral-heading mb-6">
            {isEnglish ? 'Additional Images' : 'Ek Görseller'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 aspect-square"
                onClick={() => {
                  // Create lightbox overlay
                  const overlay = document.createElement('div');
                  overlay.className = 'lightbox-overlay';
                  overlay.onclick = () => overlay.remove();
                  
                  const image = document.createElement('img');
                  image.src = img;
                  image.className = 'lightbox-image';
                  image.onclick = (e) => e.stopPropagation();
                  
                  const closeBtn = document.createElement('button');
                  closeBtn.className = 'lightbox-close';
                  closeBtn.innerHTML = '×';
                  closeBtn.onclick = () => overlay.remove();
                  
                  overlay.appendChild(image);
                  overlay.appendChild(closeBtn);
                  document.body.appendChild(overlay);
                  
                  // Prevent body scroll
                  document.body.style.overflow = 'hidden';
                  
                  // Cleanup on remove
                  const observer = new MutationObserver(() => {
                    if (!document.body.contains(overlay)) {
                      document.body.style.overflow = '';
                      observer.disconnect();
                    }
                  });
                  observer.observe(document.body, { childList: true });
                }}
              >
                <img
                  src={img}
                  alt={`Additional image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const container = target.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="flex items-center justify-center h-full text-neutral-body">
                          <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      `;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


