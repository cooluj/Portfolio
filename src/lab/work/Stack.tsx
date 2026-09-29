import { useEffect, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { prefersReducedMotion } from '../../components/useReveal';
import { Frame, ReadLink, pad, to, useRevealIn } from './shared';

/** Sticky stack: each card pins at 6rem and the next one slides over it, scaling the one beneath down a touch. */
export default function Stack() {
  const ref = useRef<HTMLDivElement>(null);
  useRevealIn(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.wkk-card'));
    let raf = 0;
    const paint = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const r = card.getBoundingClientRect();
        // how far the next card has climbed over this one, 0 to 1
        const p = r.height ? Math.min(1, Math.max(0, (r.bottom - next.getBoundingClientRect().top) / r.height)) : 0;
        card.style.setProperty('--p', p.toFixed(3));
      });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    return () => {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
      if (raf) cancelAnimationFrame(raf);
      cards.forEach((c) => c.style.removeProperty('--p'));
    };
  }, []);

  return (
    <div className="wk wk-stack" ref={ref}>
      {featured.map((f, i) => (
        <article className="wkk-card" key={f.slug} style={{ '--i': i } as CSSProperties}>
          <div className="wkk-in rv">
            <div className="wkk-text">
              <p className="wb-kicker">
                <span className="wb-no">{pad(i)}</span>
                {f.kicker}
              </p>
              <h3 className="wb-title wkk-title">
                <Link to={to(f)}>{f.title}</Link>
              </h3>
              <p className="wb-problem wkk-problem">{f.problem}</p>
              <p className="wb-call wkk-call">
                <span className="wb-call-label">The call</span>
                {f.call}
              </p>
              <ReadLink f={f} />
            </div>
            <Frame f={f} i={i} className="wkk-media" />
          </div>
          <span className="wkk-shade" aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}
