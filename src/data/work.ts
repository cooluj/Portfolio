export type CaseStudy = {
  slug: 'eventully' | 'superpowr' | 'painsights';
  title: string;
  cat: string;
  year: string;
  sum: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'eventully',
    title: 'Eventully',
    cat: 'Founder · Product design and build',
    year: '2026',
    sum: 'UW has over 1,200 student organisations and students still said there was nothing to do. I built the platform that fixes discovery, and testing told me it had two kinds of user, not one.',
  },
  {
    slug: 'superpowr',
    title: 'Superpowr.ai',
    cat: 'Product Design & Development Intern',
    year: '2025',
    sum: 'People stalled at the front door and in the main room. I rebuilt the testing flow and landing page around where they got stuck, then shipped it with engineering.',
  },
  {
    slug: 'painsights',
    title: 'PainSights',
    cat: 'FigBuild 2026 · Speculative design',
    year: '2026',
    sum: 'Pain is the one thing in medicine that is only self-reported. A clinician platform that reads it directly, so a doctor can see where it hurts and how much, even when the patient cannot say.',
  },
];

export const otherWork: { name: string; cat: string; desc: string; link?: string }[] = [
  { name: 'ArtisanCrafts', cat: 'IBM UX Capstone', desc: 'A trust-first marketplace for handmade goods. Research, personas, usability testing and a full design system.', link: 'https://www.figma.com/proto/sHDOwDL5KibuqUGIvdLora/Prototyping-ArtisansCrafts?node-id=47-7&starting-point-node-id=47%3A7' },
  { name: 'Seattle Center', cat: 'Identity redesign', desc: 'An identity redesign for the Seattle Center campus.' },
  { name: 'Pathfinder', cat: 'AI · Python', desc: 'Graph-traversal pathfinding in a maze. BFS at the core, with greedy, A* and uniform-cost search compared against it.' },
  { name: 'Autonomous RC', cat: 'Hardware · Arduino', desc: 'RC cars and motorboats that drive themselves. Hardware and software integration where failures are loud and lessons are physical.' },
];

export const toolkit = [
  { n: '01', label: 'Design', items: ['Figma', 'FigJam', 'Framer', 'Illustrator', 'Photoshop', 'Prototyping', 'Design Systems'] },
  { n: '02', label: 'Engineering', items: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Python', 'Node.js'] },
  { n: '03', label: 'Research & Method', items: ['User Interviews', 'Usability Testing', 'A/B Testing', 'Synthesis', 'Journey Mapping', 'Accessibility (WCAG)'] },
  { n: '04', label: 'Tools', items: ['Git', 'Vercel', 'Notion', 'Arduino / Raspberry Pi'] },
];

// Most recent first, so the strongest work is what people see before they stop scrolling.
export const journey = [
  { n: '01', year: '2026', body: 'Founded Eventully and built it end to end: a live campus engagement platform for UW students. Designed PainSights at FigBuild, Figma’s student design-a-thon.', tags: ['Founder', 'Next.js', 'FigBuild'] },
  { n: '02', year: '2025', body: 'Product Design & Development intern at Superpowr.ai. Rebuilt the testing flow and landing page, led the brand redesign, and shipped it alongside engineering.', tags: ['React', 'Tailwind', 'Product'] },
  { n: '03', year: '2024', body: 'Design work with real users: UX Research Assistant at UW, then Pathways Bloodworks on data and research. Learned how much of design is deciding what not to build.', tags: ['Research', 'Prototyping'] },
  { n: '04', year: '2023', body: 'Started at UW in HCDE. Learned research methods and began pairing them with front-end code instead of treating them as separate skills. Joined the Autonomous Vehicle team: Arduino, Raspberry Pi, hardware that fails loudly.', tags: ['HCDE', 'Figma', 'Arduino'] },
  { n: '05', year: '2022', body: 'First real exposure to building things. Fundamentals, logic, and the realisation that I liked making the thing more than talking about it.', tags: ['Foundations'] },
];

export const marqueeWords = [
  'CLARITY OVER CLEVERNESS', 'RESEARCH THEN BUILD', 'SHIP AND ITERATE',
  'ACCESSIBLE BY DEFAULT', 'REDUCE COGNITIVE LOAD', 'SYSTEMS, NOT SCREENS',
];
