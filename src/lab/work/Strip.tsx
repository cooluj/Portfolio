import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { prefersReducedMotion } from '../../components/useReveal';
import { Frame, ReadLink, pad, to, useRevealIn } from './shared';

/** Horizontal strip: three columns on desktop, a scroll-snap row with a position indicator on small screens. */
export default function Strip() {
  const ref = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  useRevealIn(ref);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const range = el.scrollWidth - el.clientWidth;
      if (range <= 0) return setActive(0);
      setActive(Math.round((el.scrollLeft / range) * (el.children.length - 1)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = row.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <div className="wk wk-strip" ref={ref}>
      <ol className="wks-row" ref={row} tabIndex={0} aria-label="Three projects, side by side; scrolls sideways on small screens">
        {featured.map((f, i) => (
          <li className="wks-card rv" key={f.slug}>
            <Frame f={f} i={i} className="wks-media" />
            <p className="wb-kicker wks-kicker">
              <span className="wb-no">{pad(i)}</span>
              {f.kicker}
            </p>
            <h3 className="wb-title wks-title">
              <Link to={to(f)}>{f.title}</Link>
            </h3>
            <p className="wb-problem wks-problem">{f.problem}</p>
            <p className="wb-call wks-call">
              <span className="wb-call-label">The call</span>
              {f.call}
            </p>
            <ReadLink f={f} />
          </li>
        ))}
      </ol>
      <div className="wks-nav">
        <p className="wks-count">
          <span className="wb-no">{pad(active)}</span> / {pad(featured.length - 1)}
        </p>
        <div className="wks-dots">
          {featured.map((f, i) => (
            <button type="button" key={f.slug} className="wks-dot" aria-label={`Go to ${f.title}`} aria-current={i === active ? 'true' : undefined} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
