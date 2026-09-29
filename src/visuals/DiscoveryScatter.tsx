import { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '../components/useReveal';
import { seeded } from './random';

const W = 1200;
const H = 560;
const COUNT = 1200;
const CHOSEN = { x: 430, y: 290 };

/**
 * Eventully hero. 1,200 dots, one per registered organisation. The wall of noise is what
 * students saw; pressing the button (or scrolling it into view) resolves it to one match.
 */
export default function DiscoveryScatter() {
  const [matched, setMatched] = useState(false);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const dots = useMemo(() => {
    const r = seeded(1200);
    return Array.from({ length: COUNT }, () => ({
      x: 10 + r() * (W - 20),
      y: 10 + r() * (H - 20),
      o: 0.25 + r() * 0.5,
      s: r() < 0.8 ? 2.2 : 3.2,
    }));
  }, []);

  // Resolve once on first view, unless the reader has already used the button or prefers less motion.
  useEffect(() => {
    if (prefersReducedMotion() || touched || !ref.current) return;
    let t: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          t = setTimeout(() => setMatched(true), 1400);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [touched]);

  const toggle = () => {
    setTouched(true);
    setMatched((m) => !m);
  };

  return (
    <div className="scatter" ref={ref}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={
          matched
            ? 'Twelve hundred faded dots, one per organisation, with a single highlighted dot: the one match that fits.'
            : 'Twelve hundred scattered dots, one per registered student organisation, with nothing to tell them apart.'
        }
      >
        {dots.map((d, i) => (
          <circle
            key={i}
            className="dot"
            cx={d.x}
            cy={d.y}
            r={d.s}
            fill="#a1a1a1"
            opacity={matched ? 0.07 : d.o}
          />
        ))}
        <g style={{ opacity: matched ? 1 : 0, transition: 'opacity 0.8s var(--expo) 0.4s' }}>
          <circle cx={CHOSEN.x} cy={CHOSEN.y} r="34" fill="none" stroke="#ff6b35" strokeWidth="1.5" opacity="0.5" />
          <circle cx={CHOSEN.x} cy={CHOSEN.y} r="18" fill="none" stroke="#ff6b35" strokeWidth="2" />
          <circle cx={CHOSEN.x} cy={CHOSEN.y} r="8" fill="#ff6b35" />
          <line x1={CHOSEN.x + 34} y1={CHOSEN.y} x2={W * 0.6 - 16} y2={CHOSEN.y} stroke="#ff6b35" strokeWidth="1.5" strokeDasharray="4 6" />
        </g>
      </svg>

      <div className={`match-card${matched ? ' on' : ''}`} style={{ left: '74%' }} aria-hidden={!matched}>
        <span className="k">One match · illustrative</span>
        <p style={{ marginTop: '0.5rem', fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.25 }}>
          A club you would not have found scrolling
        </p>
        <div className="why">
          <span>Matches your filters <b>yes</b></span>
          <span>Matches what you described <b>close</b></span>
          <span>Why it is here <b>shown</b></span>
        </div>
      </div>

      <div className="scatter-bar">
        <span className="scatter-count" aria-live="polite">
          {matched ? '1 of 1,200+ organisations, with the reason it was picked' : '1,200+ registered organisations, zero signal'}
        </span>
        <button type="button" className="ctl" aria-pressed={matched} onClick={toggle}>
          {matched ? 'Show the noise' : 'Find a match'}
        </button>
      </div>
    </div>
  );
}
