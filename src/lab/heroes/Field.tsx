import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../components/useReveal';
import { useVoice } from '../copy';
import { Ctas } from './parts';

const COUNT = 600;
const REACH = 140;
const PULL = 0.42;

type Dot = { ox: number; oy: number; x: number; y: number; vx: number; vy: number };

/** Reads the text colour off the section so every theme paints its own dots. */
const ink = (el: HTMLElement) => getComputedStyle(el).color || '#fff';

/** A field of ~600 dim dots behind the headline that lean toward the pointer within 140px and settle back. */
export default function Field() {
  const v = useVoice();
  const sec = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sec.current;
    const canvas = cv.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const live = !prefersReducedMotion() && window.matchMedia('(pointer: fine)').matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let px = -1e4;
    let py = -1e4;
    let color = ink(section);

    const build = () => {
      const r = section.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // A grid whose cell keeps the count near 600 for any aspect ratio.
      const cell = Math.sqrt((w * h) / COUNT);
      const cols = Math.ceil(w / cell);
      const rows = Math.ceil(h / cell);
      dots = [];
      for (let j = 0; j <= rows; j++) {
        for (let i = 0; i <= cols; i++) {
          const ox = i * cell + (j % 2 ? cell / 2 : 0);
          const oy = j * cell;
          dots.push({ ox, oy, x: ox, y: oy, vx: 0, vy: 0 });
        }
      }
    };

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const d of dots) {
        const dx = d.x - d.ox;
        const dy = d.y - d.oy;
        const stretch = Math.min(1, Math.hypot(dx, dy) / 24);
        ctx.globalAlpha = 0.24 + stretch * 0.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.3 + stretch * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // One physics step: ease toward the pointer inside REACH, spring home outside it. Returns whether anything moved.
    const step = () => {
      let moving = false;
      for (const d of dots) {
        const dx = px - d.ox;
        const dy = py - d.oy;
        const dist = Math.hypot(dx, dy);
        let tx = d.ox;
        let ty = d.oy;
        if (dist < REACH && dist > 0.01) {
          const f = (1 - dist / REACH) * PULL;
          tx = d.ox + dx * f;
          ty = d.oy + dy * f;
        }
        d.vx = (d.vx + (tx - d.x) * 0.12) * 0.78;
        d.vy = (d.vy + (ty - d.y) * 0.12) * 0.78;
        d.x += d.vx;
        d.y += d.vy;
        if (Math.abs(d.vx) > 0.02 || Math.abs(d.vy) > 0.02 || Math.abs(tx - d.x) > 0.05) moving = true;
      }
      return moving;
    };

    const loop = () => {
      raf = 0;
      const moving = step();
      paint();
      if (moving) raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = section.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      wake();
    };
    const onLeave = () => {
      px = -1e4;
      py = -1e4;
      wake();
    };

    build();
    paint();

    const ro = new ResizeObserver(() => {
      build();
      paint();
    });
    ro.observe(section);
    // Repaint in the new ink when the lab swaps the theme.
    const mo = new MutationObserver(() => {
      color = ink(section);
      paint();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-l-theme', 'data-mode'] });

    if (live) {
      section.addEventListener('pointermove', onMove);
      section.addEventListener('pointerleave', onLeave);
      section.addEventListener('pointercancel', onLeave);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      section.removeEventListener('pointermove', onMove);
      section.removeEventListener('pointerleave', onLeave);
      section.removeEventListener('pointercancel', onLeave);
    };
  }, []);

  return (
    <section ref={sec} className="hm-hero hero-field gutter" aria-labelledby="hm-h">
      <canvas ref={cv} className="hero-field-canvas" aria-hidden="true" />
      <div className="hero-field-text">
        <p className="hm-eyebrow">{v.eyebrow}</p>
        <h1 id="hm-h" className="hm-h1">
          {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
        </h1>
        <p className="hm-lede">{v.lede}</p>
        <Ctas cta={v.cta} />
      </div>
    </section>
  );
}
