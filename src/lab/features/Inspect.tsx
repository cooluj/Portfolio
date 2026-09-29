import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isPlain } from './util';

const CLASS = 'ft-inspect';

/** Text of the heading that names a section, or its id, or its tag; whitespace collapsed. */
function labelFor(el: HTMLElement) {
  const byId = el.getAttribute('aria-labelledby');
  const heading = (byId && document.getElementById(byId)) || el.querySelector<HTMLElement>('h1, h2, h3');
  const text = heading ? (heading.innerText || heading.textContent || '').replace(/\s+/g, ' ').trim() : '';
  const tag = el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '');
  return text ? `${tag}  ${text}` : tag;
}

/** Press i: every section and article gets an outline and a label, plus the column grid. What a builder sees. */
export default function Inspect() {
  const [on, setOn] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'i' && isPlain(e)) {
        e.preventDefault();
        setOn((v) => !v);
      }
      if (e.key === 'Escape') setOn(false);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  // Label every landmark now and again whenever the page changes under us.
  useEffect(() => {
    if (!on) return;
    const root = document.documentElement;
    root.classList.add(CLASS);
    const main = document.getElementById('main') || document.body;
    let raf = 0;
    const label = () => {
      raf = 0;
      main.querySelectorAll<HTMLElement>('section, article').forEach((el) => el.setAttribute('data-inspect-label', labelFor(el)));
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(label);
    };
    label();
    const mo = new MutationObserver(queue);
    mo.observe(main, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      root.classList.remove(CLASS);
      main.querySelectorAll('[data-inspect-label]').forEach((el) => el.removeAttribute('data-inspect-label'));
    };
  }, [on, pathname]);

  const count = on ? document.querySelectorAll('#main section, #main article').length : 0;

  return (
    <>
      <div className="sr-only" aria-live="polite">{on ? 'Inspect mode on' : ''}</div>
      {on && (
        <div className="ft-legend" role="status">
          <span className="ft-legend-t">Inspect mode: what a builder sees</span>
          <span className="ft-legend-d">
            <i className="ft-legend-sw" aria-hidden="true" /> section or article, named by its heading
          </span>
          <span className="ft-legend-d">
            <i className="ft-legend-sw is-grid" aria-hidden="true" /> the 12 columns every page is set on
          </span>
          <span className="ft-legend-m">{count} landmarks on this page. <kbd className="ft-kbd">i</kbd> or <kbd className="ft-kbd">esc</kbd> to leave</span>
        </div>
      )}
    </>
  );
}
