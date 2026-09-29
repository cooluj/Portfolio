import { useVoice } from '../copy';
import { Ctas, EMAIL } from './parts';

const ROWS: { k: string; v: string; accent?: boolean }[] = [
  { k: 'Role', v: 'Product designer who writes the front-end' },
  { k: 'Based in', v: 'Seattle, WA' },
  { k: 'Studying', v: 'HCDE at the University of Washington, class of 2027' },
  { k: 'Status', v: 'Open to 2027 roles', accent: true },
  { k: 'Latest', v: 'Superpowr redesign shipped' },
];

/** A compact two-column fact table beside the claim: role, location, status, latest, contact. Strong hairlines, no fluff. */
export default function Ledger() {
  const v = useVoice();
  return (
    <section className="hm-hero hero-ledger gutter" aria-labelledby="hm-h">
      <div className="hero-lg-text">
        <p className="hm-eyebrow">{v.eyebrow}</p>
        <h1 id="hm-h" className="hm-h1">
          {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
        </h1>
        <p className="hm-lede">{v.lede}</p>
        <Ctas cta={v.cta} />
      </div>
      <table className="hero-lg-table">
        <caption className="sr-only">Facts at a glance</caption>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.k}>
              <th scope="row">{r.k}</th>
              <td className={r.accent ? 'hero-lg-accent' : undefined}>{r.v}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Contact</th>
            <td><a href={`mailto:${EMAIL}`}>{EMAIL}</a></td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
