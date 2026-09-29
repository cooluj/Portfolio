import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../components/useReveal';
import { useVoice } from '../copy';
import { Ctas } from './parts';

const MS = 25;
const START = 700;

/** The lede types itself at 25ms per character with a block cursor, then the cursor keeps blinking. */
export default function Typewriter() {
  const v = useVoice();
  const still = prefersReducedMotion();
  const [n, setN] = useState(() => (still ? v.lede.length : 0));
  const done = n >= v.lede.length;

  useEffect(() => {
    if (still) {
      setN(v.lede.length);
      return;
    }
    // Restart when the voice changes the lede under us.
    setN(0);
    let id = 0;
    let k = 0;
    const tick = () => {
      k += 1;
      setN(k);
      if (k < v.lede.length) id = window.setTimeout(tick, MS);
    };
    id = window.setTimeout(tick, START);
    return () => window.clearTimeout(id);
  }, [v.lede, still]);

  return (
    <section className="hm-hero hero-typewriter gutter" aria-labelledby="hm-h">
      <p className="hm-eyebrow">{v.eyebrow}</p>
      <h1 id="hm-h" className="hm-h1">
        {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
      </h1>
      <p className={`hm-lede hero-tw-lede${done ? ' is-done' : ''}`}>
        <span className="sr-only">{v.lede}</span>
        <span className="hero-tw-size" aria-hidden="true">{v.lede}</span>
        <span className="hero-tw-text" aria-hidden="true">
          {v.lede.slice(0, n)}
          <span className="hero-tw-cursor" />
        </span>
      </p>
      <Ctas cta={v.cta} />
    </section>
  );
}
