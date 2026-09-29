import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULTS, DIMENSIONS } from './registry';

type Sel = Record<string, string>;
type Lab = {
  sel: Sel;
  set: (dim: string, id: string) => void;
  toggleFeature: (id: string) => void;
  has: (feature: string) => boolean;
  shuffle: () => void;
  reset: () => void;
  shareUrl: () => string;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const KEY = 'ua-lab-2';
const Ctx = createContext<Lab | null>(null);

const parse = (s: string): Sel =>
  Object.fromEntries(
    s.split(',').map((p) => p.split(':')).filter(([k, v]) => k && v !== undefined).map(([k, v]) => [k, v.replace(/\+/g, ' ')]),
  );
const serialize = (sel: Sel) =>
  DIMENSIONS.filter((d) => sel[d.id] && sel[d.id] !== DEFAULTS[d.id]).map((d) => `${d.id}:${sel[d.id].replace(/ /g, '+')}`).join(',');

function initial(): Sel {
  let sel: Sel = { ...DEFAULTS };
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) sel = { ...sel, ...JSON.parse(saved) };
  } catch {
    /* storage blocked */
  }
  try {
    const q = new URLSearchParams(location.search).get('lab');
    if (q) sel = { ...sel, ...parse(q) };
  } catch {
    /* no location */
  }
  // drop unknown ids so a stale link cannot leave the page half-styled
  for (const d of DIMENSIONS) {
    if (d.multi) sel[d.id] = (sel[d.id] || '').split(' ').filter((f) => d.options.some((o) => o.id === f)).join(' ');
    else if (!d.options.some((o) => o.id === sel[d.id])) sel[d.id] = DEFAULTS[d.id];
  }
  return sel;
}

const loaded = new Set<string>();
function loadFont(url: string) {
  if (loaded.has(url)) return;
  loaded.add(url);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

export function LabProvider({ children }: { children: ReactNode }) {
  const [sel, setSel] = useState<Sel>(initial);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    for (const d of DIMENSIONS) {
      // every dimension is written, defaults included, so a curated default can be any option
      const v = sel[d.id];
      if (!v) delete root.dataset[`l${d.id[0].toUpperCase()}${d.id.slice(1)}`];
      else root.dataset[`l${d.id[0].toUpperCase()}${d.id.slice(1)}`] = v;
    }
    const type = DIMENSIONS[0].options.find((o) => o.id === sel.type);
    if (type?.fonts) loadFont(type.fonts);
    try {
      localStorage.setItem(KEY, JSON.stringify(sel));
    } catch {
      /* storage blocked */
    }
  }, [sel]);

  const set = useCallback((dim: string, id: string) => setSel((s) => ({ ...s, [dim]: id })), []);
  const toggleFeature = useCallback(
    (id: string) =>
      setSel((s) => {
        const on = new Set((s.features || '').split(' ').filter(Boolean));
        if (on.has(id)) on.delete(id);
        else on.add(id);
        return { ...s, features: [...on].join(' ') };
      }),
    [],
  );
  const has = useCallback((f: string) => (sel.features || '').split(' ').includes(f), [sel.features]);
  const shuffle = useCallback(() => {
    // pick a random option per single-choice dimension, keep whatever features are on
    let seed = (Date.now() % 100000) + 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    setSel((s) => {
      const next: Sel = { ...s };
      for (const d of DIMENSIONS) if (!d.multi) next[d.id] = d.options[Math.floor(rnd() * d.options.length)].id;
      return next;
    });
  }, []);
  const reset = useCallback(() => setSel({ ...DEFAULTS }), []);
  const shareUrl = useCallback(() => {
    const q = serialize(sel);
    const base = location.origin + location.pathname;
    return q ? `${base}?lab=${q}` : base;
  }, [sel]);

  const value = useMemo<Lab>(() => ({ sel, set, toggleFeature, has, shuffle, reset, shareUrl, open, setOpen }), [sel, set, toggleFeature, has, shuffle, reset, shareUrl, open]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLab(): Lab {
  const v = useContext(Ctx);
  if (!v) throw new Error('useLab outside LabProvider');
  return v;
}
