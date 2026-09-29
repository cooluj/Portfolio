import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { prefersReducedMotion } from '../../components/useReveal';
import { featured } from '../../data/home';
import { useVoice } from '../copy';
import { Ctas } from './parts';

const MS = 12;
const AFTER_CMD = 240;
const AFTER_OUT = 120;

type Entry = { cmd: string } | { out: string };

/** The commands, in order. Each command is followed by one output block. */
const SCRIPT: Entry[] = [
  { cmd: 'whoami' }, { out: 'name' },
  { cmd: 'cat role.txt' }, { out: 'role' },
  { cmd: 'ls work/' }, { out: 'work' },
  { cmd: 'cat intro.txt' }, { out: 'intro' },
  { cmd: 'open' }, { out: 'ctas' },
];
const END = SCRIPT.length;

/** The hero is a shell that prints the intro line by line: typed at 12ms a character, skippable, instant under reduced motion. */
export default function Terminal() {
  const v = useVoice();
  const still = prefersReducedMotion();
  const [{ idx, chars }, setS] = useState({ idx: still ? END : 0, chars: 0 });
  const done = idx >= END;

  useEffect(() => {
    if (done) return;
    const e = SCRIPT[idx];
    let id = 0;
    if ('cmd' in e) {
      if (chars < e.cmd.length) id = window.setTimeout(() => setS({ idx, chars: chars + 1 }), MS);
      else id = window.setTimeout(() => setS({ idx: idx + 1, chars: 0 }), AFTER_CMD);
    } else {
      id = window.setTimeout(() => setS({ idx: idx + 1, chars: 0 }), AFTER_OUT);
    }
    return () => window.clearTimeout(id);
  }, [idx, chars, done]);

  const outputs: Record<string, ReactNode> = {
    name: (
      <h1 id="hm-h" className="hm-h1 hero-term-h1">
        {v.h1.map((line, i) => <span className="hm-h1-line" key={i}>{line}</span>)}
      </h1>
    ),
    role: <p className="hm-eyebrow hero-term-role">{v.eyebrow}</p>,
    work: (
      <ul className="hero-term-ls" aria-label="Case studies">
        {featured.map((f) => (
          <li key={f.slug}><Link to={`/work/${f.slug}`} data-cursor="View">{f.slug}/</Link></li>
        ))}
      </ul>
    ),
    intro: <p className="hm-lede hero-term-lede">{v.lede}</p>,
    ctas: <Ctas cta={v.cta} className="hero-term-ctas" />,
  };

  return (
    <section className="hm-hero hero-terminal gutter" aria-labelledby="hm-h">
      <div className={`hero-term${done ? ' is-done' : ''}`} aria-busy={!done}>
        <div className="hero-term-bar">
          <span className="hero-term-title" aria-hidden="true">ujjawal@seattle: ~</span>
          {!done && (
            <button type="button" className="hero-term-skip" onClick={() => setS({ idx: END, chars: 0 })}>
              Skip
            </button>
          )}
        </div>
        <div className="hero-term-body">
          {SCRIPT.map((e, k) => {
            const state = k < idx ? 'is-shown' : k === idx ? 'is-live' : 'is-pending';
            if ('cmd' in e) {
              const typed = k < idx ? e.cmd : k === idx ? e.cmd.slice(0, chars) : '';
              return (
                <div className={`hero-term-line hero-term-cmd ${state}`} key={k} aria-hidden="true">
                  <span className="hero-term-prompt">$</span>
                  <span className="hero-term-typed">{typed}</span>
                  {k === idx && <span className="hero-term-cursor" />}
                  <span className="hero-term-rest">{e.cmd.slice(typed.length)}</span>
                </div>
              );
            }
            return (
              <div className={`hero-term-line hero-term-out ${state}`} key={k}>
                {outputs[e.out]}
              </div>
            );
          })}
          {done && (
            <div className="hero-term-line hero-term-cmd is-shown" aria-hidden="true">
              <span className="hero-term-prompt">$</span>
              <span className="hero-term-cursor" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
