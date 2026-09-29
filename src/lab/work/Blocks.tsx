import { Link } from 'react-router-dom';
import { TiltBox } from '../../components/useTilt';
import { featured } from '../../data/home';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

/** Alternating blocks: screenshot one side, problem and call the other. The default. */
export default function Blocks() {
  return (
    <>
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
    </>
  );
}
