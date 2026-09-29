import { useMemo } from 'react';
import { seeded } from './random';

/** Small previews for the home work index. Each one hints at that case study's own visual. */

export function EventullyThumb() {
  const dots = useMemo(() => {
    const r = seeded(7);
    return Array.from({ length: 260 }, () => ({ x: 8 + r() * 304, y: 8 + r() * 224 }));
  }, []);
  return (
    <svg viewBox="0 0 320 240" aria-hidden="true">
      <rect width="320" height="240" fill="#111" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.8" fill="#8a8a8a" opacity={0.45} />
      ))}
      <circle cx="160" cy="120" r="16" fill="none" stroke="#ff6b35" strokeWidth="1.5" />
      <circle cx="160" cy="120" r="5" fill="#ff6b35" />
    </svg>
  );
}

export function SuperpowrThumb() {
  const screen = (x: number, bg: string, fg: string, dim: string) => (
    <g>
      <rect x={x} y="0" width="160" height="240" fill={bg} />
      <rect x={x + 22} y="46" width="96" height="10" rx="2" fill={fg} />
      <rect x={x + 22} y="64" width="70" height="10" rx="2" fill={fg} />
      <rect x={x + 22} y="88" width="112" height="5" rx="2" fill={dim} />
      <rect x={x + 22} y="99" width="90" height="5" rx="2" fill={dim} />
      <rect x={x + 22} y="124" width="54" height="18" rx="9" fill={fg} />
      <rect x={x + 22} y="166" width="116" height="42" rx="4" fill="none" stroke={dim} />
      <rect x={x + 30} y="180" width="60" height="5" rx="2" fill={dim} />
    </g>
  );
  return (
    <svg viewBox="0 0 320 240" aria-hidden="true">
      {screen(0, '#f4f3ef', '#111', '#b5b3ad')}
      {screen(160, '#111', '#fafafa', '#3a3a3a')}
      <line x1="160" y1="0" x2="160" y2="240" stroke="#ff6b35" strokeWidth="2" />
    </svg>
  );
}

export function PainThumb() {
  return (
    <svg viewBox="0 0 320 240" aria-hidden="true">
      <defs>
        <radialGradient id="pt-hot">
          <stop offset="0" stopColor="#fff1c4" />
          <stop offset="0.35" stopColor="#ff6b35" />
          <stop offset="1" stopColor="#ff6b35" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="240" fill="#111" />
      <g transform="translate(160 16) scale(0.48) translate(-100 0)">
        <BodyShape />
      </g>
      <circle cx="176" cy="112" r="22" fill="url(#pt-hot)" />
      <circle cx="140" cy="60" r="11" fill="url(#pt-hot)" opacity="0.6" />
      <circle cx="146" cy="176" r="14" fill="url(#pt-hot)" opacity="0.75" />
    </svg>
  );
}

/** Front-facing figure, drawn on a 200 x 440 grid. Shared with the PainSights hero. */
export function BodyShape({ fill = '#1e1e1e', stroke = '#3a3a3a' }: { fill?: string; stroke?: string }) {
  const limb = { fill: 'none', stroke: fill, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <g>
      <g stroke={stroke} strokeWidth="1.5">
        <circle cx="100" cy="38" r="25" fill={fill} />
        <path d="M90 60 h20 v16 h-20 z" fill={fill} />
        <path d="M58 82 Q100 70 142 82 L146 150 Q142 196 134 224 L66 224 Q58 196 54 150 Z" fill={fill} />
        <path d="M66 222 L134 222 L140 254 Q100 266 60 254 Z" fill={fill} />
      </g>
      {/* limbs: an outline pass, then a fill pass on top */}
      <g {...limb} stroke={stroke} strokeWidth="23">
        <path d="M60 90 L46 162 L38 238" />
        <path d="M140 90 L154 162 L162 238" />
        <path d="M82 250 L78 332 L76 414" />
        <path d="M118 250 L122 332 L124 414" />
      </g>
      <g {...limb} strokeWidth="20">
        <path d="M60 90 L46 162 L38 238" />
        <path d="M140 90 L154 162 L162 238" />
        <path d="M82 250 L78 332 L76 414" />
        <path d="M118 250 L122 332 L124 414" />
      </g>
      <g fill={fill} stroke={stroke} strokeWidth="1.5">
        <ellipse cx="72" cy="424" rx="15" ry="7" />
        <ellipse cx="128" cy="424" rx="15" ry="7" />
      </g>
    </g>
  );
}
