# CLAUDE.md

Personal portfolio and engineering knowledge site (`engineering-notes`) — Astro 7 + MDX content,
React only as deferred islands, Tailwind v4 over CSS custom properties. Static output,
deployed to Vercel. Node >= 22.12.

`README.md` documents the architecture and frontmatter for readers; this file is the
working contract for changes. Prefer it when the two overlap.


Before saying a change is done: `npm run check && npm run lint && npm run build`.
There is no test suite — the typecheck and build *are* the test suite, so don't claim
verification without running them.

## Architecture rules

- **`src/lib/content.ts` is the only module allowed to import `astro:content`.**
  Everything — pages, components, RSS, search — goes through `ContentRepository`.
  It caches per build, so calling it repeatedly is free. Don't call `getCollection`
  anywhere else.
- **`ContentEntry` is the normalised shape the UI consumes.** `entry.raw` exists only
  to pass to `render(entry.raw)`; never read display data off it.
- **Nothing is hardcoded about the corpus.** Counts, tag clouds, category lists,
  "latest", related links and stats are all derived. If a number appears in the UI, it
  came from `ContentRepository.stats()` / `tagCounts()` — keep it that way.
- **Single sources of truth:** `src/data/site.ts` (copy, URLs, social),
  `src/data/navigation.ts` (every nav surface reads this array),
  `src/data/topics.ts` (the three pillars, difficulties, `categoryOrder`).
  Adding a nav item or a pillar means editing the data file, not the components.
- **`src/lib/search-schema.ts` is the client-safe half of search.** React islands may
  import it; they must never import `search.ts` or `content.ts` (server-only —
  importing them drags the whole content layer into the browser bundle).

## Content authoring

Content is MDX under `src/content/{concepts,system-design,ai}/<category>/<slug>.mdx`.

- **The URL slug is the filename**, not the path — `concepts/security/ssh-keys.mdx`
  serves at `/concepts/ssh-keys`. Category folders are authoring ergonomics only, so a
  file can be re-filed without breaking its permalink. Filenames must therefore be
  unique within a collection.
- Frontmatter is Zod-validated in `src/content.config.ts`; the schema is authoritative
  (title ≤ 120 chars, description ≤ 300, 1–12 tags, `type` must match the collection).
  A bad field fails the build, not the page.
- `category` should normally be one of the strings in `categoryOrder` (`data/topics.ts`).
  Anything else still renders but sorts alphabetically at the end — add it to the array
  if it's meant to be a real section.
- `related` uses global ids: `concepts/jwt`, `ai/rag`. Unmatched ids are dropped
  silently and topped up by tag/category similarity, so typos are invisible — check them.
- `readingTime` is optional; omit it and `estimateReadingTime` computes it from the body.
- `draft: true` hides an entry in production but keeps it visible in dev.
- MDX components are auto-injected via `mdxComponents` — `<Callout>`, `<Tradeoff>`,
  `<Decision>`, `<Capacity>`, `<Mermaid>`, `<PromptExample>`, `<ModelComparison>`,
  `<ArchitectureDiagram>`. **No imports in content files.** New component ⇒ register it
  in `src/components/mdx/components.ts`.

## Astro vs React

Astro is the default. Reach for React only when browser state or interaction is
genuinely required, and always with a hydration directive:

- `client:idle` — chrome that must be ready but not blocking (search trigger, filters,
  appearance controls)
- `client:visible` — below-the-fold widgets (Mermaid, copy buttons, bookmark button)
- `client:load` — only on pages whose whole point is the island (`/search`, `/bookmarks`)

Server-render the content and let the island toggle it. `ContentLibrary.astro` is the
pattern: the full card list ships as HTML with `data-*` attributes, and `ContentFilter`
only flips `hidden`. Don't move rendering into React to make filtering easier.

## Styling

- All colour, spacing, radius, elevation and motion live in `src/styles/tokens.css`.
  **Never inline a raw colour value in a component** — reference a token.
- Section colour comes from `--pillar` / `--pillar-dim` / `--pillar-wash`, rebound by
  the `.pillar-concepts|-system-design|-ai` classes that `BaseLayout` puts on `<body>`,
  and overridden globally by a reader's `data-accent` choice. New accent surfaces should
  consume `--pillar`, not a specific hue.
- Theme is `data-theme` on `<html>`, applied by a blocking inline script in
  `BaseLayout.astro` before first paint. If you touch theme logic, keep that script and
  `src/lib/theme.ts` in sync — they duplicate the resolution rules on purpose (the
  island can't run early enough). Default is `light`.
- localStorage keys: `portfolio:theme`, `portfolio:accent`, `portfolio:bookmarks`.
  All reads/writes are wrapped in try/catch because storage can be blocked; keep the
  fallback path correct rather than removing the empty catch (`no-empty` is configured
  with `allowEmptyCatch`).

## Gotchas

- **TypeScript is pinned to 6.x.** `astro check` needs a programmatic API TS 7 doesn't
  expose yet. Don't bump it.
- **`legacy-peer-deps=true` in `.npmrc` is load-bearing.** `eslint-plugin-jsx-a11y`
  still caps its peer at eslint ^9 while `eslint-plugin-astro` needs >= 10; removing it
  breaks `npm ci` on Vercel before the build starts.
- **`mermaid` is pinned in `vite.optimizeDeps.include`** because it is only reached via
  a dynamic import inside an island. Removing it makes Vite re-optimise mid-session and
  every diagram falls back to raw source.
- **`scripts/generate-og.mjs` imports `sharp`, which is not a declared dependency** —
  it currently resolves transitively. If `npm run og` fails with a missing module, that
  is why; add it as a devDependency rather than working around it.
- Shiki emits both solarized themes; the dark one is swapped in via `--shiki-dark` in
  `global.css`. Changing `defaultColor` breaks that pairing.
- `trailingSlash: 'never'` — build canonical URLs and internal links without a trailing
  slash.
- `/bookmarks` is excluded from the sitemap by design (it's per-device state).

## Conventions

- Prettier: single quotes, semicolons, `printWidth: 96`, trailing commas. Run
  `npm run format` rather than hand-aligning.
- Comments in this codebase explain *why*, not what, and are written in full sentences.
  Match that tone; don't add narration comments.
- Keep new modules small and typed at the boundary — exported interfaces (`ContentEntry`,
  `SearchDoc`, `PageMeta`, `NavItem`) are the contracts everything else leans on.
