export type SarusHubItemType = 'case-study' | 'news' | 'insight' | 'event';

export type SarusHubItemStatus = 'draft' | 'published';

export type SarusHubItemLanguage = 'tr' | 'en' | 'mixed';

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
  image?: string; // Image URL
  video?: string; // Video URL
  language: SarusHubItemLanguage;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
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


