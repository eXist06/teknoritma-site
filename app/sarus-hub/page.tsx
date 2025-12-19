"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SarusHubItem, SarusHubItemType } from "@/lib/types/sarus-hub";

const typeLabels: Record<SarusHubItemType, string> = {
  "case-study": "Vaka Çalışması",
  news: "Haber",
  insight: "İçgörü",
  event: "Etkinlik",
};

const typeColors: Record<SarusHubItemType, string> = {
  "case-study": "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  news: "bg-sky-500/10 text-sky-400 ring-sky-500/30",
  insight: "bg-violet-500/10 text-violet-400 ring-violet-500/30",
  event: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function SarusHubPage() {
  const [items, setItems] = useState<SarusHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "all" as "all" | SarusHubItemType,
    search: "",
    language: "all" as "tr" | "en" | "all",
  });

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type !== "all") params.append("type", filters.type);
      if (filters.search) params.append("search", filters.search);
      if (filters.language !== "all") params.append("language", filters.language);

      const response = await fetch(`/api/sarus-hub/content?${params.toString()}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const featured = items.find((item) => item.featured) || items[0];
  const others = items.filter((item) => item.id !== featured?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-body">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Hero */}
        <header className="mb-12">
          <p className="text-base md:text-lg font-semibold uppercase tracking-wider text-primary mb-4">
            Sarus-HUB
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-heading mb-6 leading-tight">
            Sağlık sistemlerinin nabzını tutan içerik merkezi
          </h1>
          <p className="text-xl md:text-2xl text-neutral-body max-w-3xl leading-relaxed">
            Mega hastane projeleri, go-live deneyimleri, klinik iş akışı içgörüleri ve
            etkinlik özetleri — Sarus ekosisteminin tamamı tek bir ekranda.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-10 flex flex-col sm:flex-row gap-4 bg-neutral-light/50 rounded-2xl p-4 border border-neutral-border">
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value as any })
            }
            className="px-5 py-3 border border-neutral-border rounded-lg bg-white font-medium text-neutral-heading focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Tüm İçerikler</option>
            <option value="case-study">Vaka Çalışması</option>
            <option value="news">Haber</option>
            <option value="insight">İçgörü</option>
            <option value="event">Etkinlik</option>
          </select>
          <input
            type="text"
            placeholder="Ara..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 min-w-[200px] px-5 py-3 border border-neutral-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Featured */}
        {featured && (
          <section className="mb-12 grid gap-6 md:grid-cols-[1.8fr,1.2fr]">
            <Link
              href={`/sarus-hub/${featured.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-neutral-border bg-white hover:shadow-xl transition-all"
            >
              <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                {featured.video ? (
                  <video
                    src={featured.video}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    muted
                    loop
                    playsInline
                    autoPlay
                    onError={(e) => {
                      console.error("Video yüklenemedi:", featured.video);
                      const target = e.target as HTMLVideoElement;
                      target.style.display = "none";
                    }}
                  />
                ) : featured.primaryImage || featured.image ? (
                  <img
                    src={featured.primaryImage || featured.image || ""}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.error("Görsel yüklenemedi:", featured.primaryImage || featured.image);
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
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-neutral-body">
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">Görsel bulunamadı</p>
                    </div>
                  </div>
                )}
                {(featured.primaryImage || featured.image || featured.video) && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {featured.video && (
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        🎥 Video
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center gap-3 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] ring-1 ${typeColors[featured.type]}`}
                  >
                    {typeLabels[featured.type]}
                  </span>
                  <span className="text-neutral-body">{formatDate(featured.publishedAt)}</span>
                  {featured.readingMinutes && (
                    <span className="text-neutral-body">• {featured.readingMinutes} dk okuma</span>
                  )}
                </div>
                <h2 className="mb-3 text-2xl md:text-3xl font-bold text-neutral-heading group-hover:text-primary transition-colors">
                  {featured.title}
                </h2>
                <p className="mb-4 text-neutral-body text-base leading-relaxed">{featured.summary}</p>
                <div className="mb-4 flex flex-wrap gap-2 text-[11px] text-neutral-body">
                  {featured.hospital && (
                    <span className="rounded-full bg-neutral-light px-3 py-1">
                      {featured.hospital}
                    </span>
                  )}
                  {featured.country && (
                    <span className="rounded-full bg-neutral-light px-3 py-1">
                      {featured.country}
                    </span>
                  )}
                  {featured.segment && (
                    <span className="rounded-full bg-neutral-light px-3 py-1">
                      {featured.segment}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                  Detayı gör
                  <span className="ml-1 text-xs">→</span>
                </span>
              </div>
            </Link>

            {/* Quick filters sidebar */}
            <aside className="space-y-4 rounded-2xl border border-neutral-border bg-neutral-light/50 p-4">
              <h3 className="text-sm font-semibold text-neutral-heading">Hızlı filtreler</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setFilters({ ...filters, type: "all" })}
                  className={`rounded-full px-3 py-1 ${
                    filters.type === "all"
                      ? "bg-primary text-white"
                      : "bg-white text-neutral-body hover:bg-neutral-border"
                  }`}
                >
                  Tüm içerikler
                </button>
                <button
                  onClick={() => setFilters({ ...filters, type: "case-study" })}
                  className={`rounded-full px-3 py-1 ${
                    filters.type === "case-study"
                      ? "bg-primary text-white"
                      : "bg-white text-neutral-body hover:bg-neutral-border"
                  }`}
                >
                  Mega hastaneler
                </button>
              </div>
              <div className="h-px bg-neutral-border" />
              <div className="space-y-3">
                {others.slice(0, 3).map((item) => (
                  <Link
                    href={`/sarus-hub/${item.slug}`}
                    key={item.id}
                    className="block rounded-lg p-2 hover:bg-white transition-colors"
                  >
                    <p className="text-[11px] text-neutral-body">
                      {typeLabels[item.type]} • {formatDate(item.publishedAt)}
                    </p>
                    <p className="text-sm text-neutral-heading line-clamp-2 font-medium">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </aside>
          </section>
        )}

        {/* Grid of other items */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-border pb-4">
            <h3 className="text-2xl font-bold text-neutral-heading">
              Tüm Sarus-HUB içerikleri
            </h3>
            <span className="text-sm text-neutral-body font-medium">{items.length} içerik</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <Link
                href={`/sarus-hub/${item.slug}`}
                key={item.id}
                className="group flex flex-col rounded-2xl border border-neutral-border bg-white overflow-hidden hover:border-primary hover:shadow-xl transition-all"
              >
                {(item.primaryImage || item.image || item.video) && (
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                    {item.video ? (
                      <video
                        src={item.video}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          console.error("Görsel yüklenemedi:", item.primaryImage || item.image);
                          const target = e.target as HTMLImageElement;
                          const container = target.parentElement;
                          if (container) {
                            target.style.display = "none";
                            // Show placeholder if not already shown
                            if (!container.querySelector('.image-placeholder')) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'image-placeholder absolute inset-0 flex items-center justify-center text-neutral-body';
                              placeholder.innerHTML = '<div class="text-center"><svg class="w-12 h-12 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs">Görsel yüklenemedi</p></div>';
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
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] ring-1 backdrop-blur-sm ${typeColors[item.type]}`}
                      >
                        {typeLabels[item.type]}
                      </span>
                    </div>
                    {item.video && (
                      <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-0.5 rounded text-[10px]">
                        🎥
                      </div>
                    )}
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  {!(item.primaryImage || item.image || item.video) && (
                    <div className="mb-3 flex items-center justify-between text-[11px] text-neutral-body">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ring-1 ${typeColors[item.type]}`}
                      >
                        {typeLabels[item.type]}
                      </span>
                      <span>{item.publishedAt ? formatDate(item.publishedAt) : ""}</span>
                    </div>
                  )}
                  {(item.primaryImage || item.image || item.video) && (
                    <div className="mb-2 text-[11px] text-neutral-body">
                      {item.publishedAt ? formatDate(item.publishedAt) : ""}
                    </div>
                  )}
                  <h4 className="mb-2 line-clamp-2 text-base font-bold text-neutral-heading group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="mb-4 line-clamp-3 text-sm text-neutral-body leading-relaxed">{item.summary}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 text-[10px] text-neutral-body">
                    {item.hospital && (
                      <span className="rounded-full bg-neutral-light px-2.5 py-1">
                        {item.hospital}
                      </span>
                    )}
                    {item.country && (
                      <span className="rounded-full bg-neutral-light px-2.5 py-1">
                        {item.country}
                      </span>
                    )}
                    {item.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-neutral-light px-2.5 py-1 text-neutral-body"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-center py-12 text-neutral-body">
              İçerik bulunamadı.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}


