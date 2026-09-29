import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { seattleTime, useFootSlot } from './util';

/** Seattle time in the footer, ticking every second. */
export default function Clock() {
  const slot = useFootSlot();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!slot) return null;
  const { time, period, zone } = seattleTime(now, true);
  return createPortal(
    <span className="ft-clock">
      <span className="ft-clock-k">Seattle</span>
      <time dateTime={now.toISOString()}>{time} {period}</time>
      <span className="ft-clock-z">{zone}</span>
    </span>,
    slot,
  );
}
