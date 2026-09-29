import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useLab } from '../LabContext';
import { prefersReducedMotion } from '../../components/useReveal';

type Mode = 'dot' | 'ring' | 'label' | 'trail' | 'spotlight';
const MODES: Mode[] = ['dot', 'ring', 'label', 'trail', 'spotlight'];
const TRAIL = 8;

// Anything the ring grows over.
const HOT = 'a, button, [data-cursor], [role="button"], label, summary, input[type="range"], input[type="checkbox"], input[type="radio"]';
// Text fields keep the native I-beam; the custom cursor steps aside while over them.
const TEXT = 'textarea, select, [contenteditable="true"], input:not([type="button"], [type="submit"], [type="checkbox"], [type="radio"], [type="range"], [type="file"], [type="color"])';

// One moving point: k is the lerp factor per frame (1 snaps), chain > -1 follows that point instead of the pointer.
type Pt = { el: HTMLElement; k: number; chain: number; x: number; y: number };

/** Custom pointer for fine pointers only. Mounts nothing for 'system', coarse pointers or reduced motion. */
export default function LabCursor() {
  const { sel } = useLab();
  const mode = MODES.includes(sel.cursor as Mode) ? (sel.cursor as Mode) : null;
  const [fine, setFine] = useState(false);
  const host = useRef<HTMLDivElement>(null);

  // Re-evaluated live: docking a mouse or flipping the OS motion setting switches it on or off.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setFine(mq.matches && !prefersReducedMotion());
    sync();
    mq.addEventListener('change', sync);
    rm.addEventListener('change', sync);
    return () => {
      mq.removeEventListener('change', sync);
      rm.removeEventListener('change', sync);
    };
  }, []);

  const on = fine && mode !== null;

  useEffect(() => {
    const root = host.current;
    if (!on || !root || !mode) return;
    const pts: Pt[] = Array.from(root.querySelectorAll<HTMLElement>('.lc-p')).map((el, i) => ({
      el, k: Number(el.dataset.k) || 1, chain: el.dataset.chain === '' ? i - 1 : -1, x: 0, y: 0,
    }));
    const ring = root.querySelector<HTMLElement>('.lc-ring');
    const word = root.querySelector<HTMLElement>('.lc-word');
    if (mode !== 'spotlight') document.body.classList.add('cur-hide');

    let px = 0;
    let py = 0;
    let raf = 0;
    let shown = false;

    // The loop runs only while something is still travelling toward its target.
    const step = () => {
      let moving = false;
      for (const p of pts) {
        const tx = p.chain < 0 ? px : pts[p.chain].x;
        const ty = p.chain < 0 ? py : pts[p.chain].y;
        const dx = tx - p.x;
        const dy = ty - p.y;
        if (p.k >= 1 || (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05)) {
          p.x = tx;
          p.y = ty;
        } else {
          p.x += dx * p.k;
          p.y += dy * p.k;
          moving = true;
        }
        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      }
      raf = moving ? requestAnimationFrame(step) : 0;
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const hide = () => {
      shown = false;
      root.classList.remove('is-on', 'is-down');
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      if (!shown) {
        // First sighting: everything starts under the pointer instead of sliding in from the corner.
        shown = true;
        for (const p of pts) {
          p.x = px;
          p.y = py;
        }
        root.classList.add('is-on');
      }
      wake();
    };

    // Hover state is decided when the pointer enters an element, not on every move.
    const over = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !(e.target instanceof Element)) return;
      const text = e.target.closest(TEXT);
      root.classList.toggle('is-off', !!text);
      const hot = text ? null : e.target.closest(HOT);
      root.classList.toggle('is-hover', !!hot);
      if (mode !== 'label' || !ring || !word) return;
      const w = hot ? e.target.closest('[data-cursor]')?.getAttribute('data-cursor') || '' : '';
      if (w) {
        word.textContent = w;
        ring.style.setProperty('--lw', `${Math.ceil(word.getBoundingClientRect().width) + 28}px`);
      }
      root.classList.toggle('is-word', !!w);
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') root.classList.add('is-down');
    };
    const up = () => root.classList.remove('is-down');

    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointercancel', up, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerdown', down);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      document.documentElement.removeEventListener('mouseleave', hide);
      window.removeEventListener('blur', hide);
      if (raf) cancelAnimationFrame(raf);
      document.body.classList.remove('cur-hide');
    };
  }, [on, mode]);

  if (!on || !mode) return null;
  return (
    <div ref={host} key={mode} className={`lc lc-${mode}`} aria-hidden="true">
      {mode === 'dot' && <span className="lc-p lc-dot" data-k="1" />}
      {(mode === 'ring' || mode === 'label') && (
        <>
          <span className="lc-p lc-ring" data-k="0.18">
            {mode === 'label' && <span className="lc-word" />}
          </span>
          <span className="lc-p lc-pin" data-k="1" />
        </>
      )}
      {mode === 'trail' &&
        Array.from({ length: TRAIL }, (_, i) => (
          <span key={i} className="lc-p lc-t" data-k={i ? 0.35 : 1} data-chain={i ? '' : undefined} style={{ '--i': i } as CSSProperties} />
        ))}
      {mode === 'spotlight' && <span className="lc-p lc-spot" data-k="0.22" />}
    </div>
  );
}
