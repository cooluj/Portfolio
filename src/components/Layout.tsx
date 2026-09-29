import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { prefersReducedMotion } from './useReveal';

const NAV = [
  { label: 'Work', hash: '#work' },
  { label: 'About', hash: '#about' },
  { label: 'Timeline', hash: '#journey' },
  { label: 'Contact', hash: '#contact' },
];
const RESUME = `${import.meta.env.BASE_URL}Ujjawal-Agrawal-Resume.pdf`;

export function Glyph({ width = 56, height = 44, stroke = 'currentColor', strokeWidth = 3 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 56 44" aria-hidden="true">
      {[4, 12, 20, 28].map((x) => (
        <line key={x} x1={x} y1="40" x2={x + 16} y2="4" stroke={stroke} strokeWidth={strokeWidth} />
      ))}
    </svg>
  );
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
  const menu = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
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
      <ScrollManager />

      <header id="header" className={`${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
        <div className="gutter header-row">
          <Link to="/" className="wordmark" aria-label="Ujjawal Agrawal, home">Ujjawal Agrawal</Link>
          <nav className="hd-nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.hash} to={{ pathname: '/', hash: n.hash }}>{n.label}</Link>
            ))}
            <a href={RESUME} target="_blank" rel="noopener noreferrer" className="hd-cta">Resume</a>
          </nav>
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
          </div>
        </div>
      </div>

      <main id="main" tabIndex={-1}>
        <div className="page" key={pathname}>
          <Outlet />
        </div>
      </main>

      <footer className="gutter hm-foot">
        <span>&copy; 2026 Ujjawal Agrawal · Seattle</span>
        <a href="#main" id="to-top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' }); }}>
          Back to top &uarr;
        </a>
      </footer>
    </>
  );
}
