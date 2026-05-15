// Optimise les hero images d'incident.
// Lit /public/images/incidents/raw/*.{jpg,png}
// → écrit /public/images/incidents/<slug>-<width>.webp pour 3 tailles
// Skip si webp existe et est plus récent que le raw.

import { readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, parse as parsePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const rawDir = join(root, 'public', 'images', 'incidents', 'raw');
const outDir = join(root, 'public', 'images', 'incidents');

const WIDTHS = [1920, 1280, 800];
const QUALITY = 78;

if (!existsSync(rawDir)) {
  console.warn('No raw images dir, skipping image build.');
  process.exit(0);
}

mkdirSync(outDir, { recursive: true });

const files = readdirSync(rawDir).filter((f) => /\.(jpe?g|png)$/i.test(f));
let processed = 0;
let skipped = 0;

for (const file of files) {
  const { name } = parsePath(file);
  const rawPath = join(rawDir, file);
  const rawMtime = statSync(rawPath).mtimeMs;

  for (const w of WIDTHS) {
    const outPath = join(outDir, `${name}-${w}.webp`);
    if (existsSync(outPath) && statSync(outPath).mtimeMs > rawMtime) {
      skipped++;
      continue;
    }
    await sharp(rawPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outPath);
    processed++;
  }
}

console.log(`✓ images: ${processed} générées, ${skipped} à jour (skip).`);
