import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { caseStudies, type CaseStudy } from '../data/work';
import { prefersReducedMotion, useReveal } from './useReveal';

type HeaderProps = {
  slug: CaseStudy['slug'];
  lede: ReactNode;
  meta: { k: string; v: ReactNode }[];
};

const LETTER_STAGGER = 30;

/** Splits a title into letter spans inside per-word overflow wrappers so each letter can rise in. */
function SplitTitle({ text }: { text: string }) {
  let i = 0;
  return (
    <>
      {text.split(' ').map((word, w) => (
        <Fragment key={w}>
          {w > 0 && <span className="cs-sp"> </span>}
          <span className="cs-w">
            {Array.from(word).map((ch, k) => (
              <span key={k} className="cs-l" style={{ '--i': i++ } as CSSProperties}>{ch}</span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** One rolling digit column: stacks 0..n and translates up to n once on mount. */
function Digit({ n }: { n: number }) {
  const stack = Array.from({ length: n + 1 }, (_, d) => d);
  return (
    <span className="cs-dig">
      <span className="cs-dig-roll" style={{ '--n': n } as CSSProperties}>
        {stack.map((d) => <span key={d}>{d}</span>)}
      </span>
    </span>
  );
}

export function CaseHeader({ slug, lede, meta }: HeaderProps) {
  useReveal();
  const i = caseStudies.findIndex((c) => c.slug === slug);
  const c = caseStudies[i];
  const [still] = useState(() => prefersReducedMotion());
  useEffect(() => {
    document.title = `${c.title} · Ujjawal Agrawal`;
  }, [c.title]);
  const num = String(i + 1).padStart(2, '0');
  const total = String(caseStudies.length).padStart(2, '0');
  const letters = c.title.replace(/ /g, '').length;
  const ledeDelay = (letters - 1) * LETTER_STAGGER + 150;
  return (
    <header
      className={`cs-head${still ? ' is-still' : ''}`}
      style={{ '--lede-delay': `${ledeDelay}ms` } as CSSProperties}
    >
      <Link to={{ pathname: '/', hash: '#work' }} className="cs-back">
        <span aria-hidden="true">&larr;</span> All work
      </Link>
      <p className="index-label cs-count" style={{ marginTop: '2.5rem' }}>
        <span className="sr-only">Case study {num} / {total}</span>
        <span aria-hidden="true">
          Case study {Array.from(num).map((d, k) => <Digit key={k} n={Number(d)} />)} / {total}
        </span>
      </p>
      <h1 className="cs-title" aria-label={c.title}>
        <span aria-hidden="true"><SplitTitle text={c.title} /></span>
      </h1>
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
  const { thumb } = next;
  return (
    <nav className="cs-next" aria-label="Next case study">
      <Link to={`/work/${next.slug}`} className="cs-next-link" data-cursor="Next">
        <span className="cs-next-body">
          <span className="mono-label">Next case study</span>
          <span className="t">{next.title} <span aria-hidden="true">&rarr;</span></span>
        </span>
        <span className="cs-next-thumb">
          <img
            src={`${import.meta.env.BASE_URL}images/${thumb.src}`}
            alt={thumb.alt}
            loading="lazy"
            decoding="async"
            style={thumb.pos ? { objectPosition: thumb.pos } : undefined}
          />
        </span>
      </Link>
      <Link to={{ pathname: '/', hash: '#contact' }} className="cs-back">Get in touch</Link>
    </nav>
  );
}
