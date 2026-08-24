import { getCollection, type CollectionEntry } from 'astro:content';
import { categoryOrder, pillars, type Difficulty, type Pillar } from '../data/topics';
import { estimateReadingTime, slugify } from './utils';

type RawEntry =
  CollectionEntry<'concepts'> | CollectionEntry<'system-design'> | CollectionEntry<'ai'>;

/**
 * The normalised shape every UI component consumes. Nothing outside
 * this module touches `astro:content` directly, so swapping the
 * backing store (CMS, Postgres) later means reimplementing the
 * loaders below and nothing else.
 */
export interface ContentEntry {
  /** Slug, unique within its pillar. */
  slug: string;
  /** Stable global identifier, e.g. `concepts/pkce`. */
  id: string;
  url: string;
  pillar: Pillar;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: Difficulty;
  readingTime: number;
  publishedAt: Date;
  updatedAt: Date;
  featured: boolean;
  related: string[];
  /** Pillar-specific extras, kept loose so the union stays simple. */
  diagram?: string;
  scale?: string;
  /** Raw MDX body — used for the search index only. */
  body?: string;
  /** Escape hatch for `render(entry)`; never used for display. */
  raw: RawEntry;
}

export interface ContentStats {
  concepts: number;
  systemDesigns: number;
  ai: number;
  total: number;
  tags: number;
  categories: number;
  /** Distinct engineering practices covered — tags plus categories. */
  practices: number;
}

export interface TagCount {
  tag: string;
  slug: string;
  count: number;
}

export interface CategoryGroup {
  category: string;
  entries: ContentEntry[];
}

function normalise(entry: RawEntry, pillar: Pillar): ContentEntry {
  const data = entry.data as RawEntry['data'] & {
    diagram?: string;
    scale?: string;
  };
  return {
    slug: entry.id,
    id: `${pillar}/${entry.id}`,
    url: `${pillars[pillar].href}/${entry.id}`,
    pillar,
    title: data.title,
    description: data.description,
    category: data.category,
    tags: data.tags,
    difficulty: data.difficulty,
    readingTime: data.readingTime ?? estimateReadingTime(entry.body),
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt ?? data.publishedAt,
    featured: data.featured,
    related: data.related,
    diagram: data.diagram,
    scale: data.scale,
    body: entry.body,
    raw: entry,
  };
}

const isPublished = (entry: ContentEntry) =>
  import.meta.env.DEV || !(entry.raw.data as { draft?: boolean }).draft;

const byNewest = (a: ContentEntry, b: ContentEntry) =>
  b.publishedAt.getTime() - a.publishedAt.getTime();

/** Cached per build — `getCollection` is called once per pillar. */
let cache: ContentEntry[] | null = null;

async function loadAll(): Promise<ContentEntry[]> {
  if (cache) return cache;
  const [concepts, systemDesign, ai] = await Promise.all([
    getCollection('concepts'),
    getCollection('system-design'),
    getCollection('ai'),
  ]);
  cache = [
    ...concepts.map((e) => normalise(e, 'concepts')),
    ...systemDesign.map((e) => normalise(e, 'system-design')),
    ...ai.map((e) => normalise(e, 'ai')),
  ]
    .filter(isPublished)
    .sort(byNewest);
  return cache;
}

/**
 * The one seam between the site and its content store.
 * Every page and component goes through this object.
 */
