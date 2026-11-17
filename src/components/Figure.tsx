import type { CSSProperties, ReactNode } from 'react';

type FigureProps = {
  src: string;
  alt: string;
  caption?: ReactNode;
  /** Natural pixel size. Reserves the space before the image loads and keeps it no taller than the screen. */
  w?: number;
  h?: number;
};

/** A captioned image in a case study. Same markup the case CSS styles as `.cs-fig`. */
export default function Figure({ src, alt, caption, w, h }: FigureProps) {
  const sized = Boolean(w && h);
  return (
    <figure className={`cs-fig${sized ? ' fit' : ''}`} style={sized ? ({ '--ar': w! / h! } as CSSProperties) : undefined}>
      <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
