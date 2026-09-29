import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Glyph } from '../components/Layout';
import { Marquee, Particles } from '../components/HeroArt';
import { ImageSlot, Ph } from '../components/Placeholder';
import { prefersReducedMotion, useReveal } from '../components/useReveal';
import { caseStudies, journey, marqueeWords, otherWork, toolkit } from '../data/work';
import { EventullyThumb, PainThumb, SuperpowrThumb } from '../visuals/Thumbs';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const offClock = [
  { src: 'skyline-night.webp', caption: 'Seattle, after dark', alt: 'Ujjawal at night in front of the Seattle skyline reflected in the water' },
  { src: 'rainier-vista.webp', caption: 'Rainier Vista, UW', alt: 'Mount Rainier above the trees, seen past Drumheller Fountain on the UW campus' },
  { src: 'st-peters.webp', caption: 'St. Peter’s Basilica, Rome', alt: 'Ujjawal leaning on a railing inside the dome of St. Peter’s Basilica, looking down' },
];

const thumbs = { eventully: EventullyThumb, superpowr: SuperpowrThumb, painsights: PainThumb };

function SectionHead({ index, title, sub, center }: { index: string; title: string; sub?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`sec-head${center ? ' center' : ''}`}>
      <span className="index-label rv">[{index}]</span>
      <h2 className="display-section rv d1">{title}</h2>
      {sub && <p className="subline rv d2">{sub}</p>}
    </div>
  );
}

