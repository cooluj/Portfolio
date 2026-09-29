import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { ReadLink, img, pad, to, useRevealIn } from './shared';

/** Full-bleed covers: each project is a 16:7 image with the title over a bottom scrim; the call rises on hover or focus. */
export default function Covers() {
  const ref = useRef<HTMLDivElement>(null);
  useRevealIn(ref);
  return (
    <div className="wk wk-covers" ref={ref}>
      {featured.map((f, i) => (
        <article className="wkc rv" key={f.slug}>
          <Link to={to(f)} className="wkc-media" aria-label={`${f.title} case study`} data-cursor="View">
            <img src={img(f.image.src)} alt={f.image.alt} loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
          </Link>
          <div className="wkc-text">
            <p className="wb-kicker wkc-kicker">
              <span className="wb-no">{pad(i)}</span>
              {f.kicker}
            </p>
            <h3 className="wb-title wkc-title">
              <Link to={to(f)}>{f.title}</Link>
            </h3>
            <p className="wkc-problem">{f.problem}</p>
            <div className="wkc-call">
              <div className="wkc-call-in">
                <p className="wb-call wkc-call-text">
                  <span className="wb-call-label">The call</span>
                  {f.call}
                </p>
                <ReadLink f={f} className="wkc-read" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
