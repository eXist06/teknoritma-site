/**
 * Utility functions for translating Sarus Hub content
 */

/**
 * Generate a slug for the English translation
 * Adds '-en' suffix to the original slug if it doesn't already have it
 */
export function generateTranslationSlug(originalSlug: string, targetLanguage: 'en' | 'tr'): string {
  if (targetLanguage === 'en') {
    // If slug already ends with -en, return as is
    if (originalSlug.endsWith('-en')) {
      return originalSlug;
    }
    // Add -en suffix
    return `${originalSlug}-en`;
  } else {
    // For Turkish, remove -en suffix if present
    return originalSlug.replace(/-en$/, '');
  }
}

/**
 * Generate placeholder English content from Turkish content
 * This creates a draft that can be manually translated
 */
export function generatePlaceholderTranslation(
  title: string,
  summary: string,
  content: string
): { title: string; summary: string; content: string } {
  return {
    title: `[TRANSLATE] ${title}`,
    summary: `[TRANSLATE] ${summary}`,
    content: `<p><strong>[TRANSLATE]</strong></p>${content}`,
  };
}

/**
 * Check if a slug is available (doesn't exist in database)
 */
export function isSlugAvailable(slug: string, existingSlugs: string[]): boolean {
  return !existingSlugs.includes(slug);
}
