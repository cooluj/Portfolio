import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent as RPointerEvent } from 'react';
import { useHref, useNavigate } from 'react-router-dom';
import { prefersReducedMotion } from '../../components/useReveal';
import { EDGES, NEIGHBOURS, NODES, ORDERED, PROJECTS_OF, THEMES_OF, type SpatialNode } from '../../data/spatial';
import { useVoice } from '../copy';
import { Ctas } from './parts';

/** The sphere's axis leans like a globe on a desk. */
const TILT = 0.4;
/** Pitch is clamped so the poles never swing past the camera. */
const PITCH_MAX = 1.25;
/** One turn per minute. */
const AUTO = (Math.PI * 2) / 60;
/** Themes deeper than this (0 back, 1 front) lose their label; on a phone they need to be nearer still. */
const LABEL_DEPTH = 0.55;
const LABEL_DEPTH_NARROW = 0.65;
/** How much the near side grows and the far side shrinks. */
const PERSPECTIVE = 0.45;
/** Depth of the sphere's silhouette: points behind it are on the far side. */
const LIMB_T = (1 + PERSPECTIVE) / 2;
const STEP = Math.PI / 12;
const NOTE_W = 220;
const CARD_W = 172;
/** Latitudes drawn as rings, beside the equator. */
const LATITUDES = [0.58, -0.58];

type Rot = { yaw: number; pitch: number };
type Size = { w: number; h: number };
type Pt = { x: number; y: number; t: number; s: number };
type Placed = { right: boolean; small: boolean };

const TAU = Math.PI * 2;
const clampPitch = (p: number) => Math.max(-PITCH_MAX, Math.min(PITCH_MAX, p));
/** The same angle, expressed within half a turn of `near`, so easing takes the short way round. */
const near = (angle: number, ref: number) => ref + (((angle - ref + Math.PI) % TAU) + TAU) % TAU - Math.PI;
const radius = (size: Size) => Math.min(size.w, size.h) * 0.35;

