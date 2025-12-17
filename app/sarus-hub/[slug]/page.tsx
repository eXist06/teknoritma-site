import { Metadata } from "next";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { SarusHubItem, SarusHubItemType } from "@/lib/types/sarus-hub";
import SarusHubContent from "@/components/SarusHubContent";
import SocialShareButtons from "@/components/SocialShareButtons";
import ViewCounter from "@/components/ViewCounter";
import { verifySarusHubRole } from "@/lib/utils/role-verification";

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
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  // Dynamic import to avoid bundling better-sqlite3 in client
  const { getAllItems } = await import("@/lib/db/sarus-hub");
  const { initializeDatabase } = await import("@/lib/db/schema");
  initializeDatabase();
  const items = getAllItems({}, false); // Only published items
  return items.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  // Dynamic import to avoid bundling better-sqlite3 in client
  const { getItemBySlug } = await import("@/lib/db/sarus-hub");
  const { initializeDatabase } = await import("@/lib/db/schema");
  initializeDatabase();
  
  const { slug } = await params;
  const item = getItemBySlug(slug);
  
  if (!item || item.status !== "published") {
    return {
      title: "İçerik Bulunamadı",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://teknoritma.com.tr";
  const url = `${siteUrl}/sarus-hub/${item.slug}`;
  const image = item.primaryImage || item.image ? `${siteUrl}${item.primaryImage || item.image}` : undefined;

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      url,
      siteName: "Sarus-HUB",
      images: image ? [{ url: image }] : [],
      locale: "tr_TR",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
      images: image ? [image] : [],
    },
  };
}

export default async function SarusHubDetailPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  // Dynamic import to avoid bundling better-sqlite3 in client
  const { getItemBySlug } = await import("@/lib/db/sarus-hub");
  const { initializeDatabase } = await import("@/lib/db/schema");
  initializeDatabase();
  
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams?.preview === "true";
  
  // If preview mode, verify admin/sarus-hub role
  if (isPreview) {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    
    if (!token) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-heading mb-4">Yetkisiz Erişim</h1>
            <p className="text-neutral-body mb-4">Önizleme modu için admin girişi gereklidir.</p>
            <Link href="/admin/login" className="text-primary hover:underline">
              Admin paneline giriş yap
            </Link>
          </div>
        </div>
      );
    }

    // Create a request object for verification using headers
    const headers = new Headers();
    headers.set("cookie", `admin_token=${token}`);
    const mockRequest = new NextRequest("http://localhost/api/admin/auth/me", {
      headers,
    });

    const authCheck = await verifySarusHubRole(mockRequest);
    if (!authCheck.isAuthorized) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-heading mb-4">Yetkisiz Erişim</h1>
            <p className="text-neutral-body mb-4">Önizleme modu için admin veya sarus-hub rolü gereklidir.</p>
            <Link href="/admin/login" className="text-primary hover:underline">
              Admin paneline giriş yap
            </Link>
          </div>
        </div>
      );
    }
  }
  
  // Get item from database
  const item = getItemBySlug(slug);
  
  // Check if item exists
  if (!item) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-heading mb-4">İçerik Bulunamadı</h1>
          {isPreview && (
            <p className="text-sm text-neutral-body mb-4">
              Bu slug ile bir içerik bulunamadı. Lütfen admin panelinden kontrol edin.
            </p>
          )}
          <Link href={isPreview ? "/admin/sarus-hub" : "/sarus-hub"} className="text-primary hover:underline">
            {isPreview ? "Admin paneline dön" : "Sarus-HUB'a dön"}
          </Link>
        </div>
      </div>
    );
  }

  // For preview mode, allow draft content. Otherwise, only show published.
  if (!isPreview && item.status !== "published") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-heading mb-4">İçerik Bulunamadı</h1>
          <p className="text-neutral-body mb-4">Bu içerik henüz yayınlanmamış.</p>
          <Link href="/sarus-hub" className="text-primary hover:underline">
            Sarus-HUB'a dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isPreview && item.status === "draft" && (
        <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-3 text-center">
          <p className="text-sm text-yellow-800">
            ⚠️ Bu bir önizleme. İçerik henüz yayınlanmamış.
          </p>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Back link */}
        <Link
          href={isPreview ? "/admin/sarus-hub" : "/sarus-hub"}
          className="inline-flex items-center text-sm text-neutral-body hover:text-primary mb-8"
        >
          ← {isPreview ? "Admin paneline dön" : "Sarus-HUB'a dön"}
        </Link>

        {/* Header */}
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-3 text-sm">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ring-1 ${typeColors[item.type]}`}
            >
              {typeLabels[item.type]}
            </span>
            <span className="text-neutral-body">{item.publishedAt ? formatDate(item.publishedAt) : ""}</span>
            {item.readingMinutes && (
              <span className="text-neutral-body">• {item.readingMinutes} dk okuma</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-heading mb-4">
            {item.title}
          </h1>
          <p className="text-lg text-neutral-body mb-6">{item.summary}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-2 mb-6 text-sm text-neutral-body">
            {item.hospital && (
              <span className="rounded-full bg-neutral-light px-3 py-1">
                🏥 {item.hospital}
              </span>
            )}
            {item.country && (
              <span className="rounded-full bg-neutral-light px-3 py-1">
                🌍 {item.country}
              </span>
            )}
            {item.segment && (
              <span className="rounded-full bg-neutral-light px-3 py-1">
                {item.segment}
              </span>
            )}
            {item.author && (
              <span className="rounded-full bg-neutral-light px-3 py-1">
                ✍️ {item.author}
              </span>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 text-primary px-3 py-1 text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social share */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <SocialShareButtons
              url={`/sarus-hub/${item.slug}`}
              title={item.title}
              summary={item.summary}
            />
            <ViewCounter slug={item.slug} initialCount={item.viewCount || 0} />
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <SarusHubContent
            content={item.content}
            image={item.image}
            primaryImage={item.primaryImage}
            images={item.images}
            imageDisplayStyle={item.imageDisplayStyle}
            video={item.video}
          />
        </article>
      </div>
    </div>
  );
}


