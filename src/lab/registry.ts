/**
 * The design lab: every exploration is an option in one dimension. Selections are applied to <html>
 * as data-l-<dimension>="<option>" (features: data-l-features="a b c"), so CSS and components can react.
 */
export type Option = { id: string; name: string; desc: string; fonts?: string };
export type Dimension = { id: string; name: string; desc: string; multi?: boolean; options: Option[] };

const G = 'https://fonts.googleapis.com/css2?';

export const DIMENSIONS: Dimension[] = [
  {
    id: 'type', name: 'Typography', desc: 'The face the whole site is set in.',
    options: [
      { id: 'schibsted', name: 'Schibsted Grotesk', desc: 'Sturdy editorial grotesque. The current default.' },
      { id: 'fraunces', name: 'Fraunces + Inter Tight', desc: 'A wonky soft serif for headings over a tight sans for text.', fonts: G + 'family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Inter+Tight:wght@400;500;600&display=swap' },
      { id: 'space', name: 'Space Grotesk', desc: 'Geometric with quirky terminals; reads technical.', fonts: G + 'family=Space+Grotesk:wght@400;500;700&display=swap' },
      { id: 'bricolage', name: 'Bricolage Grotesque', desc: 'Variable optical sizes; big headings get extra character.', fonts: G + 'family=Bricolage+Grotesque:opsz,wght@12..96,300..800&display=swap' },
      { id: 'instrument', name: 'Instrument Sans + Serif', desc: 'Clean sans body with a sharp italic serif for emphasis.', fonts: G + 'family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&display=swap' },
      { id: 'syne', name: 'Syne', desc: 'Wide, extra-bold display; unmistakable at hero size.', fonts: G + 'family=Syne:wght@400..800&display=swap' },
      { id: 'archivo', name: 'Archivo (Black for display)', desc: 'Heavy grotesque headlines, compact body.', fonts: G + 'family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&display=swap' },
      { id: 'manrope', name: 'Manrope', desc: 'Rounded geometric; friendly and modern.', fonts: G + 'family=Manrope:wght@400..800&display=swap' },
      { id: 'plex', name: 'IBM Plex Sans + Plex Mono', desc: 'Engineered, slightly retro; pairs with the mono labels.', fonts: G + 'family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap' },
      { id: 'unbounded', name: 'Unbounded', desc: 'Very wide display face; loud in the hero only.', fonts: G + 'family=Unbounded:wght@400..900&family=Inter+Tight:wght@400;500;600&display=swap' },
      { id: 'newsreader', name: 'Newsreader', desc: 'A newspaper serif with real italics; reads like an essay.', fonts: G + 'family=Newsreader:ital,opsz,wght@0,6..72,300..800;1,6..72,300..800&display=swap' },
      { id: 'mono', name: 'All mono', desc: 'Everything in IBM Plex Mono; the whole site reads like source.' },
      { id: 'dm', name: 'DM Serif Display + DM Sans', desc: 'High-contrast serif headings, quiet sans body.', fonts: G + 'family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400..700&display=swap' },
      { id: 'familjen', name: 'Familjen Grotesk', desc: 'Narrow, warm grotesque; dense headlines.', fonts: G + 'family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&display=swap' },
    ],
  },
  {
    id: 'theme', name: 'Colour', desc: 'The palette tokens every element reads from.',
    options: [
      { id: 'void', name: 'Void', desc: 'Near-black, off-white, one ember accent. The current default.' },
      { id: 'paper', name: 'Paper', desc: 'Warm off-white ground, ink text, oxblood accent.' },
      { id: 'uw', name: 'Husky', desc: 'UW purple and gold, for the campus Eventully was built for.' },
      { id: 'midnight', name: 'Midnight', desc: 'Deep navy ground with a pale lime accent.' },
      { id: 'forest', name: 'Forest', desc: 'Dark green ground, cream text, copper accent.' },
      { id: 'graphite', name: 'Graphite', desc: 'Mid-dark grey with an electric orange accent.' },
      { id: 'ink', name: 'Ink', desc: 'Pure black and pure white, no accent at all.' },
      { id: 'sepia', name: 'Print', desc: 'Sepia paper with black ink, like a printed dossier.' },
      { id: 'terminal', name: 'Terminal', desc: 'Black with phosphor green text and an amber accent.' },
      { id: 'signal', name: 'Signal', desc: 'Black on safety yellow; the loudest option here.' },
      { id: 'dusk', name: 'Dusk', desc: 'Warm charcoal ground with a coral accent.' },
      { id: 'clinic', name: 'Clinic', desc: 'Cool light grey and slate, a red accent, borrowed from PainSights.' },
    ],
  },
  {
    id: 'texture', name: 'Surface', desc: 'What sits on the background.',
    options: [
      { id: 'flat', name: 'Flat', desc: 'Nothing on the ground. The current default.' },
      { id: 'grain', name: 'Grain', desc: 'Fine film grain over everything.' },
      { id: 'dots', name: 'Dot grid', desc: 'A faint dot grid, like a layout canvas.' },
      { id: 'blueprint', name: 'Blueprint', desc: 'Ruled major and minor lines, like drafting paper.' },
      { id: 'ruled', name: 'Ruled', desc: 'Horizontal rules at the line height, like a notebook.' },
      { id: 'scanlines', name: 'Scanlines', desc: 'Subtle CRT scanlines.' },
      { id: 'vignette', name: 'Vignette', desc: 'The edges fall off to darkness.' },
      { id: 'halftone', name: 'Halftone', desc: 'A print halftone that fades toward the corners.' },
    ],
  },
  {
    id: 'hero', name: 'Hero', desc: 'The first thing on the home page.',
    options: [
      { id: 'statement', name: 'Statement', desc: 'Two-line claim and a lede. The current default.' },
      { id: 'nameplate', name: 'Nameplate', desc: 'The name at full width, the claim underneath.' },
      { id: 'split', name: 'Split portrait', desc: 'Text left, the Kerry Park portrait bleeding off the right edge.' },
      { id: 'kinetic', name: 'Kinetic', desc: 'One word in the headline cycles: designs, researches, prototypes, ships.' },
      { id: 'typewriter', name: 'Typewriter', desc: 'The lede types itself, then a cursor blinks.' },
      { id: 'field', name: 'Field', desc: 'The Eventully dot field behind the headline; dots follow the pointer.' },
      { id: 'toggle', name: 'Design / Build', desc: 'A switch in the headline flips the copy between the designer and the builder.' },
      { id: 'covers', name: 'Covers', desc: 'The three case study screens fan out under the headline.' },
      { id: 'terminal', name: 'Prompt', desc: 'The hero is a terminal that prints the intro line by line.' },
      { id: 'ledger', name: 'Ledger', desc: 'A compact fact table: role, location, studies, latest, contact.' },
    ],
  },
  {
    id: 'work', name: 'Work layout', desc: 'How the three case studies are presented.',
    options: [
      { id: 'blocks', name: 'Alternating blocks', desc: 'Screenshot one side, problem and call the other. The current default.' },
      { id: 'covers', name: 'Full-bleed covers', desc: 'Each project is a full-width image with the title set over it.' },
      { id: 'strip', name: 'Horizontal strip', desc: 'The three projects side by side; scrolls sideways on small screens.' },
      { id: 'stack', name: 'Sticky stack', desc: 'Cards pin and stack as you scroll.' },
      { id: 'list', name: 'Index list', desc: 'A dense list; hovering a row previews its image.' },
      { id: 'grid', name: 'Grid', desc: 'Three equal cards with the call on the back on hover or focus.' },
      { id: 'numbers', name: 'Big numbers', desc: 'Each project led by a huge index numeral.' },
      { id: 'tabs', name: 'Tabs', desc: 'One project shown at a time, switched by tabs or arrow keys.' },
      { id: 'filmstrip', name: 'Filmstrip', desc: 'A single row of frames with sprocket edges, scrubbed by scroll.' },
      { id: 'magazine', name: 'Magazine', desc: 'Rules, columns and a drop cap, like a feature spread.' },
    ],
  },
  {
    id: 'transition', name: 'Page transition', desc: 'What happens between routes.',
    options: [
      { id: 'fade', name: 'Fade up', desc: 'Content fades and rises. The current default.' },
      { id: 'wipe', name: 'Wipe', desc: 'A panel wipes across and reveals the next page.' },
      { id: 'curtain', name: 'Curtain', desc: 'Two halves part from the middle.' },
      { id: 'zoom', name: 'Zoom', desc: 'The new page scales in from 96%.' },
      { id: 'slide', name: 'Slide', desc: 'Pages slide in from the right, back slides left.' },
      { id: 'none', name: 'None', desc: 'Instant. Sometimes the right call.' },
    ],
  },
  {
    id: 'reveal', name: 'Scroll reveal', desc: 'How sections appear as you scroll.',
    options: [
      { id: 'rise', name: 'Rise', desc: 'Fade and rise 30px. The current default.' },
      { id: 'blur', name: 'Blur', desc: 'Blurred to sharp.' },
      { id: 'mask', name: 'Mask', desc: 'Lines rise out of a clipped box.' },
      { id: 'scale', name: 'Scale', desc: 'From 96% to 100%.' },
      { id: 'clip', name: 'Clip', desc: 'A clip-path opens from the left.' },
      { id: 'none', name: 'None', desc: 'Everything is simply there.' },
    ],
  },
  {
    id: 'images', name: 'Image treatment', desc: 'How screenshots and photos are framed.',
    options: [
      { id: 'plain', name: 'Plain', desc: 'Rounded, thin border. The current default.' },
      { id: 'browser', name: 'Browser chrome', desc: 'Screenshots sit in a minimal browser window.' },
      { id: 'sharp', name: 'Sharp', desc: 'No radius, hairline border.' },
      { id: 'duotone', name: 'Duotone', desc: 'Images in two inks; full colour on hover.' },
      { id: 'mono', name: 'Grayscale', desc: 'Black and white until hovered.' },
      { id: 'polaroid', name: 'Polaroid', desc: 'Personal photos get a white frame and a tilt.' },
      { id: 'tilted', name: 'Tilted stack', desc: 'Case study images stack at slight angles.' },
      { id: 'shadow', name: 'Deep shadow', desc: 'Soft, long shadows lift images off the page.' },
    ],
  },
  {
    id: 'cursor', name: 'Cursor', desc: 'What the pointer looks like.',
    options: [
      { id: 'system', name: 'System', desc: 'The normal cursor. The current default.' },
      { id: 'dot', name: 'Dot', desc: 'A small ember dot.' },
      { id: 'ring', name: 'Ring', desc: 'A ring that grows over links.' },
      { id: 'label', name: 'Label', desc: 'A ring that says View, Drag or Mail over targets.' },
      { id: 'trail', name: 'Trail', desc: 'A short fading trail behind the pointer.' },
      { id: 'spotlight', name: 'Spotlight', desc: 'A soft light follows the pointer across the dark ground.' },
    ],
  },
  {
    id: 'layout', name: 'Structure', desc: 'The page grid and rhythm.',
    options: [
      { id: 'wide', name: 'Wide', desc: 'Full-width sections with big gutters. The current default.' },
      { id: 'narrow', name: 'Essay', desc: 'One narrow reading column, like a long article.' },
      { id: 'sidebar', name: 'Sidebar', desc: 'A fixed left rail with name and nav; content on the right.' },
      { id: 'rules', name: 'Rules', desc: 'Every section boxed by hairlines, headings in the margin.' },
      { id: 'bento', name: 'Bento', desc: 'About and facts as a tiled grid.' },
      { id: 'edge', name: 'Edge to edge', desc: 'Images and rules run to the viewport edge.' },
      { id: 'compact', name: 'Compact', desc: 'Tighter spacing; the whole page fits in fewer screens.' },
      { id: 'sticky', name: 'Sticky headings', desc: 'Section headings pin to the left while the content scrolls.' },
    ],
  },
  {
    id: 'copy', name: 'Voice', desc: 'How the hero speaks.',
    options: [
      { id: 'current', name: 'Direct', desc: '"Designer who builds." The current default.' },
      { id: 'blunt', name: 'Blunt', desc: '"I ship." Three words, then proof.' },
      { id: 'numbers', name: 'Numbers first', desc: 'Leads with 1,231 organisations, 3 built, 1 designer.' },
      { id: 'question', name: 'Question', desc: '"What does a designer who codes look like?"' },
      { id: 'manifesto', name: 'Manifesto', desc: 'Four short lines of belief.' },
      { id: 'third', name: 'Third person', desc: 'Written like a magazine standfirst about him.' },
    ],
  },
  {
    id: 'case', name: 'Case study pages', desc: 'The layout of the three case studies.',
    options: [
      { id: 'default', name: 'Sticky labels', desc: 'Section labels pin to the left. The current default.' },
      { id: 'magazine', name: 'Magazine', desc: 'Two-column text with rules and a pull quote.' },
      { id: 'toc', name: 'Table of contents', desc: 'A sticky contents list tracks your position.' },
      { id: 'steps', name: 'Numbered steps', desc: 'Big numerals introduce each section.' },
      { id: 'wide', name: 'Wide media', desc: 'Images break out of the text column.' },
      { id: 'minimal', name: 'Minimal', desc: 'No labels, generous space, the words carry it.' },
      { id: 'timeline', name: 'Timeline', desc: 'Sections hang off a vertical line.' },
      { id: 'reader', name: 'Reader', desc: 'Reading progress, estimated time, and a return-to-top rail.' },
    ],
  },
  {
    id: 'features', name: 'Extras', desc: 'Toggle any number of these on.', multi: true,
    options: [
      { id: 'palette', name: 'Command palette', desc: 'Press Cmd/Ctrl+K or / to jump anywhere, copy the email or grab the resume.' },
      { id: 'shortcuts', name: 'Keyboard shortcuts', desc: 'g then w, a, t, c to jump; ? shows the list.' },
      { id: 'inspect', name: 'Inspect mode', desc: 'Press i: outlines every section with its name and shows the grid, the way a builder sees it.' },
      { id: 'konami', name: 'Konami code', desc: 'Up up down down left right left right b a. Something happens.' },
      { id: 'tabtitle', name: 'Tab title', desc: 'When you leave the tab, the title asks you back.' },
      { id: 'progress', name: 'Reading progress', desc: 'A thin bar in the header tracks how far you are.' },
      { id: 'greeting', name: 'Time-aware line', desc: 'A line under the header knows whether it is morning in Seattle.' },
      { id: 'print', name: 'Print stylesheet', desc: 'Cmd+P prints a clean one-page resume of the site.' },
      { id: 'shuffle', name: 'Shuffle', desc: 'A button in the footer randomises the lab; every visit could be different.' },
      { id: 'clock', name: 'Seattle clock', desc: 'The footer shows the local time where he is.' },
      { id: 'sounds', name: 'Click sounds', desc: 'Tiny UI sounds on buttons, off by default, one switch.' },
      { id: 'grid', name: 'Layout grid', desc: 'Press g twice to show the 12-column grid the pages are built on.' },
    ],
  },
];

export const DEFAULTS: Record<string, string> = {
  type: 'schibsted', theme: 'void', texture: 'flat', hero: 'statement', work: 'blocks', transition: 'fade',
  reveal: 'rise', images: 'plain', cursor: 'system', layout: 'wide', copy: 'current', case: 'default', features: '',
};

/** Every option with a running number, for the list of 100. */
export const NUMBERED = DIMENSIONS.flatMap((d) => d.options.map((o) => ({ dim: d, opt: o }))).map((x, i) => ({ n: i + 1, ...x }));
