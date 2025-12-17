"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SarusHubItem, SarusHubItemType } from "@/lib/types/sarus-hub";

const typeLabels: Record<SarusHubItemType, string> = {
  "case-study": "Vaka Çalışması",
  news: "Haber",
  insight: "İçgörü",
  event: "Etkinlik",
};

const statusLabels: Record<"draft" | "published", string> = {
  draft: "Taslak",
  published: "Yayında",
};

export default function AdminSarusHubPage() {
  const router = useRouter();
  const [items, setItems] = useState<SarusHubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<"all" | SarusHubItemType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/sarus-hub/content");
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu içeriği silmek istediğinize emin misiniz?")) return;

    try {
      const response = await fetch(`/api/sarus-hub/content?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchItems();
      } else {
        alert("Silme işlemi başarısız oldu");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Silme işlemi başarısız oldu");
    }
  };

  const filtered = items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      (item.hospital ?? "").toLowerCase().includes(q)
    );
  });

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
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-heading">
              Sarus-HUB İçerik Yönetimi
            </h1>
            <p className="mt-1 text-sm text-neutral-body">
              Vaka çalışmaları, haberler, içgörüler ve etkinlikleri yönetin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/sarus-hub/new")}
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            + Yeni içerik
          </button>
        </header>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-neutral-border bg-neutral-light/50 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2 text-xs">
            {(["all", "case-study", "news", "insight", "event"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`rounded-full px-3 py-1 ${
                  typeFilter === t
                    ? "bg-primary text-white"
                    : "bg-white text-neutral-body hover:bg-neutral-border"
                }`}
              >
                {t === "all" ? "Tümü" : typeLabels[t]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="rounded-full border border-neutral-border bg-white px-3 py-1 text-sm"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
            </select>
            <input
              type="text"
              placeholder="Başlık, tag veya hastane ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-neutral-border bg-white px-3 py-1.5 text-sm placeholder:text-neutral-body focus:border-primary focus:outline-none md:w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-neutral-light text-xs uppercase text-neutral-body">
              <tr>
                <th className="px-4 py-3">Başlık</th>
                <th className="px-4 py-3">Tür</th>
                <th className="px-4 py-3">Hastane / Segment</th>
                <th className="px-4 py-3">Ülke</th>
                <th className="px-4 py-3">Durum</th>
                <th className="px-4 py-3">Yayın Tarihi</th>
                <th className="px-4 py-3">Görüntülenme</th>
                <th className="px-4 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-neutral-border odd:bg-white even:bg-neutral-light/30"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-neutral-heading">
                        {item.title}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-neutral-body">
                        {item.summary}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-neutral-body">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-neutral-light px-2 py-0.5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-neutral-heading">
                    {typeLabels[item.type]}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-neutral-heading">
                    {item.hospital ?? "—"}
                    {item.segment && (
                      <div className="text-[10px] text-neutral-body">{item.segment}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-neutral-heading">
                    {item.country ?? "—"}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                        item.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {statusLabels[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-neutral-heading">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("tr-TR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 align-top text-xs text-neutral-heading">
                    {item.viewCount !== undefined ? (
                      <span className="inline-flex items-center gap-1">
                        👁️ {item.viewCount.toLocaleString("tr-TR")}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-right text-xs">
                    <div className="flex justify-end gap-2">
                      <a
                        href={`/sarus-hub/${item.slug}?preview=true`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-green-500/10 text-green-600 px-3 py-1 hover:bg-green-500/20"
                        title="Önizle"
                      >
                        👁️
                      </a>
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/sarus-hub/${item.id}`)}
                        className="rounded-full bg-primary/10 text-primary px-3 py-1 hover:bg-primary/20"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="rounded-full bg-red-500/10 text-red-600 px-3 py-1 hover:bg-red-500/20"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm text-neutral-body">
                    Filtrelere uygun içerik bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

