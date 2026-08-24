import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search';

export const prerender = true;

/**
 * The client-side search index, built once at build time and served
 * as a static file. No search API, no server — the whole corpus is
 * small enough to match in the browser.
 */
export const GET: APIRoute = async () => {
  const index = await buildSearchIndex();
  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
};
