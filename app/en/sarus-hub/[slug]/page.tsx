import { Metadata } from "next";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { SarusHubItem, SarusHubItemType } from "@/lib/types/sarus-hub";
import SarusHubContent from "@/components/SarusHubContent";
import SarusHubPrimaryMedia from "@/components/SarusHubPrimaryMedia";
import SarusHubHero from "@/components/SarusHubHero";
import SocialShareButtons from "@/components/SocialShareButtons";
import ViewCounter from "@/components/ViewCounter";
import { verifySarusHubRole } from "@/lib/utils/role-verification";

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
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  // Dynamic import to avoid bundling better-sqlite3 in client
  const { getAllItems } = await import("@/lib/db/sarus-hub");
  const { initializeDatabase } = await import("@/lib/db/schema");
  initializeDatabase();
  // Only get English and mixed language items for English pages
  const items = getAllItems({ language: "en" }, false); // Only published items
  return items
    .filter((item) => item.language === "en" || item.language === "mixed")
    .map((item) => ({
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
  
  if (!item || item.status !== "published" || (item.language !== "en" && item.language !== "mixed")) {
    return {
      title: "Content Not Found",
    };
  }

  const { SITE_URL } = await import("@/lib/config");
  const url = `${SITE_URL}/en/sarus-hub/${item.slug}`;
  const image = item.primaryImage || item.image ? `${SITE_URL}${item.primaryImage || item.image}` : undefined;

  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: item.title,
      description: item.summary,
      url,
      siteName: "Sarus-HUB",
      images: image ? [{ url: image }] : [],
      locale: "en_US",
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

export default async function SarusHubDetailPageEN({ 
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
            <h1 className="text-2xl font-bold text-neutral-heading mb-4">Unauthorized Access</h1>
            <p className="text-neutral-body mb-4">Admin login is required for preview mode.</p>
            <Link href="/en/admin/login" className="text-primary hover:underline">
              Login to Admin Panel
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
            <h1 className="text-2xl font-bold text-neutral-heading mb-4">Unauthorized Access</h1>
            <p className="text-neutral-body mb-4">Admin or sarus-hub role is required for preview mode.</p>
            <Link href="/en/admin/login" className="text-primary hover:underline">
              Login to Admin Panel
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
          <h1 className="text-2xl font-bold text-neutral-heading mb-4">Content Not Found</h1>
          {isPreview && (
            <p className="text-sm text-neutral-body mb-4">
              No content found with this slug. Please check from admin panel.
            </p>
          )}
          <Link href={isPreview ? "/en/admin/sarus-hub" : "/en/sarus-hub"} className="text-primary hover:underline">
            {isPreview ? "Back to Admin Panel" : "Back to Sarus-HUB"}
          </Link>
        </div>
      </div>
    );
  }

  // Check language - English page should only show English or mixed content
  if (!isPreview && item.language !== "en" && item.language !== "mixed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-heading mb-4">Content Not Found</h1>
          <p className="text-neutral-body mb-4">This content is not available in English.</p>
          <Link href="/en/sarus-hub" className="text-primary hover:underline">
            Back to Sarus-HUB
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
          <h1 className="text-2xl font-bold text-neutral-heading mb-4">Content Not Found</h1>
          <p className="text-neutral-body mb-4">This content has not been published yet.</p>
          <Link href="/en/sarus-hub" className="text-primary hover:underline">
            Back to Sarus-HUB
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
            ⚠️ This is a preview. Content has not been published yet.
          </p>
        </div>
      )}
      {/* Hero Section */}
      <SarusHubHero language="en" showLink={false} />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Back link */}
        <Link
          href={isPreview ? "/en/admin/sarus-hub" : "/en/sarus-hub"}
          className="inline-flex items-center text-sm text-neutral-body hover:text-primary mb-6"
        >
          ← {isPreview ? "Back to Admin Panel" : "Back to Sarus-HUB"}
        </Link>

        {/* Primary Image/Video - Always at the top */}
        <div className="mb-6">
          <SarusHubPrimaryMedia
            image={item.primaryImage || item.image}
            video={item.video}
            title={item.title}
          />
        </div>

        {/* Article Header - New Layout */}
        <header className="mb-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-heading mb-5 leading-tight tracking-tight">
            {item.title}
          </h1>

          {/* Date + Content Type + View Count + Social Share (Single Line) */}
          <div className="flex items-center justify-between gap-4 mb-6 text-sm">
            <div className="flex items-center gap-4">
              <span className="text-neutral-600">{item.publishedAt ? formatDate(item.publishedAt) : ""}</span>
              <span className="text-neutral-400">•</span>
            <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${typeColors[item.type]}`}
            >
              {typeLabels[item.type]}
            </span>
            {item.readingMinutes && (
                <>
                  <span className="text-neutral-400">•</span>
                  <span className="text-neutral-600">{item.readingMinutes} min read</span>
                </>
            )}
              {!isPreview && (
                <>
                  <span className="text-neutral-400">•</span>
                  <ViewCounter slug={item.slug} initialCount={item.viewCount || 0} />
                </>
              )}
            </div>
            {/* Social Share Icons (Right aligned / Horizontal) */}
            <div className="flex items-center">
              <SocialShareButtons
                url={`/en/sarus-hub/${item.slug}`}
                title={item.title}
                summary={item.summary}
              />
            </div>
          </div>

          {/* Lead Paragraph (Summary) */}
          <p className="text-lg md:text-xl text-neutral-700 mb-8 leading-relaxed max-w-3xl">
            {item.summary}
          </p>

          {/* Meta Information - Enterprise Style */}
          {(item.hospital || item.country || item.segment) && (
            <div className="border-t border-neutral-200 pt-6 mb-8">
              <div className="flex flex-wrap gap-4 text-sm">
            {item.hospital && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">🏥</span>
                    <span className="text-neutral-700 font-medium">{item.hospital}</span>
                  </div>
            )}
            {item.country && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">🌍</span>
                    <span className="text-neutral-700 font-medium">{item.country}</span>
                  </div>
            )}
            {item.segment && (
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">📊</span>
                    <span className="text-neutral-700 font-medium">{item.segment}</span>
                  </div>
            )}
          </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none mb-8">
          <SarusHubContent
            content={item.content}
            image={undefined}
            primaryImage={item.primaryImage || item.image}
            images={item.images ? item.images.filter(img => {
              // Filter out primary image from additional images
              const primaryImg = item.primaryImage || item.image;
              return primaryImg ? img !== primaryImg : true;
            }) : []}
            imageDisplayStyle={item.imageDisplayStyle}
            video={undefined}
            skipPrimaryImage={true}
          />
        </article>

        {/* Tags - At the bottom */}
          {item.tags.length > 0 && (
          <div className="border-t border-neutral-200 pt-8">
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 border border-neutral-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


