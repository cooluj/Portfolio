import { useVoice } from '../copy';

/** Two-line claim and a lede. The default hero. */
export default function Statement() {
  const v = useVoice();
  return (
    <section className="hm-hero gutter" aria-labelledby="hm-h">
      <p className="hm-eyebrow">{v.eyebrow}</p>
      <h1 id="hm-h" className="hm-h1">
        {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
      </h1>
      <p className="hm-lede">{v.lede}</p>
      <div className="hm-ctas">
        <a className="cta-pill" href="#work">{v.cta} <span aria-hidden="true">&darr;</span></a>
        <a className="hm-ghost" href="mailto:ujjawal.agrawal@outlook.com">ujjawal.agrawal@outlook.com</a>
      </div>
    </section>
  );
}
