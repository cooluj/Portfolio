import { useId, useState, type CSSProperties } from 'react';

type Side = { need: string; alt: string; src?: string };

function Layer({ side, className }: { side: Side; className: string }) {
  return (
    <div className={`ba-layer ${className}`}>
      {side.src ? (
        <img src={side.src} alt={side.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div className="ph-block" role="img" aria-label={`Placeholder, image not supplied yet: ${side.need}`}>
          <span>[PLACEHOLDER: {side.need}]</span>
        </div>
      )}
    </div>
  );
}

/** Drag or arrow-key comparison. A native range input drives it, so it is keyboard and screen reader friendly. */
export default function BeforeAfter({ label, before, after, caption }: { label: string; before: Side; after: Side; caption?: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <figure className="ba">
      <div className="ba-frame" style={{ '--pos': `${pos}%` } as CSSProperties}>
        <Layer side={before} className="ba-before" />
        <Layer side={after} className="ba-after" />
        <span className="ba-tag l" aria-hidden="true">Before</span>
        <span className="ba-tag r" aria-hidden="true">After</span>
        <span className="ba-line" aria-hidden="true" />
      </div>
      <div className="ba-range">
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-valuetext={`${100 - pos}% after, ${pos}% before`}
        />
      </div>
      {caption && <figcaption className="cs-fig" style={{ marginTop: '0.5rem' }}><span className="mono-label" style={{ letterSpacing: '0.06em', textTransform: 'none' }}>{caption}</span></figcaption>}
    </figure>
  );
}