export const ContentRepository = {
  async all(): Promise<ContentEntry[]> {
    return loadAll();
  },

  async byPillar(pillar: Pillar): Promise<ContentEntry[]> {
    return (await loadAll()).filter((e) => e.pillar === pillar);
  },

  async bySlug(pillar: Pillar, slug: string): Promise<ContentEntry | undefined> {
    return (await loadAll()).find((e) => e.pillar === pillar && e.slug === slug);
  },

  async byId(id: string): Promise<ContentEntry | undefined> {
    return (await loadAll()).find((e) => e.id === id);
  },

  /** Newest entries in a pillar, for the homepage columns. */
  async latest(pillar: Pillar, limit = 5): Promise<ContentEntry[]> {
    return (await this.byPillar(pillar)).slice(0, limit);
  },

  async featured(pillar?: Pillar, limit = 4): Promise<ContentEntry[]> {
    const pool = pillar ? await this.byPillar(pillar) : await loadAll();
    const flagged = pool.filter((e) => e.featured);
    // Fall back to newest so the UI is never empty before anything
    // has been marked featured.
    return (flagged.length ? flagged : pool).slice(0, limit);
  },

  /** Homepage statistics — derived, never hardcoded. */
  async stats(): Promise<ContentStats> {
    const all = await loadAll();
    const tags = new Set(all.flatMap((e) => e.tags));
    const categories = new Set(all.map((e) => e.category));
    return {
      concepts: all.filter((e) => e.pillar === 'concepts').length,
      systemDesigns: all.filter((e) => e.pillar === 'system-design').length,
      ai: all.filter((e) => e.pillar === 'ai').length,
      total: all.length,
      tags: tags.size,
      categories: categories.size,
      practices: tags.size + categories.size,
    };
  },

  /** Tag frequency across the whole site, most used first. */
  async tagCounts(limit?: number): Promise<TagCount[]> {
    const counts = new Map<string, number>();
    for (const entry of await loadAll()) {
      for (const tag of entry.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()]
      .map(([tag, count]) => ({ tag, slug: slugify(tag), count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
    return limit ? sorted.slice(0, limit) : sorted;
  },

  /** Distinct categories within a pillar, in curated order. */
  async categories(pillar: Pillar): Promise<string[]> {
    const found = [...new Set((await this.byPillar(pillar)).map((e) => e.category))];
    return found.sort(compareCategories);
  },

  /** Entries grouped by category — the Concepts page layout. */
  async groupedByCategory(pillar: Pillar): Promise<CategoryGroup[]> {
    const entries = await this.byPillar(pillar);
    const groups = new Map<string, ContentEntry[]>();
    for (const entry of entries) {
      const bucket = groups.get(entry.category) ?? [];
      bucket.push(entry);
      groups.set(entry.category, bucket);
    }
    return [...groups.entries()]
      .map(([category, items]) => ({ category, entries: items }))
      .sort((a, b) => compareCategories(a.category, b.category));
  },

  /**
   * Explicit `related` slugs first, then the closest entries by
   * shared tags, so an article always has somewhere to go next.
   */
  async related(entry: ContentEntry, limit = 4): Promise<ContentEntry[]> {
    const all = await loadAll();
    const picked = new Map<string, ContentEntry>();

    for (const id of entry.related) {
      const match = all.find((e) => e.id === id || (e.slug === id && e.id !== entry.id));
      if (match && match.id !== entry.id) picked.set(match.id, match);
    }

    if (picked.size < limit) {
      const tagSet = new Set(entry.tags);
      const scored = all
        .filter((e) => e.id !== entry.id && !picked.has(e.id))
        .map((e) => ({
          entry: e,
          score:
            e.tags.filter((t) => tagSet.has(t)).length +
            (e.category === entry.category ? 1.5 : 0),
        }))
        .filter((s) => s.score > 0)
        .sort((a, b) => b.score - a.score);
      for (const { entry: match } of scored) {
        if (picked.size >= limit) break;
        picked.set(match.id, match);
      }
    }

    return [...picked.values()].slice(0, limit);
  },

  /** Strongest related entry from a different pillar, for cross-links. */
  async crossPillar(entry: ContentEntry): Promise<ContentEntry | undefined> {
    const related = await this.related(entry, 12);
    return related.find((e) => e.pillar !== entry.pillar);
  },

  /** Previous/next within the same pillar, ordered newest → oldest. */
  async adjacent(entry: ContentEntry): Promise<{
    prev?: ContentEntry;
    next?: ContentEntry;
  }> {
    const siblings = await this.byPillar(entry.pillar);
    const index = siblings.findIndex((e) => e.id === entry.id);
    if (index === -1) return {};
    return {
      prev: siblings[index + 1],
      next: siblings[index - 1],
    };
  },
};

function compareCategories(a: string, b: string): number {
  const ia = categoryOrder.indexOf(a);
  const ib = categoryOrder.indexOf(b);
  if (ia !== -1 && ib !== -1) return ia - ib;
  if (ia !== -1) return -1;
  if (ib !== -1) return 1;
  return a.localeCompare(b);
}
