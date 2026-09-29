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
    eyebrow: 'Product designer, Seattle',
    h1: ['Designer', 'who builds.'],
    lede: 'From the first interview to production code. Founder of Eventully; led the Superpowr.ai redesign.',
    cta: 'See the work',
  },
  // Three words, then proof. The shortest possible claim, backed by two things that are live.
  blunt: {
    eyebrow: 'Ujjawal Agrawal. Product designer, front-end included. Seattle.',
    h1: ['I ship.'],
    lede: 'Eventully has been live for UW students since June 2024, and the Superpowr.ai redesign I led went to production this summer as the front-end I wrote.',
    cta: 'Proof',
  },
  // Leads with the figures, then tells you what each one means.
  numbers: {
    eyebrow: 'Three numbers about Ujjawal Agrawal, product designer in Seattle.',
    h1: ['1,231 organisations.', '3 products built.', '1 designer who codes.'],
    lede: '1,231 is every UW student organisation indexed on Eventully, the campus platform I founded, with AI search and a match score on every result. 3 is Eventully, the Superpowr.ai redesign, and the PainSights clinical dashboard. 1 is me, designing in Figma and writing the React that ships.',
    cta: 'Count them yourself',
  },
  // Asks the question a hiring manager is already asking, then answers it.
  question: {
    eyebrow: 'A fair question, from a product designer in Seattle.',
    h1: ['What does a designer', 'who codes look like?'],
    lede: 'Like someone who runs the interviews, draws the flows in Figma, then opens the editor and writes the React and TypeScript that ships. I founded Eventully for UW students, led the Superpowr.ai redesign to production, and built PainSights with a team of three at FigBuild 2026.',
    cta: 'Have a look',
  },
  // Four beliefs, each one a habit you can see in the work below.
  manifesto: {
    eyebrow: 'How I work. Ujjawal Agrawal, product designer and front-end developer, Seattle.',
    h1: ['Research first.', 'Decide, then build.', 'Ship it yourself.', 'Test it with people.'],
    lede: 'Four habits, each one visible in Eventully, Superpowr.ai and PainSights, and each one learned from synthesising 100+ studies as a UX research assistant at UW.',
    cta: 'See the habits at work',
  },
  // A magazine standfirst about him, written as if by an editor.
  third: {
    eyebrow: 'Profile. Product designer and front-end developer, Seattle.',
    h1: ['Ujjawal Agrawal', 'designs and ships.'],
    lede: 'He studies Human Centered Design & Engineering at the University of Washington, class of 2027. In June 2024 he founded Eventully, a live platform indexing 1,231 UW student organisations, and this summer he led the redesign of Superpowr.ai and wrote the production front-end himself. He would like to do it again for your team.',
    cta: 'Read the work',
  },
};

export function useVoice(): Voice {
  const { sel } = useLab();
  return VOICES[sel.copy] || VOICES.current;
}
