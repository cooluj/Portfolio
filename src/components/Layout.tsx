import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { prefersReducedMotion } from './useReveal';

const NAV = [
  { label: 'Home', hash: '#home' },
  { label: 'About', hash: '#about' },
  { label: 'Work', hash: '#work' },
  { label: 'Journey', hash: '#journey' },
  { label: 'Contact', hash: '#contact' },
];

function useSeattleClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-US', {
          timeZone: 'America/Los_Angeles',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return `Seattle ${time} PT`;
}

function Loader() {
  const [state, setState] = useState<'show' | 'exit' | 'gone'>(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('ua-loaded') === '1';
    } catch {
      /* storage blocked */
    }
    return seen || prefersReducedMotion() ? 'gone' : 'show';
  });
  useEffect(() => {
    if (state === 'gone') {
      document.documentElement.style.setProperty('--intro-delay', '0.2s');
      return;
    }
    const a = setTimeout(() => {
      try {
        sessionStorage.setItem('ua-loaded', '1');
      } catch {
        /* storage blocked */
      }
      setState('exit');
    }, 1300);
    const b = setTimeout(() => setState('gone'), 2050);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div id="loader" aria-hidden="true" className={state === 'show' ? '' : state}>
      <div className="loader-mark">
        <div className="loader-ring" />
        <svg className="loader-arc" viewBox="0 0 144 144">
          <circle cx="72" cy="72" r="71" fill="none" stroke="#fafafa" strokeWidth="2" strokeLinecap="round" strokeDasharray="111.5 334.6" />
        </svg>
        <div className="loader-tile">
          <Glyph width={34} height={28} stroke="#fafafa" strokeWidth={4} />
        </div>
      </div>
    </div>
  );
}

export function Glyph({ width = 56, height = 44, stroke = 'currentColor', strokeWidth = 3 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 56 44" aria-hidden="true">
      {[4, 12, 20, 28].map((x) => (
        <line key={x} x1={x} y1="40" x2={x + 16} y2="4" stroke={stroke} strokeWidth={strokeWidth} />
      ))}
    </svg>
  );
}

function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    document.body.classList.add('cursor-on');
    let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) {
        dot.current.style.left = mx + 'px';
        dot.current.style.top = my + 'px';
      }
      const t = e.target instanceof Element ? e.target : null;
      const word = (t?.closest('[data-cursor]') as HTMLElement | null)?.dataset.cursor?.trim() ?? '';
      if (ring.current) {
        ring.current.classList.toggle('hover', Boolean(t && t.closest('a, button, input, [data-cursor]')));
        ring.current.classList.toggle('label', word !== '');
      }
      if (label.current && word) label.current.textContent = word;
    };
    const lerp = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current) {
        ring.current.style.left = rx + 'px';
        ring.current.style.top = ry + 'px';
      }
      raf = requestAnimationFrame(lerp);
    };
    addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(lerp);
    return () => {
      removeEventListener('pointermove', move);
      cancelAnimationFrame(raf);
      document.body.classList.remove('cursor-on');
    };
  }, []);
  return (
    <>
      <div id="cur-ring" ref={ring} aria-hidden="true">
        <span className="cur-label" ref={label} />
      </div>
      <div id="cur-dot" ref={dot} aria-hidden="true" />
    </>
  );
}

const MAG_REACH = 48;
const MAG_PULL = 6;

/** Pulls .cta-pill and .ctl toward a fine pointer within reach, easing back when it leaves. */
function useMagnetic() {
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;
    const cur = new Map<HTMLElement, { x: number; y: number }>();
    let px = -1e4, py = -1e4, raf = 0, queued = false;
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const frame = () => {
      raf = 0;
      queued = false;
      let live = false;
      const els = document.querySelectorAll<HTMLElement>('.cta-pill, .ctl');
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        const near = px > r.left - MAG_REACH && px < r.right + MAG_REACH && py > r.top - MAG_REACH && py < r.bottom + MAG_REACH;
        const tx = near ? clamp((px - (r.left + r.width / 2)) / (r.width / 2 + MAG_REACH)) * MAG_PULL : 0;
        const ty = near ? clamp((py - (r.top + r.height / 2)) / (r.height / 2 + MAG_REACH)) * MAG_PULL : 0;
        const c = cur.get(el) ?? { x: 0, y: 0 };
        if (!near && !cur.has(el)) return;
        c.x += (tx - c.x) * 0.2;
        c.y += (ty - c.y) * 0.2;
        const settled = Math.abs(tx - c.x) < 0.05 && Math.abs(ty - c.y) < 0.05;
        if (settled) {
          c.x = tx;
          c.y = ty;
        } else {
          live = true;
        }
        if (!near && settled) {
          el.style.removeProperty('--mx');
          el.style.removeProperty('--my');
          cur.delete(el);
          return;
        }
        cur.set(el, c);
        el.style.setProperty('--mx', c.x.toFixed(2) + 'px');
        el.style.setProperty('--my', c.y.toFixed(2) + 'px');
      });
      cur.forEach((_, el) => {
        if (!el.isConnected) cur.delete(el);
      });
      if (live || queued) raf = requestAnimationFrame(frame);
    };
    const move = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      queued = true;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const leave = () => {
      px = -1e4;
      py = -1e4;
      queued = true;
      if (!raf) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
      cur.forEach((_, el) => {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
      cur.clear();
    };
  }, []);
}

/** Scroll to the hash target (for /#about style links) or to the top on route change. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const clock = useSeattleClock();
  const { pathname } = useLocation();
  useMagnetic();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      setScrolled(scrollY > 50);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (!menuOpen) return;
    menu.current?.querySelector('a')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        burger.current?.focus();
      }
      if (e.key === 'Tab' && menu.current) {
        const f = [...menu.current.querySelectorAll('a')];
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <a href="#main" className="skip" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}>Skip to content</a>
      <Loader />
      <ScrollManager />
      <div id="progress" ref={progress} aria-hidden="true" />
      <Cursor />

      <header id="header" className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="gutter header-row">
          <Link to="/" className="wordmark" aria-label="Ujjawal Agrawal, home">UJJAWAL</Link>
          <button
            id="burger"
            ref={burger}
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div id="menu" ref={menu} role="dialog" aria-modal="true" aria-label="Navigation" className={menuOpen ? 'open' : ''}>
        <nav className="gutter menu-nav">
          {NAV.map((n) => (
            <span className="menu-line" key={n.hash}>
              <Link className="menu-link" to={{ pathname: '/', hash: n.hash }} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
                {n.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="gutter menu-foot">
          <a href="mailto:ujjawal.agrawal@outlook.com" tabIndex={menuOpen ? 0 : -1}>ujjawal.agrawal@outlook.com</a>
          <div className="links">
            <a href="https://github.com/cooluj" target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? 0 : -1}>GitHub</a>
            <a href="https://linkedin.com/in/ujjawal-agrawal" target="_blank" rel="noopener noreferrer" tabIndex={menuOpen ? 0 : -1}>LinkedIn</a>
            <span>{clock}</span>
          </div>
        </div>
      </div>

      <main id="main" tabIndex={-1}>
        <div className="page" key={pathname}>
          <Outlet />
        </div>
      </main>

      <footer className="gutter" style={{ position: 'relative', zIndex: 10, background: 'var(--bg)' }}>
        <span className="mono-label">&copy; 2026 Ujjawal Agrawal</span>
        <span className="mono-label">{clock}</span>
        <a href="#main" id="to-top" className="mono-label" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }}>
          Back to top &uarr;
        </a>
      </footer>
    </>
  );
}
