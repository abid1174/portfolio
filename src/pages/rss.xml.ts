import type { APIRoute } from 'astro';
import { ContentRepository } from '../lib/content';
import { pillars } from '../data/topics';
import { site } from '../data/site';

export const prerender = true;

const escape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async ({ site: origin }) => {
  const base = (origin ?? new URL(site.url)).origin;
  const entries = (await ContentRepository.all()).slice(0, 50);

  const items = entries
    .map((entry) => {
      const url = `${base}${entry.url}`;
      return `    <item>
      <title>${escape(entry.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(entry.description)}</description>
      <category>${escape(pillars[entry.pillar].label)}</category>
      <category>${escape(entry.category)}</category>
      <pubDate>${entry.publishedAt.toUTCString()}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.title)}</title>
    <link>${base}</link>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escape(site.description)}</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
