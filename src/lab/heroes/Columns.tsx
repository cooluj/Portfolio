import { useEffect, useState } from 'react';
import { useVoice } from '../copy';
import { Ctas, img } from './parts';

type Tile = { src: string } | { card: true };

// Two columns, no photo in both, one place card in the second.
const A: Tile[] = [{ src: 'portrait-kerry-park' }, { src: 'rainier-vista' }, { src: 'st-peters' }];
const B: Tile[] = [{ src: 'hero-skyline-night' }, { card: true }, { src: 'fuji-golf' }, { src: 'skyline-night' }];

/** The columns are a desktop decoration: the CSS hides them below this width, so the DOM is not built there either. */
const WIDE = '(min-width: 1024px)';

function useWide() {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(WIDE).matches);
  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return wide;
}

// React 18 only forwards fetchpriority when it is written in lowercase; the camelCase form logs a warning.
const low = { fetchpriority: 'low' };

/** A tile is at most 16rem wide, so the 320 and 640 variants (made by scripts/images.mjs) cover 1x and 2x screens. */
const Photo = ({ name }: { name: string }) => (
  <img
    src={img(`${name}-640.webp`)}
    srcSet={`${img(`${name}-320.webp`)} 320w, ${img(`${name}-640.webp`)} 640w`}
    sizes="16rem"
    alt=""
    loading="lazy"
    decoding="async"
    {...low}
  />
);

const track = (tiles: Tile[]) => (
  <div className="drift-track">
    {[...tiles, ...tiles].map((t, i) =>
      'src' in t ? (
        <div className="tile photo" key={i}>
          <Photo name={t.src} />
        </div>
      ) : (
        <div className="tile place" key={i} style={{ opacity: 1 }}>
          <span style={{ color: 'var(--fg)' }}>Seattle, WA</span>
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
  const wide = useWide();
  return (
    <section className="hm-hero hero-columns gutter" aria-labelledby="hm-h">
      {wide && (
        <div className="drift-wrap" aria-hidden="true">
          <div className="drift-cols">
            <div className="drift-col">{track(A)}</div>
            <div className="drift-col offset">{track(B)}</div>
          </div>
          <div className="drift-fade" />
        </div>
      )}
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
