import { RefObject, useEffect, useState } from 'react';

/** True once `ref` has intersected the viewport. Observes once, then disconnects. */
export function useInView(ref: RefObject<Element>, options: IntersectionObserverInit = { threshold: 0.4 }) {
  const [seen, setSeen] = useState(() => typeof window === 'undefined' || !('IntersectionObserver' in window));

  useEffect(() => {
    if (seen) return;
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [ref, seen]);

  return seen;
}
