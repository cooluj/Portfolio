import { useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { prefersReducedMotion } from '../components/useReveal';

type Side = { need: string; alt: string; src?: string };

function Layer({ side, className }: { side: Side; className: string }) {
  return (
    <div className={`ba-layer ${className}`}>
      {side.src ? (
        <img src={side.src} alt={side.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className="ph-block" role="img" aria-label={`Placeholder, image not supplied yet: ${side.need}`}>
          <span>[PLACEHOLDER: {side.need}]</span>
        </div>
      )}
    </div>
  );
}

const HINT_MS = 1800;
// The handle nudges 50 -> 34 -> 66 -> 50 once, so it reads as draggable before anyone touches it.
const HINT_PATH: [number, number, number][] = [[50, 34, 0.3], [34, 66, 0.4], [66, 50, 0.3]];
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const hintAt = (p: number) => {
  let start = 0;
  for (const [from, to, share] of HINT_PATH) {
    if (p <= start + share) return from + (to - from) * easeInOut((p - start) / share);
    start += share;
  }
  return 50;
};

/** Drag or arrow-key comparison. A native range input drives it, so it is keyboard and screen reader friendly. */
export default function BeforeAfter({ label, before, after, caption }: { label: string; before: Side; after: Side; caption?: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  const frame = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const raf = useRef(0);

  const stopHint = () => {
    touched.current = true;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = 0;
  };

  useEffect(() => {
    const el = frame.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (touched.current) return;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / HINT_MS, 1);
          setPos(hintAt(p));
          raf.current = p < 1 ? requestAnimationFrame(tick) : 0;
        };
        raf.current = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, []);

  const posFrom = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
  };
  const rounded = Math.round(pos);

  return (
    <figure className="ba" onPointerDown={stopHint} onKeyDown={stopHint}>
      <div
        ref={frame}
        className="ba-frame"
        data-cursor="Drag"
        style={{ '--pos': `${pos}%` } as CSSProperties}
        onPointerDown={(e) => {
          if (!e.isPrimary) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          setPos(posFrom(e));
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) setPos(posFrom(e));
        }}
      >
        <Layer side={before} className="ba-before" />
        <Layer side={after} className="ba-after" />
        <span className="ba-tag l" aria-hidden="true">Before</span>
        <span className="ba-tag r" aria-hidden="true">After</span>
        <span className="ba-line" aria-hidden="true">
          <span className="ba-knob">‹ ›</span>
        </span>
      </div>
      <div className="ba-range">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={rounded}
          onChange={(e) => setPos(Number(e.target.value))}
          onFocus={stopHint}
          aria-valuetext={`${100 - rounded}% after, ${rounded}% before`}
        />
      </div>
      {caption && <figcaption className="cs-fig" style={{ marginTop: '0.5rem' }}><span className="mono-label" style={{ letterSpacing: '0.06em', textTransform: 'none' }}>{caption}</span></figcaption>}
    </figure>
  );
}
