import Database from "better-sqlite3";
import { getDatabase } from "./schema";
import { SarusHubItem, SarusHubFilters } from "@/lib/types/sarus-hub";

export function getAllItems(filters?: SarusHubFilters, includeDrafts: boolean = false): SarusHubItem[] {
  const db = getDatabase();
  
  let query = "SELECT * FROM sarus_hub_items WHERE 1=1";
  const params: any[] = [];

  if (!includeDrafts) {
    query += " AND status = 'published'";
  }

  if (filters?.type) {
    query += " AND type = ?";
    params.push(filters.type);
  }

  if (filters?.segment) {
    query += " AND segment = ?";
    params.push(filters.segment);
  }

  if (filters?.country) {
    query += " AND country = ?";
    params.push(filters.country);
  }

  if (filters?.year) {
    query += " AND strftime('%Y', published_at) = ?";
    params.push(filters.year.toString());
  }

  if (filters?.language && filters.language !== "all") {
    query += " AND (language = ? OR language = 'mixed')";
    params.push(filters.language);
  }

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    query += " AND (LOWER(title) LIKE ? OR LOWER(summary) LIKE ? OR LOWER(content) LIKE ?)";
    const searchPattern = `%${searchLower}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  if (filters?.tags && filters.tags.length > 0) {
    // For tags, we need to check if any tag exists in the JSON array
    // SQLite doesn't have native JSON support in older versions, so we use LIKE
    const tagConditions = filters.tags.map(() => "tags LIKE ?").join(" OR ");
    query += ` AND (${tagConditions})`;
    filters.tags.forEach(tag => {
      params.push(`%"${tag}"%`);
    });
  }

  query += " ORDER BY published_at DESC, created_at DESC";

  const rows = db.prepare(query).all(...params) as any[];
  db.close();

  return rows.map(row => {
    const primaryImage = row.primary_image || row.image || undefined;
    const images = JSON.parse(row.images || '[]');
    // If primaryImage exists and not in images array, add it
    const allImages = primaryImage && !images.includes(primaryImage) 
      ? [primaryImage, ...images] 
      : images.length > 0 ? images : (primaryImage ? [primaryImage] : []);
    
    return {
      id: row.id,
      type: row.type as SarusHubItem['type'],
      title: row.title,
      slug: row.slug,
      summary: row.summary,
      content: row.content,
      hospital: row.hospital || undefined,
      country: row.country || undefined,
      segment: row.segment || undefined,
      tags: JSON.parse(row.tags || '[]'),
      publishedAt: row.published_at || undefined,
      featured: row.featured === 1,
      readingMinutes: row.reading_minutes || undefined,
      status: row.status as SarusHubItem['status'],
      author: row.author || undefined,
      image: row.image || undefined, // Legacy
      primaryImage,
      images: allImages.length > 0 ? allImages : undefined,
      imageDisplayStyle: (row.image_display_style || 'cover') as SarusHubItem['imageDisplayStyle'],
      video: row.video || undefined,
      language: row.language as SarusHubItem['language'],
      viewCount: row.view_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });
}

export function getItemById(id: string): SarusHubItem | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM sarus_hub_items WHERE id = ?").get(id) as any;
  db.close();

  if (!row) return null;

  const primaryImage = row.primary_image || row.image || undefined;
  const images = JSON.parse(row.images || '[]');
  const allImages = primaryImage && !images.includes(primaryImage) 
    ? [primaryImage, ...images] 
    : images.length > 0 ? images : (primaryImage ? [primaryImage] : []);

  return {
    id: row.id,
    type: row.type as SarusHubItem['type'],
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    hospital: row.hospital || undefined,
    country: row.country || undefined,
    segment: row.segment || undefined,
    tags: JSON.parse(row.tags || '[]'),
    publishedAt: row.published_at || undefined,
    featured: row.featured === 1,
    readingMinutes: row.reading_minutes || undefined,
    status: row.status as SarusHubItem['status'],
    author: row.author || undefined,
    image: row.image || undefined, // Legacy
    primaryImage,
    images: allImages.length > 0 ? allImages : undefined,
    imageDisplayStyle: (row.image_display_style || 'cover') as SarusHubItem['imageDisplayStyle'],
    video: row.video || undefined,
    language: row.language as SarusHubItem['language'],
    viewCount: row.view_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getItemBySlug(slug: string): SarusHubItem | null {
  const db = getDatabase();
  const row = db.prepare("SELECT * FROM sarus_hub_items WHERE slug = ?").get(slug) as any;
  db.close();

  if (!row) return null;

  const primaryImage = row.primary_image || row.image || undefined;
  const images = JSON.parse(row.images || '[]');
  const allImages = primaryImage && !images.includes(primaryImage) 
    ? [primaryImage, ...images] 
    : images.length > 0 ? images : (primaryImage ? [primaryImage] : []);

  return {
    id: row.id,
    type: row.type as SarusHubItem['type'],
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    content: row.content,
    hospital: row.hospital || undefined,
    country: row.country || undefined,
    segment: row.segment || undefined,
    tags: JSON.parse(row.tags || '[]'),
    publishedAt: row.published_at || undefined,
    featured: row.featured === 1,
    readingMinutes: row.reading_minutes || undefined,
    status: row.status as SarusHubItem['status'],
    author: row.author || undefined,
    image: row.image || undefined, // Legacy
    primaryImage,
    images: allImages.length > 0 ? allImages : undefined,
    imageDisplayStyle: (row.image_display_style || 'cover') as SarusHubItem['imageDisplayStyle'],
    video: row.video || undefined,
    language: row.language as SarusHubItem['language'],
    viewCount: row.view_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createItem(item: Omit<SarusHubItem, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { id?: string; publishedAt?: string }): SarusHubItem {
  const db = getDatabase();
  const now = new Date().toISOString();
  const id = item.id || Date.now().toString();

  // Determine primary image and images array
  const primaryImage = item.primaryImage || item.image || null;
  const imagesArray = item.images || [];
  // Remove primary image from images array if it's there
  const filteredImages = imagesArray.filter(img => img !== primaryImage);
  
  db.prepare(`
    INSERT INTO sarus_hub_items (
      id, type, title, slug, summary, content, hospital, country, segment,
      tags, published_at, featured, reading_minutes, status, author, 
      image, primary_image, images, image_display_style, video,
      language, view_count, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    item.type,
    item.title,
    item.slug,
    item.summary,
    item.content,
    item.hospital || null,
    item.country || null,
    item.segment || null,
    JSON.stringify(item.tags || []),
    item.publishedAt || null,
    item.featured ? 1 : 0,
    item.readingMinutes || null,
    item.status,
    item.author || null,
    item.image || null, // Legacy
    primaryImage,
    JSON.stringify(filteredImages),
    item.imageDisplayStyle || 'cover',
    item.video || null,
    item.language,
    item.viewCount || 0,
    now,
    now
  );

  db.close();
  return getItemById(id)!;
}

