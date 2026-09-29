import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { seattleHour, seattleTime } from './util';

const HIDE_AFTER = 80;

function line(d: Date) {
  const h = seattleHour(d);
  const { time } = seattleTime(d);
  const part = h < 5 ? 'Late night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 21 ? 'Good evening' : 'Late evening';
  return `${part} in Seattle, ${time}`;
}

/** A mono line under the header on the home page that knows what time it is where he is. */
export default function Greeting() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  const [text, setText] = useState(() => line(new Date()));
  const [hidden, setHidden] = useState(false);

  // Tick on the minute so the clock never reads a minute late.
  useEffect(() => {
    if (!home) return;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      setText(line(new Date()));
      interval = window.setInterval(() => setText(line(new Date())), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [home]);

  useEffect(() => {
    if (!home) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      setHidden(scrollY > HIDE_AFTER);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    addEventListener('scroll', queue, { passive: true });
    return () => {
      removeEventListener('scroll', queue);
      cancelAnimationFrame(raf);
    };
  }, [home]);

  if (!home) return null;
  return (
    <p className={`ft-greet gutter${hidden ? ' is-hidden' : ''}`}>
      <span className="ft-greet-dot" aria-hidden="true" />
      {text}
    </p>
  );
}
