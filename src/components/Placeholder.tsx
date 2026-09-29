import type { ReactNode } from 'react';

/** Inline placeholder. Loud on purpose: anything wrapped in this has not been supplied yet. */
export function Ph({ children }: { children: ReactNode }) {
  return <mark className="ph">[PLACEHOLDER: {children}]</mark>;
}

type ImageSlotProps = {
  /** What the image should be. Shown in the placeholder until `src` is set. */
  need: string;
  /** Alt text for the real image. Required so it is written before the image lands. */
  alt: string;
  src?: string;
  caption?: ReactNode;
  ratio?: string;
};

/**
 * An image that may not exist yet. Set `src` (a file in /public) to swap the
 * placeholder for the real thing; the alt text is already in place.
 */
export function ImageSlot({ need, alt, src, caption, ratio = '16 / 10' }: ImageSlotProps) {
  return (
    <figure className="cs-fig">
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <div className="ph-block" style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder, image not supplied yet: ${need}`}>
          <span>[PLACEHOLDER: {need}]</span>
        </div>
      )}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
