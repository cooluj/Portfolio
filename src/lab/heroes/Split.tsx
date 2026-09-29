import { useVoice } from '../copy';
import { Ctas, img } from './parts';

/** Text left, the Kerry Park portrait bleeding off the right edge. Stacks on small screens. */
export default function Split() {
  const v = useVoice();
  return (
    <section className="hm-hero hero-split gutter" aria-labelledby="hm-h">
      <div className="hero-split-text">
        <p className="hm-eyebrow">{v.eyebrow}</p>
        <h1 id="hm-h" className="hm-h1">
          {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
        </h1>
        <p className="hm-lede">{v.lede}</p>
        <Ctas cta={v.cta} />
      </div>
      <figure className="hero-split-fig">
        <img
          src={img('portrait-kerry-park.webp')}
          alt="Ujjawal Agrawal in a dark blazer at Kerry Park at sunset, the Space Needle behind him"
          width={1320}
          height={1313}
          fetchPriority="high"
          decoding="async"
        />
        <figcaption className="hero-split-cap">Kerry Park, Seattle</figcaption>
      </figure>
    </section>
  );
}
