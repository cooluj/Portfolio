import {
  siArduino,
  siBlender,
  siClaude,
  siCss,
  siCursor,
  siFigma,
  siFlask,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siPython,
  siRaspberrypi,
  siReact,
  siTailwindcss,
  siTypescript,
  siV0,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';

export type Tool = {
  name: string;
  path?: string;
  mono?: string;
  /** Hover colour on the dark theme: brand hex, or --fg when the brand is too dark. */
  brand: string;
  /** Hover colour on the light theme: brand hex, or --fg when the brand is too light. */
  brandLight: string;
};

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

/** WCAG relative luminance of a six-digit hex, 0 (black) to 1 (white). */
export const luminance = (hex: string) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return 0.2126 * channel(n >> 16) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
};

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const DARK_BG = luminance('0a0a0a');
const LIGHT_BG = luminance('f4f3ef');

/** A brand hex that barely shows against a theme's background falls back to --fg on that theme. */
const brandPair = (hex: string) => {
  const l = luminance(hex);
  return {
    brand: contrast(l, DARK_BG) < 2.5 ? 'var(--fg)' : `#${hex}`,
    brandLight: contrast(l, LIGHT_BG) < 2.5 ? 'var(--fg)' : `#${hex}`,
  };
};

const logo = (icon: SimpleIcon, name = icon.title): Tool => ({ name, path: icon.path, ...brandPair(icon.hex) });
const monogram = (name: string, mono: string): Tool => ({ name, mono, brand: 'var(--ember)', brandLight: 'var(--ember)' });

export const tools: Tool[] = [
  logo(siFigma),
  logo(siReact),
  logo(siTypescript),
  logo(siJavascript),
  logo(siHtml5),
  logo(siCss),
  logo(siTailwindcss),
  logo(siFlask),
  logo(siPython),
  logo(siGit),
  logo(siGithub),
  logo(siClaude, 'Claude Code'),
  logo(siCursor),
  logo(siV0),
  logo(siArduino),
  logo(siRaspberrypi),
  logo(siBlender),
  monogram('Adobe Creative Suite', 'Ai'),
  monogram('SQL', 'SQ'),
  monogram('Figma Make', 'FM'),
];

export const methods = [
  'User interviews',
  'Usability testing',
  'A/B testing',
  'Synthesis',
  'Journey mapping',
  'Information architecture',
  'Interaction design',
  'Design systems',
  'Accessibility (WCAG)',
];
