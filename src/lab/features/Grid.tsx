import { useEffect, useState } from 'react';
import { isPlain } from './util';

const DOUBLE_MS = 600;
const COLS = Array.from({ length: 12 }, (_, i) => i + 1);

/** The 12-column overlay. Shown by CSS while html has ft-grid or ft-inspect; rendered once for both. */
export function GridOverlay() {
  return (
    <div className="ft-grid" aria-hidden="true">
      <div className="ft-grid-cols">
        {COLS.map((n) => <span key={n} data-n={n} />)}
      </div>
    </div>
  );
}

/** g twice inside 600ms toggles the layout grid. */
export default function Grid() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    let last = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOn(false);
      if (e.key !== 'g' || !isPlain(e)) return;
      const now = performance.now();
      if (now - last < DOUBLE_MS) {
        last = 0;
        setOn((v) => !v);
      } else last = now;
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!on) return;
    document.documentElement.classList.add('ft-grid-on');
    return () => document.documentElement.classList.remove('ft-grid-on');
  }, [on]);

  return <div className="sr-only" aria-live="polite">{on ? 'Layout grid on' : ''}</div>;
}
