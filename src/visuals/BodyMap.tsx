import { useState } from 'react';
import { BodyShape } from './Thumbs';

const HEAT = ['#7a2e12', '#b8431b', '#ff6b35', '#ffb347', '#fff1c4'];

const REGIONS = [
  { id: 'abdomen', name: 'Lower abdomen, right side', x: 80, y: 200, level: 5 },
  { id: 'head', name: 'Head, left temple', x: 116, y: 30, level: 4 },
  { id: 'knee', name: 'Left knee', x: 122, y: 332, level: 3 },
  { id: 'shoulder', name: 'Right shoulder', x: 60, y: 92, level: 2 },
];

/**
 * PainSights hero. A clinician's view: where it hurts and how much, read from the sensor rather than
 * described. Regions glow by intensity. The list beside it is the keyboard and screen reader control.
 */
export default function BodyMap() {
  const [sel, setSel] = useState(REGIONS[0].id);
  const active = REGIONS.find((r) => r.id === sel)!;

  return (
    <div className="body-wrap">
      <div className="body-stage">
        <svg viewBox="-20 -10 240 460" role="img" aria-label={`Body model with ${REGIONS.length} pain regions glowing by intensity. Strongest: ${REGIONS[0].name}.`}>
          <defs>
            {HEAT.map((c, i) => (
              <radialGradient key={c} id={`heat-${i + 1}`}>
                <stop offset="0" stopColor={HEAT[Math.min(4, i + 1)]} />
                <stop offset="0.35" stopColor={c} stopOpacity="0.9" />
                <stop offset="1" stopColor={c} stopOpacity="0" />
              </radialGradient>
            ))}
          </defs>
          <BodyShape />
          {REGIONS.map((r) => {
            const on = r.id === sel;
            const rad = 10 + r.level * 4.5;
            return (
              <g key={r.id} className="region-btn" onClick={() => setSel(r.id)} aria-hidden="true">
                <circle
                  className="pain-glow pulse"
                  cx={r.x}
                  cy={r.y}
                  r={rad}
                  fill={`url(#heat-${r.level})`}
                  style={{ ['--dur' as string]: `${3.4 - r.level * 0.4}s` }}
                />
                <circle cx={r.x} cy={r.y} r={rad + 6} fill="none" stroke={on ? '#fafafa' : 'transparent'} strokeWidth="1.5" strokeDasharray="3 4" />
              </g>
            );
          })}
        </svg>
        <span className="body-note mono-label">Illustrative reading</span>
      </div>

      <div>
        <h3 className="mono-label">Pain regions, strongest first</h3>
        <div className="region-list" style={{ marginTop: '1rem' }}>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={r.id === sel}
              onClick={() => setSel(r.id)}
              style={{ ['--heat' as string]: HEAT[r.level - 1] }}
            >
              <span>{r.name}</span>
              <span className="meter" role="img" aria-label={`Intensity ${r.level} of 5`}>
                {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= r.level ? 'on' : ''} />)}
              </span>
            </button>
          ))}
        </div>
        <p aria-live="polite" style={{ marginTop: '1.25rem', lineHeight: 1.6, color: 'var(--muted-fg)' }}>
          <span style={{ color: 'var(--fg)' }}>{active.name}</span>, intensity {active.level} of 5. Read from the
          sensor, not from the patient's description.
        </p>
        <div className="legend" aria-hidden="true">
          <span>Low</span><span className="ramp" /><span>High</span>
        </div>
      </div>
    </div>
  );
}

const QUEUE = [
  { p: 'Patient C', level: 92 },
  { p: 'Patient A', level: 71 },
  { p: 'Patient E', level: 55 },
  { p: 'Patient B', level: 34 },
  { p: 'Patient D', level: 18 },
];

/** Caseload view: every patient's current reading, sorted so the person suffering most is first. */
export function Caseload() {
  return (
    <div className="queue">
      <div className="queue-head">
        <span className="mono-label" style={{ color: 'var(--fg)' }}>Caseload · sorted by current pain</span>
        <span className="mono-label">Illustrative</span>
      </div>
      <ol aria-label="Illustrative caseload, highest current pain first">
        {QUEUE.map((q, i) => (
          <li key={q.p}>
            <span className="mono-label" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span>{q.p}</span>
            <span className="bar" role="img" aria-label={i === 0 ? 'Highest reading' : `Rank ${i + 1}`}>
              <i style={{ width: `${q.level}%` }} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
