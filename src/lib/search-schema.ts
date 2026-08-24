/**
 * Client-safe half of the search module. Kept separate from
 * `search.ts` because that file imports `astro:content`, which is
 * server-only — importing it from a React island would drag the
 * whole content layer into the browser bundle.
 */

export type SearchPillar = 'concepts' | 'system-design' | 'ai';

/**
 * One search result. Deliberately small — the whole index is fetched
 * by the browser on first search, so every field costs bytes for
 * every visitor who opens the palette.
 */
export interface SearchDoc {
  id: string;
  title: string;
  description: string;
  url: string;
  pillar: SearchPillar;
  category: string;
  tags: string[];
  difficulty: string;
  readingTime: number;
  /** Trimmed prose excerpt so body text is searchable without shipping it all. */
  excerpt: string;
}

/** Field weights for Fuse. Title dominates; body text is a tiebreaker. */
export const searchKeys = [
  { name: 'title', weight: 0.45 },
  { name: 'tags', weight: 0.2 },
  { name: 'description', weight: 0.15 },
  { name: 'category', weight: 0.12 },
  { name: 'excerpt', weight: 0.08 },
];

export const fuseOptions = {
  keys: searchKeys,
  threshold: 0.34,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};
