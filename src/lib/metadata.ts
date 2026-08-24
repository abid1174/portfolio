import { site } from '../data/site';
import type { ContentEntry } from './content';
import { pillars } from '../data/topics';

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  /** Absolute URL of the social image. */
  image: string;
  type: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
}

export interface MetaInput {
  title: string;
  description?: string;
  pathname: string;
  type?: 'website' | 'article';
  entry?: ContentEntry;
  /** Selects the social image; inferred from `entry` when omitted. */
  pillar?: 'concepts' | 'system-design' | 'ai';
  noindex?: boolean;
}

const absolute = (path: string) => new URL(path, site.url).href;

/** Builds the complete metadata set for a page. */
export function buildMeta({
  title,
  description,
  pathname,
  type = 'website',
  entry,
  pillar,
  noindex,
}: MetaInput): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/';
  return {
    title: title === site.title ? title : `${title} — ${site.name}`,
    description: description ?? entry?.description ?? site.description,
    canonical: absolute(path),
    image: absolute(`/og/${pillar ?? entry?.pillar ?? 'default'}.png`),
    type,
    publishedTime: entry?.publishedAt.toISOString(),
    modifiedTime: entry?.updatedAt.toISOString(),
    tags: entry?.tags,
    noindex,
  };
}

/** Person + WebSite graph, emitted once on every page. */
export function siteJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: site.title,
      description: site.description,
      inLanguage: 'en',
      publisher: { '@id': `${site.url}/#person` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${site.url}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': `${site.url}/#person`,
      name: site.name,
      jobTitle: site.role,
      description: site.bio,
      url: site.url,
      sameAs: site.social.map((s) => s.href),
    },
  ];
}

/** Article graph for a content entry. */
export function articleJsonLd(entry: ContentEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${absolute(entry.url)}#article`,
    headline: entry.title,
    description: entry.description,
    url: absolute(entry.url),
    datePublished: entry.publishedAt.toISOString(),
    dateModified: entry.updatedAt.toISOString(),
    articleSection: entry.category,
    keywords: entry.tags.join(', '),
    proficiencyLevel: entry.difficulty,
    wordCount: entry.body ? entry.body.split(/\s+/).length : undefined,
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: { '@id': `${site.url}/#person` },
    publisher: { '@id': `${site.url}/#person` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absolute(entry.url) },
  };
}

export interface Crumb {
  label: string;
  href?: string;
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      ...(crumb.href ? { item: absolute(crumb.href) } : {}),
    })),
  };
}

/** Breadcrumb trail for an article: Home / Pillar / Category / Title. */
export function entryCrumbs(entry: ContentEntry): Crumb[] {
  const pillar = pillars[entry.pillar];
  return [
    { label: 'Home', href: '/' },
    { label: pillar.label, href: pillar.href },
    {
      label: entry.category,
      href: `${pillar.href}?category=${encodeURIComponent(entry.category)}`,
    },
    { label: entry.title },
  ];
}
