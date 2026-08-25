/**
 * Renders the social preview images once, into public/og/.
 * Run with `npm run og` after changing the brand or palette —
 * the output is committed, so builds stay dependency-free.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const variants = [
  {
    name: 'default',
    eyebrow: 'Engineering notes',
    heading: ['Clear concepts.', 'Scalable systems.', 'Smarter with AI.'],
    accent: '#4fd493',
    accent2: '#4ec9bb',
  },
  {
    name: 'concepts',
    eyebrow: 'Concepts',
    heading: ['Understand the', 'building blocks of', 'modern software.'],
    accent: '#4fd493',
    accent2: '#27a875',
  },
  {
    name: 'system-design',
    eyebrow: 'System Design Practices',
    heading: ['Design scalable,', 'reliable and', 'efficient systems.'],
    accent: '#a6cf62',
    accent2: '#82ad42',
  },
  {
    name: 'ai',
    eyebrow: 'AI Learning',
    heading: ['How modern AI', 'systems actually', 'work.'],
    accent: '#4ec9bb',
    accent2: '#269e93',
  },
];

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function template({ eyebrow, heading, accent, accent2 }) {
  const lines = heading
    .map((line, i) => `<text x="80" y="${268 + i * 78}" class="h">${escape(line)}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a120e"/>
      <stop offset="100%" stop-color="#050908"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.22" cy="0.28" r="0.55">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent2}" stop-opacity="0.15"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#16221c" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)" opacity="0.5"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <style>
    .h { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 64px; font-weight: 700; fill: #e8f2ec; letter-spacing: -2px; }
    .eyebrow { font-family: 'SF Mono', Menlo, monospace; font-size: 20px; font-weight: 600; fill: ${accent}; letter-spacing: 4px; }
    .name { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 600; fill: #e8f2ec; }
    .role { font-family: 'SF Mono', Menlo, monospace; font-size: 17px; fill: #6b8076; letter-spacing: 2px; }
  </style>

  <text x="80" y="118" class="eyebrow">${escape(eyebrow.toUpperCase())}</text>
  <rect x="80" y="146" width="220" height="3" fill="url(#rule)"/>
  ${lines}

  <rect x="80" y="496" width="56" height="56" rx="14" fill="#0c1410" stroke="#1f2f27"/>
  <text x="108" y="533" text-anchor="middle" class="name" style="font-family:'SF Mono',Menlo,monospace">AA</text>
  <text x="156" y="521" class="name">Abid Al Amin</text>
  <text x="156" y="546" class="role">SENIOR SOFTWARE ENGINEER</text>

  <circle cx="1060" cy="150" r="9" fill="${accent}"/>
  <circle cx="1060" cy="240" r="9" fill="${accent2}"/>
  <circle cx="1060" cy="330" r="9" fill="#4ec9bb" opacity="0.8"/>
  <path d="M1060 159v72M1060 249v72" stroke="#1f2f27" stroke-width="2"/>
</svg>`;
}

for (const variant of variants) {
  const svg = template(variant);
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(new URL(`../public/og/${variant.name}.png`, import.meta.url), png);
  console.log(`public/og/${variant.name}.png`);
}
