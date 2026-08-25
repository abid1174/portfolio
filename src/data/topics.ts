import { BookOpen, Brain, Network } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Pillar = 'concepts' | 'system-design' | 'ai';

export interface PillarMeta {
  id: Pillar;
  /** Collection name in `src/content.config.ts`. */
  collection: Pillar;
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  tagline: string;
  description: string;
  /** Long-form copy for the section hero. */
  heroDescription: string;
  /** CSS class from tokens.css that rebinds `--pillar`. */
  accentClass: string;
  /** Noun used in counts, e.g. "42 concepts". */
  unit: string;
}

/** The three pillars the entire site is organised around. */
export const pillars: Record<Pillar, PillarMeta> = {
  concepts: {
    id: 'concepts',
    collection: 'concepts',
    label: 'Concepts',
    shortLabel: 'Concept',
    href: '/concepts',
    icon: BookOpen,
    tagline: 'Understand the building blocks of modern software.',
    description:
      'Short, practical explanations of the ideas backend engineers rely on every day.',
    heroDescription:
      'Short, practical explanations of software engineering concepts — written to be understood once, not memorised twice.',
    accentClass: 'pillar-concepts',
    unit: 'concepts',
  },
  'system-design': {
    id: 'system-design',
    collection: 'system-design',
    label: 'System Design',
    shortLabel: 'System Design',
    href: '/system-design',
    icon: Network,
    tagline: 'Design scalable, reliable and efficient systems.',
    description:
      'End-to-end design walkthroughs: requirements, capacity, architecture and the trade-offs that decide it.',
    heroDescription:
      'Deep dives into designing scalable, reliable backend systems — from the first requirement to the final trade-off.',
    accentClass: 'pillar-system-design',
    unit: 'system designs',
  },
  ai: {
    id: 'ai',
    collection: 'ai',
    label: 'AI Learning',
    shortLabel: 'AI Note',
    href: '/ai',
    icon: Brain,
    tagline: 'Explore AI concepts, tools and real-world applications.',
    description:
      'Notes from working out how modern AI systems are actually built and evaluated.',
    heroDescription:
      'Notes from learning how modern AI systems actually work — the mechanics under the abstractions.',
    accentClass: 'pillar-ai',
    unit: 'AI notes',
  },
};

export const pillarList: PillarMeta[] = [
  pillars.concepts,
  pillars['system-design'],
  pillars.ai,
];

export const difficulties = ['beginner', 'intermediate', 'advanced'] as const;
export type Difficulty = (typeof difficulties)[number];

/**
 * Preferred display order for categories. Categories not listed here
 * still render — they simply sort alphabetically after these.
 * This file never stores counts; those come from the content itself.
 */
export const categoryOrder: string[] = [
  'Authentication',
  'Networking',
  'Databases',
  'Caching',
  'Distributed Systems',
  'Architecture',
  'Security',
  'Backend',
  'Performance',
  'Messaging',
  'Storage',
  'Real-time',
  'Scalability',
  'LLM',
  'RAG',
  'Embeddings',
  'Agents',
  'Prompt Engineering',
  'Evaluation',
  'AI Infrastructure',
  'AI Architecture',
];
