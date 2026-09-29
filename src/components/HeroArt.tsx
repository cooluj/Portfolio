import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useReveal';

export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = prefersReducedMotion();
    let dots: { x: number; y: number; r: number; ph: number; sp: number }[] = [];
    let raf = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const n = Math.floor((canvas.width * canvas.height) / 26000);
      dots = Array.from({ length: n }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() < 0.7 ? 1 : 1.8,
        ph: Math.random() * Math.PI * 2,
        sp: 0.4 + Math.random() * 0.8,
      }));
      if (reduced) draw(0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fafafa';
      for (const d of dots) {
        ctx.globalAlpha = reduced ? 0.35 : 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(d.ph + (t / 1000) * d.sp));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    resize();
    addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas id="particles" ref={ref} aria-hidden="true" />;
}

/** Two columns of photos drifting in opposite directions in the hero corner. */
export function PhotoColumns({ a, b }: { a: string[]; b: string[] }) {
  const track = (srcs: string[]) => (
    <div className="drift-track">
      {[...srcs, ...srcs].map((src, i) => (
        <div className="tile photo" key={i}>
          <img src={src} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
        </div>
      ))}
    </div>
  );
  return (
    <div className="drift-wrap" aria-hidden="true">
      <div className="drift-cols">
        <div className="drift-col">{track(a)}</div>
        <div className="drift-col offset">{track(b)}</div>
      </div>
      <div className="drift-fade" />
    </div>
  );
}

export function Marquee({ words }: { words: string[] }) {
  const row = words.join('  •  ') + '  •  ';
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-inner">
          <span>{row}</span>
          <span>{row}</span>
        </div>
      </div>
    </div>
  );
}
