export type SarusHubItemType = 'case-study' | 'news' | 'insight' | 'event';

export type SarusHubItemStatus = 'draft' | 'published';

export type SarusHubItemLanguage = 'tr' | 'en' | 'mixed';
export type ImageDisplayStyle = 'cover' | 'gallery' | 'carousel' | 'grid';

export interface SarusHubItem {
  id: string;
  type: SarusHubItemType;
  title: string;
  slug: string;
  summary: string;
  content: string; // Rich text HTML content
  hospital?: string;
  country?: string;
  segment?: string; // Public Hospital, City Hospital, Private Group, etc.
  tags: string[]; // HIS, PACS, LIS, AI, City Hospital, Private Group, etc.
  publishedAt: string; // ISO string
  featured?: boolean;
  readingMinutes?: number;
  status: SarusHubItemStatus;
  author?: string;
  image?: string; // Primary/Featured Image URL (deprecated, use primaryImage)
  primaryImage?: string; // Primary/Featured Image URL for card preview
  images?: string[]; // Multiple images array
  imageDisplayStyle?: ImageDisplayStyle; // How to display multiple images
  video?: string; // Video URL
  language: SarusHubItemLanguage;
  translationId?: string; // ID of the original item if this is a translation
  translationGroupId?: string; // Group ID to link all translations together
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  viewCount?: number; // View statistics
}

export interface SarusHubFilters {
  type?: SarusHubItemType;
  tags?: string[];
  segment?: string;
  country?: string;
  year?: number;
  search?: string;
  language?: 'tr' | 'en' | 'all';
}




