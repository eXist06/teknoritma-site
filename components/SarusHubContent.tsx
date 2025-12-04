"use client";

import { useState } from "react";

interface SarusHubContentProps {
  content: string;
  image?: string;
  video?: string;
}

export default function SarusHubContent({
  content,
  image,
  video,
}: SarusHubContentProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="space-y-6">
      {/* Featured Image */}
      {image && (
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
          <img
            src={image}
            alt="Featured"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Resim yüklenemedi:", image);
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Video */}
      {video && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
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


