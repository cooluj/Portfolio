import { useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from '../components/useReveal';
import { seeded } from './random';

const W = 1200;
const H = 560;
const COUNT = 1200;
const SPOT = 90;
const DIM_MS = 600;
const RING_MS = 700;
const TAU = Math.PI * 2;
const CATS = ['Engineering/Tech', 'Arts/Creative', 'Service/Volunteer', 'Sports/Recreation', 'Business'];
// One representative dot per category, all left of the card so the dashed line has somewhere to go.
const PICKS: [number, number][] = [[300, 160], [620, 380], [180, 420], [430, 290], [560, 120]];
const FEEL_PICK = 3;
const DEMO = 'low key hikes on weekends';

type Mode = 'filters' | 'feeling';
type Tween = { from: number; to: number; t0: number; dur: number; delay: number };

const ease = (p: number) => 1 - Math.pow(1 - p, 4);
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const fmt = (n: number) => n.toLocaleString('en-US');
const at = (t: Tween, now: number) => t.from + (t.to - t.from) * ease(t.dur > 0 ? clamp01((now - t.t0 - t.delay) / t.dur) : 1);
const done = (t: Tween, now: number) => t.dur === 0 || now - t.t0 - t.delay >= t.dur;

/**
 * Eventully hero. 1,200 dots on a canvas, one per registered organisation. Two ways in (filters or a
 * described feeling) narrow the wall of noise to one match, and both end at the same match card.
 */
export default function DiscoveryScatter() {
  const [mode, setMode] = useState<Mode>('filters');
  const [picked, setPicked] = useState(() => CATS.map(() => false));
  const [query, setQuery] = useState('');
  const [resolved, setResolved] = useState(false);
  const [touched, setTouched] = useState(false);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eng = useRef({
    from: new Float32Array(COUNT).fill(1),
    to: new Float32Array(COUNT).fill(1),
    spot: new Float32Array(COUNT),
    t0: 0,
    dur: 0,
    ring: { from: 0, to: 0, t0: 0, dur: 0, delay: 0 } as Tween,
    pick: FEEL_PICK,
    px: -1,
    py: -1,
    inside: false,
    spotOn: false,
    last: 0,
    raf: 0,
    geo: { w: 0, h: 0, dpr: 1 },
    kick: () => {},
  });

  const dots = useMemo(() => {
    const r = seeded(1200);
    const list = Array.from({ length: COUNT }, () => ({
      x: 10 + r() * (W - 20),
      y: 10 + r() * (H - 20),
      o: 0.25 + r() * 0.5,
      s: r() < 0.8 ? 2.2 : 3.2,
      c: Math.floor(r() * CATS.length),
      f: 0,
    }));
    PICKS.forEach(([x, y], i) => Object.assign(list[i], { x, y, c: i, s: 3.2, o: 0.7 }));
    const [fx, fy] = PICKS[FEEL_PICK];
    const far = Math.hypot(W, H);
    list.forEach((d) => (d.f = Math.hypot(d.x - fx, d.y - fy) / far));
    return list;
  }, []);
  const counts = useMemo(() => CATS.map((_, i) => dots.filter((d) => d.c === i).length), [dots]);

  const anyPicked = picked.some(Boolean);
  const matchCount = picked.reduce((n, on, i) => n + (on ? counts[i] : 0), 0);
  const typed = query.trim().length >= 3;
  const showCard = mode === 'filters' ? anyPicked : resolved;
  const pick = mode === 'filters' ? Math.max(0, picked.findIndex(Boolean)) : FEEL_PICK;
  const pickedNames = CATS.filter((_, i) => picked[i]).join(', ');

  // Canvas engine: sizing, pointer spotlight and the single draw loop. Runs only while something moves.
  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const e = eng.current;
    e.spotOn = !reduced && window.matchMedia('(pointer: fine)').matches;

    const frame = (now: number) => {
      e.raf = 0;
      const { w, h, dpr } = e.geo;
      if (!w || !h) return;
      const sx = w / W;
      const sy = h / H;
      const k = Math.min(1, Math.max(0.5, sx));
      const dt = e.last ? Math.min(64, now - e.last) : 16;
      e.last = now;
      const ep = ease(e.dur > 0 ? clamp01((now - e.t0) / e.dur) : 1);
      const ringA = at(e.ring, now);
      const decay = 1 - Math.exp(-dt / 90);
      let busy = ep < 1 || !done(e.ring, now) || e.inside;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < COUNT; i++) {
        const d = dots[i];
        const cx = d.x * sx;
        const cy = d.y * sy;
        const v = e.from[i] + (e.to[i] - e.from[i]) * ep;
        let s = e.spot[i];
        if (e.spotOn) {
          const target = e.inside ? Math.max(0, 1 - Math.hypot(cx - e.px, cy - e.py) / SPOT) : 0;
          s += (target - s) * decay;
          if (s < 0.004) s = 0;
          e.spot[i] = s;
          if (s > 0) busy = true;
        }
        const a = Math.min(1, 0.06 + (d.o - 0.06) * v + s * 0.7);
        const g = Math.round(161 + 89 * s);
        ctx.fillStyle = `rgba(${g},${g},${g},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(cx, cy, d.s * k * (0.75 + 0.25 * v + 0.9 * s), 0, TAU);
        ctx.fill();
      }

      if (ringA > 0.001) {
        const p = dots[e.pick];
        const cx = p.x * sx;
        const cy = p.y * sy;
        const out = 34 * k;
        const ember = (o: number) => `rgba(255,107,53,${(o * ringA).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = ember(0.5);
        ctx.beginPath();
        ctx.arc(cx, cy, out * (0.6 + 0.4 * ringA), 0, TAU);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.strokeStyle = ember(1);
        ctx.beginPath();
        ctx.arc(cx, cy, 18 * k, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = ember(1);
        ctx.beginPath();
        ctx.arc(cx, cy, 8 * k * ringA, 0, TAU);
        ctx.fill();
        const endX = w * 0.6 - 16;
        if (endX > cx + out) {
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 6]);
          ctx.lineDashOffset = (1 - ringA) * 40;
          ctx.beginPath();
          ctx.moveTo(cx + out, cy);
          ctx.lineTo(endX, cy);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (busy) e.raf = requestAnimationFrame(frame);
    };
    e.kick = () => {
      if (!e.raf) e.raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      e.geo = { w: rect.width, h: rect.height, dpr };
      e.kick();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const move = (ev: PointerEvent) => {
      if (ev.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      e.px = ev.clientX - rect.left;
      e.py = ev.clientY - rect.top;
      e.inside = true;
      e.kick();
    };
    const leave = () => {
      e.inside = false;
      e.kick();
    };
    if (e.spotOn) {
      canvas.addEventListener('pointermove', move);
      canvas.addEventListener('pointerleave', leave);
    }
    return () => {
      ro.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      if (e.raf) cancelAnimationFrame(e.raf);
      e.raf = 0;
      e.kick = () => {};
    };
  }, [dots, reduced]);

  // Retarget every dot and the ring whenever the interaction state changes.
  useEffect(() => {
    const e = eng.current;
    const now = performance.now();
    const ep = ease(e.dur > 0 ? clamp01((now - e.t0) / e.dur) : 1);
    let want = (_i: number) => 1;
    if (mode === 'filters' && anyPicked) want = (i) => (picked[dots[i].c] ? 1 : 0);
    if (mode === 'feeling' && typed) {
      const q = clamp01((query.trim().length - 2) / 8);
      want = (i) => (i === FEEL_PICK ? 1 : 1 - clamp01(q * (1 + dots[i].f)));
    }
    for (let i = 0; i < COUNT; i++) {
      e.from[i] = e.from[i] + (e.to[i] - e.from[i]) * ep;
      e.to[i] = want(i);
    }
    e.t0 = now;
    e.dur = reduced ? 0 : DIM_MS;
    const moved = e.pick !== pick;
    const to = showCard ? 1 : 0;
    e.ring = { from: moved ? 0 : at(e.ring, now), to, t0: now, dur: reduced ? 0 : RING_MS, delay: to && !reduced ? 350 : 0 };
    e.pick = pick;
    e.kick();
  }, [mode, picked, query, typed, anyPicked, showCard, pick, dots, reduced]);

  // Feeling mode resolves 250ms after the last keystroke; under reduced motion it resolves at once.
  useEffect(() => {
    if (mode !== 'feeling' || !typed) {
      setResolved(false);
      return;
    }
    if (reduced) {
      setResolved(true);
      return;
    }
    const t = setTimeout(() => setResolved(true), 250);
    return () => clearTimeout(t);
  }, [mode, typed, query, reduced]);

  // Auto demo on first view: switch to Feeling mode and type an example query. Any interaction cancels it.
  useEffect(() => {
    const el = fieldRef.current;
    if (touched || !el) return;
    let t: ReturnType<typeof setTimeout> | undefined;
    let iv: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (prefersReducedMotion()) {
          setMode('feeling');
          setQuery(DEMO);
          return;
        }
        t = setTimeout(() => {
          setMode('feeling');
          let i = 0;
          iv = setInterval(() => {
            i += 1;
            setQuery(DEMO.slice(0, i));
            if (i >= DEMO.length) clearInterval(iv);
          }, 40);
        }, 1400);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [touched]);

  const cancelDemo = () => {
    if (!touched) setTouched(true);
  };
  const toggleChip = (i: number) => setPicked((p) => p.map((on, j) => (j === i ? !on : on)));
  const reset = () => {
    setPicked(CATS.map(() => false));
    setQuery('');
  };

  const count =
    showCard && mode === 'feeling'
      ? '1 of 1,200 organisations, with the reason it was picked'
      : mode === 'filters' && anyPicked
        ? `Illustrative: about ${fmt(matchCount)} of 1,200 organisations would match these filters`
        : mode === 'feeling' && typed
          ? 'Narrowing 1,200 organisations to the closest one'
          : mode === 'feeling'
            ? '1,200 organisations. Describe the feeling to narrow them.'
            : '1,200 organisations. Pick a category to narrow them.';

  const label =
    mode === 'filters' && anyPicked
      ? `${fmt(matchCount)} dots lit for ${pickedNames}, the rest faded, with one match ringed in orange.`
      : mode === 'feeling' && resolved
        ? 'Twelve hundred faded dots, one per organisation, with a single highlighted dot: the one match that fits.'
        : mode === 'feeling' && typed
          ? 'Twelve hundred dots fading as the description narrows the field.'
          : 'Twelve hundred scattered dots, one per registered student organisation, with nothing to tell them apart.';

  return (
    <div className="scatter" onPointerDownCapture={cancelDemo} onKeyDownCapture={cancelDemo}>
      <div className="scatter-modes">
        <div className="scatter-mode-row" role="group" aria-label="How do you want to search">
          <span className="mono-label">Two ways in</span>
          <button type="button" className="ctl" aria-pressed={mode === 'filters'} onClick={() => setMode('filters')}>
            I know what I want
          </button>
          <button type="button" className="ctl" aria-pressed={mode === 'feeling'} onClick={() => setMode('feeling')}>
            I only know the feeling
          </button>
        </div>
        <div className="scatter-panel" key={mode}>
          {mode === 'filters' ? (
            <div className="scatter-chips" role="group" aria-label="Filter by category">
              {CATS.map((name, i) => (
                <button type="button" key={name} className="ctl chip" aria-pressed={picked[i]} onClick={() => toggleChip(i)}>
                  {name}
                </button>
              ))}
            </div>
          ) : (
            <div className="scatter-ask">
              <label htmlFor="scatter-query" className="mono-label">
                Describe it
              </label>
              <input
                id="scatter-query"
                type="text"
                value={query}
                placeholder="something chill outdoors on weekends"
                autoComplete="off"
                spellCheck={false}
                onChange={(ev) => setQuery(ev.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div className="scatter-field" ref={fieldRef}>
        <canvas ref={canvasRef} role="img" aria-label={label} />

        <div className={`match-card${showCard ? ' on' : ''}`} style={{ left: '74%' }} aria-hidden={!showCard}>
          <span className="k">One match · illustrative</span>
          <p className="match-title">
            {mode === 'filters' ? 'The closest fit inside your filters' : 'A club you would not have found scrolling'}
          </p>
          <span className="match-cat">{CATS[pick]}</span>
          <div className="why">
            <span>
              Matches your filters <b>{mode === 'filters' ? 'yes' : 'n/a'}</b>
            </span>
            <span>
              Matches what you described <b>{mode === 'feeling' ? 'close' : 'n/a'}</b>
            </span>
            <span>
              Why it is here <b>shown</b>
            </span>
          </div>
        </div>
      </div>

      <div className="scatter-bar">
        <span className="scatter-count" aria-live="polite">
          {count}
        </span>
        <button type="button" className="ctl" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
