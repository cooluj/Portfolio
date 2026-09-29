import { useState } from 'react';
import { useVoice } from '../copy';
import { Ctas } from './parts';

const BUILD_LEDE = 'I write the front-end I design. React, TypeScript, Flask. The design I test is the design that ships.';

/** A real two-option switch in the headline. Designer shows the design-side copy, Builder the code-side copy. */
export default function Toggle() {
  const v = useVoice();
  const [side, setSide] = useState<'designer' | 'builder'>('designer');
  const builder = side === 'builder';

  return (
    <section className={`hm-hero hero-toggle gutter${builder ? ' is-builder' : ''}`} aria-labelledby="hm-h">
      <p className="hm-eyebrow">{v.eyebrow}</p>
      <h1 id="hm-h" className="hm-h1">
        <span className="hm-h1-line hero-tg-line">
          <span className="hero-tg-switch" role="group" aria-label="Which side of the work to read about">
            <button type="button" className="hero-tg-opt" aria-pressed={!builder} onClick={() => setSide('designer')}>
              Designer
            </button>
            <span className="hero-tg-slash" aria-hidden="true">/</span>
            <button type="button" className="hero-tg-opt" aria-pressed={builder} onClick={() => setSide('builder')}>
              Builder
            </button>
          </span>
        </span>
        <span className="hm-h1-line hero-tg-claim" key={side}>{builder ? 'who designs.' : 'who builds.'}</span>
      </h1>
      <div className="hero-tg-body" aria-live="polite">
        <p className="hm-lede" key={side}>{builder ? BUILD_LEDE : v.lede}</p>
      </div>
      <Ctas cta={v.cta} />
    </section>
  );
}
