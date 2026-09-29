/** Shared bits for the hero variants: the email, the image helper, the two CTAs. */
export const EMAIL = 'ujjawal.agrawal@outlook.com';

export const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

/** The two calls every hero ends with: the work anchor and the mailto. */
export function Ctas({ cta, className = '' }: { cta: string; className?: string }) {
  return (
    <div className={`hm-ctas ${className}`.trim()}>
      <a className="cta-pill" href="#work">{cta} <span aria-hidden="true">&darr;</span></a>
      <a className="hm-ghost" href={`mailto:${EMAIL}`}>{EMAIL}</a>
    </div>
  );
}
