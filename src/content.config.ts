import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * The entry id is the URL slug. Content lives in category folders
 * (`concepts/authentication/pkce.mdx`) purely for authoring
 * ergonomics — the folder never appears in the URL, so an article
 * can be re-filed without breaking its permalink.
 */
const slugFromFilename = ({ entry }: { entry: string }) =>
  entry
    .split('/')
    .pop()!
    .replace(/\.mdx?$/, '');

const difficulty = z.enum(['beginner', 'intermediate', 'advanced']);

/**
 * Fields shared by every content type. Keeping one base schema is
 * what lets `lib/content.ts` treat all three collections as a
 * single `ContentEntry` union.
 */
const baseSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(300),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1).max(12),
  difficulty,
  /** Author's estimate in minutes. Computed from the body when omitted. */
  readingTime: z.number().int().positive().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  /** Slugs of related entries, as `concepts/pkce` or `ai/rag`. */
  related: z.array(z.string()).default([]),
});

const concepts = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/concepts',
    generateId: slugFromFilename,
  }),
  schema: baseSchema.extend({
    type: z.literal('concept'),
  }),
});

const systemDesign = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/system-design',
    generateId: slugFromFilename,
  }),
  schema: baseSchema.extend({
    type: z.literal('system-design'),
    /** Drives the card thumbnail motif. */
    diagram: z
      .enum(['fanout', 'keyvalue', 'realtime', 'pipeline', 'storage', 'mesh'])
      .default('mesh'),
    /** Rough scale target, shown on the article header. */
    scale: z.string().optional(),
  }),
});

const ai = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/ai',
    generateId: slugFromFilename,
  }),
  schema: baseSchema.extend({
    type: z.literal('ai'),
  }),
});

export const collections = { concepts, 'system-design': systemDesign, ai };
