import { ContentRepository } from './content';
import type { SearchDoc } from './search-schema';

export type { SearchDoc } from './search-schema';
export { fuseOptions, searchKeys } from './search-schema';

/** Strips MDX syntax down to plain prose for indexing. */
function toExcerpt(body: string | undefined, limit = 600): string {
  if (!body) return '';
  return body
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

/** Built once at build time and served as static JSON. */
export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const entries = await ContentRepository.all();
  return entries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    description: entry.description,
    url: entry.url,
    pillar: entry.pillar,
    category: entry.category,
    tags: entry.tags,
    difficulty: entry.difficulty,
    readingTime: entry.readingTime,
    excerpt: toExcerpt(entry.body),
  }));
}
