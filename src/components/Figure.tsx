import type { CSSProperties, ReactNode } from 'react';

type FigureProps = {
  src: string;
  alt: string;
  caption?: ReactNode;
  /** Natural pixel size. Reserves the space before the image loads and keeps it no taller than the screen. */
  w?: number;
  h?: number;
  /** Load at once: for the first figure on a page, which must be there when the page opens. */
  eager?: boolean;
};

/** A captioned image in a case study. Same markup the case CSS styles as `.cs-fig`. */
export default function Figure({ src, alt, caption, w, h, eager }: FigureProps) {
  const sized = Boolean(w && h);
  return (
    <figure className={`cs-fig${sized ? ' fit' : ''}`} style={sized ? ({ '--ar': w! / h! } as CSSProperties) : undefined}>
      <img src={src} alt={alt} width={w} height={h} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
