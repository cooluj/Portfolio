import { useEffect, useRef, useState } from 'react';
import { useVoice } from '../copy';
import { Ctas } from './parts';

const NAME = 'Ujjawal Agrawal';

/** The name at full container width, the claim underneath. The SVG viewBox is fitted to the measured glyph box. */
export default function Nameplate() {
  const v = useVoice();
  const text = useRef<SVGTextElement>(null);
  const [box, setBox] = useState<string | null>(null);

  useEffect(() => {
    const t = text.current;
    if (!t || typeof t.getBBox !== 'function') return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const b = t.getBBox();
      if (b.width && b.height) setBox(`${b.x.toFixed(1)} ${b.y.toFixed(1)} ${b.width.toFixed(1)} ${b.height.toFixed(1)}`);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    // Re-fit when web fonts land or the lab swaps the typeface.
    const fonts = document.fonts;
    fonts?.ready.then(queue).catch(() => undefined);
    fonts?.addEventListener?.('loadingdone', queue);
    const mo = new MutationObserver(queue);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-l-type'] });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      fonts?.removeEventListener?.('loadingdone', queue);
      mo.disconnect();
    };
  }, []);

  return (
    <section className="hm-hero hero-nameplate gutter" aria-labelledby="hm-h">
      <p className="hm-eyebrow">{v.eyebrow}</p>
      <p className="hero-np-name">
        <span className="sr-only">{NAME}</span>
        <svg className="hero-np-svg" viewBox={box || '0 0 1000 100'} aria-hidden="true" focusable="false" data-fitted={box ? '' : undefined}>
          <text ref={text} x="0" y="80" fontSize="100" fontWeight="800" letterSpacing="-5">{NAME}</text>
        </svg>
      </p>
      <div className="hero-np-row">
        <h1 id="hm-h" className="hm-h1">
          {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
        </h1>
        <div className="hero-np-side">
          <p className="hm-lede">{v.lede}</p>
          <Ctas cta={v.cta} />
        </div>
      </div>
    </section>
  );
}
