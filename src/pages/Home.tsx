import { useEffect } from 'react';
import CopyEmail from '../components/CopyEmail';
import Toolkit from '../components/Toolkit';
import { useReveal } from '../components/useReveal';
import { otherWork } from '../data/work';
import { photos, timeline } from '../data/home';
import { HeroSwitch, WorkSwitch } from '../lab/switch';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
const RESUME = `${import.meta.env.BASE_URL}Ujjawal-Agrawal-Resume.pdf`;

export default function Home() {
  useReveal();
  useEffect(() => {
    document.title = 'Ujjawal Agrawal · Designer who builds';
  }, []);

  return (
    <>
      <HeroSwitch />

      {/* ---------- work ---------- */}
      <section id="work" className="hm-work gutter" aria-labelledby="work-h">
        <div className="hm-sec-head">
          <h2 id="work-h">Selected work</h2>
          <p>Three products. What broke, the call I made, and what shipped.</p>
        </div>

        <WorkSwitch />

        <div className="hm-other rv">
          <h3>Also</h3>
          <ul>
            {otherWork.map((w) => (
              <li key={w.name}>
                <span className="hm-other-name">{w.name}</span>
                <span className="hm-other-cat">{w.cat}</span>
                <span className="hm-other-desc">
                  {w.desc}
                  {w.link && (
                    <>
                      {' '}
                      <a href={w.link} target="_blank" rel="noopener noreferrer" className="other-link">
                        Prototype<span className="sr-only"> for {w.name}</span> <span aria-hidden="true">↗</span>
                      </a>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- about ---------- */}
      <section id="about" className="hm-about gutter" aria-labelledby="about-h">
        <div className="hm-sec-head">
          <h2 id="about-h">About</h2>
        </div>
        <div className="hm-about-grid">
          <div className="hm-about-text rv">
            <p className="hm-about-lead">
              I design the thing and then I build it, so the design I tested is the design that ships. No handoff,
              no drift.
            </p>
            <p>
              I study Human Centered Design & Engineering at the University of Washington, with a minor in Business
              Management, on the Dean’s List, graduating June 2027. Before Superpowr and Eventully: UX research at UW
              on a peer-reviewed publication, and data and UX research at Pathways Bloodworks.
            </p>
            <dl className="hm-facts">
              <div><dt>Based in</dt><dd>Seattle, WA</dd></div>
              <div><dt>Graduating</dt><dd>June 2027</dd></div>
              <div><dt>Certifications</dt><dd>IBM UX Design Capstone, Google UX Design, AWS Academy Cloud Foundations, PMI Project Leadership</dd></div>
              <div><dt>Resume</dt><dd><a href={RESUME} target="_blank" rel="noopener noreferrer" className="other-link">Download PDF</a></dd></div>
            </dl>
          </div>
          <div className="hm-portrait rv">
            <img src={img('portrait-kerry-park.webp')} alt="Ujjawal Agrawal in a dark blazer at sunset, with the Seattle skyline behind him" loading="lazy" />
          </div>
        </div>
        <ul className="hm-photos rv" aria-label="Photos">
          {photos.map((p) => (
            <li key={p.src}>
              <figure>
                <img src={img(p.src)} alt={p.alt} loading="lazy" />
                <figcaption>{p.cap}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- toolkit ---------- */}
      <section id="toolkit" className="hm-toolkit gutter" aria-labelledby="kit-h">
        <div className="hm-sec-head">
          <h2 id="kit-h">Tools and methods</h2>
        </div>
        <Toolkit />
      </section>

      {/* ---------- timeline ---------- */}
      <section id="journey" className="hm-timeline gutter" aria-labelledby="tl-h">
        <div className="hm-sec-head">
          <h2 id="tl-h">Timeline</h2>
          <p>Most recent first.</p>
        </div>
        <ol className="hm-tl">
          {timeline.map((t, i) => (
            <li key={i} className="rv">
              <span className="hm-tl-when">{t.when}</span>
              <span className="hm-tl-what">{t.what}</span>
              <span className="hm-tl-note">{t.note}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- contact ---------- */}
      <section id="contact" className="hm-contact gutter" aria-labelledby="contact-h">
        <div className="hm-sec-head">
          <h2 id="contact-h">Hiring for product design?</h2>
          <p>Email is fastest. I answer within a day.</p>
        </div>
        <div className="hm-contact-row rv">
          <CopyEmail email="ujjawal.agrawal@outlook.com" />
        </div>
        <ul className="hm-links rv">
          <li><a href="https://linkedin.com/in/ujjawal-agrawal" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a href="https://github.com/cooluj" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          <li><a href={RESUME} target="_blank" rel="noopener noreferrer">Resume</a></li>
        </ul>
      </section>
    </>
  );
}
