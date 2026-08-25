# Engineering Notes

A personal engineering knowledge platform — software concepts, system design walkthroughs
and AI notes — built with Astro, React islands and MDX.

> Clear concepts. Scalable systems. Smarter with AI.

## Architecture

Astro is the primary framework. React is used only where state or browser interaction is
genuinely required, and every island is deferred (`client:idle` / `client:visible`) so the
initial page ships almost no JavaScript.

```
Git → MDX → Astro Content Collections → ContentRepository → Astro pages
                                                              ├── static HTML
                                                              └── React islands
```

| Layer                                                                     | Built with                                                       |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Pages, layouts, cards, navigation, article shell, TOC, SEO                | Astro                                                            |
| Search palette, theme switcher, filters, bookmarks, Mermaid, copy buttons | React islands                                                    |
| Content                                                                   | MDX in `src/content`, validated with Zod                         |
| Styling                                                                   | Tailwind v4 over CSS custom properties (`src/styles/tokens.css`) |

`src/lib/content.ts` exposes a `ContentRepository` — the only module that touches
`astro:content`. Swapping the backing store for a CMS or Postgres later means
reimplementing that file, not the UI.

## Content model

Three collections, one shared base schema (`src/content.config.ts`):

| Collection      | Route                   | Layout               |
| --------------- | ----------------------- | -------------------- |
| `concepts`      | `/concepts/<slug>`      | `ConceptLayout`      |
| `system-design` | `/system-design/<slug>` | `SystemDesignLayout` |
| `ai`            | `/ai/<slug>`            | `AILearningLayout`   |

The URL slug is the **filename**; category folders are for authoring only, so an article can
be re-filed without breaking its permalink.

```yaml
---
title: 'What is PKCE?'
description: 'A practical explanation of Proof Key for Code Exchange.'
type: 'concept' # concept | system-design | ai
category: 'Authentication'
tags: ['OAuth', 'Security', 'Authentication']
difficulty: 'beginner' # beginner | intermediate | advanced
readingTime: 8 # optional — computed from the body when omitted
publishedAt: '2026-04-03'
updatedAt: '2026-08-19'
featured: true
related: ['concepts/oauth-2', 'concepts/jwt']
---
```

Counts, tag clouds, "latest" lists and related content are all derived from the collections.
Nothing about content volume is hardcoded in the UI.

### MDX components

Auto-injected — no imports needed in content files:

`<Callout>` · `<Tradeoff>` · `<Decision>` · `<Capacity>` · `<Mermaid>` · `<PromptExample>` ·
`<ModelComparison>` · `<ArchitectureDiagram>`

## Commands

| Command           | Does                                                 |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Dev server                                           |
| `npm run build`   | Static build to `dist/`                              |
| `npm run preview` | Serve the build                                      |
| `npm run check`   | `astro check` — types across `.astro`, `.ts`, `.tsx` |
| `npm run lint`    | ESLint                                               |
| `npm run format`  | Prettier                                             |
| `npm run og`      | Regenerate `public/og/*.png` social images           |

## Notes

- **Search** is a static JSON index (`/search-index.json`) built at compile time and matched
  in the browser with Fuse.js. No search backend.
- **Bookmarks** live in `localStorage` under `portfolio:bookmarks`. Nothing leaves the device.
- **Theme** is applied by a blocking inline script before first paint, so there is no flash.
- **Mermaid** is dynamically imported inside a `client:visible` island — the diagram bundle is
  only fetched by readers who actually scroll one into view.
- **TypeScript** is pinned to 6.x: `astro check` needs the programmatic API that TS 7 does not
  yet expose.
