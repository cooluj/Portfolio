import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { useHead } from '../components/useHead';
import CountUp from '../components/CountUp';
import Figure from '../components/Figure';
import DiscoveryScatter from '../visuals/DiscoveryScatter';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const STATS: { n: number; label: string }[] = [
  { n: 1231, label: 'registered organizations' },
  { n: 18, label: 'categories' },
  { n: 2, label: 'kinds of user, not one' },
  { n: 1, label: 'match score on every result' },
];

export default function Eventully() {
  useHead('Eventully · Ujjawal Agrawal', 'A live campus platform indexing 1,231 UW student organizations in 18 categories, with AI search, filters and a match score on every result. Founded June 2024, built with Flask and Tailwind.');
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
        <span className="stats-src mono-label">1,231 and 18 are from the UW organization directory Eventully indexes. The other two are design decisions.</span>
      </div>

      <div style={{ marginTop: '3rem' }} className="rv">
        <Figure
          src={img('eventully-landing.webp')}
          alt="Eventully landing page: the headline Find Your People, Run Your Club, beside a preview of an AI search result and a club with a match score"
          caption="The Eventully landing page."
        />
      </div>

      <Block n="01" title="The problem">
        <div className="prose">
          <p>
            The University of Washington has <strong>1,231 registered student organizations</strong>, and
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
          <figure className="cs-fig">
            <div className="v1-mock" role="img" aria-label="A single empty search box reading Ask for a club, and nothing else on the page">
              <div className="v1-mock-input">Ask for a club...</div>
            </div>
            <figcaption>Version one: one box, nothing to react to. Mock of the first prototype, which was never deployed.</figcaption>
          </figure>
        </div>
      </Block>

      <Block n="03" title="Two users, not one">
        <div className="prose">
          <p>
            So I ran an A/B test: the AI-only search against a version with filters plus AI. It showed I had two
            different users, not one. People who arrive knowing what they want, and people who only know the
            feeling they're after. No figures from the test are published here.
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
          <Figure
            src={img('eventully-directory.webp')}
            alt="Eventully club directory listing 1,231 clubs, with category, status and sort filters above the results"
            caption="The filter path: every club, narrowed by category, status and sort."
          />
        </div>
      </Block>

      <Block n="04" title="The outcome">
        <div className="cs-figs two" style={{ marginTop: 0, marginBottom: '2.5rem' }}>
          <Figure
            src={img('eventully-earlier.webp')}
            alt="An earlier Eventully landing page in cream and gold: UW has 1231 clubs, Eventully finds yours, with a three-step sample route explaining how clubs are scored"
            caption="Earlier: the first full rebuild, July 2026."
          />
          <Figure
            src={img('eventully-landing.webp')}
            alt="The current Eventully landing page: Find Your People, Run Your Club, with an AI search preview and a club match score"
            caption="Now: the design live at eventully.org."
          />
        </div>
        <div className="prose">
          <p>
            A deployed product covering every campus organization, with search behavior shaped by testing rather
            than assumption. I only publish numbers I can back up, so there are no usage figures here. What I
            stand behind is the product itself: live at eventully.org, indexing all 1,231 organizations end to end.
          </p>
        </div>
      </Block>

      <Reflection>
        The AI-only version was the more impressive demo and the worse product. The
        right call was recognizing two user segments and refusing to sacrifice either one.
      </Reflection>

      <NextCase slug="eventully" />
    </article>
  );
}
