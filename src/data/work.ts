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
    year: 'Since 2024',
    sum: 'UW has over 1,200 student organisations and students still said there was nothing to do. I built the platform that fixes discovery, and testing told me it had two kinds of user, not one.',
  },
  {
    slug: 'superpowr',
    title: 'Superpowr.ai',
    cat: 'Product Design & Development Intern',
    year: 'Summer 2026',
    sum: 'People stalled at the front door and in the main room. I rebuilt the testing flow and landing page around where they got stuck, then shipped it with engineering.',
  },
  {
    slug: 'painsights',
    title: 'PainSights',
    cat: 'FigBuild · Speculative design',
    year: 'Mar 2026',
    sum: 'Pain is the one thing in medicine that is only self-reported. A clinician platform that reads it directly, so a doctor can see where it hurts and how much, even when the patient cannot say.',
  },
];

export const otherWork: { name: string; cat: string; desc: string; link?: string }[] = [
  { name: 'ArtisanCrafts', cat: 'IBM UX Capstone · 2026', desc: 'A trust-first marketplace for handmade goods. Research, personas, usability testing and a full design system.', link: 'https://www.figma.com/proto/sHDOwDL5KibuqUGIvdLora/Prototyping-ArtisansCrafts?node-id=47-7&starting-point-node-id=47%3A7' },
  { name: 'Seattle Center', cat: 'Identity redesign', desc: 'An identity redesign for the Seattle Center campus.' },
  { name: 'Pathfinder', cat: 'AI · Python', desc: 'Graph-traversal pathfinding in a maze. BFS at the core, with greedy, A* and uniform-cost search compared against it.' },
  { name: 'Autonomous RC', cat: 'Hardware · Arduino', desc: 'RC cars and motorboats that drive themselves. Hardware and software integration where failures are loud and lessons are physical.' },
];

export const toolkit = [
  { n: '01', label: 'Design', items: ['Figma', 'Figma Make', 'Adobe Creative Suite', 'Prototyping', 'Design Systems', 'Information Architecture', 'Interaction Design'] },
  { n: '02', label: 'Engineering', items: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Tailwind CSS', 'Flask', 'Python', 'SQL'] },
  { n: '03', label: 'Research & Method', items: ['User Interviews', 'Usability Testing', 'A/B Testing', 'Synthesis', 'Journey Mapping', 'Accessibility (WCAG)'] },
  { n: '04', label: 'Tools', items: ['Git', 'Claude Code', 'Cursor', 'v0', 'Arduino / Raspberry Pi'] },
];

// Most recent first, so the strongest work is what people see before they stop scrolling.
export const journey = [
  { n: '01', year: '2026', body: 'Product Design & Development intern at Superpowr.ai, June to September: led the redesign of an AI-powered career-discovery platform and shipped it as production front-end with the team. Rebuilt and launched Eventully at eventully.org. Designed PainSights at FigBuild, Figma’s student design-a-thon, and ArtisanCrafts for the IBM UX Design Capstone.', tags: ['Superpowr.ai', 'Eventully', 'FigBuild'] },
  { n: '02', year: '2025', body: 'UX Research Assistant at UW, March to August: synthesised findings from 100+ studies on mental health and resilience in high-performance aviation, and turned them into data visualisations for a peer-reviewed publication.', tags: ['Research', 'Data visualisation'] },
  { n: '03', year: '2024', body: 'Founded Eventully in June. Data & UX Research intern at Pathways Bloodworks: mapped the donor journey, built dashboards that exposed retention drop-off, and ran segmentation in Python and SQL for campaigns tied to a 35% increase in donor turnout.', tags: ['Founder', 'Python', 'SQL'] },
  { n: '04', year: '2023', body: 'Started at UW in HCDE. Learned research methods and began pairing them with front-end code instead of treating them as separate skills. Joined the Autonomous Vehicle team: Arduino, Raspberry Pi, hardware that fails loudly.', tags: ['HCDE', 'Figma', 'Arduino'] },
  { n: '05', year: '2022', body: 'First real exposure to building things. Fundamentals, logic, and the realisation that I liked making the thing more than talking about it.', tags: ['Foundations'] },
];

export const marqueeWords = [
  'CLARITY OVER CLEVERNESS', 'RESEARCH THEN BUILD', 'SHIP AND ITERATE',
  'ACCESSIBLE BY DEFAULT', 'REDUCE COGNITIVE LOAD', 'SYSTEMS, NOT SCREENS',
];
