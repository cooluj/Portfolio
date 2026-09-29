import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import CountUp from '../components/CountUp';
import { ImageSlot, Ph } from '../components/Placeholder';
import DiscoveryScatter from '../visuals/DiscoveryScatter';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const STATS: { n: number; label: string }[] = [
  { n: 1231, label: 'registered organisations' },
  { n: 18, label: 'categories' },
  { n: 2, label: 'kinds of user, not one' },
  { n: 1, label: 'match score on every result' },
];

export default function Eventully() {
  return (
    <article className="cs gutter">
      <CaseHeader
        slug="eventully"
        lede="Supply was never the problem at UW. Discovery was."
        meta={[
          { k: 'Role', v: 'Founder, product designer and developer. Designed and built end to end.' },
          { k: 'Status', v: <>Live at <a href="https://eventully.org" target="_blank" rel="noopener noreferrer">eventully.org</a></> },
          { k: 'Timeline', v: 'June 2024 to now' },
        ]}
      />

      <div className="rv">
        <DiscoveryScatter />
      </div>

      <div className="stats rv">
        <ul className="stats-grid" aria-label="Eventully by the numbers">
          {STATS.map((s) => (
            <li className="stat" key={s.label}>
              <span className="stat-tick" aria-hidden="true" />
              <span className="stat-n">
                <CountUp value={s.n} duration={1200} />
              </span>
              <span className="stat-l mono-label">{s.label}</span>
            </li>
          ))}
        </ul>
        <span className="stats-src mono-label">1,231 and 18 are from the UW organisation directory Eventully indexes. The other two are design decisions.</span>
      </div>

      <div style={{ marginTop: '3rem' }} className="rv">
        <ImageSlot
          need="hero screenshot of Eventully"
          src={img('eventully-landing.webp')}
          alt="Eventully landing page: the headline Find Your People, Run Your Club, beside a preview of an AI search result and a club with a match score"
          caption="The Eventully landing page."
        />
      </div>

      <Block n="01" title="The problem">
        <div className="prose">
          <p>
            The University of Washington has <strong>over 1,200 registered student organisations</strong>, and
            students still said there was nothing to do.
          </p>
          <p>
            Supply was never the issue. Discovery was. Clubs lived across scattered pages, dead links and Instagram
            accounts, so finding one thing you cared about cost more effort than it was worth.
          </p>
        </div>
      </Block>

      <Block n="02" title="The approach">
        <div className="prose">
          <p>
            I built Eventully as a live campus engagement platform. The first version leaned entirely on AI search:
            ask for what you want and let it find the club.
          </p>
          <p>
            In testing, that broke down for a lot of people. <strong>They didn't know what to ask</strong>, and a
            blank box gave them nothing to react to.
          </p>
        </div>
        <div className="cs-figs">
          <ImageSlot
            need="screenshot of the AI-only search version"
            src={img('eventully-ai-v1.webp')}
            alt="Early Eventully with a single empty AI search box and no other way in"
            caption="Version one. One box, and nothing to react to. Illustrated reconstruction; the v1 was never archived."
          />
        </div>
      </Block>

      <Block n="03" title="Two users, not one">
        <div className="prose">
          <p>
            So I ran an A/B test, and it showed I had two different users, not one. People who arrive knowing what
            they want, and people who only know the feeling they're after.
          </p>
          <p>
            Rather than picking a winner, I served both: filters for the first group, AI search for the second, and a{' '}
            <strong>transparent match score on every recommendation</strong> so either path explains itself instead
            of hiding behind a black box.
          </p>
        </div>

        <div className="paths" role="group" aria-label="How the two user groups reach a recommendation">
          <ol className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Arrives knowing</span>
              <p className="mt-2 text-lg leading-snug">what they want</p>
            </li>
            <li aria-hidden="true" className="hidden md:block font-mono text-faint">&rarr;</li>
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Uses</span>
              <p className="mt-2 text-lg leading-snug">Filters</p>
            </li>
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Arrives knowing</span>
              <p className="mt-2 text-lg leading-snug">only the feeling they're after</p>
            </li>
            <li aria-hidden="true" className="hidden md:block font-mono text-faint">&rarr;</li>
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Uses</span>
              <p className="mt-2 text-lg leading-snug">AI search</p>
            </li>
          </ol>
          <div className="mt-4 rounded-md p-4" style={{ border: '1px solid var(--ember)' }}>
            <span className="mono-label" style={{ color: 'var(--fg)' }}>Both paths end at</span>
            <p className="mt-2 text-lg leading-snug">
              A match score on every recommendation, so the result explains itself.
            </p>
          </div>
        </div>

        <div className="cs-figs">
          <ImageSlot
            need="club directory with filters"
            src={img('eventully-directory.webp')}
            alt="Eventully club directory listing 1,231 clubs, with category, status and sort filters above the results"
            caption="The filter path: every club, narrowed by category, status and sort."
          />
        </div>
        <div className="cs-figs two">
          <ImageSlot
            need="recommendations screen with the match score visible"
            src={img('eventully-recs.webp')}
            alt="Eventully AI search preview on the live site, showing a 91% match score on a club result"
            caption="The AI search path, captured from the live site: every result shows why it matched."
          />
          <ImageSlot
            need="A/B test notes or results"
            src={img('eventully-ab-test.webp')}
            alt="Diagram of the A/B test: AI-only search versus a hybrid of filters plus AI, and the three things measured"
            caption="The test that split one user into two. Diagram only; no measured figures are shown."
          />
        </div>
      </Block>

      <Block n="04" title="The outcome">
        <div className="cs-figs two" style={{ marginTop: 0, marginBottom: '2.5rem' }}>
          <ImageSlot
            need="earlier Eventully design"
            src={img('eventully-earlier.webp')}
            alt="An earlier Eventully landing page in cream and gold: UW has 1231 clubs, Eventully finds yours, with a three-step sample route explaining how clubs are scored"
            caption="Earlier: the first full rebuild, July 2026."
          />
          <ImageSlot
            need="current Eventully design"
            src={img('eventully-landing.webp')}
            alt="The current Eventully landing page: Find Your People, Run Your Club, with an AI search preview and a club match score"
            caption="Now: the design live at eventully.org."
          />
        </div>
        <div className="prose">
          <p>
            A deployed product covering the full body of campus organisations, used by real students, with search
            behaviour driven by testing rather than assumption.
          </p>
          <p>
            <Ph>usage numbers, e.g. students signed up, searches run, clubs joined</Ph>
          </p>
        </div>
      </Block>

      <Reflection>
        The AI-only version was the more impressive demo and the worse product. The
        right call was recognising two user segments and refusing to sacrifice either one.
      </Reflection>

      <NextCase slug="eventully" />
    </article>
  );
}
