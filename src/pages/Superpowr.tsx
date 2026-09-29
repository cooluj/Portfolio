import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { ImageSlot } from '../components/Placeholder';
import { prefersReducedMotion } from '../components/useReveal';
import BeforeAfter from '../visuals/BeforeAfter';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

type Theme = 'dark' | 'light';
const KEY = 'ua-superpowr-theme';

const applyMode = (t: Theme) => {
  const root = document.documentElement;
  if (t === 'light') root.dataset.mode = 'light';
  else delete root.dataset.mode;
};

/** Light and dark were shipped modes on Superpowr, so this page lets you switch it too. */
function useCaseTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });
  useEffect(() => {
    applyMode(theme);
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage blocked */
    }
  }, [theme]);
  // Leaving the case study returns the rest of the site to its dark reskin.
  useEffect(() => () => void delete document.documentElement.dataset.mode, []);

  // Circular wipe from the clicked button via the View Transitions API; instant when unsupported or reduced motion.
  const switchTheme = useCallback(
    (t: Theme, x: number, y: number) => {
      if (t === theme) return;
      if (typeof document.startViewTransition !== 'function' || prefersReducedMotion()) {
        setTheme(t);
        return;
      }
      const root = document.documentElement;
      root.style.setProperty('--vt-x', `${Math.round(x)}px`);
      root.style.setProperty('--vt-y', `${Math.round(y)}px`);
      root.dataset.wipe = '';
      const done = () => {
        delete root.dataset.wipe;
        root.style.removeProperty('--vt-x');
        root.style.removeProperty('--vt-y');
      };
      const vt = document.startViewTransition(() => {
        applyMode(t);
        flushSync(() => setTheme(t));
      });
      vt.finished.then(done, done);
    },
    [theme],
  );
  return [theme, switchTheme] as const;
}

function ThemeSwitch({ theme, switchTheme }: { theme: Theme; switchTheme: (t: Theme, x: number, y: number) => void }) {
  const pick = (t: Theme) => (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    switchTheme(t, r.left + r.width / 2, r.top + r.height / 2);
  };
  return (
    <div className="theme-dock rv" role="group" aria-label="Page colour mode">
      <p>
        This page has both modes too. Switch it and read the rest in either.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" className="ctl" aria-pressed={theme === 'dark'} onClick={pick('dark')}>Dark</button>
        <button type="button" className="ctl" aria-pressed={theme === 'light'} onClick={pick('light')}>Light</button>
      </div>
      <span className="mono-label theme-note">Both modes shipped to production at Superpowr.</span>
    </div>
  );
}

export default function Superpowr() {
  const [theme, switchTheme] = useCaseTheme();
  return (
    <article className="cs gutter">
      <CaseHeader
        slug="superpowr"
        lede="Real capability underneath, and people couldn't get to it."
        meta={[
          { k: 'Role', v: 'Product Design & Development Intern' },
          { k: 'Time', v: 'June to September 2026, full time' },
          { k: 'Status', v: 'Shipped to production' },
        ]}
      />

      <ThemeSwitch theme={theme} switchTheme={switchTheme} />

      <Block n="01" title="The problem">
        <div className="prose">
          <p>
            The product had real capability underneath, but people couldn't get to it. Users stalled in the testing
            flow, the core thing the product exists to do, and the landing page didn't explain the product well
            enough for anyone to arrive with intent.
          </p>
        </div>
        <div className="flowline">
          <div>
            <h3>Drop-off 01 · The front door</h3>
            <p>The landing page didn't explain the product, so nobody arrived with intent.</p>
          </div>
          <div>
            <h3>Drop-off 02 · The main room</h3>
            <p>Users stalled in the testing flow, the one thing the product exists to do.</p>
          </div>
        </div>
      </Block>

      <Block n="02" title="The approach">
        <div className="prose">
          <p>
            Rather than a visual refresh, I rebuilt the experience around <strong>where people were actually getting
            stuck</strong>. I redesigned the testing flow so users could get through it without hitting a wall, and
            rebuilt the landing page so the product's value was clear before anyone signed up.
          </p>
          <p>
            I owned the information architecture, user flows, wireframes and high-fidelity interfaces, plus the
            motion concepts for a scroll-driven product experience. The research started from one question: at
            which step does the ten-minute assessment promise stop being believed?
          </p>
        </div>
        <div className="cs-figs">
          <ImageSlot
            need="research plan"
            src={img('superpowr-research-plan.webp')}
            alt="Superpowr research plan titled Why candidates stop mid-battery, with background, objectives, four research questions, a methods table, a six-week timeline and planned outputs"
            caption="The research plan behind the testing-flow work: why candidates stop mid-assessment. Figures in the plan are illustrative."
          />
        </div>
        <BeforeAfter
          label="Compare testing flow"
          before={{ need: 'old testing flow screenshot', alt: 'The original Superpowr testing flow', src: img('superpowr-testing-before.webp') }}
          after={{ need: 'new testing flow screenshot', alt: 'The redesigned Superpowr testing flow', src: img('superpowr-testing-after.webp') }}
          caption="Testing flow, illustrated reconstruction. Drag the slider, or focus it and use the arrow keys."
        />
        <BeforeAfter
          label="Compare landing page"
          before={{ need: 'old landing page screenshot', alt: 'The original Superpowr landing page', src: img('superpowr-landing-before.webp') }}
          after={{ need: 'new landing page screenshot', alt: 'The rebuilt Superpowr landing page', src: img('superpowr-landing-after.webp') }}
          caption="Landing page, before and after: archived April 2026 versus the redesign."
        />
      </Block>

      <Block n="03" title="Brand, modes, access">
        <div className="prose">
          <p>
            Alongside that I led the branding redesign, shipped light and dark modes, and brought the interface up to
            WCAG accessibility standards so every interactive element was <strong>reachable and usable, not just
            present</strong>.
          </p>
        </div>
        <div className="cs-figs">
          <ImageSlot need="brand system overview" src={img('superpowr-brand.webp')} alt="Superpowr brand system: logo, type and colour" caption="The brand system, reconstructed from the shipped site." />
        </div>
        <div className="cs-figs two">
          <ImageSlot need="light mode screen" src={img('superpowr-light.webp')} alt="Superpowr interface in light mode" caption="Light mode, captured from the live site." />
          <ImageSlot need="dark mode screen" src={img('superpowr-dark.webp')} alt="Superpowr interface in dark mode" caption="Dark mode, captured from the live site." />
        </div>
      </Block>

      <Block n="04" title="Working with engineering">
        <div className="prose">
          <p>
            I worked directly alongside the engineering team through implementation. Not handing off mockups, but
            building with them until it shipped.
          </p>
        </div>
      </Block>

      <Block n="05" title="The outcome">
        <div className="prose">
          <p>The redesign shipped to production. A live product people use, not a Figma file.</p>
          <p>
            I don't have publishable before/after metrics from the internship, so there are no invented
            lift percentages here. What shipped is the evidence: the rebuilt testing flow and landing page
            are the production site today, and the comparisons above show the live product, not mockups.
          </p>
        </div>
      </Block>

      <Reflection>
        The temptation with a redesign is to make it look different. The work that mattered was making it{' '}
        make sense, and most of that lived in flows, not pixels.
      </Reflection>

      <NextCase slug="superpowr" />
    </article>
  );
}
