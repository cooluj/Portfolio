import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { Frame, ReadLink, pad, to, useRevealIn } from './shared';

/** Grid: three equal cards; the call slides up over the screenshot on hover, on focus-within, or with the tap toggle. */
export default function Grid() {
  const ref = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  useRevealIn(ref);

  return (
    <ul className="wk wk-grid" ref={ref}>
      {featured.map((f, i) => {
        const on = open === f.slug;
        const id = `wkg-call-${f.slug}`;
        return (
          <li key={f.slug} className={`wkg-card rv${on ? ' is-open' : ''}`}>
            <div className="wkg-media">
              <Frame f={f} i={i} className="wkg-link" />
              <div className="wkg-back" id={id}>
                <p className="wb-call wkg-call">
                  <span className="wb-call-label">The call</span>
                  {f.call}
                </p>
              </div>
            </div>
            <div className="wkg-text">
              <p className="wb-kicker wkg-kicker">
                <span className="wb-no">{pad(i)}</span>
                {f.kicker}
              </p>
              <h3 className="wb-title wkg-title">
                <Link to={to(f)}>{f.title}</Link>
              </h3>
              <p className="wb-problem wkg-problem">{f.problem}</p>
              <div className="wkg-foot">
                <ReadLink f={f} />
                <button type="button" className="wkg-toggle" aria-pressed={on} aria-controls={id} onClick={() => setOpen(on ? null : f.slug)}>
                  The call
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
