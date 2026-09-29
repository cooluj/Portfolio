import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { ReadLink, img, pad, to, useRevealIn } from './shared';

/** Index list: a dense table of rows; the hovered or focused row previews its image in a pinned pane on desktop, inline on mobile. */
export default function List() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useRevealIn(ref);
  const cur = featured[active];

  return (
    <div className="wk wk-list rv" ref={ref}>
      <div className="wkl-index">
        <div className="wkl-head" aria-hidden="true">
          <span>No.</span>
          <span>Project</span>
          <span>Role</span>
          <span>Problem</span>
        </div>
        <ol className="wkl-rows">
          {featured.map((f, i) => (
            <li key={f.slug} className={`wkl-row${i === active ? ' is-active' : ''}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)}>
              <span className="wkl-no">{pad(i)}</span>
              <h3 className="wkl-title">
                <Link to={to(f)}>{f.title}</Link>
              </h3>
              <span className="wkl-kicker">{f.kicker}</span>
              <span className="wkl-problem">{f.problem}</span>
              <div className="wkl-inline">
                <span className="wb-frame wkl-inline-frame">
                  <img src={img(f.image.src)} alt={f.image.alt} loading="lazy" style={{ objectPosition: f.image.pos }} />
                </span>
                <p className="wb-call wkl-inline-call">
                  <span className="wb-call-label">The call</span>
                  {f.call}
                </p>
              </div>
              <ReadLink f={f} className="wkl-read" />
            </li>
          ))}
        </ol>
      </div>
      <div className="wkl-pane" aria-live="polite">
        <div className="wkl-pane-imgs">
          {featured.map((f, i) => (
            <img key={f.slug} className={i === active ? 'is-on' : undefined} src={img(f.image.src)} alt="" loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
          ))}
        </div>
        <p className="wb-kicker wkl-pane-kicker">
          <span className="wb-no">{pad(active)}</span>
          {cur.title}
        </p>
        <p className="wb-call wkl-pane-call">
          <span className="wb-call-label">The call</span>
          {cur.call}
        </p>
      </div>
    </div>
  );
}
