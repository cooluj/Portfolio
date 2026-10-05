// Makes the small variants of the hero photos: <name>-320.webp and <name>-640.webp beside each original
// in public/images. The originals are never read for anything but input and are never rewritten.
//
// Re-run after adding or replacing a hero photo:   node scripts/images.mjs
// No npm install is needed. The encoder is whichever of these is found first:
//   1. node_modules/sharp (only if some other package pulled it in; it is not a dependency here)
//   2. ImageMagick's `convert` on the PATH
//   3. Playwright's bundled Chromium drawing the photo onto a canvas and calling toDataURL('image/webp', 0.82)
// Existing variants are overwritten so a replaced original always gets fresh small copies.

import { createRequire } from 'node:module';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'public', 'images');

/** The photos the Columns hero tiles. Add a name here when a new photo joins the columns. */
const PHOTOS = ['portrait-kerry-park', 'rainier-vista', 'st-peters', 'hero-skyline-night', 'fuji-golf', 'skyline-night'];
const WIDTHS = [320, 640];
const QUALITY = 82;

const jobs = PHOTOS.flatMap((name) => {
  const src = join(dir, `${name}.webp`);
  if (!existsSync(src)) {
    console.warn(`skip: ${src} does not exist`);
    return [];
  }
  return WIDTHS.map((w) => ({ name, src, width: w, out: join(dir, `${name}-${w}.webp`) }));
});

function tryRequire(id) {
  try {
    return require(id);
  } catch {
    return null;
  }
}

async function withSharp(sharp) {
  for (const j of jobs) {
    await sharp(j.src).resize({ width: j.width, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(j.out);
    report(j);
  }
}

function withConvert() {
  for (const j of jobs) {
    // "WxH>" only shrinks, never enlarges, and keeps the aspect ratio.
    const r = spawnSync('convert', [j.src, '-resize', `${j.width}x${j.width * 4}>`, '-quality', String(QUALITY), j.out]);
    if (r.status !== 0) throw new Error(`convert failed for ${j.src}: ${r.stderr}`);
    report(j);
  }
}

async function withPlaywright(pw) {
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  try {
    for (const j of jobs) {
      const dataUrl = `data:image/webp;base64,${readFileSync(j.src).toString('base64')}`;
      const out = await page.evaluate(
        ([url, width, q]) =>
          new Promise((ok, fail) => {
            const im = new Image();
            im.onload = () => {
              const w = Math.min(width, im.naturalWidth);
              const h = Math.round((im.naturalHeight * w) / im.naturalWidth);
              const c = document.createElement('canvas');
              c.width = w;
              c.height = h;
              const ctx = c.getContext('2d');
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(im, 0, 0, w, h);
              ok(c.toDataURL('image/webp', q));
            };
            im.onerror = () => fail(new Error('could not decode'));
            im.src = url;
          }),
        [dataUrl, j.width, QUALITY / 100],
      );
      writeFileSync(j.out, Buffer.from(out.split(',')[1], 'base64'));
      report(j);
    }
  } finally {
    await browser.close();
  }
}

function report(j) {
  const kb = (n) => `${(n / 1024).toFixed(0)} kB`;
  console.log(`${j.name}-${j.width}.webp  ${kb(readFileSync(j.src).length)} -> ${kb(readFileSync(j.out).length)}`);
}

const sharp = tryRequire('sharp');
const hasConvert = spawnSync('convert', ['-version']).status === 0;
const pw = tryRequire('playwright') || tryRequire('/opt/node22/lib/node_modules/playwright');

if (sharp) {
  console.log('encoder: sharp');
  await withSharp(sharp);
} else if (hasConvert) {
  console.log('encoder: ImageMagick convert');
  withConvert();
} else if (pw) {
  console.log('encoder: Playwright canvas');
  await withPlaywright(pw);
} else {
  console.error('No encoder found: install sharp, ImageMagick, or Playwright.');
  process.exit(1);
}
