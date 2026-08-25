// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
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
      // Everforest is a green-based syntax palette, so code blocks sit
      // in the same colour family as the rest of the site. Both themes
      // are emitted; global.css swaps to the light one under
      // `[data-theme='light']`.
      themes: {
        dark: 'everforest-dark',
        light: 'everforest-light',
      },
      // Dark is what ships inline; light lives in `--shiki-light`.
      defaultColor: 'dark',
      wrap: false,
    },
  },
  fonts: [
    // Body / UI. Geist has more character than the default Inter
    // without giving up long-form legibility.
    {
      provider: fontProviders.google(),
      name: 'Geist',
      cssVariable: '--font-geist',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    // Display. Space Grotesk gives headings a drafted, technical
    // presence that matches the schematic motifs.
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-display',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    // Mono. Geist Mono keeps code and metadata labels in the same
    // family as the body text.
    {
      provider: fontProviders.google(),
      name: 'Geist Mono',
      cssVariable: '--font-geist-mono',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  ],
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