export function updateItem(id: string, updates: Partial<SarusHubItem>): SarusHubItem {
  const db = getDatabase();
  const existing = getItemById(id);
  
  if (!existing) {
    db.close();
    throw new Error("Item not found");
  }

  const updated: SarusHubItem = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Handle publishedAt: set if status changes to published and not already set
  if (updates.status === "published" && !existing.publishedAt) {
    updated.publishedAt = new Date().toISOString();
  } else if (updates.publishedAt !== undefined) {
    updated.publishedAt = updates.publishedAt;
  } else {
    updated.publishedAt = existing.publishedAt;
  }

  // Determine primary image and images array
  const primaryImage = updated.primaryImage || updated.image || null;
  const imagesArray = updated.images || [];
  const filteredImages = imagesArray.filter(img => img !== primaryImage);
  
  db.prepare(`
    UPDATE sarus_hub_items SET
      type = ?, title = ?, slug = ?, summary = ?, content = ?,
      hospital = ?, country = ?, segment = ?, tags = ?,
      published_at = ?, featured = ?, reading_minutes = ?,
      status = ?, author = ?, image = ?, primary_image = ?, 
      images = ?, image_display_style = ?, video = ?,
      language = ?, updated_at = ?
    WHERE id = ?
  `).run(
    updated.type,
    updated.title,
    updated.slug,
    updated.summary,
    updated.content,
    updated.hospital || null,
    updated.country || null,
    updated.segment || null,
    JSON.stringify(updated.tags || []),
    updated.publishedAt || null,
    updated.featured ? 1 : 0,
    updated.readingMinutes || null,
    updated.status,
    updated.author || null,
    updated.image || null, // Legacy
    primaryImage,
    JSON.stringify(filteredImages),
    updated.imageDisplayStyle || 'cover',
    updated.video || null,
    updated.language,
    updated.updatedAt,
    id
  );

  db.close();
  return getItemById(id)!;
}

export function deleteItem(id: string): boolean {
  const db = getDatabase();
  const result = db.prepare("DELETE FROM sarus_hub_items WHERE id = ?").run(id);
  db.close();
  return result.changes > 0;
}

export function incrementViewCount(slug: string): number {
  const db = getDatabase();
  const result = db.prepare(`
    UPDATE sarus_hub_items 
    SET view_count = view_count + 1 
    WHERE slug = ?
  `).run(slug);

  if (result.changes === 0) {
    db.close();
    throw new Error("Item not found");
  }

  const row = db.prepare("SELECT view_count FROM sarus_hub_items WHERE slug = ?").get(slug) as any;
  db.close();
  return row.view_count;
}
