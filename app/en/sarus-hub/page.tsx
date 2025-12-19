"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SarusHubItem, SarusHubItemType } from "@/lib/types/sarus-hub";
import SarusHubHero from "@/components/SarusHubHero";

const typeLabels: Record<SarusHubItemType, string> = {
  "case-study": "Case Study",
  news: "News",
  insight: "Insight",
  event: "Event",
};

const typeColors: Record<SarusHubItemType, string> = {
  "case-study": "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  news: "bg-sky-500/10 text-sky-400 ring-sky-500/30",
  insight: "bg-violet-500/10 text-violet-400 ring-violet-500/30",
  event: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function SarusHubPageEN() {
  const [items, setItems] = useState<SarusHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all" as "all" | SarusHubItemType,
    search: "",
    language: "all" as "tr" | "en" | "all", // Show all, but filter to en/mixed on frontend
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type !== "all") params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);
      // Always filter for English content on English page
      params.append("language", "en");

      const response = await fetch(`/api/sarus-hub/content?${params.toString()}`);
      const data = await response.json();
      
      // Additional filter to ensure only English and mixed language items are shown
      const filteredItems = (data.items || []).filter(
        (item: SarusHubItem) => item.language === "en" || item.language === "mixed"
      );
      
      setItems(filteredItems);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const featured = items.find((item) => item.featured);
  const allItems = featured ? items.filter((item) => item.id !== featured.id) : items;

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Featured or Default */}
      <SarusHubHero featured={featured} language="en" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
        {/* Grid of all items */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-border pb-4">
            <h3 className="text-2xl font-bold text-neutral-heading">
              Published Content <span className="text-lg font-normal text-neutral-body">- {allItems.length} items</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value as any })
                }
                className="px-4 py-2 border border-neutral-border rounded-lg bg-white font-medium text-neutral-heading text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Content</option>
                <option value="case-study">Case Study</option>
                <option value="news">News</option>
                <option value="insight">Insight</option>
                <option value="event">Event</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="flex-1 sm:min-w-[200px] px-4 py-2 border border-neutral-border rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allItems.map((item) => (
              <Link
                href={`/en/sarus-hub/${item.slug}`}
                key={item.id}
                className="group flex flex-col rounded-2xl border border-neutral-border bg-white overflow-hidden hover:border-primary hover:shadow-xl transition-all"
              >
                {(item.primaryImage || item.image || item.video) && (
                  <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    {item.video ? (
                      <video
                        src={item.video}
                        className="w-full h-full object-contain max-w-full max-h-full"
                        muted
                        loop
                        playsInline
                        autoPlay
                        onError={(e) => {
                          console.error("Video yüklenemedi:", item.video);
                          const target = e.target as HTMLVideoElement;
                          target.style.display = "none";
                        }}
                      />
                    ) : (
                      <img
                        src={item.primaryImage || item.image}
                      alt={item.title}
                        className="w-full h-full object-contain max-w-full max-h-full"
                        onError={(e) => {
                          console.error("Görsel yüklenemedi:", item.primaryImage || item.image);
                          const target = e.target as HTMLImageElement;
                          const container = target.parentElement;
                          if (container) {
                            target.style.display = "none";
                            if (!container.querySelector('.image-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body bg-gradient-to-br from-primary/5 to-accent/5';
                              placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs">Image failed to load</p></div>';
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
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 backdrop-blur-sm bg-white ${typeColors[item.type]}`}
                      >
                        {typeLabels[item.type]}
                      </span>
                    </div>
                    {item.video && (
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-[10px] font-medium">
                        🎥 Video
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col flex-1 p-6">
                  {!(item.primaryImage || item.image || item.video) && (
                    <div className="mb-3 flex items-center justify-between text-xs text-neutral-body">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ring-1 ${typeColors[item.type]}`}
                      >
                        {typeLabels[item.type]}
                      </span>
                      <span>{item.publishedAt ? formatDate(item.publishedAt) : ""}</span>
                    </div>
                  )}
                  {(item.primaryImage || item.image || item.video) && (
                    <div className="mb-3 text-xs text-neutral-body">
                      {item.publishedAt ? formatDate(item.publishedAt) : ""}
                    </div>
                  )}
                  <h4 className="mb-3 line-clamp-2 text-lg font-bold text-neutral-heading group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="mb-4 line-clamp-3 text-sm text-neutral-body leading-relaxed">{item.summary}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                      View details
                      <span className="ml-1 text-xs">→</span>
                      </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {allItems.length === 0 && (
            <div className="text-center py-12 text-neutral-body">
              No content found.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


