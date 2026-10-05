import type { ReactNode } from 'react';

type FigureProps = {
  src: string;
  alt: string;
  caption?: ReactNode;
};

/** A captioned image in a case study. Same markup the case CSS styles as `.cs-fig`. */
export default function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="cs-fig">
      <img src={src} alt={alt} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
