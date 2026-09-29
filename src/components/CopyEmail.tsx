import { useEffect, useRef, useState } from 'react';

const RESET_MS = 1800;

function fallbackCopy(text: string) {
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
  document.body.removeChild(ta);
  return ok;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the textarea path */
    }
  }
  return fallbackCopy(text);
}

/** Email as a mailto link plus a Copy pill; sized to sit inside a .c-row as its .c-value. */
export default function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(email);
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState('idle'), RESET_MS);
  };

  const label = state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy';

  return (
    <span className="c-value copy-email">
      <a className="text copy-email-text" href={`mailto:${email}`} data-cursor="Mail">{email}</a>
      <button
        type="button"
        className={`ctl copy-email-btn${state === 'copied' ? ' is-copied' : ''}`}
        aria-live="polite"
        aria-label={state === 'idle' ? `Copy ${email}` : undefined}
        onClick={onCopy}
      >
        <span className="copy-email-label" key={state}>{label}</span>
      </button>
    </span>
  );
}
