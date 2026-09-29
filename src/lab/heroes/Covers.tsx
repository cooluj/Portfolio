import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { useVoice } from '../copy';
import { Ctas, img } from './parts';

/** The three case study screens fan out under the headline as tilted cards that straighten on hover or focus. */
export default function Covers() {
  const v = useVoice();
  return (
    <section className="hm-hero hero-covers gutter" aria-labelledby="hm-h">
      <p className="hm-eyebrow">{v.eyebrow}</p>
      <h1 id="hm-h" className="hm-h1">
        {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
      </h1>
      <div className="hero-cv-row">
        <p className="hm-lede">{v.lede}</p>
        <Ctas cta={v.cta} />
      </div>
      <ul className="hero-cv-fan" aria-label="Case studies">
        {featured.map((f, i) => (
          <li className="hero-cv-item" key={f.slug} style={{ '--i': i } as CSSProperties}>
            <Link to={`/work/${f.slug}`} className="hero-cv-card" data-cursor="View">
              <img src={img(f.image.src)} alt="" loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
              <span className="hero-cv-label">
                <span className="hero-cv-no">0{i + 1}</span>
                <span className="hero-cv-title">{f.title}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
