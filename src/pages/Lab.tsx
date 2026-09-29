import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLab } from '../lab/LabContext';
import { DEFAULTS, DIMENSIONS, NUMBERED } from '../lab/registry';
import { useReveal } from '../components/useReveal';

/** The numbered list of every exploration, each with a one-click Try. */
export default function Lab() {
  const lab = useLab();
  useReveal();
  useEffect(() => {
    document.title = 'Design lab · Ujjawal Agrawal';
  }, []);
  const changed = DIMENSIONS.filter((d) => (lab.sel[d.id] || '') !== DEFAULTS[d.id]).length;
  let n = 0;
  return (
    <article className="cs gutter lab-page">
      <Link to="/" className="cs-back"><span aria-hidden="true">&larr;</span> Home</Link>
      <h1 className="cs-title" style={{ marginTop: '2rem' }}>Design lab</h1>
      <p className="cs-lede">
        {NUMBERED.length} explorations of this site: typefaces, palettes, heroes, layouts, motion, cursors, extras.
        Press Try on any of them and the whole site changes. The default is the combination I chose; Shuffle picks one
        at random.
      </p>
      <div className="lab-page-actions">
        <button type="button" className="ctl" onClick={lab.shuffle}>Shuffle everything</button>
        <button type="button" className="ctl" onClick={lab.reset}>Back to my pick</button>
        <Link to="/" className="ctl">See it on the home page</Link>
      </div>
      <nav className="lab-jump" aria-label="Dimensions">
        {DIMENSIONS.map((d) => (
          <a key={d.id} href={`#lab-${d.id}`}>{d.name}</a>
        ))}
      </nav>

      {DIMENSIONS.map((d) => (
        <section key={d.id} className="lab-sec rv" aria-labelledby={`lab-${d.id}`}>
          <h2 id={`lab-${d.id}`}>{d.name}</h2>
          <p className="lab-sec-desc">{d.desc}</p>
          <ol className="lab-list" start={n + 1}>
            {d.options.map((o) => {
              n += 1;
              const active = d.multi ? lab.has(o.id) : lab.sel[d.id] === o.id;
              const isDefault = !d.multi && DEFAULTS[d.id] === o.id;
              return (
                <li key={o.id} className={active ? 'on' : ''}>
                  <span className="lab-n">{String(n).padStart(3, '0')}</span>
                  <span className="lab-name">
                    {o.name}
                    {isDefault && <span className="lab-tag">my pick</span>}
                  </span>
                  <span className="lab-desc">{o.desc}</span>
                  <button
                    type="button"
                    className="ctl lab-try"
                    aria-pressed={active}
                    onClick={() => (d.multi ? lab.toggleFeature(o.id) : lab.set(d.id, o.id))}
                  >
                    {d.multi ? (active ? 'On' : 'Turn on') : active ? 'Active' : 'Try'}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      {/* live status: what is applied right now, and the way to go see it */}
      <div className={`lab-bar${changed ? ' show' : ''}`} aria-live="polite">
        <span>{changed} {changed === 1 ? 'change' : 'changes'} applied to the whole site</span>
        <Link to="/" className="ctl">See the home page</Link>
        <Link to="/work/eventully" className="ctl">See a case study</Link>
        <button type="button" className="ctl" onClick={lab.reset}>Reset</button>
      </div>
    </article>
  );
}
