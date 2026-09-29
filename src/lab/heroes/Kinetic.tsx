import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../components/useReveal';
import { useVoice } from '../copy';
import { Ctas } from './parts';

const WORDS = ['researches.', 'prototypes.', 'tests.', 'ships.', 'builds.'];
const REST = WORDS.length - 1;
const STEP = 1600;

/** "Designer who ___": the blank cycles one verb per 1.6s, pausing on hover or focus. Reduced motion rests on "builds." */
export default function Kinetic() {
  const v = useVoice();
  const still = prefersReducedMotion();
  const [{ i, prev }, setS] = useState<{ i: number; prev: number | null }>({ i: still ? REST : 0, prev: null });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (still || paused) return;
    const id = window.setInterval(() => setS((s) => ({ i: (s.i + 1) % WORDS.length, prev: s.i })), STEP);
    return () => window.clearInterval(id);
  }, [still, paused]);

  // Drop the outgoing word once its exit animation is over.
  useEffect(() => {
    if (prev === null) return;
    const id = window.setTimeout(() => setS((s) => ({ ...s, prev: null })), 700);
    return () => window.clearTimeout(id);
  }, [prev]);

  const on = () => setPaused(true);
  const off = () => setPaused(false);

  return (
    <section
      className={`hm-hero hero-kinetic gutter${paused ? ' is-paused' : ''}`}
      aria-labelledby="hm-h"
      onPointerEnter={on}
      onPointerLeave={off}
      onFocus={on}
      onBlur={off}
    >
      <p className="hm-eyebrow">{v.eyebrow}</p>
      <h1 id="hm-h" className="hm-h1">
        <span className="hm-h1-line">Designer</span>
        <span className="hm-h1-line hero-kin-line">
          <span className="hero-kin-who">who</span>{' '}
          <span className="sr-only">builds.</span>
          <span className="hero-kin-slot" aria-hidden="true">
            {WORDS.map((w, n) => (
              <span
                key={w}
                className={`hero-kin-word${n === i ? ' is-in' : ''}${n === prev ? ' is-out' : ''}`}
              >
                {w}
              </span>
            ))}
          </span>
        </span>
      </h1>
      <p className="hm-lede">{v.lede}</p>
      <Ctas cta={v.cta} />
    </section>
  );
}
