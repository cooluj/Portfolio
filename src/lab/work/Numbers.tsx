import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { Frame, ReadLink, pad, to, useRevealIn } from './shared';

/** Big numbers: a huge outlined index numeral leads each project, the text beside it, the screenshot below. */
export default function Numbers() {
  const ref = useRef<HTMLDivElement>(null);
  useRevealIn(ref);
  return (
    <div className="wk wk-numbers" ref={ref}>
      {featured.map((f, i) => (
        <article className="wkn-item rv" key={f.slug}>
          <div className="wkn-head">
            <span className="wkn-num" aria-hidden="true">{pad(i)}</span>
            <div className="wkn-text">
              <p className="wb-kicker">
                <span className="sr-only">Project {i + 1}.</span>
                {f.kicker}
              </p>
              <h3 className="wb-title wkn-title">
                <Link to={to(f)}>{f.title}</Link>
              </h3>
              <p className="wb-problem">{f.problem}</p>
              <p className="wb-call">
                <span className="wb-call-label">The call</span>
                {f.call}
              </p>
              <ReadLink f={f} />
            </div>
          </div>
          <Frame f={f} i={i} className="wkn-media" />
        </article>
      ))}
    </div>
  );
}
