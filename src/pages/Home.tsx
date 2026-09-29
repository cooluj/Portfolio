import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CopyEmail from '../components/CopyEmail';
import Toolkit from '../components/Toolkit';
import { TiltBox } from '../components/useTilt';
import { useReveal } from '../components/useReveal';
import { otherWork } from '../data/work';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
const RESUME = `${import.meta.env.BASE_URL}Ujjawal-Agrawal-Resume.pdf`;

/** The three case studies, each with the problem in one line and the decision that mattered. */
const featured = [
  {
    slug: 'eventully',
    title: 'Eventully',
    kicker: 'Founder · live at eventully.org · 2024 to now',
    problem: 'UW has 1,231 student organisations and students still said there was nothing to do. Supply was never the problem. Discovery was.',
    call: 'Testing showed two kinds of user, not one. I served both: filters for people who know what they want, AI search for people who only know the feeling, and a transparent match score on every result.',
    image: { src: 'eventully-landing.webp', alt: 'Eventully landing page: Find Your People, Run Your Club, with an AI search preview and a club match score', pos: '0% 0%' },
  },
  {
    slug: 'superpowr',
    title: 'Superpowr.ai',
    kicker: 'Product Design & Development Intern · summer 2026 · shipped to production',
    problem: 'People stalled at the front door and in the main room: a landing page that did not explain the product, and a testing flow they could not get through.',
    call: 'Not a visual refresh. I rebuilt the flows around where people got stuck, owned the IA, wireframes and hi-fi, then built it with engineering until it shipped, with light and dark modes and WCAG in.',
    image: { src: 'superpowr-research-plan.webp', alt: 'Superpowr research plan: why candidates stop mid-assessment', pos: '0% 0%' },
  },
  {
    slug: 'painsights',
    title: 'PainSights',
    kicker: 'FigBuild 2026 · speculative clinical design · team of three',
    problem: 'Pain is the one thing in medicine that is entirely self-reported. Sedated, unconscious and non-verbal patients cannot report it at all.',
    call: 'We designed for the clinician, not the patient. The patient wears the sensor; the doctor sees where it hurts, how much, and who to see first.',
    image: { src: 'painsights-scan.webp', alt: 'PainSights after a scan: a body model with pain regions glowing and a ranked list of detected pain points', pos: '40% 20%' },
  },
];

const timeline = [
  { when: '2026', what: 'Superpowr.ai, Product Design & Development Intern', note: 'June to September. Led the end-to-end redesign of an AI career-discovery platform and shipped it as production front-end.' },
  { when: '2026', what: 'FigBuild, PainSights', note: 'Designed the clinical dashboard and built the hi-fi Figma prototype. Presented at FigBuild.' },
  { when: '2026', what: 'IBM UX Design Capstone, ArtisanCrafts', note: 'Research, personas, IA and hi-fi prototypes for a handmade-goods marketplace.' },
  { when: '2025', what: 'University of Washington, UX Research Assistant', note: 'March to August. Synthesised 100+ studies on resilience in aviation into visualisations for a peer-reviewed publication.' },
  { when: '2024', what: 'Eventully, Founder', note: 'June onward. Research, design system, Flask and Tailwind build, launch and iteration.' },
  { when: '2024', what: 'Pathways Bloodworks, Data & UX Research Intern', note: 'June to September. Mapped the donor journey, built retention dashboards, ran segmentation in Python and SQL for campaigns tied to a 35% rise in donor turnout.' },
  { when: '2023', what: 'Started HCDE at the University of Washington', note: 'Research methods paired with front-end code from the first year.' },
];

const photos = [
  { src: 'portrait-kerry-park.webp', alt: 'Ujjawal at Kerry Park at sunset, Space Needle behind', cap: 'Kerry Park' },
  { src: 'skyline-night.webp', alt: 'Ujjawal at night in front of the Seattle skyline reflected in the water', cap: 'Lake Union' },
  { src: 'rainier-vista.webp', alt: 'Mount Rainier above the trees, seen past Drumheller Fountain on the UW campus', cap: 'Rainier Vista, UW' },
  { src: 'fuji-golf.webp', alt: 'Ujjawal on a golf course with Mount Fuji behind', cap: 'Fuji' },
  { src: 'st-peters.webp', alt: 'Ujjawal leaning on a railing inside the dome of St. Peter’s Basilica', cap: 'St. Peter’s, Rome' },
];

export default function Home() {
  useReveal();
  useEffect(() => {
    document.title = 'Ujjawal Agrawal · Designer who builds';
  }, []);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hm-hero gutter" aria-labelledby="hm-h">
        <p className="hm-eyebrow">Product designer who writes the front-end. Seattle. HCDE at UW, class of 2027.</p>
        <h1 id="hm-h" className="hm-h1">
          <span className="hm-h1-line">Designer</span>
          <span className="hm-h1-line">who builds.</span>
        </h1>
        <p className="hm-lede">
          I take products from the first user interview to production code. I founded Eventully, a live platform
          UW students use to find their people, and I led the Superpowr.ai redesign that shipped this summer.
        </p>
        <div className="hm-ctas">
          <a className="cta-pill" href="#work">See the work <span aria-hidden="true">&darr;</span></a>
          <a className="hm-ghost" href="mailto:ujjawal.agrawal@outlook.com">ujjawal.agrawal@outlook.com</a>
        </div>
      </section>

      {/* ---------- work ---------- */}
      <section id="work" className="hm-work gutter" aria-labelledby="work-h">
        <div className="hm-sec-head">
          <h2 id="work-h">Selected work</h2>
          <p>Three products. What broke, the call I made, and what shipped.</p>
        </div>

        {featured.map((f, i) => (
          <article className={`wb rv${i % 2 ? ' wb-flip' : ''}`} key={f.slug}>
            <Link to={`/work/${f.slug}`} className="wb-media" aria-label={`${f.title} case study`} data-cursor="View">
              <TiltBox className="wb-frame" max={3}>
                <img src={img(f.image.src)} alt={f.image.alt} loading={i ? 'lazy' : 'eager'} style={{ objectPosition: f.image.pos }} />
              </TiltBox>
            </Link>
            <div className="wb-text">
              <p className="wb-kicker">
                <span className="wb-no">0{i + 1}</span>
                {f.kicker}
              </p>
              <h3 className="wb-title">
                <Link to={`/work/${f.slug}`}>{f.title}</Link>
              </h3>
              <p className="wb-problem">{f.problem}</p>
              <p className="wb-call">
                <span className="wb-call-label">The call</span>
                {f.call}
              </p>
              <Link to={`/work/${f.slug}`} className="wb-read">
                Read the case study <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>
        ))}

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
