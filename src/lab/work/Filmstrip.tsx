import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { prefersReducedMotion } from '../../components/useReveal';
import { ReadLink, img, pad, to, useRevealIn } from './shared';

/** Filmstrip: one row of frames between sprocket edges, scrubbed by sideways scroll, the wheel, arrow keys or the two buttons. */
export default function Filmstrip() {
  const ref = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  useRevealIn(ref);

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      el.querySelectorAll<HTMLElement>('.wkf-frame').forEach((fr, i) => {
        const d = Math.abs(fr.offsetLeft + fr.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    // a vertical wheel over the strip scrubs it sideways, except at either end so the page keeps scrolling
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const at = el.scrollLeft;
      if ((e.deltaY > 0 && at >= max - 1) || (e.deltaY < 0 && at <= 1)) return;
      e.preventDefault();
      el.scrollLeft = at + e.deltaY;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('wheel', onWheel, { passive: false });
    read();
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('wheel', onWheel);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (i: number) => {
    const el = strip.current;
    const fr = el?.querySelectorAll<HTMLElement>('.wkf-frame')[i];
    if (!el || !fr) return;
    el.scrollTo({ left: fr.offsetLeft - (el.clientWidth - fr.offsetWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = featured.length - 1;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = Math.min(last, active + 1);
    else if (e.key === 'ArrowLeft') next = Math.max(0, active - 1);
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    go(next);
  };

  return (
    <div className="wk wk-filmstrip rv" ref={ref}>
      <div className="wkf-bar">
        <p className="wkf-count" aria-live="polite">
          Frame <span className="wb-no">{pad(active)}</span> of {pad(featured.length - 1)}
        </p>
        <div className="wkf-btns">
          <button type="button" className="wkf-btn" aria-label="Previous frame" disabled={active === 0} onClick={() => go(active - 1)}>
            <span aria-hidden="true">&larr;</span>
          </button>
          <button type="button" className="wkf-btn" aria-label="Next frame" disabled={active === featured.length - 1} onClick={() => go(active + 1)}>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
      <div className="wkf-strip" ref={strip} tabIndex={0} role="region" aria-label="Filmstrip of the three projects. Scroll sideways or use the arrow keys." onKeyDown={onKey}>
        <ol className="wkf-track">
          {featured.map((f, i) => (
            <li className={`wkf-frame${i === active ? ' is-active' : ''}`} key={f.slug}>
              <p className="wkf-edge" aria-hidden="true">
                <span>{pad(i)}</span>
                <span>{f.title}</span>
                <span>{pad(i)}A</span>
              </p>
              <Link to={to(f)} className="wkf-media" aria-label={`${f.title} case study`} data-cursor="View">
                <img src={img(f.image.src)} alt={f.image.alt} loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
              </Link>
              <div className="wkf-text">
                <p className="wb-kicker wkf-kicker">{f.kicker}</p>
                <h3 className="wb-title wkf-title">
                  <Link to={to(f)}>{f.title}</Link>
                </h3>
                <p className="wb-problem wkf-problem">{f.problem}</p>
                <p className="wb-call wkf-call">
                  <span className="wb-call-label">The call</span>
                  {f.call}
                </p>
                <ReadLink f={f} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
