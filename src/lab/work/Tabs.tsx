import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { featured } from '../../data/home';
import { Frame, ReadLink, pad, useRevealIn } from './shared';

/** Tabs: a real tablist with arrow-key navigation; one project at a time with the screenshot set large. */
export default function Tabs() {
  const ref = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useRevealIn(ref);

  // the underline follows the selected tab
  useEffect(() => {
    const el = list.current;
    const t = tabs.current[active];
    if (!el || !t) return;
    const place = () => {
      el.style.setProperty('--x', `${t.offsetLeft}px`);
      el.style.setProperty('--w', `${t.offsetWidth}px`);
    };
    place();
    if (!('ResizeObserver' in window)) return;
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [active]);

  const pick = (i: number) => {
    setActive(i);
    tabs.current[i]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = featured.length;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = (active + 1) % n;
    else if (e.key === 'ArrowLeft') next = (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next === null) return;
    e.preventDefault();
    pick(next);
  };

  return (
    <div className="wk wk-tabs rv" ref={ref}>
      <div className="wkt-list" role="tablist" aria-label="Case studies" ref={list}>
        {featured.map((f, i) => (
          <button
            type="button"
            role="tab"
            key={f.slug}
            id={`wkt-tab-${f.slug}`}
            className="wkt-tab"
            aria-selected={i === active}
            aria-controls={`wkt-panel-${f.slug}`}
            tabIndex={i === active ? 0 : -1}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            onClick={() => setActive(i)}
            onKeyDown={onKey}
          >
            <span className="wkt-tab-no">{pad(i)}</span>
            <span className="wkt-tab-name">{f.title}</span>
          </button>
        ))}
      </div>
      {featured.map((f, i) => (
        <div
          key={f.slug}
          role="tabpanel"
          id={`wkt-panel-${f.slug}`}
          aria-labelledby={`wkt-tab-${f.slug}`}
          className="wkt-panel"
          tabIndex={0}
          hidden={i !== active}
        >
          <Frame f={f} i={i} className="wkt-media" />
          <div className="wkt-body">
            <p className="wb-kicker wkt-kicker">{f.kicker}</p>
            <div className="wkt-copy">
              <p className="wb-problem wkt-problem">{f.problem}</p>
              <p className="wb-call wkt-call">
                <span className="wb-call-label">The call</span>
                {f.call}
              </p>
              <ReadLink f={f} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
