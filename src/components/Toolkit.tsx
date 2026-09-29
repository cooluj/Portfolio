import { useState } from 'react';
import type { CSSProperties } from 'react';
import { methods, tools } from '../data/toolkit';
import type { Tool } from '../data/toolkit';
import { prefersReducedMotion } from './useReveal';

type TileStyle = CSSProperties & { '--brand': string; '--brand-light': string };

function Tile({ tool, index }: { tool: Tool; index: number }) {
  const style: TileStyle = {
    '--brand': tool.brand,
    '--brand-light': tool.brandLight,
    transitionDelay: prefersReducedMotion() ? '0s' : `${Math.min(index, 14) * 45}ms`,
  };
  return (
    <li className="kit-tile rv" style={style}>
      <div className="kit-tile-in">
        {tool.path ? (
          <svg className="kit-logo" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d={tool.path} />
          </svg>
        ) : (
          <span className="kit-mono" aria-hidden="true">{tool.mono}</span>
        )}
        <span className="kit-name">{tool.name}</span>
      </div>
    </li>
  );
}

/** Toolkit: brand-logo tiles that colour on hover, plus a plain list of methods. */
export default function Toolkit() {
  const [colour, setColour] = useState(false);

  return (
    <div className="kit" data-colour={colour ? 'true' : undefined}>
      <div className="kit-head rv">
        <h3 className="mono-label">Tools <span className="kit-count">{tools.length}</span></h3>
        <button
          type="button"
          className="ctl kit-toggle"
          aria-pressed={colour}
          onClick={() => setColour((v) => !v)}
        >
          <span className="kit-swatch" aria-hidden="true" />
          {colour ? 'Colour on' : 'Colour off'}
        </button>
      </div>
      <p className="kit-hint" aria-live="polite">
        {colour ? 'Every logo in its own brand colour.' : 'Hover a tile for its brand colour, or switch colour on.'}
      </p>
      <ul className="kit-tiles" aria-label="Tools">
        {tools.map((t, i) => <Tile key={t.name} tool={t} index={i} />)}
      </ul>

      <h3 className="mono-label kit-sub rv">Methods <span className="kit-count">{methods.length}</span></h3>
      <ul className="kit-methods" aria-label="Methods">
        {methods.map((m, i) => (
          <li key={m} className="rv" style={{ transitionDelay: prefersReducedMotion() ? '0s' : `${i * 40}ms` }}>
            <span className="kit-chip">{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
