import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLab } from '../LabContext';
import { prefersReducedMotion } from '../../components/useReveal';
import { isPlain, trapFocus } from './util';

const CHORD_MS = 1200;
const JUMPS: Record<string, [string, string]> = { w: ['Work', '#work'], a: ['About', '#about'], t: ['Timeline', '#journey'], c: ['Contact', '#contact'] };

/** g then w, a, t, c jumps to a home section; g then l opens the lab page; ? lists everything. */
export default function Shortcuts() {
  const lab = useLab();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [pending, setPending] = useState(false);
  const [help, setHelp] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const loc = useRef({ pathname, hash });
  loc.current = { pathname, hash };

  useEffect(() => {
    let timer = 0;
    let armed = false;
    const disarm = () => {
      armed = false;
      clearTimeout(timer);
      setPending(false);
    };
    // Capture phase so the g-l chord can stop the lab panel's own L toggle from also firing.
    const onKey = (e: KeyboardEvent) => {
      if (!isPlain(e)) return;
      if (e.key === '?') {
        e.preventDefault();
        returnTo.current = document.activeElement as HTMLElement | null;
        setHelp((h) => !h);
        disarm();
        return;
      }
      if (e.key === 'Escape') {
        disarm();
        return;
      }
      if (!armed) {
        if (e.key === 'g') {
          armed = true;
          setPending(true);
          timer = window.setTimeout(disarm, CHORD_MS);
        }
        return;
      }
      const k = e.key.toLowerCase();
      if (k === 'l') {
        e.preventDefault();
        e.stopPropagation();
        disarm();
        navigate('/lab');
        return;
      }
      const jump = JUMPS[k];
      if (jump) {
        e.preventDefault();
        disarm();
        const h = jump[1];
        const { pathname: p, hash: cur } = loc.current;
        const el = p === '/' ? document.querySelector<HTMLElement>(h) : null;
        if (el && cur === h) el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        else navigate({ pathname: '/', hash: h });
        return;
      }
      if (k !== 'g') disarm();
    };
    addEventListener('keydown', onKey, true);
    return () => {
      removeEventListener('keydown', onKey, true);
      clearTimeout(timer);
    };
  }, [navigate]);

  // The help sheet: Escape closes, focus stays inside, focus returns afterwards.
  useEffect(() => {
    if (!help) return;
    const el = dialog.current;
    el?.querySelector<HTMLElement>('button')?.focus();
    const untrap = el ? trapFocus(el) : () => {};
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setHelp(false);
      }
    };
    addEventListener('keydown', onKey);
    return () => {
      untrap();
      removeEventListener('keydown', onKey);
      returnTo.current?.focus?.();
    };
  }, [help]);

  const rows: [string[], string][] = [
    [['g', 'w'], 'Work'],
    [['g', 'a'], 'About'],
    [['g', 't'], 'Timeline'],
    [['g', 'c'], 'Contact'],
    [['g', 'l'], 'The lab page'],
    [['L'], 'Lab panel'],
  ];
  if (lab.has('palette')) rows.push([['Cmd', 'K'], 'Command palette'], [['/'], 'Command palette']);
  if (lab.has('inspect')) rows.push([['i'], 'Inspect mode']);
  if (lab.has('grid')) rows.push([['g', 'g'], 'Layout grid']);
  rows.push([['?'], 'This list'], [['esc'], 'Close anything']);

  return (
    <>
      <div className={`ft-chord${pending ? ' on' : ''}`} aria-hidden="true">
        <kbd className="ft-kbd">g</kbd><span>then w, a, t, c or l</span>
      </div>
      {help && (
        <div className="ft-pal-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget) setHelp(false); }}>
          <div ref={dialog} className="ft-help" role="dialog" aria-modal="true" aria-labelledby="ft-help-h">
            <div className="ft-help-head">
              <h2 id="ft-help-h">Keyboard</h2>
              <button type="button" className="ft-kbd ft-pal-close" onClick={() => setHelp(false)} aria-label="Close">esc</button>
            </div>
            <dl className="ft-help-list">
              {rows.map(([keys, what]) => (
                <div key={keys.join() + what}>
                  <dt>{keys.map((k, i) => <kbd key={i} className="ft-kbd">{k}</kbd>)}</dt>
                  <dd>{what}</dd>
                </div>
              ))}
            </dl>
            <p className="ft-help-note">Chords are typed one key after the other, the way Gmail and GitHub do it.</p>
          </div>
        </div>
      )}
    </>
  );
}
