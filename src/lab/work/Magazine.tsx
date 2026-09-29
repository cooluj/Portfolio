import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { Frame, ReadLink, pad, to, useRevealIn } from './shared';

/** Magazine: a feature spread per project. Running head, headline, image across both columns, a drop cap on the problem. */
export default function Magazine() {
  const ref = useRef<HTMLDivElement>(null);
  useRevealIn(ref);
  return (
    <div className="wk wk-magazine" ref={ref}>
      {featured.map((f, i) => (
        <article className="wkm-spread rv" key={f.slug}>
          <p className="wkm-run">
            <span className="wkm-run-kicker">{f.kicker}</span>
            <span className="wkm-run-folio">
              <span className="sr-only">Project </span>
              {pad(i)} / {pad(featured.length - 1)}
            </span>
          </p>
          <h3 className="wb-title wkm-title">
            <Link to={to(f)}>{f.title}</Link>
          </h3>
          <Frame f={f} i={i} className="wkm-media" />
          <div className="wkm-cols">
            <p className="wkm-problem">{f.problem}</p>
            <div className="wkm-col2">
              <p className="wb-call wkm-call">
                <span className="wb-call-label">The call</span>
                {f.call}
              </p>
              <ReadLink f={f} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
