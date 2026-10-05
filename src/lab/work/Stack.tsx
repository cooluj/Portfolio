import { useEffect, useRef, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { featured } from '../../data/home';
import { prefersReducedMotion } from '../../components/useReveal';
import { ReadLink, img, pad, to, useRevealIn } from './shared';

/** Sticky stack: each card pins at 6rem and the next one slides over it, scaling the one beneath down a touch.
 *  Keyboard: a focused control is never left under the next card. The card that holds focus is raised above its
 *  siblings and the page scrolls so that card sits at its sticky top (WCAG 2.2 2.4.11). The image link is taken out
 *  of the tab order because the title link already goes to the same case study. */
export default function Stack() {
  const ref = useRef<HTMLDivElement>(null);
  useRevealIn(ref);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('.wkk-card'));
    const reduced = prefersReducedMotion();
    let raf = 0;

    /** The card that holds keyboard focus, if any. Its --p stays 0 so it is neither scaled nor shaded. */
    const focusedCard = () => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || !root.contains(a)) return null;
      return a.closest<HTMLElement>('.wkk-card');
    };

    const paint = () => {
      raf = 0;
      const held = focusedCard();
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next || card === held) {
          card.style.setProperty('--p', '0');
          return;
        }
        const r = card.getBoundingClientRect();
        // how far the next card has climbed over this one, 0 to 1
        const p = r.height ? Math.min(1, Math.max(0, (r.bottom - next.getBoundingClientRect().top) / r.height)) : 0;
        card.style.setProperty('--p', p.toFixed(3));
      });
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    /** Scroll so the card that just received keyboard focus sits at its sticky top, fully uncovered. */
    const onFocusIn = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const card = t.closest<HTMLElement>('.wkk-card');
      const i = card ? cards.indexOf(card) : -1;
      if (!card || i < 0) return;
      if (!reduced) queue();
      let visible = true;
      try {
        visible = t.matches(':focus-visible');
      } catch {
        /* older engine: treat every focus as keyboard focus */
      }
      if (!visible) return;
      // Natural (unstuck) document top of this card: the container top plus the cards and gaps before it.
      // Sticky shifts getBoundingClientRect, so the position is rebuilt from layout sizes instead.
      const gap = parseFloat(getComputedStyle(root).rowGap) || 0;
      let y = root.getBoundingClientRect().top + window.scrollY;
      for (let j = 0; j < i; j += 1) y += cards[j].offsetHeight + gap;
      const stickyTop = parseFloat(getComputedStyle(card).top) || 0;
      let top = y - stickyTop;
      // keep the control itself on screen when the card is taller than the viewport
      const cr = card.getBoundingClientRect();
      const tr = t.getBoundingClientRect();
      const scale = card.offsetHeight ? cr.height / card.offsetHeight : 1;
      const bottomInCard = (tr.bottom - cr.top) / (scale || 1);
      top = Math.max(top, y + bottomInCard - window.innerHeight + 24);
      window.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
    };

    root.addEventListener('focusin', onFocusIn);
    if (!reduced) {
      paint();
      root.addEventListener('focusout', queue);
      window.addEventListener('scroll', queue, { passive: true });
      window.addEventListener('resize', queue);
    }
    return () => {
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', queue);
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
            {/* Same destination as the title link, so it stays clickable but is not a tab stop. */}
            <Link to={to(f)} className="wkk-media" tabIndex={-1} aria-hidden="true" data-cursor="View">
              <span className="wb-frame">
                <img src={img(f.image.src)} alt={f.image.alt} loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
              </span>
            </Link>
          </div>
          <span className="wkk-shade" aria-hidden="true" />
        </article>
      ))}
    </div>
  );
}
