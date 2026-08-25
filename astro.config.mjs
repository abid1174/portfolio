// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://abidalamin.dev',
  trailingSlash: 'never',
  integrations: [
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/bookmarks'),
    }),
  ],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      // Solarized is the warm, low-contrast pair that sits closest to
      // the cream/charcoal palette — code blocks read as part of the
      // page rather than as a pasted-in terminal. Both themes are
      // emitted; global.css swaps to the dark one under
      // `[data-theme='dark']`.
      themes: {
        light: 'solarized-light',
        dark: 'solarized-dark',
      },
      // Light is what ships inline; dark lives in `--shiki-dark`.
      defaultColor: 'light',
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      // Mermaid is only reached through a dynamic import inside an
      // island, so Vite discovers it late and re-optimises mid-session.
      // That invalidates the lazily-loaded per-diagram chunks it had
      // already handed the page, and every diagram falls back to its
      // source. Pre-bundling it at server start avoids the reshuffle.
      include: ['mermaid'],
    },
  },
});
