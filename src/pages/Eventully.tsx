import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { useHead } from '../components/useHead';
import CountUp from '../components/CountUp';
import Figure from '../components/Figure';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const STATS: { n: number; label: string }[] = [
  { n: 1231, label: 'registered organizations' },
  { n: 18, label: 'categories indexed' },
  { n: 2, label: 'discovery paths' },
  { n: 2, label: 'sides of the platform' },
];

export default function Eventully() {
  useHead('Eventully · Ujjawal Agrawal', 'A live campus platform indexing 1,231 UW student organizations in 18 categories. Designed for student discovery and club operations, with AI search and filters.');
  return (
    <article className="cs gutter">
      <CaseHeader
        slug="eventully"
        lede="Supply was never the problem at UW. Discovery was."
        meta={[
          { k: 'Role', v: 'Founder, product designer and developer. Designed and built end to end.' },
          { k: 'Status', v: <>Live at <a href="https://eventully.org" target="_blank" rel="noopener noreferrer">eventully.org</a></> },
          { k: 'Timeline', v: 'June 2024 to now' },
          { k: 'Built with', v: 'Flask and Tailwind CSS' },
        ]}
      />

      <div className="rv" style={{ marginTop: '3rem' }}>
        <Figure
          src={img('eventully-landing.webp')}
          w={1440}
          h={900}
          eager
          alt="Eventully landing page: the headline Find Your People, Run Your Club, beside a preview of an AI search result and a club with a match score"
          caption="The landing page, live at eventully.org."
        />
      </div>

      <div className="stats rv">
        <ul className="stats-grid" aria-label="Eventully by the numbers">
          {STATS.map((s) => (
            <li className="stat" key={s.label}>
              <span className="stat-tick" aria-hidden="true" />
              <span className="stat-n"><CountUp value={s.n} duration={1200} /></span>
              <span className="stat-l mono-label">{s.label}</span>
            </li>
          ))}
        </ul>
        <span className="stats-src mono-label">1,231 organizations and 18 categories come from the UW directory. The remaining figures describe the product's two discovery modes and two audiences.</span>
      </div>

      <Block n="01" title="The problem">
        <div className="prose">
          <p>
            I came to the University of Washington as a freshman and struggled to find a sense of community.
            What fixed that was a club. <strong>Once I found one that fit, I had my people.</strong> Getting there
            was the broken part.
          </p>
          <p>
            UW has <strong>1,231 registered student organizations</strong>, and students still said there was
            nothing to do. Supply was never the issue. Discovery was. Clubs lived across scattered pages, dead links
            and social accounts, so finding the one that fit took more effort than most people would spend.
          </p>
          <p>
            The problem extended beyond discovery. Club officers also needed a better way to represent their
            organizations and keep students informed. Eventully had to work for both sides: the student looking
            for a community and the officer trying to build one.
          </p>
        </div>
      </Block>

      <Block n="02" title="Research before the interface">
        <div className="prose">
          <p>
            I used a combination of research methods to understand the experience from both sides of the campus
            community. I looked at how students approached finding organizations and what made discovery difficult,
            while also considering the needs of officers responsible for maintaining and promoting their clubs.
          </p>
          <p>
            One important distinction emerged: <strong>not every student starts the search in the same place.</strong>
            Some arrive with a clear idea of the activity, identity or interest they want to pursue. Others know
            they want to meet people or try something new, but cannot translate that feeling into a precise search.
          </p>
          <p>
            That difference changed the product question. Instead of asking how to make one search box smarter,
            I needed to support both intentional and exploratory discovery without making either group work harder.
          </p>
        </div>
      </Block>

      <Block n="03" title="Test the discovery model">
        <div className="prose">
          <p>
            My first direction leaned entirely on AI: describe what you want and let the system find a club.
            It looked simple, but it assumed students already knew how to describe what they were looking for.
            <strong> A blank prompt created work before the product could help.</strong>
          </p>
        </div>
        <div className="cs-figs">
          <figure className="cs-fig">
            <div className="v1-mock" role="img" aria-label="A single empty search box reading Ask for a club, and nothing else on the page">
              <div className="v1-mock-bar"><i /><i /><i />Eventully, version one</div>
              <div className="v1-mock-body">
                <div className="v1-mock-input">Ask for a club...</div>
                <span className="v1-mock-hint">No categories. No examples. No list.</span>
              </div>
            </div>
            <figcaption>Version one, shown as a mock. This direction was explored, not deployed.</figcaption>
          </figure>
        </div>
        <div className="prose">
          <p>
            I put two approaches in front of users: AI-only search and a combined experience with filters alongside
            AI search. Testing both approaches helped expose the difference between students who wanted to narrow
            a known interest and students who needed help exploring possibilities.
          </p>
          <p>
            This was comparative user testing, not a claim of a statistically controlled A/B experiment. The
            important outcome was qualitative: a single interaction model did not serve both discovery behaviors
            equally well.
          </p>
        </div>
      </Block>

      <Block n="04" title="Two paths into one directory">
        <div className="prose">
          <p>
            I kept both approaches rather than forcing a winner. Students who know what they want can narrow the
            directory with filters. Students who are still exploring can describe an interest in their own words
            and use AI search to discover relevant organizations.
          </p>
          <p>
            Both paths lead to the same directory and use a <strong>match score on each recommendation</strong>
            to make relevance easier to understand. The goal was not to make AI the whole experience; it was to
            give students a useful starting point, then let them judge the results.
          </p>
        </div>

        <div className="paths" role="group" aria-label="Two discovery paths into the Eventully directory">
          <ol className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Knows what they want</span>
              <p className="mt-2 text-lg leading-snug">Choose filters</p>
            </li>
            <li aria-hidden="true" className="hidden md:block font-mono text-faint">&rarr;</li>
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Gets to</span>
              <p className="mt-2 text-lg leading-snug">Relevant organizations</p>
            </li>
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Still exploring</span>
              <p className="mt-2 text-lg leading-snug">Describe an interest</p>
            </li>
            <li aria-hidden="true" className="hidden md:block font-mono text-faint">&rarr;</li>
            <li className="border border-line rounded-md p-4">
              <span className="mono-label">Gets to</span>
              <p className="mt-2 text-lg leading-snug">Relevant organizations</p>
            </li>
          </ol>
          <div className="mt-4 rounded-md p-4" style={{ border: '1px solid var(--ember)' }}>
            <span className="mono-label" style={{ color: 'var(--fg)' }}>Shared destination</span>
            <p className="mt-2 text-lg leading-snug">
              One campus directory, with a match score to help explain each recommendation.
            </p>
          </div>
        </div>

        <div className="cs-figs">
          <Figure
            src={img('eventully-directory.webp')}
            w={1440}
            h={900}
            alt="Eventully club directory listing 1,231 clubs, with category, status and sort filters above the results"
            caption="The directory and filter experience: organizations narrowed by category, status and sort."
          />
        </div>
      </Block>

      <Block n="05" title="Design for both sides of campus">
        <div className="prose">
          <p>
            Eventully is not only a student-facing discovery tool. It also includes an officer-facing experience,
            because a directory is only useful when the organizations behind it can maintain a presence and reach
            the people they want to bring in.
          </p>
          <p>
            That made the product a two-sided platform: students need a clear way to find and evaluate communities;
            officers need tools that help their organizations stay visible and communicate opportunities. I
            designed for both journeys rather than treating club information as a static list.
          </p>
          <p>
            The same product decision shaped the overall experience: make it easier for students to find a fit,
            while giving clubs a practical way to show what they offer.
          </p>
        </div>
      </Block>

      <Block n="06" title="What shipped">
        <div className="cs-figs two" style={{ marginTop: 0, marginBottom: '2.5rem' }}>
          <Figure
            src={img('eventully-earlier.webp')}
            w={1440}
            h={900}
            alt="An earlier Eventully landing page in cream and gold: UW has 1231 clubs, Eventully finds yours, with a three-step sample route explaining how clubs are scored"
            caption="Earlier: the first full rebuild, July 2026."
          />
          <Figure
            src={img('eventully-landing.webp')}
            w={1440}
            h={900}
            alt="The current Eventully landing page: Find Your People, Run Your Club, with an AI search preview and a club match score"
            caption="Now: live at eventully.org."
          />
        </div>
        <div className="prose">
          <p>
            The result is a live campus platform indexing all <strong>1,231 UW student organizations</strong>
            across 18 categories, with two discovery paths and experiences for students and club officers.
            The search direction was shaped by comparing approaches with users instead of assuming that a more
            sophisticated prompt would automatically make discovery easier.
          </p>
          <p>
            I do not publish usage or conversion figures that I cannot substantiate. The evidence I can show here
            is the product scope, the shipped interface and the design decisions that connect the research to it.
          </p>
        </div>
      </Block>

      <Reflection>
        The AI-only version was the more impressive demo and the worse product. Testing both approaches made the
        real problem clearer: discovery starts from different levels of certainty. The better product gives people
        more than one way in, then brings them to the same useful directory.
      </Reflection>

      <NextCase slug="eventully" />
    </article>
  );
}
