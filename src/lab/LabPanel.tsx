import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLab } from './LabContext';
import { DIMENSIONS, NUMBERED, differs } from './registry';

/** Floating panel: every dimension as a radio group, features as checkboxes. Toggle with the button or Shift+L. */
export default function LabPanel() {
  const lab = useLab();
  const [copied, setCopied] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const changed = DIMENSIONS.filter((d) => differs(d.id, lab.sel[d.id])).length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      // Shift+L, not a bare letter, so a single key press never changes the page (WCAG 2.1.4).
      if (e.key === 'L' && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) lab.setOpen(!lab.open);
      if (e.key === 'Escape' && lab.open) lab.setOpen(false);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [lab]);

  useEffect(() => {
    if (lab.open) panel.current?.querySelector<HTMLElement>('button, input')?.focus();
    else if (panel.current?.contains(document.activeElement)) fab.current?.focus();
  }, [lab.open]);

  const copy = async () => {
    const url = lab.shareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <div className="lab-dock">
        {changed > 0 && (
          <button type="button" className="lab-fab-reset" onClick={lab.reset}>
            Reset to my pick
          </button>
        )}
        <button type="button" ref={fab} className="lab-fab" aria-expanded={lab.open} aria-controls="lab-panel" onClick={() => lab.setOpen(!lab.open)}>
          Lab{changed ? <span className="lab-fab-n">{changed}<span className="sr-only"> changed</span></span> : null}
        </button>
      </div>
      <div id="lab-panel" ref={panel} className={`lab-panel${lab.open ? ' open' : ''}`} role="dialog" aria-label="Design lab" aria-hidden={!lab.open}>
        <div className="lab-head">
          <div>
            <strong>Design lab</strong>
            <span className="lab-sub">{NUMBERED.length} things to try. Press Shift+L to toggle.</span>
          </div>
          <div className="lab-actions">
            <button type="button" className="ctl" onClick={lab.shuffle}>Shuffle</button>
            <button type="button" className="ctl" onClick={lab.reset}>Reset</button>
            <button type="button" className="ctl" onClick={copy} aria-live="polite">{copied ? 'Copied' : 'Copy link'}</button>
            <button type="button" className="ctl" onClick={() => lab.setOpen(false)} aria-label="Close lab">Close</button>
          </div>
        </div>
        <div className="lab-body">
          {DIMENSIONS.map((d) => (
            <fieldset key={d.id} className="lab-dim">
              <legend>
                {d.name} <span className="lab-dim-desc">{d.desc}</span>
              </legend>
              <div className="lab-opts">
                {d.options.map((o) =>
                  d.multi ? (
                    <label key={o.id} className={`lab-opt${lab.has(o.id) ? ' on' : ''}`} title={o.desc}>
                      <input type="checkbox" checked={lab.has(o.id)} onChange={() => lab.toggleFeature(o.id)} />
                      {o.name}
                    </label>
                  ) : (
                    <label key={o.id} className={`lab-opt${lab.sel[d.id] === o.id ? ' on' : ''}`} title={o.desc}>
                      <input type="radio" name={`lab-${d.id}`} checked={lab.sel[d.id] === o.id} onChange={() => lab.set(d.id, o.id)} />
                      {o.name}
                    </label>
                  ),
                )}
              </div>
            </fieldset>
          ))}
          <p className="lab-foot">
            <Link to="/lab" onClick={() => lab.setOpen(false)}>Read all {NUMBERED.length}, numbered</Link>
          </p>
        </div>
      </div>
    </>
  );
}
