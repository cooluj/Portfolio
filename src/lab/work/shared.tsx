import { useEffect, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import type { Featured } from '../../data/home';

export const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
export const pad = (i: number) => String(i + 1).padStart(2, '0');
export const to = (f: Featured) => `/work/${f.slug}`;

/** Reveals `.rv` children of `ref`. Home's useReveal runs once per route, so a live variant switch needs its own pass. */
export function useRevealIn(ref: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.matches('.rv') ? [root, ...root.querySelectorAll('.rv:not(.in)')] : [...root.querySelectorAll('.rv:not(.in)')];
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '-10% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}

/** The case study link every variant keeps. */
export function ReadLink({ f, className }: { f: Featured; className?: string }) {
  return (
    <Link to={to(f)} className={className ? `wb-read ${className}` : 'wb-read'}>
      Read the case study <span aria-hidden="true">&rarr;</span>
    </Link>
  );
}

/** A framed screenshot link. Uses .wb-frame so the image-treatment dimension applies. */
export function Frame({ f, i, className }: { f: Featured; i: number; className?: string }) {
  return (
    <Link to={to(f)} className={className} aria-label={`${f.title} case study`} data-cursor="View">
      <span className="wb-frame">
        <img src={img(f.image.src)} alt={f.image.alt} loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
      </span>
    </Link>
  );
}
