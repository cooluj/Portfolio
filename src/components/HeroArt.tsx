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

const fg1 = '#232323', fg2 = '#2e2e2e', fg3 = '#3a3a3a';
const shapes: Record<string, string> = {
  frames: `<rect x="18" y="22" width="52" height="34" rx="4" fill="${fg1}"/><rect x="34" y="70" width="52" height="34" rx="4" fill="${fg2}"/><rect x="18" y="118" width="36" height="24" rx="4" fill="${fg1}"/>`,
  mountain: `<circle cx="34" cy="34" r="12" fill="${fg2}"/><path d="M6 150 L52 74 L70 104 L84 84 L114 150 Z" fill="${fg2}"/><path d="M52 74 L64 94 L58 96 Z" fill="${fg3}"/>`,
  code: `<rect x="16" y="24" width="60" height="5" rx="2.5" fill="${fg2}"/><rect x="26" y="40" width="44" height="5" rx="2.5" fill="${fg1}"/><rect x="26" y="56" width="56" height="5" rx="2.5" fill="${fg1}"/><rect x="16" y="72" width="38" height="5" rx="2.5" fill="${fg2}"/><rect x="26" y="88" width="52" height="5" rx="2.5" fill="${fg1}"/><rect x="16" y="104" width="64" height="5" rx="2.5" fill="${fg1}"/><rect x="16" y="120" width="30" height="5" rx="2.5" fill="${fg2}"/>`,
  torii: `<rect x="16" y="40" width="88" height="8" rx="3" fill="${fg3}"/><rect x="22" y="58" width="76" height="6" rx="3" fill="${fg2}"/><rect x="30" y="48" width="8" height="102" fill="${fg2}"/><rect x="82" y="48" width="8" height="102" fill="${fg2}"/>`,
  print: `<rect x="20" y="120" width="80" height="8" rx="2" fill="${fg2}"/><rect x="34" y="80" width="52" height="40" rx="4" fill="${fg1}"/><rect x="52" y="52" width="16" height="28" fill="${fg3}"/><rect x="20" y="30" width="80" height="6" rx="3" fill="${fg2}"/>`,
  board: `<rect x="14" y="20" width="92" height="120" rx="6" fill="${fg1}"/><circle cx="40" cy="52" r="10" fill="${fg2}"/><rect x="58" y="46" width="34" height="5" rx="2.5" fill="${fg2}"/><rect x="24" y="76" width="66" height="5" rx="2.5" fill="${fg2}"/><rect x="24" y="92" width="50" height="5" rx="2.5" fill="${fg2}"/><path d="M24 118 L44 108 L60 120 L80 106" stroke="${fg3}" stroke-width="3" fill="none"/>`,
  device: `<rect x="30" y="24" width="60" height="112" rx="10" fill="${fg1}"/><rect x="38" y="38" width="44" height="30" rx="3" fill="${fg2}"/><rect x="38" y="76" width="44" height="6" rx="3" fill="${fg2}"/><rect x="38" y="90" width="30" height="6" rx="3" fill="${fg2}"/><circle cx="60" cy="118" r="7" fill="${fg3}"/>`,
  golf: `<path d="M10 150 Q60 120 110 150 Z" fill="${fg1}"/><rect x="76" y="50" width="3" height="70" fill="${fg2}"/><path d="M79 50 L100 58 L79 66 Z" fill="${fg3}"/><circle cx="40" cy="132" r="5" fill="${fg3}"/>`,
};

function Tile({ kind, ground }: { kind: string; ground: string }) {
  return (
    <div
      className="tile"
      dangerouslySetInnerHTML={{
        __html: `<svg viewBox="0 0 120 160" preserveAspectRatio="xMidYMid slice"><rect width="120" height="160" fill="${ground}"/>${shapes[kind]}</svg>`,
      }}
    />
  );
}

function Track({ kinds }: { kinds: string[] }) {
  return (
    <div className="drift-track">
      {[...kinds, ...kinds].map((k, i) => (
        <Tile key={i} kind={k} ground={i % 2 ? '#141414' : '#181818'} />
      ))}
    </div>
  );
}

export function DriftColumns() {
  return (
    <div className="drift-wrap" aria-hidden="true">
      <div className="drift-cols">
        <div className="drift-col"><Track kinds={['frames', 'mountain', 'code', 'golf']} /></div>
        <div className="drift-col offset"><Track kinds={['print', 'torii', 'board', 'device']} /></div>
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
