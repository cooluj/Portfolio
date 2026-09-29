import { useEffect, useState } from 'react';
import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { ImageSlot, Ph } from '../components/Placeholder';
import BeforeAfter from '../visuals/BeforeAfter';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

type Theme = 'dark' | 'light';
const KEY = 'ua-superpowr-theme';

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
    const root = document.documentElement;
    if (theme === 'light') root.dataset.mode = 'light';
    else delete root.dataset.mode;
    try {
      localStorage.setItem(KEY, theme);
    } catch {
      /* storage blocked */
    }
  }, [theme]);
  // Leaving the case study returns the rest of the site to its dark reskin.
  useEffect(() => () => void delete document.documentElement.dataset.mode, []);
  return [theme, setTheme] as const;
}

function ThemeSwitch({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  return (
    <div className="theme-dock rv" role="group" aria-label="Page colour mode">
      <p>
        I shipped light and dark modes for Superpowr. This page has both too. Switch it and read the rest in
        either.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="button" className="ctl" aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>Dark</button>
        <button type="button" className="ctl" aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>Light</button>
      </div>
    </div>
  );
}

export default function Superpowr() {
  const [theme, setTheme] = useCaseTheme();
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

      <ThemeSwitch theme={theme} setTheme={setTheme} />

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
          before={{ need: 'old testing flow screenshot', alt: 'The original Superpowr testing flow' }}
          after={{ need: 'new testing flow screenshot', alt: 'The redesigned Superpowr testing flow' }}
          caption="Testing flow. Drag the slider, or focus it and use the arrow keys."
        />
        <BeforeAfter
          label="Compare landing page"
          before={{ need: 'old landing page screenshot', alt: 'The original Superpowr landing page' }}
          after={{ need: 'new landing page screenshot', alt: 'The rebuilt Superpowr landing page' }}
          caption="Landing page, before and after."
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
          <ImageSlot need="brand system overview" alt="Superpowr brand system: logo, type and colour" caption="The brand system." />
        </div>
        <div className="cs-figs two">
          <ImageSlot need="light mode screen" alt="Superpowr interface in light mode" caption="Light mode." />
          <ImageSlot need="dark mode screen" alt="Superpowr interface in dark mode" caption="Dark mode." />
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
            <Ph>before and after metric, e.g. testing flow completion or landing page sign-up rate</Ph>
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