/** Rotate a unit point by yaw (around the tilted axis) and the tilt, then project with perspective. */
function project([x, y, z]: SpatialNode['p'], rot: Rot, size: Size): Pt {
  const cy = Math.cos(rot.yaw);
  const sy = Math.sin(rot.yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const a = TILT + rot.pitch;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const y2 = y * ca - z1 * sa;
  const z2 = y * sa + z1 * ca;
  const R = radius(size);
  const s = 1 / (1 - z2 * PERSPECTIVE);
  return { x: size.w / 2 + x1 * R * s, y: size.h / 2 - y2 * R * s, t: (z2 + 1) / 2, s };
}

/** The rotation that brings a point to the front and centre. */
function facing(p: SpatialNode['p'], current: Rot): Rot {
  const [x, y, z] = p;
  const yaw = -Math.atan2(x, z);
  const r = Math.hypot(x, z);
  const pitch = clampPitch(Math.atan2(y, r) - TILT);
  return { yaw: near(yaw, current.yaw), pitch };
}

/** A latitude ring, as front and back path chunks so the far side reads fainter. */
function ring(lat: number, rot: Rot, size: Size): { front: string; back: string } {
  const rr = Math.sqrt(1 - lat * lat);
  let front = '';
  let back = '';
  let prev: boolean | null = null;
  for (let i = 0; i <= 72; i++) {
    const u = (i / 72) * TAU;
    const q = project([Math.cos(u) * rr, lat, Math.sin(u) * rr], rot, size);
    const isFront = q.t >= LIMB_T;
    const cmd = prev === isFront ? 'L' : 'M';
    const seg = `${cmd}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
    if (isFront) front += seg;
    else back += seg;
    prev = isFront;
  }
  return { front, back };
}

/** Roughly how wide a label paints, for fitting and collision checks. */
const labelWidth = (n: SpatialNode, small: boolean) => n.label.length * (n.kind === 'project' ? 7.6 : small ? 6.9 : 8.2) + 14;

type Rect = { x1: number; x2: number; y1: number; y2: number };
const hits = (a: Rect, b: Rect) => a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2;

/** The home page opens on a globe of the work: projects and the themes they share, rotating slowly, draggable, every node reachable by keyboard. */
export default function Spatial() {
  const v = useVoice();
  const navigate = useNavigate();
  const base = useHref('/work');
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [size, setSize] = useState<Size>({ w: 0, h: 0 });
  const [view, setView] = useState<Rot>({ yaw: 0.6, pitch: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [narrow, setNarrow] = useState(false);
  const [coarse, setCoarse] = useState(false);

  // The live rotation lives in refs so the frame loop never closes over stale state.
  const rot = useRef<Rot>({ yaw: 0.6, pitch: 0 });
  const vel = useRef<Rot>({ yaw: 0, pitch: 0 });
  const target = useRef<Rot | null>(null);
  const raf = useRef(0);
  const last = useRef(0);
  const skip = useRef(0);
  const visible = useRef(true);
  const paused = useRef(false);
  const dragging = useRef(false);
  const dragged = useRef(false);
  const reduced = useRef(false);
  const endDrag = useRef<(() => void) | null>(null);

  const commit = useCallback(() => setView({ ...rot.current }), []);

  const tick = useCallback((ts: number) => {
    raf.current = 0;
    const dt = last.current ? Math.min(0.05, (ts - last.current) / 1000) : 0.016;
    last.current = ts;
    const r = rot.current;
    let busy = false;
    let auto = false;
    const t = target.current;
    if (t) {
      const k = 1 - Math.exp(-dt * 7);
      r.yaw += (t.yaw - r.yaw) * k;
      r.pitch += (t.pitch - r.pitch) * k;
      if (Math.abs(t.yaw - r.yaw) < 0.0015 && Math.abs(t.pitch - r.pitch) < 0.0015) {
        r.yaw = t.yaw;
        r.pitch = t.pitch;
        target.current = null;
      } else busy = true;
    } else if (Math.abs(vel.current.yaw) > 0.01 || Math.abs(vel.current.pitch) > 0.01) {
      r.yaw += vel.current.yaw * dt;
      r.pitch = clampPitch(r.pitch + vel.current.pitch * dt);
      const decay = Math.exp(-dt * 2.6);
      vel.current.yaw *= decay;
      vel.current.pitch *= decay;
      busy = true;
    } else if (!paused.current && !dragging.current && !reduced.current) {
      vel.current = { yaw: 0, pitch: 0 };
      r.yaw += AUTO * dt;
      busy = true;
      auto = true;
    }
    const svg = svgRef.current;
    if (busy && visible.current && !document.hidden) {
      raf.current = requestAnimationFrame(tick);
      // Transitions stay off while the globe moves, so per-frame opacity never restarts one.
      svg?.classList.add('is-moving');
      // The slow idle turn moves the rim well under a pixel per frame: paint every third frame.
      if (auto && ++skip.current % 3) return;
    } else {
      last.current = 0;
      svg?.classList.remove('is-moving');
    }
    setView({ yaw: r.yaw, pitch: r.pitch });
  }, []);

  const wake = useCallback(() => {
    if (!raf.current && visible.current && !document.hidden) raf.current = requestAnimationFrame(tick);
  }, [tick]);

  // Stage size, visibility and the tab's state decide whether a frame is worth drawing.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      reduced.current = prefersReducedMotion();
      if (reduced.current) {
        vel.current = { yaw: 0, pitch: 0 };
        if (target.current) {
          rot.current = { ...target.current };
          target.current = null;
          commit();
        }
      } else wake();
    };
    syncMotion();
    mq.addEventListener('change', syncMotion);

    const mqNarrow = window.matchMedia('(max-width: 899px)');
    const mqCoarse = window.matchMedia('(pointer: coarse)');
    const syncNarrow = () => setNarrow(mqNarrow.matches);
    const syncCoarse = () => setCoarse(mqCoarse.matches);
    syncNarrow();
    syncCoarse();
    mqNarrow.addEventListener('change', syncNarrow);
    mqCoarse.addEventListener('change', syncCoarse);

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(stage);

    const io = new IntersectionObserver((entries) => {
      visible.current = entries[0].isIntersecting;
      if (visible.current) wake();
    });
    io.observe(stage);

    const onVis = () => {
      if (!document.hidden) wake();
    };
    document.addEventListener('visibilitychange', onVis);
    wake();
    return () => {
      mq.removeEventListener('change', syncMotion);
      mqNarrow.removeEventListener('change', syncNarrow);
      mqCoarse.removeEventListener('change', syncCoarse);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      visible.current = false;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [commit, wake]);

  // Auto-rotation pauses while something is pointed at, focused or selected.
  useEffect(() => {
    paused.current = !!(hover || focus || selected);
    if (!paused.current) wake();
  }, [hover, focus, selected, wake]);

  /** Aim the globe at a rotation: eased, or instant when motion is reduced. */
  const aim = useCallback((to: Rot) => {
    vel.current = { yaw: 0, pitch: 0 };
    if (reduced.current) {
      rot.current = { ...to };
      target.current = null;
      commit();
    } else {
      target.current = to;
      wake();
    }
  }, [commit, wake]);

  const select = useCallback((id: string | null) => {
    setSelected(id);
    const node = id && NODES.find((n) => n.id === id);
    if (node) aim(facing(node.p, rot.current));
  }, [aim]);

  // Drag to rotate: window listeners during the drag, so a click on a node still lands on the node.
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !stageRef.current) return;
    const stage = stageRef.current;
    const svg = svgRef.current;
    // A finger only spins the globe: vertical swipes stay with the page (touch-action: pan-y).
    const touch = e.pointerType === 'touch';
    const onNode = !!(e.target as Element).closest('.sp-node');
    const sens = 2.2 / Math.max(1, stage.clientWidth);
    let lx = e.clientX;
    let ly = e.clientY;
    let lt = performance.now();
    const sx = lx;
    const sy = ly;
    let vy = 0;
    let vp = 0;
    dragging.current = true;
    dragged.current = false;
    target.current = null;
    vel.current = { yaw: 0, pitch: 0 };
    svg?.classList.add('is-dragging');
    const move = (ev: PointerEvent) => {
      const now = performance.now();
      const dx = ev.clientX - lx;
      const dy = touch ? 0 : ev.clientY - ly;
      const dt = Math.max(1, now - lt) / 1000;
      lx = ev.clientX;
      ly = ev.clientY;
      lt = now;
      if (!dragged.current && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 4) dragged.current = true;
      rot.current.yaw += dx * sens;
      rot.current.pitch = clampPitch(rot.current.pitch - dy * sens);
      vy = vy * 0.5 + ((dx * sens) / dt) * 0.5;
      vp = vp * 0.5 + ((-dy * sens) / dt) * 0.5;
      commit();
    };
    const up = (ev?: Event) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      endDrag.current = null;
      dragging.current = false;
      svg?.classList.remove('is-dragging');
      if (!reduced.current && performance.now() - lt < 80) {
        const cap = (x: number) => Math.max(-6, Math.min(6, x));
        vel.current = { yaw: cap(vy), pitch: cap(vp) };
      }
      // A plain click on the background lets go of the selected theme.
      if (ev?.type === 'pointerup' && !onNode && !dragged.current) select(null);
      wake();
    };
    endDrag.current?.();
    endDrag.current = up;
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  // A drag still in progress when the hero unmounts drops its window listeners.
  useEffect(() => () => {
    visible.current = false;
    endDrag.current?.();
  }, []);

  const onStageKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      if (selected) {
        e.preventDefault();
        select(null);
      }
      return;
    }
    if (e.target !== e.currentTarget) return;
    const r = target.current || rot.current;
    const steps: Record<string, Rot> = {
      ArrowLeft: { yaw: r.yaw - STEP, pitch: r.pitch },
      ArrowRight: { yaw: r.yaw + STEP, pitch: r.pitch },
      ArrowUp: { yaw: r.yaw, pitch: clampPitch(r.pitch - STEP) },
      ArrowDown: { yaw: r.yaw, pitch: clampPitch(r.pitch + STEP) },
    };
    const to = steps[e.key];
    if (!to) return;
    e.preventDefault();
    aim(to);
  };

  const go = (node: SpatialNode, pt: Pt) => {
    const stage = stageRef.current;
    if (stage) {
      const r = stage.getBoundingClientRect();
      try {
        sessionStorage.setItem('sp-from', JSON.stringify({ slug: node.slug, x: Math.round(r.left + pt.x), y: Math.round(r.top + pt.y) }));
      } catch {
        /* storage may be off */
      }
    }
    navigate(`/work/${node.slug}`);
  };

  // Enter on the link arrives here as a native click too (detail 0), so modifier keys keep their meaning.
  const onProjectClick = (e: MouseEvent<Element>, node: SpatialNode, pt: Pt) => {
    if (dragged.current && e.detail > 0) {
      e.preventDefault();
      return;
    }
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    go(node, pt);
  };

  const onThemeKey = (e: KeyboardEvent<SVGGElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(selected === id ? null : id);
    }
  };

  const pts = useMemo(() => {
    const m: Record<string, Pt> = {};
    for (const n of NODES) m[n.id] = project(n.p, view, size);
    return m;
  }, [view, size]);
  const rings = useMemo(() => [0, ...LATITUDES].map((lat) => ring(lat, view, size)), [view, size]);

  const active = hover || focus;
  // Three levels: lit (the node in hand and what it touches), near (the wider neighbourhood of a selection), and the rest, dimmed.
  const { lit, nearSet } = useMemo(() => {
    const lit = new Set<string>();
    const nearSet = new Set<string>();
    if (active) {
      lit.add(active);
      NEIGHBOURS[active]?.forEach((id) => lit.add(id));
    }
    if (selected) {
      lit.add(selected);
      PROJECTS_OF(selected).forEach((id) => lit.add(id));
      NEIGHBOURS[selected]?.forEach((id) => {
        if (!lit.has(id)) nearSet.add(id);
      });
    }
    return { lit, nearSet };
  }, [active, selected]);
  const selProjects = useMemo(() => (selected ? PROJECTS_OF(selected) : []), [selected]);
  const edgeLevel = (a: string, b: string): '' | ' is-lit' | ' is-near' => {
    if (active && (a === active || b === active)) return ' is-lit';
    if (selected) {
      if ((a === selected && lit.has(b)) || (b === selected && lit.has(a))) return ' is-lit';
      if ((selProjects.includes(a) && nearSet.has(b)) || (selProjects.includes(b) && nearSet.has(a))) return ' is-near';
    }
    return '';
  };

  // Labels: the ones that matter most are placed first, and any label that would overlap a placed one is dropped this frame.
  const placed = useMemo(() => {
    const out: Record<string, Placed> = {};
    if (!size.w) return out;
    const rank = (n: SpatialNode) =>
      n.id === selected ? 0 : n.id === active ? 1 : lit.has(n.id) ? 2 : nearSet.has(n.id) ? 3 : n.kind === 'project' ? 4 : 5;
    const depth = narrow ? LABEL_DEPTH_NARROW : LABEL_DEPTH;
    const order = [...NODES].sort((a, b) => rank(a) - rank(b) || pts[b.id].t - pts[a.id].t);
    const rects: Rect[] = [];
    for (const n of order) {
      const pt = pts[n.id];
      const wanted = n.kind === 'project' || n.id === active || n.id === selected || lit.has(n.id) || nearSet.has(n.id) || pt.t >= depth;
      if (!wanted) continue;
      const small = narrow && n.kind !== 'project';
      const r = (n.kind === 'project' ? 8 : 3.2) * pt.s;
      const w = labelWidth(n, small);
      // Labels sit on the outer side of the globe, and flip inward only when they would leave the stage.
      const fitsRight = pt.x + r + 8 + w <= size.w - 2;
      const fitsLeft = pt.x - r - 8 - w >= 2;
      const right = pt.x >= size.w / 2 ? fitsRight || !fitsLeft : !fitsLeft;
      const x1 = right ? pt.x + r + 8 : pt.x - r - 8 - w;
      const rect = { x1, x2: x1 + w, y1: pt.y - 8, y2: pt.y + 8 };
      if (rects.some((o) => hits(o, rect))) continue;
      rects.push(rect);
      out[n.id] = { right, small };
    }
    return out;
  }, [pts, size, active, selected, lit, nearSet, narrow]);

  // The note or card follows the pointer or focus, and stays on the picked theme once the pointer leaves.
  // It docks in the stage corner farthest from the node, so it never covers what just lit up.
  const tipNode = NODES.find((n) => n.id === (active || selected));
  const tipStyle = tipNode && size.w ? (() => {
    const pt = pts[tipNode.id];
    return {
      width: tipNode.kind === 'project' ? CARD_W : Math.min(NOTE_W, size.w - 16),
      [pt.x < size.w / 2 ? 'right' : 'left']: 8,
      [pt.y < size.h / 2 ? 'bottom' : 'top']: 8,
    };
  })() : null;
  // On a phone the stage is too small to share with a card: the note goes under the globe instead.
  const below = narrow ? tipNode : undefined;

  const hint = selected
    ? coarse ? 'Tap the background to clear' : 'Esc clears the theme'
    : coarse ? 'Swipe to turn. Tap a theme to see what shares it.' : 'Drag to turn. Pick a theme to see what shares it.';

  const ready = size.w > 0;
  const limb = ready ? radius(size) / Math.sqrt(1 - PERSPECTIVE * PERSPECTIVE) : 0;

  return (
    <section className="hm-hero hero-spatial gutter" aria-labelledby="hm-h">
      <div className="hero-sp-text">
        <p className="hm-eyebrow">{v.eyebrow}</p>
        <h1 id="hm-h" className="hm-h1">
          {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
        </h1>
        <p className="hm-lede">{v.lede}</p>
        <Ctas cta={v.cta} />
      </div>

      <div className="hero-sp-wrap">
        <div
          ref={stageRef}
          className={`sp-stage${selected ? ' has-selection' : ''}${active ? ' has-active' : ''}`}
          tabIndex={0}
          role="group"
          aria-label="Constellation of the work, drag or use the arrow keys to rotate"
          data-cursor="Drag"
          onPointerDown={onPointerDown}
          onKeyDown={onStageKey}
        >
          {ready && (
            <svg ref={svgRef} className="sp-svg" role="presentation" width={size.w} height={size.h} viewBox={`0 0 ${size.w} ${size.h}`}>
              <g className="sp-sphere" aria-hidden="true">
                {rings.map((rg, i) => <path key={`b${i}`} className={`sp-ring-path is-back${i ? ' is-lat' : ''}`} d={rg.back} />)}
                <circle className="sp-limb" cx={size.w / 2} cy={size.h / 2} r={limb} />
                {rings.map((rg, i) => <path key={`f${i}`} className={`sp-ring-path${i ? ' is-lat' : ''}`} d={rg.front} />)}
              </g>
              <g className="sp-edges" aria-hidden="true">
                {EDGES.map((e) => {
                  const level = edgeLevel(e.a, e.b);
                  // Theme-to-theme edges only appear when something lights them; at rest the globe shows the projects' spokes.
                  if (e.soft && !level) return null;
                  const a = pts[e.a];
                  const b = pts[e.b];
                  const depth = (a.t + b.t) / 2;
                  return (
                    <line
                      key={`${e.a}-${e.b}`}
                      className={`sp-edge${e.soft ? ' is-soft' : ''}${level}`}
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      style={{ opacity: 0.1 + 0.5 * depth }}
                    />
                  );
                })}
              </g>
              {ORDERED.map((n) => {
                const pt = pts[n.id];
                const isProject = n.kind === 'project';
                const isActive = active === n.id;
                const isLit = lit.has(n.id);
                const isNear = nearSet.has(n.id);
                const isSel = selected === n.id;
                const dim = (active || selected) && !isLit && !isNear;
                const r = (isProject ? 8 : 3.2) * pt.s;
                const label = placed[n.id];
                const cls = `sp-node sp-${isProject ? 'project' : 'theme'}${isActive ? ' is-active' : ''}${isLit ? ' is-lit' : ''}${isSel ? ' is-selected' : ''}${isNear ? ' is-near' : ''}${dim ? ' is-dim' : ''}`;
                const body = (
                  <>
                    <circle className="sp-hit" r={Math.max(14, r + 5)} />
                    <circle className="sp-ring" r={r + 5} />
                    <circle className="sp-dot" r={r} style={{ opacity: 0.35 + 0.65 * pt.t }} />
                    {label && (
                      <text
                        className={`sp-label${label.small ? ' is-small' : ''}`}
                        x={label.right ? r + 8 : -(r + 8)}
                        dy="0.35em"
                        textAnchor={label.right ? 'start' : 'end'}
                      >
                        {n.label}
                      </text>
                    )}
                  </>
                );
                const common = {
                  className: cls,
                  transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`,
                  onPointerEnter: () => setHover(n.id),
                  onPointerLeave: () => setHover((h) => (h === n.id ? null : h)),
                  // Only keyboard focus counts as the hover state; a mouse click should not pin the note.
                  onFocus: (e: { currentTarget: Element }) => setFocus(e.currentTarget.matches(':focus-visible') ? n.id : null),
                  onBlur: () => setFocus((f) => (f === n.id ? null : f)),
                  'aria-describedby': `sp-note-${n.id}`,
                };
                return isProject ? (
                  <a
                    key={n.id}
                    {...common}
                    href={`${base}/${n.slug}`}
                    tabIndex={0}
                    data-cursor="View"
                    aria-label={`${n.label}, ${n.featured?.kicker}`}
                    onClick={(e) => onProjectClick(e, n, pt)}
                  >
                    {body}
                  </a>
                ) : (
                  <g
                    key={n.id}
                    {...common}
                    role="button"
                    tabIndex={0}
                    data-cursor="Pick"
                    aria-pressed={isSel}
                    aria-label={n.label}
                    onClick={(e) => {
                      if (!dragged.current || e.detail === 0) select(isSel ? null : n.id);
                    }}
                    onKeyDown={(e) => onThemeKey(e, n.id)}
                  >
                    {body}
                  </g>
                );
              })}
            </svg>
          )}

          {tipStyle && tipNode && !narrow && (
            <div className={`sp-tip${tipNode.kind === 'project' ? ' is-project' : ''}`} style={tipStyle} aria-hidden="true">
              {tipNode.kind === 'project' && tipNode.featured ? (
                <>
                  <span className="sp-tip-kicker">{tipNode.featured.kicker}</span>
                  <span className="sp-tip-title">{tipNode.label}</span>
                </>
              ) : (
                <span className="sp-tip-note">{tipNode.note}</span>
              )}
            </div>
          )}
        </div>
        <div className="sp-under" aria-hidden="true">
          {below && (
            <p className={`sp-below${below.kind === 'project' ? ' is-card' : ''}`}>
              {below.kind === 'project' && below.featured ? (
                <>
                  <strong>{below.label}</strong>
                  {below.featured.kicker}
                </>
              ) : below.note}
            </p>
          )}
          <p className="sp-hint">{hint}</p>
        </div>
      </div>

      <ul className="sr-only">
        {NODES.filter((n) => n.kind === 'project').map((n) => (
          <li key={n.id}>
            {n.label}: {THEMES_OF(n.slug as string).map((t) => t.label.toLowerCase()).join(', ')}.
          </li>
        ))}
      </ul>
      {/* Hidden targets for aria-describedby: read with the node, never in the page's own flow. */}
      {NODES.map((n) => (
        <div key={`note-${n.id}`} id={`sp-note-${n.id}`} hidden>{n.note}</div>
      ))}
    </section>
  );
}