function Journey() {
  const wrap = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const draw = () => {
      if (!wrap.current || !fill.current) return;
      const r = wrap.current.getBoundingClientRect();
      const start = innerHeight * 0.8;
      const total = r.height - innerHeight * 0.2;
      const p = Math.min(1, Math.max(0, (start - r.top) / Math.max(1, total)));
      fill.current.style.transform = `scaleY(${p})`;
    };
    addEventListener('scroll', draw, { passive: true });
    draw();
    return () => removeEventListener('scroll', draw);
  }, []);
  return (
    <div className="journey-wrap" ref={wrap}>
      <div className="spine" aria-hidden="true"><div className="spine-fill" ref={fill} /></div>
      <ol className="journey-list">
        {journey.map((j, i) => (
          <li key={j.n} className={`j-entry ${i % 2 ? 'left' : 'right'}`}>
            <span className="j-dot" aria-hidden="true" />
            <div className="j-card">
              <span className="j-ghost" aria-hidden="true">{j.year.slice(-2)}</span>
              <span className="j-index mono-label" aria-hidden="true">{j.n}</span>
              <h3 className="j-year">{j.year}</h3>
              <p className="j-body">{j.body}</p>
              <ul className="j-tags" aria-label="Focus">
                {j.tags.map((t) => <li key={t}><span>{t}</span></li>)}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Home() {
  useReveal();
  useEffect(() => {
    document.title = 'Ujjawal Agrawal · Designer who builds';
  }, []);

  return (
    <>
      <section id="home" aria-label="Introduction">
        <Particles />
        <div className="hero-photo" aria-hidden="true">
          <img src={img('hero-skyline-night.webp')} alt="" />
        </div>
        <div className="gutter glyph" style={{ color: 'rgba(250,250,250,0.3)' }}>
          <Glyph />
        </div>
        <div className="gutter">
          <h1 className="display-hero hero-h1">
            <span className="mask-line"><span>Ujjawal</span></span>
            <span className="mask-line"><span>Agrawal</span></span>
          </h1>
          <p className="hero-intro">
            Designer who builds. I design products and <span className="em">ship</span> them, working directly
            with engineering. <span className="strong">HCDE</span> at the University of Washington, based in Seattle.
          </p>
          <div className="hero-ctas">
            <Link className="cta-pill" to={{ pathname: '/', hash: '#work' }}>
              See the work <span className="arrow" aria-hidden="true">&rarr;</span>
            </Link>
            <Link className="cta-ghost" to={{ pathname: '/', hash: '#contact' }}>
              <span className="dot" aria-hidden="true" />Get in touch
            </Link>
          </div>
        </div>
        <div className="gutter" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="scroll-cue" aria-hidden="true">
            <span className="word">Scroll</span>
            <span className="rail"><span className="ball" /></span>
          </div>
        </div>
      </section>

      <div id="sheet">
        <Marquee words={marqueeWords} />

        {/* ---------- work ---------- */}
        <section id="work" className="section gutter" aria-labelledby="work-h">
          <div className="sec-head">
            <span className="index-label rv">[001]</span>
            <h2 id="work-h" className="display-section rv d1">Work</h2>
            <p className="subline rv d2">
              Three case studies. One I founded, one I shipped on a team, one that asked what{' '}
              <span className="em">medicine</span> could look like if pain were visible.
            </p>
          </div>

          <ol className="cs-index">
            {caseStudies.map((c, i) => {
              const Thumb = thumbs[c.slug];
              return (
                <li key={c.slug} className="rv">
                  <Link to={`/work/${c.slug}`} className="cs-row" data-cursor>
                    <span className="no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="title">{c.title}</span>
                      <span className="cat mono-label">{c.cat} · {c.year}</span>
                      <span className="sum" style={{ display: 'block' }}>{c.sum}</span>
                      <span className="read">Read the case study <span aria-hidden="true">&rarr;</span></span>
                    </span>
                    <span className="thumb"><Thumb /></span>
                  </Link>
                </li>
              );
            })}
          </ol>

          <div className="rv" style={{ marginTop: '5rem' }}>
            <h3 className="mono-label">Other work</h3>
            <ul className="other-list">
              {otherWork.map((w) => (
                <li key={w.name}>
                  <span className="name">{w.name}</span>
                  <span className="mono-label">{w.cat}</span>
                  <span className="desc">{w.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- about ---------- */}
        <section id="about" className="section gutter" aria-labelledby="about-h">
          <div className="sec-head">
            <span className="index-label rv">[002]</span>
            <h2 id="about-h" className="display-section rv d1">About</h2>
          </div>
          <div className="about-grid">
            <div className="rv">
              <ImageSlot
                need="real photo of me"
                src={img('portrait-kerry-park.webp')}
                alt="Ujjawal in a dark blazer at sunset, with the Seattle skyline and Space Needle behind him"
              />
            </div>
            <div>
              <p className="statement rv" style={{ marginTop: 0 }}>
                Designer who <span className="em">builds</span>. I design products and{' '}
                <span className="strong">ship them</span>, working directly with engineering.
              </p>
              <dl className="about-facts rv">
                <div><dt>Studying</dt><dd>Human Centered Design &amp; Engineering, University of Washington</dd></div>
                <div><dt>Minor</dt><dd>Business Management</dd></div>
                <div><dt>Graduating</dt><dd>June 2027</dd></div>
                <div><dt>Based in</dt><dd>Seattle, WA</dd></div>
                <div><dt>Resume</dt><dd><Ph>resume PDF link</Ph></dd></div>
              </dl>
              <ul className="off-clock rv" aria-label="Photos">
                {offClock.map((p) => (
                  <li key={p.src}>
                    <figure>
                      <img src={img(p.src)} alt={p.alt} loading="lazy" />
                      <figcaption>{p.caption}</figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- toolkit ---------- */}
        <section id="toolkit" className="section gutter" aria-labelledby="kit-h">
          <div className="sec-head">
            <span className="index-label rv">[003]</span>
            <h2 id="kit-h" className="display-section rv d1">Toolkit</h2>
          </div>
          <div className="kit-grid">
            {toolkit.map((g) => (
              <div className="kit-group rv" key={g.n}>
                <h3 className="head"><span className="num">{g.n}</span><span className="label">{g.label}</span></h3>
                <ul className="kit-items">{g.items.map((x) => <li key={x}><span>{x}</span></li>)}</ul>
              </div>
            ))}
          </div>
        </section>

        <Marquee words={marqueeWords} />

        {/* ---------- journey ---------- */}
        <section id="journey" className="section gutter" aria-labelledby="journey-h">
          <div className="sec-head center">
            <span className="index-label rv">[004]</span>
            <h2 id="journey-h" className="display-section rv d1">Journey</h2>
            <p className="subline rv d2">
              Most recent first. The years things started <span className="strong">shipping</span>, back to
              the <span className="em">foundations</span>.
            </p>
          </div>
          <Journey />
        </section>

        {/* ---------- contact ---------- */}
        <section id="contact" className="section gutter" aria-labelledby="contact-h">
          <SectionHead
            index="005"
            title="Contact"
            center
            sub={<>Hiring for product design, or building something that needs a designer who can <span className="em">ship</span>? Email is fastest.</>}
          />
          <div className="contact-rows">
            <a className="c-row rv" href="mailto:ujjawal.agrawal@outlook.com">
              <span className="mono-label">Email</span>
              <span className="c-value">
                <span className="text">ujjawal.agrawal@outlook.com</span>
                <span className="c-circle" aria-hidden="true">&nearr;</span>
              </span>
            </a>
            <div className="c-row rv">
              <span className="mono-label">Based in</span>
              <span className="c-value"><span className="text">Seattle, WA</span></span>
            </div>
          </div>
          <div className="socials rv">
            <a href="https://linkedin.com/in/ujjawal-agrawal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/cooluj" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </section>
      </div>
    </>
  );
}
