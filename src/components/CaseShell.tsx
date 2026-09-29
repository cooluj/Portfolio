import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { caseStudies, type CaseStudy } from '../data/work';
import { useReveal } from './useReveal';

type HeaderProps = {
  slug: CaseStudy['slug'];
  lede: ReactNode;
  meta: { k: string; v: ReactNode }[];
};

export function CaseHeader({ slug, lede, meta }: HeaderProps) {
  useReveal();
  const i = caseStudies.findIndex((c) => c.slug === slug);
  const c = caseStudies[i];
  useEffect(() => {
    document.title = `${c.title} · Ujjawal Agrawal`;
  }, [c.title]);
  return (
    <header>
      <Link to={{ pathname: '/', hash: '#work' }} className="cs-back">
        <span aria-hidden="true">&larr;</span> All work
      </Link>
      <p className="index-label" style={{ marginTop: '2.5rem' }}>
        Case study {String(i + 1).padStart(2, '0')} / 03
      </p>
      <h1 className="cs-title">{c.title}</h1>
      <p className="cs-lede">{lede}</p>
      <dl className="cs-meta">
        {meta.map((m) => (
          <div key={m.k}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

export function Block({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="cs-block rv" aria-labelledby={`b-${n}`}>
      <h2 id={`b-${n}`}>
        <span className="n" aria-hidden="true">{n}</span>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export function Reflection({ children }: { children: ReactNode }) {
  return (
    <section className="cs-reflect rv" aria-labelledby="reflect-h">
      <h2 id="reflect-h" className="mono-label">Reflection</h2>
      <p>{children}</p>
    </section>
  );
}

export function NextCase({ slug }: { slug: CaseStudy['slug'] }) {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(i + 1) % caseStudies.length];
  return (
    <nav className="cs-next" aria-label="Next case study">
      <Link to={`/work/${next.slug}`} data-cursor>
        <span className="mono-label">Next case study</span>
        <span className="t">{next.title} <span aria-hidden="true">&rarr;</span></span>
      </Link>
      <Link to={{ pathname: '/', hash: '#contact' }} className="cs-back">Get in touch</Link>
    </nav>
  );
}
