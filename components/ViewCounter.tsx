"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface ViewCounterProps {
  slug: string;
  initialCount: number;
}

export default function ViewCounter({ slug, initialCount }: ViewCounterProps) {
  const [viewCount, setViewCount] = useState(initialCount);
  const [hasIncremented, setHasIncremented] = useState(false);
  const pathname = usePathname();
  const isEnglish = pathname?.startsWith("/en");
  const label = isEnglish ? "views" : "görüntülenme";
  const locale = isEnglish ? "en-US" : "tr-TR";

  useEffect(() => {
    // Only increment once per page load
    if (!hasIncremented) {
      fetch("/api/sarus-hub/view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.viewCount) {
            setViewCount(data.viewCount);
            setHasIncremented(true);
          }
        })
        .catch((error) => {
          console.error("Failed to increment view count:", error);
        });
    }
  }, [slug, hasIncremented]);

  return (
    <div className="flex items-center gap-2 text-sm text-neutral-body">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span>{viewCount.toLocaleString(locale)} {label}</span>
    </div>
  );
}




