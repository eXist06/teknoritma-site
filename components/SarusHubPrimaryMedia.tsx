"use client";

import { usePathname } from "next/navigation";

interface SarusHubPrimaryMediaProps {
  image?: string;
  video?: string;
  title: string;
}

export default function SarusHubPrimaryMedia({
  image,
  video,
  title,
}: SarusHubPrimaryMediaProps) {
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  
  const videoNotSupportedText = isEnglish 
    ? "Your browser does not support the video tag."
    : "Tarayıcınız video etiketini desteklemiyor.";
  
  const imageErrorText = isEnglish
    ? "Image failed to load"
    : "Görsel yüklenemedi";

  if (video) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
        <video
          controls
          className="w-full h-full object-contain bg-black"
          src={video}
          preload="metadata"
        >
          <source src={video} type="video/mp4" />
          <source src={video} type="video/webm" />
          <source src={video} type="video/quicktime" />
          {videoNotSupportedText}
        </video>
      </div>
    );
  }

  if (!image) return null;

  return (
    <div className="relative w-full flex items-center justify-center rounded-lg overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 min-h-[400px]">
      <img
        src={image}
        alt={title}
        className="w-full h-auto max-w-full max-h-[600px] object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          const container = target.parentElement;
          if (container) {
            target.style.display = "none";
            if (!container.querySelector('.image-placeholder')) {
              const placeholder = document.createElement('div');
              placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body';
              placeholder.innerHTML = `<div class="text-center"><svg class="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-sm">${imageErrorText}</p></div>`;
              container.appendChild(placeholder);
            }
          }
        }}
        onLoad={(e) => {
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

