# Portfolio

One-page portfolio built with Astro + React. Black and white, minimal, a few sections.

## Run

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
npm run check    # typescript
```

## Editing

All copy lives in `src/lib/site.ts` — name, role, intro, about paragraphs, skills,
projects and social links. Change it there and every section updates.

## Structure

```
src/
  pages/index.astro      the single page
  layouts/Base.astro     html shell, meta tags, no-flash theme script
  lib/site.ts            all content
  components/
    Nav.tsx              sticky nav, scroll progress bar, light/dark toggle
    Hero.tsx             staggered intro animation
    Marquee.astro        looping skills strip (CSS only, ships no JS)
    Work.tsx             project list, hover dims the other rows
    About.tsx
    Contact.tsx
    Reveal.tsx           IntersectionObserver fade-up wrapper
  styles/
    global.css           tokens, resets, reveal animation
    components.css       per-section styles
```

Theme is a `data-theme` attribute on `<html>`; colours are CSS custom properties in
`global.css`. Every animation is disabled under `prefers-reduced-motion`.
