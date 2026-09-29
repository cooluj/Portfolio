import { useEffect, useState } from 'react';

/** True while the key event comes from something the visitor is typing into. */
export function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable;
}

/** A plain key press: no modifier held, not typing. */
export const isPlain = (e: KeyboardEvent) => !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e);

/** The footer's #foot-slot, found after Layout has committed; null until then. */
export function useFootSlot() {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setEl(document.getElementById('foot-slot'));
  }, []);
  return el;
}

export const SEATTLE = 'America/Los_Angeles';

/** Hour of the day in Seattle, 0 to 23. */
export function seattleHour(d = new Date()) {
  const h = new Intl.DateTimeFormat('en-US', { timeZone: SEATTLE, hour: 'numeric', hour12: false }).format(d);
  return Number(h) % 24;
}

/** Seattle clock text, e.g. 9:41 or 9:41:07, plus the zone name (PST or PDT). */
export function seattleTime(d = new Date(), seconds = false) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SEATTLE, hour: 'numeric', minute: '2-digit', second: seconds ? '2-digit' : undefined, hour12: true, timeZoneName: 'short',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const time = `${get('hour')}:${get('minute')}${seconds ? `:${get('second')}` : ''}`;
  return { time, period: get('dayPeriod').toLowerCase(), zone: get('timeZoneName') };
}

export const EMAIL = 'ujjawal.agrawal@outlook.com';
export const RESUME = `${import.meta.env.BASE_URL}Ujjawal-Agrawal-Resume.pdf`;

/** Copies text, falling back to a hidden textarea where the clipboard API is blocked. */
export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through */
    }
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

/** Keeps Tab inside a dialog. Returns the cleanup. */
export function trapFocus(root: HTMLElement) {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const f = [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]')].filter((el) => el.tabIndex >= 0);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !root.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !root.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };
  root.addEventListener('keydown', onKey);
  return () => root.removeEventListener('keydown', onKey);
}
