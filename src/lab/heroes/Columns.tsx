import { useVoice } from '../copy';
import { Ctas, img } from './parts';

type Tile = { src: string } | { card: true };

// Two columns, no photo in both, one place card in the second.
const A: Tile[] = [{ src: 'portrait-kerry-park.webp' }, { src: 'rainier-vista.webp' }, { src: 'st-peters.webp' }];
const B: Tile[] = [{ src: 'hero-skyline-night.webp' }, { card: true }, { src: 'fuji-golf.webp' }, { src: 'skyline-night.webp' }];

const track = (tiles: Tile[]) => (
  <div className="drift-track">
    {[...tiles, ...tiles].map((t, i) =>
      'src' in t ? (
        <div className="tile photo" key={i}>
          <img src={img(t.src)} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
        </div>
      ) : (
        <div className="tile place" key={i}>
          <span>Seattle, WA</span>
          <span>47.6° N</span>
          <span>122.3° W</span>
        </div>
      ),
    )}
  </div>
);

/** The statement with two photo columns drifting in opposite directions in the corner (desktop only). */
export default function Columns() {
  const v = useVoice();
  return (
    <section className="hm-hero hero-columns gutter" aria-labelledby="hm-h">
      <div className="drift-wrap" aria-hidden="true">
        <div className="drift-cols">
          <div className="drift-col">{track(A)}</div>
          <div className="drift-col offset">{track(B)}</div>
        </div>
        <div className="drift-fade" />
      </div>
      <div className="hero-col-text">
        <p className="hm-eyebrow">{v.eyebrow}</p>
        <h1 id="hm-h" className="hm-h1">
          {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
        </h1>
        <p className="hm-lede">{v.lede}</p>
        <Ctas cta={v.cta} />
      </div>
    </section>
  );
}
