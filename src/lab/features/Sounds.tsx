import { useEffect } from 'react';

const DUR = 0.03;
const HZ = 1200;
const GAIN = 0.08;

/** A 30ms sine tick on every button and link click. Built on first click; silent under reduced motion. */
export default function Sounds() {
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ctx: AudioContext | null = null;
    const tick = () => {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      ctx ??= new AC();
      if (ctx.state === 'suspended') void ctx.resume();
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = HZ;
      // A 3ms ramp either side so the tick has no click of its own.
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(GAIN, t + 0.003);
      g.gain.setValueAtTime(GAIN, t + DUR - 0.003);
      g.gain.linearRampToValueAtTime(0, t + DUR);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + DUR);
    };
    const onClick = (e: MouseEvent) => {
      if (rm.matches) return;
      const t = e.target as Element | null;
      if (t?.closest('a, button')) tick();
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      void ctx?.close();
    };
  }, []);
  return null;
}
