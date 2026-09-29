import { useLab } from './LabContext';

export type Voice = {
  eyebrow: string;
  /** Headline lines; each renders on its own line. */
  h1: string[];
  lede: string;
  cta: string;
};

export const VOICES: Record<string, Voice> = {
  current: {
    eyebrow: 'Product designer who writes the front-end. Seattle. HCDE at UW, class of 2027.',
    h1: ['Designer', 'who builds.'],
    lede: 'I take products from the first user interview to production code. I founded Eventully, a live platform UW students use to find their people, and I led the Superpowr.ai redesign that shipped this summer.',
    cta: 'See the work',
  },
};

export function useVoice(): Voice {
  const { sel } = useLab();
  return VOICES[sel.copy] || VOICES.current;
}
