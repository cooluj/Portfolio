// Fails if site copy contains an em dash or phrases we never want to ship.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const banned = [/—/, /passionate about/i, /leverag(e|ing)/i];
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = [...walk('src'), 'index.html'].filter((f) => /\.(tsx?|css|html)$/.test(f));

let bad = 0;
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    for (const re of banned) if (re.test(line)) { console.log(`${f}:${i + 1}  ${re}  ${line.trim()}`); bad++; }
  });
}
if (bad) { console.error(`\n${bad} copy problem(s).`); process.exit(1); }
console.log('Copy check passed: no em dashes or banned phrases.');
