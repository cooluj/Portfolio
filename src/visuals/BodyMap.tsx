import { useCallback, useEffect, useRef, useState } from 'react';
import { BodyShape } from './Thumbs';
import { prefersReducedMotion } from '../components/useReveal';

const HEAT = ['#7a2e12', '#b8431b', '#ff6b35', '#ffb347', '#fff1c4'];

const REGIONS = [
  { id: 'abdomen', name: 'Lower abdomen, right side', x: 80, y: 200, level: 5 },
  { id: 'head', name: 'Head, left temple', x: 116, y: 30, level: 4 },
  { id: 'knee', name: 'Left knee', x: 122, y: 332, level: 3 },
  { id: 'shoulder', name: 'Right shoulder', x: 60, y: 92, level: 2 },
];

const VIEW = { top: -10, height: 460, left: -20, width: 240 };
const SWEEP_MS = 1600;
const STRONGEST = REGIONS.reduce((a, b) => (b.level > a.level ? b : a));
const ALL_IDS = REGIONS.map((r) => r.id);

type Phase = 'idle' | 'scanning' | 'done';

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2);

/**
 * PainSights hero. A clinician's view: where it hurts and how much, read from the sensor rather than
 * described. Regions glow by intensity. The list beside it is the keyboard and screen reader control.
 * "Run scan" replays the moment the prototype detects the regions: a line sweeps the body and each
 * region appears as the line passes it. The first scan runs once when the map scrolls into view.
 */
export default function BodyMap() {
  const [sel, setSel] = useState(REGIONS[0].id);
  const [phase, setPhase] = useState<Phase>('idle');
  const [hidden, setHidden] = useState<string[]>([]);
  const [popped, setPopped] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGGElement>(null);
  const rafRef = useRef(0);
  const autoRan = useRef(false);
  const active = REGIONS.find((r) => r.id === sel);
  const scanning = phase === 'scanning';

  const finish = useCallback(() => {
    setHidden([]);
    setSel(STRONGEST.id);
    setPhase('done');
  }, []);

  const touched = useRef(false);
  const runScan = useCallback(() => {
    if (rafRef.current) return;
    if (prefersReducedMotion()) {
      setPopped([]);
      finish();
      return;
    }
    setPhase('scanning');
    setSel('');
    setHidden(ALL_IDS);
    setPopped([]);
    let start = 0;
    let shown: string[] = [];
    const frame = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / SWEEP_MS);
      const y = VIEW.top + easeInOut(t) * VIEW.height;
      lineRef.current?.setAttribute('transform', `translate(0 ${y.toFixed(2)})`);
      const passed = REGIONS.filter((r) => r.y <= y && !shown.includes(r.id)).map((r) => r.id);
      if (passed.length) {
        shown = [...shown, ...passed];
        setHidden(ALL_IDS.filter((id) => !shown.includes(id)));
        setPopped(shown);
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        rafRef.current = 0;
        finish();
      }
    };
    rafRef.current = requestAnimationFrame(frame);
  }, [finish]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || autoRan.current || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || autoRan.current || touched.current) return;
        autoRan.current = true;
        io.disconnect();
        runScan();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [runScan]);

  const status =
    phase === 'scanning' ? 'Scanning...' : phase === 'done' ? `Scan complete: ${REGIONS.length} regions found` : 'No scan running';
  const stateClass = (id: string) => (hidden.includes(id) ? 'scan-hide' : popped.includes(id) ? 'scan-in' : '');

  return (
    <div className="body-wrap" ref={wrapRef}>
      <div className="body-stage">
        <svg viewBox={`${VIEW.left} ${VIEW.top} ${VIEW.width} ${VIEW.height}`} role="img" aria-label={`Body model with ${REGIONS.length} pain regions glowing by intensity. Strongest: ${STRONGEST.name}.`}>
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
              <g key={r.id} className={`region-btn ${stateClass(r.id)}`} onClick={() => { touched.current = true; if (!scanning) setSel(r.id); }} aria-hidden="true">
                <circle
                  className="pain-glow pulse"
                  cx={r.x}
                  cy={r.y}
                  r={rad}
                  fill={`url(#heat-${r.level})`}
                  style={{ ['--dur' as string]: `${3.4 - r.level * 0.4}s` }}
                />
                <circle className="ring" cx={r.x} cy={r.y} r={rad + 6} fill="none" stroke={on ? '#fafafa' : 'transparent'} strokeWidth="1.5" strokeDasharray="3 4" />
              </g>
            );
          })}
          {scanning && (
            <g className="scan-line" ref={lineRef} transform={`translate(0 ${VIEW.top})`} aria-hidden="true">
              <rect className="after" x={VIEW.left} y={-24} width={VIEW.width} height={24} />
              <line className="edge" x1={VIEW.left} x2={VIEW.left + VIEW.width} y1={0} y2={0} />
            </g>
          )}
        </svg>
        <span className="body-note mono-label">Illustrative reading</span>
      </div>

      <div>
        <div className="scan-bar">
          <button
            type="button"
            className="ctl scan-ctl"
            aria-disabled={scanning}
            onClick={() => !scanning && runScan()}
          >
            Run scan
          </button>
          <p className="scan-status mono-label" aria-live="polite" data-phase={phase}>{status}</p>
        </div>
        <h3 className="mono-label">Pain regions, strongest first</h3>
        <div className="region-list" style={{ marginTop: '1rem' }}>
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={stateClass(r.id)}
              aria-pressed={r.id === sel}
              onClick={() => { touched.current = true; if (!scanning) setSel(r.id); }}
              style={{ ['--heat' as string]: HEAT[r.level - 1] }}
            >
              <span>{r.name}</span>
              <span className="meter" role="img" aria-label={`Intensity ${r.level} of 5`}>
                {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= r.level ? 'on' : ''} style={{ ['--i' as string]: n - 1 }} />)}
              </span>
            </button>
          ))}
        </div>
        <p aria-live="polite" style={{ marginTop: '1.25rem', lineHeight: 1.6, color: 'var(--muted-fg)' }}>
          {active ? (
            <>
              <span style={{ color: 'var(--fg)' }}>{active.name}</span>, intensity {active.level} of 5. Read from the
              sensor, not from the patient's description.
            </>
          ) : (
            'Reading the sensor.'
          )}
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
