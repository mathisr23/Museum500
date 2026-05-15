// Build-time content pipeline.
// Lit /content/incidents/*.md (front-matter YAML + body Markdown)
// → écrit src/app/data/incidents.generated.ts
// → écrit public/sitemap.xml + public/robots.txt + public/og-default.svg

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const SITE_URL = 'https://museum-of-500s.vercel.app';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const contentDir = join(root, 'content', 'incidents');
const outFile = join(root, 'src', 'app', 'data', 'incidents.generated.ts');
const publicDir = join(root, 'public');

const files = readdirSync(contentDir).filter((f) => f.endsWith('.md'));

const incidents = files
  .map((file) => {
    const raw = readFileSync(join(contentDir, file), 'utf8');
    const { data, content } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ''),
      ...data,
      context: content.trim(),
    };
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

// 1. TS data
const out = `// AUTO-GENERATED par scripts/build-content.mjs — ne pas éditer à la main.
// Source : /content/incidents/*.md

import type { Incident } from './incident.types';

export const INCIDENTS: Incident[] = ${JSON.stringify(incidents, null, 2)};
`;
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, out);

// 2. sitemap.xml
mkdirSync(publicDir, { recursive: true });
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: SITE_URL + '/', changefreq: 'monthly', priority: '1.0' },
  ...incidents.map((i) => ({
    loc: `${SITE_URL}/musee/${i.slug}`,
    changefreq: 'yearly',
    priority: '0.8',
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(publicDir, 'sitemap.xml'), sitemap);

// 3. robots.txt
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync(join(publicDir, 'robots.txt'), robots);

// 4. OG default SVG (1200x630)
const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1a1a1a" stroke-width="1"/>
    </pattern>
    <radialGradient id="vignette" cx="50%" cy="100%" r="100%">
      <stop offset="0%" stop-color="#ff2e2e" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#0a0a0a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <rect width="1200" height="630" fill="url(#vignette)"/>
  <text x="80" y="120" font-family="JetBrains Mono, monospace" font-size="22" fill="#ff2e2e" letter-spacing="6">MUSEUM / 500</text>
  <text x="80" y="350" font-family="Cormorant Garamond, Georgia, serif" font-size="148" font-style="italic" fill="#e8e6e1" font-weight="500">Cinq erreurs</text>
  <text x="80" y="490" font-family="Cormorant Garamond, Georgia, serif" font-size="148" fill="#e8e6e1" font-weight="500">qui ont changé</text>
  <text x="80" y="565" font-family="JetBrains Mono, monospace" font-size="18" fill="#e8e6e1" opacity="0.55" letter-spacing="3">HTTP/1.1 500 — Internal Server Error</text>
  <text x="1120" y="590" font-family="JetBrains Mono, monospace" font-size="14" fill="#ff2e2e" text-anchor="end" letter-spacing="3">${incidents.length} ROOMS</text>
</svg>
`;
writeFileSync(join(publicDir, 'og-default.svg'), og);

console.log(
  `✓ ${incidents.length} incidents → TS, sitemap, robots, og-default.svg`,
);
