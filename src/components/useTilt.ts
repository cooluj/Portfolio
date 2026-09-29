import { createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { prefersReducedMotion } from './useReveal';

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

/** Tilts the element toward the pointer, up to `max` degrees. Fine pointers only, rAF-throttled. */
export function useTilt<T extends HTMLElement = HTMLSpanElement>(max = 6) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    el.classList.add('tilt');

    const paint = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dx = clamp(((px - r.left) / r.width) * 2 - 1);
      const dy = clamp(((py - r.top) / r.height) * 2 - 1);
      el.style.setProperty('--rx', `${(-dy * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(dx * max).toFixed(2)}deg`);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      el.classList.add('is-tilting');
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.classList.remove('is-tilting');
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointercancel', onLeave);
      el.classList.remove('tilt', 'is-tilting');
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    };
  }, [max]);

  return ref;
}

type TiltBoxProps = HTMLAttributes<HTMLSpanElement> & { max?: number; children?: ReactNode };

/** A <span> that tilts toward the pointer. Drop-in for the work row thumb wrapper. */
export function TiltBox({ max = 6, children, ...rest }: TiltBoxProps) {
  const ref = useTilt<HTMLSpanElement>(max);
  return createElement('span', { ref, ...rest }, children);
}
