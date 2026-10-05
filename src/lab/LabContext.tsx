import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DEFAULTS, DIMENSIONS, differs } from './registry';

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

/** Storage holds only the diff from DEFAULTS plus a version, so a later change to DEFAULTS reaches returning visitors.
 *  Older keys (ua-lab, ua-lab-2) are ignored on purpose. */
const KEY = 'ua-lab-3';
const VERSION = 3;
const Ctx = createContext<Lab | null>(null);

const parse = (s: string): Sel =>
  Object.fromEntries(
    s.split(',').map((p) => p.split(':')).filter(([k, v]) => k && v !== undefined).map(([k, v]) => [k, v.replace(/\+/g, ' ')]),
  );
const serialize = (sel: Sel) =>
  DIMENSIONS.filter((d) => sel[d.id] && sel[d.id] !== DEFAULTS[d.id]).map((d) => `${d.id}:${sel[d.id].replace(/ /g, '+')}`).join(',');

/** Only the dimensions that are not at their default. */
const diff = (sel: Sel): Sel => Object.fromEntries(DIMENSIONS.filter((d) => differs(d.id, sel[d.id])).map((d) => [d.id, sel[d.id]]));

function readStored(): Sel | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { v?: number; sel?: unknown };
    if (data?.v !== VERSION || !data.sel || typeof data.sel !== 'object') return null;
    return data.sel as Sel;
  } catch {
    return null;
  }
}

/** Drop unknown ids so a stale link or store cannot leave the page half-styled. */
function clean(sel: Sel): Sel {
  for (const d of DIMENSIONS) {
    if (d.multi) sel[d.id] = (sel[d.id] || '').split(' ').filter((f) => d.options.some((o) => o.id === f)).join(' ');
    else if (!d.options.some((o) => o.id === sel[d.id])) sel[d.id] = DEFAULTS[d.id];
  }
  return sel;
}

function initial(): { sel: Sel; touched: boolean; fromQuery: boolean } {
  let sel: Sel = { ...DEFAULTS };
  const stored = readStored();
  if (stored) sel = { ...sel, ...stored };
  let fromQuery = false;
  try {
    const q = new URLSearchParams(location.search).get('lab');
    if (q) {
      sel = { ...sel, ...parse(q) };
      fromQuery = true;
    }
  } catch {
    /* no location */
  }
  // A shared link is session-only: it applies, but is not kept unless the visitor changes something afterwards.
  return { sel: clean(sel), touched: !!stored, fromQuery };
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
  const [init] = useState(initial);
  const [sel, setSel] = useState<Sel>(init.sel);
  const [open, setOpen] = useState(false);
  const touched = useRef(init.touched);
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();

  // ?lab= is consumed once: strip it from the address so a reload or a copied URL does not carry it along.
  useEffect(() => {
    if (!init.fromQuery) return;
    const params = new URLSearchParams(search);
    if (!params.has('lab')) return;
    params.delete('lab');
    const rest = params.toString();
    navigate({ pathname, search: rest ? `?${rest}` : '', hash }, { replace: true });
  }, [init.fromQuery, navigate, pathname, search, hash]);

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
    if (!touched.current) return;
    try {
      const d = diff(sel);
      if (Object.keys(d).length) localStorage.setItem(KEY, JSON.stringify({ v: VERSION, sel: d }));
      else localStorage.removeItem(KEY);
    } catch {
      /* storage blocked */
    }
  }, [sel]);

  const set = useCallback((dim: string, id: string) => {
    touched.current = true;
    setSel((s) => ({ ...s, [dim]: id }));
  }, []);
  const toggleFeature = useCallback((id: string) => {
    touched.current = true;
    setSel((s) => {
      const on = new Set((s.features || '').split(' ').filter(Boolean));
      if (on.has(id)) on.delete(id);
      else on.add(id);
      return { ...s, features: [...on].join(' ') };
    });
  }, []);
  const has = useCallback((f: string) => (sel.features || '').split(' ').includes(f), [sel.features]);
  const shuffle = useCallback(() => {
    // pick a random option per single-choice dimension, keep whatever features are on
    touched.current = true;
    let seed = (Date.now() % 100000) + 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    setSel((s) => {
      const next: Sel = { ...s };
      for (const d of DIMENSIONS) if (!d.multi) next[d.id] = d.options[Math.floor(rnd() * d.options.length)].id;
      return next;
    });
  }, []);
  const reset = useCallback(() => {
    touched.current = true;
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* storage blocked */
    }
    setSel({ ...DEFAULTS });
  }, []);
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
