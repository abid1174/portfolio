import type { APIRoute } from 'astro';
import { site } from '../data/site';

export const prerender = true;

export const GET: APIRoute = ({ site: origin }) => {
  const base = (origin ?? new URL(site.url)).origin;
  const body = `User-agent: *
Allow: /

# Personal, device-local reading list — nothing to index.
Disallow: /bookmarks

Sitemap: ${base}/sitemap-index.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
