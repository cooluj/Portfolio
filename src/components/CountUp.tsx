import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from './useInView';
import { prefersReducedMotion } from './useReveal';

type Props = {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  suffix?: string;
  className?: string;
};

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);
const defaultFormat = (n: number) => n.toLocaleString('en-US');

/** Counts from 0 to `value` once in view. Shows the final number at once without a window or with reduced motion. */
export default function CountUp({ value, duration = 1200, format = defaultFormat, suffix = '', className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const still = useMemo(() => typeof window === 'undefined' || prefersReducedMotion(), []);
  const [shown, setShown] = useState(still ? value : 0);
  const final = format(value) + suffix;

  useEffect(() => {
    if (still || !inView) return;
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, still, value, duration]);

  const done = still || shown === value;

  return (
    <span ref={ref} className={className} data-done={done ? 'true' : undefined}>
      <span className="sr-only">{final}</span>
      <span aria-hidden="true" className="countup">
        {format(shown)}
        {suffix}
      </span>
    </span>
  );
}
