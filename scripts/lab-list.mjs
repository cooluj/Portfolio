// Writes LAB.md: the numbered list of every design-lab exploration, generated from src/lab/registry.ts.
import { build } from 'esbuild';
import { writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const out = new URL('../node_modules/.cache/lab-registry.mjs', import.meta.url);
mkdirSync(new URL('../node_modules/.cache/', import.meta.url), { recursive: true });
await build({ entryPoints: ['src/lab/registry.ts'], format: 'esm', outfile: out.pathname, bundle: true, platform: 'neutral', logLevel: 'silent' });
const { DIMENSIONS, DEFAULTS, NUMBERED } = await import(pathToFileURL(out.pathname).href);

const site = 'https://cooluj.github.io/Portfolio/';
const lines = [];
lines.push('# Design lab: every exploration, numbered');
lines.push('');
lines.push(`${NUMBERED.length} things to try on the live site. Open ${site}lab, or press **L** anywhere on the site, or append \`?lab=dim:id\` to any URL (several: \`?lab=type:fraunces,theme:paper,hero:kinetic\`). The default of each dimension is my current pick; everything else is one click away. Features stack: turn on as many as you like.`);
lines.push('');
let n = 0;
for (const d of DIMENSIONS) {
  lines.push(`## ${d.name}`);
  lines.push('');
  lines.push(`${d.desc}${d.multi ? ' Multi-select.' : ''}`);
  lines.push('');
  for (const o of d.options) {
    n += 1;
    const tag = !d.multi && DEFAULTS[d.id] === o.id ? ' **(my pick)**' : '';
    const link = d.multi ? `${site}?lab=features:${o.id}` : `${site}?lab=${d.id}:${o.id}`;
    lines.push(`${String(n).padStart(3, '0')}. **${o.name}**${tag}: ${o.desc} [Try](${link})`);
  }
  lines.push('');
}
writeFileSync('LAB.md', lines.join('\n'));
console.log(`LAB.md: ${n} explorations`);
