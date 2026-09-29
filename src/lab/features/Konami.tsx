import { useEffect, useState } from 'react';

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const HOLD_MS = 3000;

/** Up up down down left right left right b a: the ember takes the borders and the wordmark for three seconds. */
export default function Konami() {
  const [hit, setHit] = useState(0);

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === CODE[i] ? i + 1 : k === CODE[0] ? 1 : 0;
      if (i === CODE.length) {
        i = 0;
        setHit((n) => n + 1);
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!hit) return;
    const root = document.documentElement;
    root.classList.add('ft-konami');
    const t = window.setTimeout(() => root.classList.remove('ft-konami'), HOLD_MS);
    return () => {
      clearTimeout(t);
      root.classList.remove('ft-konami');
    };
  }, [hit]);

  return (
    <>
      <div className="sr-only" aria-live="polite">{hit ? 'You found it.' : ''}</div>
      {hit > 0 && <div className="ft-konami-frame" key={hit} aria-hidden="true"><span>you found it</span></div>}
    </>
  );
}
