import { featured, type Featured } from './home';

/** The constellation: three projects and the themes they share, each with a one-line note for hover and focus. */
export type Kind = 'project' | 'methods' | 'craft' | 'code' | 'context';

export type SpatialNode = {
  id: string;
  kind: Kind;
  label: string;
  note: string;
  /** Projects only: the route slug and the featured entry (kicker, image). */
  slug?: string;
  featured?: Featured;
  /** Unit vector on the sphere, filled by place(). */
  p: [number, number, number];
};

export type Edge = { a: string; b: string; /** True when both ends are themes. */ soft: boolean };

const by = (slug: string) => featured.find((f) => f.slug === slug) as Featured;

const projects: Omit<SpatialNode, 'p'>[] = [
  { id: 'eventully', kind: 'project', label: 'Eventully', slug: 'eventully', featured: by('eventully'), note: 'Live campus platform indexing 1,231 UW student organizations, founded June 2024.' },
  { id: 'superpowr', kind: 'project', label: 'Superpowr.ai', slug: 'superpowr', featured: by('superpowr'), note: 'End-to-end redesign, shipped as the production front-end in summer 2026.' },
  { id: 'painsights', kind: 'project', label: 'PainSights', slug: 'painsights', featured: by('painsights'), note: 'Clinical dashboard for clinicians whose patients cannot report pain. FigBuild 2026, team of three.' },
];

const themes: Omit<SpatialNode, 'p'>[] = [
  { id: 'interviews', kind: 'methods', label: 'User interviews', note: 'Talking to the people with the problem before drawing anything.' },
  { id: 'usability', kind: 'methods', label: 'Usability testing', note: 'Watching people use the thing, then fixing where they stall.' },
  { id: 'abtest', kind: 'methods', label: 'A/B testing', note: 'Two versions in front of real users; the numbers pick.' },
  { id: 'synthesis', kind: 'methods', label: 'Synthesis', note: 'Many sources into a few findings, the way 100+ studies became one publication at UW.' },
  { id: 'ia', kind: 'craft', label: 'Information architecture', note: 'How things are named, grouped and found.' },
  { id: 'motion', kind: 'craft', label: 'Motion', note: 'Transitions that explain what just changed, and nothing more.' },
  { id: 'a11y', kind: 'craft', label: 'Accessibility', note: 'Keyboard, contrast and screen readers, WCAG in from the start.' },
  { id: 'systems', kind: 'craft', label: 'Design systems', note: 'Tokens and components that keep a product consistent as it grows.' },
  { id: 'react', kind: 'code', label: 'React + TypeScript', note: 'The front-end stack behind the Superpowr.ai redesign and this site.' },
  { id: 'flask', kind: 'code', label: 'Flask + Python', note: 'What Eventully runs on.' },
  { id: 'tailwind', kind: 'code', label: 'Tailwind', note: 'How Eventully is styled.' },
  { id: 'seattle', kind: 'context', label: 'Seattle', note: 'Home, and where the work is made.' },
  { id: 'hcde', kind: 'context', label: 'UW HCDE', note: 'Human Centered Design & Engineering at the University of Washington, class of 2027.' },
];

/** The themes each project genuinely used. */
const USED: Record<string, string[]> = {
  eventully: ['interviews', 'usability', 'abtest', 'ia', 'flask', 'tailwind', 'hcde', 'seattle'],
  superpowr: ['ia', 'motion', 'a11y', 'systems', 'react', 'usability'],
  painsights: ['interviews', 'synthesis', 'a11y', 'motion', 'seattle'],
};

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

/** Fibonacci sphere: evenly spread points. Projects sit a third of the sequence apart so they land far from each other. */
function place(): SpatialNode[] {
  const n = projects.length + themes.length;
  const slots: Omit<SpatialNode, 'p'>[] = [...themes];
  const step = Math.floor(n / projects.length);
  projects.forEach((p, i) => slots.splice(i * step + 1, 0, p));
  return slots.map((node, i) => {
    const y = 1 - (2 * (i + 0.5)) / n;
    const r = Math.sqrt(1 - y * y);
    const t = GOLDEN * i;
    return { ...node, p: [Math.cos(t) * r, y, Math.sin(t) * r] };
  });
}

export const NODES: SpatialNode[] = place();

const KIND_ORDER: Kind[] = ['project', 'methods', 'craft', 'code', 'context'];

/** Tab order: by kind, then by name, so the keyboard never depends on where the globe stopped. */
export const ORDERED: SpatialNode[] = [...NODES].sort(
  (a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.label.localeCompare(b.label),
);

/** Project to theme edges, plus theme to theme edges wherever two themes share a project. */
export const EDGES: Edge[] = (() => {
  const out: Edge[] = [];
  const seen = new Set<string>();
  const add = (a: string, b: string, soft: boolean) => {
    const key = [a, b].sort().join('|');
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ a, b, soft });
  };
  for (const [slug, used] of Object.entries(USED)) {
    for (const t of used) add(slug, t, false);
    for (let i = 0; i < used.length; i++) for (let j = i + 1; j < used.length; j++) add(used[i], used[j], true);
  }
  return out;
})();

/** Neighbours of every node (through any edge). */
export const NEIGHBOURS: Record<string, Set<string>> = (() => {
  const m: Record<string, Set<string>> = {};
  for (const n of NODES) m[n.id] = new Set();
  for (const e of EDGES) {
    m[e.a].add(e.b);
    m[e.b].add(e.a);
  }
  return m;
})();

/** The projects a theme belongs to. */
export const PROJECTS_OF = (theme: string): string[] => Object.keys(USED).filter((slug) => USED[slug].includes(theme));

/** The themes of a project, in the order they are listed, for the screen reader summary. */
export const THEMES_OF = (slug: string): SpatialNode[] => (USED[slug] || []).map((id) => NODES.find((n) => n.id === id) as SpatialNode);
