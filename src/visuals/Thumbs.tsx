/** Front-facing figure, drawn on a 200 x 440 grid. Used by the PainSights hero. */
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
