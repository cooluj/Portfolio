import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as RKey } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLab } from '../LabContext';
import { prefersReducedMotion } from '../../components/useReveal';
import { EMAIL, RESUME, copyText, isTyping, trapFocus } from './util';

type Action = { id: string; group: 'Go' | 'Open' | 'Do'; name: string; hint: string; keys: string; run: () => void | Promise<string | void> };

const HOME_SECTIONS: [string, string][] = [['Work', '#work'], ['About', '#about'], ['Timeline', '#journey'], ['Contact', '#contact']];
const CASES: [string, string][] = [['Eventully', 'eventully'], ['Superpowr.ai', 'superpowr'], ['PainSights', 'painsights']];

/** Cmd/Ctrl+K or / opens a dialog that jumps anywhere on the site, copies the email or grabs the resume. */
export default function Palette() {
  const lab = useLab();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState('');
  const dialog = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const timer = useRef(0);

  const goHash = useCallback(
    (h: string) => {
      if (pathname === '/' && hash === h) document.querySelector(h)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      else navigate({ pathname: '/', hash: h });
    },
    [navigate, pathname, hash],
  );

  const actions = useMemo<Action[]>(
    () => [
      { id: 'home', group: 'Go', name: 'Home', hint: '/', keys: 'home top start', run: () => navigate('/') },
      ...HOME_SECTIONS.map<Action>(([name, h]) => ({ id: h.slice(1), group: 'Go', name: `Go to ${name}`, hint: `/${h}`, keys: `${name} section jump`, run: () => goHash(h) })),
      ...CASES.map<Action>(([name, slug]) => ({ id: slug, group: 'Open', name: `Open ${name}`, hint: `/work/${slug}`, keys: `${name} case study project work`, run: () => navigate(`/work/${slug}`) })),
      { id: 'copy', group: 'Do', name: 'Copy email', hint: EMAIL, keys: 'mail contact address clipboard', run: async () => ((await copyText(EMAIL)) ? 'Email copied' : 'Copy failed') },
      { id: 'resume', group: 'Do', name: 'Download resume', hint: 'PDF', keys: 'cv pdf', run: () => { window.open(RESUME, '_blank', 'noopener'); } },
      { id: 'lab', group: 'Do', name: 'Open the lab', hint: 'L', keys: 'design lab panel explore', run: () => lab.setOpen(true) },
      { id: 'shuffle', group: 'Do', name: 'Shuffle the lab', hint: 'random', keys: 'random surprise', run: () => { lab.shuffle(); return 'Shuffled'; } },
      { id: 'reset', group: 'Do', name: 'Reset the lab', hint: 'defaults', keys: 'default clear', run: () => { lab.reset(); return 'Back to the defaults'; } },
    ],
    [navigate, goHash, lab],
  );

  // Every word typed must appear somewhere in the name or keywords; names that start with the query rank first.
  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return actions;
    return actions
      .map((a) => {
        const hay = `${a.name} ${a.keys} ${a.hint}`.toLowerCase();
        if (!words.every((w) => hay.includes(w))) return null;
        return { a, score: a.name.toLowerCase().startsWith(words[0]) ? 0 : a.name.toLowerCase().includes(words[0]) ? 1 : 2 };
      })
      .filter((x): x is { a: Action; score: number } => x !== null)
      .sort((x, y) => x.score - y.score)
      .map((x) => x.a);
  }, [q, actions]);

  const close = useCallback(() => {
    setOpen(false);
    returnTo.current?.focus?.();
  }, []);

  const run = useCallback(
    async (a: Action) => {
      const msg = await a.run();
      if (typeof msg === 'string') {
        setStatus(msg);
        clearTimeout(timer.current);
        timer.current = window.setTimeout(close, 900);
      } else close();
    },
    [close],
  );

  // Global opener: Cmd/Ctrl+K anywhere, / when not typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const cmdK = (e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k';
      const slash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e);
      if (!cmdK && !slash) return;
      e.preventDefault();
      setOpen((o) => {
        if (!o) returnTo.current = document.activeElement as HTMLElement | null;
        return !o;
      });
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  // While open: reset the query, focus the field, lock scroll, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;
    setQ('');
    setActive(0);
    setStatus('');
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    input.current?.focus();
    const untrap = dialog.current ? trapFocus(dialog.current) : () => {};
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      untrap();
      removeEventListener('keydown', onKey);
      clearTimeout(timer.current);
    };
  }, [open, close]);

  useEffect(() => setActive(0), [q]);

  // Keep the active row in view when moving with the keyboard.
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const onInputKey = (e: RKey) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(Math.max(0, results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) void run(results[active]);
    }
  };

  let lastGroup = '';
  return (
    <div className="ft-pal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={dialog} className="ft-pal" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="ft-pal-field">
          <span className="ft-pal-prompt" aria-hidden="true">&gt;</span>
          <input
            ref={input}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Where to?"
            aria-label="Search actions"
            aria-controls="ft-pal-list"
            aria-activedescendant={results[active] ? `ft-pal-${results[active].id}` : undefined}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button type="button" className="ft-kbd ft-pal-close" onClick={close} aria-label="Close">esc</button>
        </div>
        <div ref={list} id="ft-pal-list" className="ft-pal-list" role="listbox" aria-label="Actions">
          {results.map((a, i) => {
            const head = a.group !== lastGroup ? a.group : '';
            lastGroup = a.group;
            return (
              <div key={a.id} className="ft-pal-row">
                {head && <div className="ft-pal-group" role="presentation">{head}</div>}
                <button
                  type="button"
                  id={`ft-pal-${a.id}`}
                  role="option"
                  aria-selected={i === active}
                  data-i={i}
                  tabIndex={-1}
                  className="ft-pal-item"
                  onMouseMove={() => setActive(i)}
                  onClick={() => void run(a)}
                >
                  <span className="ft-pal-name">{a.name}</span>
                  <span className="ft-pal-hint">{a.hint}</span>
                </button>
              </div>
            );
          })}
          {!results.length && <p className="ft-pal-empty">Nothing matches. Try work, about, resume or email.</p>}
        </div>
        <div className="ft-pal-foot">
          <span aria-live="polite" className="ft-pal-status">{status || `${results.length} ${results.length === 1 ? 'action' : 'actions'}`}</span>
          <span className="ft-pal-keys" aria-hidden="true">
            <kbd className="ft-kbd">&uarr;</kbd><kbd className="ft-kbd">&darr;</kbd> move <kbd className="ft-kbd">&crarr;</kbd> run
          </span>
        </div>
      </div>
    </div>
  );
}
