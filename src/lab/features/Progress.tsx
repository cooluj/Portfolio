import { useEffect, useRef } from 'react';

/** A 2px ember bar across the top that fills as you read. Scroll work is batched into one frame. */
export default function Progress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      el.style.transform = `scaleX(${p})`;
      el.classList.toggle('is-done', p >= 0.999);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    const ro = 'ResizeObserver' in window ? new ResizeObserver(queue) : null;
    ro?.observe(document.body);
    return () => {
      removeEventListener('scroll', queue);
      removeEventListener('resize', queue);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={bar} className="ft-progress" aria-hidden="true" />;
}
