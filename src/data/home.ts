export type Featured = {
  slug: string; title: string; kicker: string; problem: string; call: string;
  image: { src: string; alt: string; pos: string };
};

/** The three case studies, each with the problem in one line and the decision that mattered. */
export const featured: Featured[] = [
  {
    slug: 'eventully',
    title: 'Eventully',
    kicker: 'Founder · live at eventully.org · 2024 to now',
    problem: 'UW has 1,231 student organisations and students still said there was nothing to do. Supply was never the problem. Discovery was.',
    call: 'Testing showed two kinds of user, not one. I served both: filters for people who know what they want, AI search for people who only know the feeling, and a transparent match score on every result.',
    image: { src: 'eventully-landing.webp', alt: 'Eventully landing page: Find Your People, Run Your Club, with an AI search preview and a club match score', pos: '0% 0%' },
  },
  {
    slug: 'superpowr',
    title: 'Superpowr.ai',
    kicker: 'Product Design & Development Intern · summer 2026 · shipped to production',
    problem: 'People stalled at the front door and in the main room: a landing page that did not explain the product, and a testing flow they could not get through.',
    call: 'Not a visual refresh. I rebuilt the flows around where people got stuck, owned the IA, wireframes and hi-fi, then built it with engineering until it shipped, with light and dark modes and WCAG in.',
    image: { src: 'superpowr-research-plan.webp', alt: 'Superpowr research plan: why candidates stop mid-assessment', pos: '0% 0%' },
  },
  {
    slug: 'painsights',
    title: 'PainSights',
    kicker: 'FigBuild 2026 · speculative clinical design · team of three',
    problem: 'Pain is the one thing in medicine that is entirely self-reported. Sedated, unconscious and non-verbal patients cannot report it at all.',
    call: 'We designed for the clinician, not the patient. The patient wears the sensor; the doctor sees where it hurts, how much, and who to see first.',
    image: { src: 'painsights-scan.webp', alt: 'PainSights after a scan: a body model with pain regions glowing and a ranked list of detected pain points', pos: '40% 20%' },
  },
];

export const timeline = [
  { when: '2026', what: 'Superpowr.ai, Product Design & Development Intern', note: 'June to September. Led the end-to-end redesign of an AI career-discovery platform and shipped it as production front-end.' },
  { when: '2026', what: 'FigBuild, PainSights', note: 'Designed the clinical dashboard and built the hi-fi Figma prototype. Presented at FigBuild.' },
  { when: '2026', what: 'IBM UX Design Capstone, ArtisanCrafts', note: 'Research, personas, IA and hi-fi prototypes for a handmade-goods marketplace.' },
  { when: '2025', what: 'University of Washington, UX Research Assistant', note: 'March to August. Synthesised 100+ studies on resilience in aviation into visualisations for a peer-reviewed publication.' },
  { when: '2024', what: 'Eventully, Founder', note: 'June onward. Research, design system, Flask and Tailwind build, launch and iteration.' },
  { when: '2024', what: 'Pathways Bloodworks, Data & UX Research Intern', note: 'June to September. Mapped the donor journey, built retention dashboards, ran segmentation in Python and SQL for campaigns tied to a 35% rise in donor turnout.' },
  { when: '2023', what: 'Started HCDE at the University of Washington', note: 'Research methods paired with front-end code from the first year.' },
];

export const photos = [
  { src: 'portrait-kerry-park.webp', alt: 'Ujjawal at Kerry Park at sunset, Space Needle behind', cap: 'Kerry Park' },
  { src: 'skyline-night.webp', alt: 'Ujjawal at night in front of the Seattle skyline reflected in the water', cap: 'Lake Union' },
  { src: 'rainier-vista.webp', alt: 'Mount Rainier above the trees, seen past Drumheller Fountain on the UW campus', cap: 'Rainier Vista, UW' },
  { src: 'fuji-golf.webp', alt: 'Ujjawal on a golf course with Mount Fuji behind', cap: 'Fuji' },
  { src: 'st-peters.webp', alt: 'Ujjawal leaning on a railing inside the dome of St. Peter’s Basilica', cap: 'St. Peter’s, Rome' },
];

