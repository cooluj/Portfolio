import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { useHead } from '../components/useHead';
import CountUp from '../components/CountUp';
import Figure from '../components/Figure';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;

const STATS: { n: number; label: string }[] = [
  { n: 1231, label: 'registered organizations' },
  { n: 18, label: 'categories indexed' },
  { n: 2, label: 'primary user groups' },
  { n: 0, label: ' ' },
];

export default function Eventully() {
  useHead('Eventully · Ujjawal Agrawal', 'A campus platform for discovering and engaging with 1,231 UW student organizations across 18 categories, with personalized matching, events, and officer tools.');
  return (
    <article className="cs gutter">
      <CaseHeader
        slug="eventully"
        lede="Supply was never the problem at UW. Discovery was."
        meta={[
          { k: 'Role', v: 'Founder, product designer and developer. Designed and built end to end.' },
          { k: 'Status', v: 'Previously deployed; currently offline' },
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
          alt="Eventully landing page: Find Your People, Run Your Club, with a preview of a club recommendation and match score"
          caption="An archived capture of the production product."
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
        <span className="stats-src mono-label">The directory contained 1,231 UW organizations across 18 categories. Audience count is a product-scope descriptor, not an adoption metric.</span>
      </div>

      <Block n="01" title="The problem">
        <div className="prose">
          <p>
            I started Eventully to address a problem I experienced at UW: finding a community takes more work than simply knowing clubs exist. The earliest class prototype focused on coordinating meetings and participation. Research and workflow mapping with students and club officers helped me see that scheduling was only one part of a larger journey.
          </p>
          <p>
            UW has <strong>1,231 registered student organizations</strong>. The challenge was not a lack of options; it was helping students understand which organizations fit their interests, major, and available time, then giving them a clear path from discovery to participation.
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
            I used a combination of interviews, workflow mapping, prototyping, and user feedback to understand both sides of the campus community. Early research with students and club officers focused on how students discover and participate in organizations, and how officers coordinate meetings, communicate opportunities, and maintain club information.
          </p>
          <p>
            The early project began with scheduling and participation. As I explored the broader journey, I saw that a student must first find an organization that fits before they can attend its events. That reframed the product from a scheduling utility into a platform spanning discovery, engagement, and club operations.
          </p>
          <p>
            This changed the product question: how might one experience help students move from an initial interest to a relevant organization, then make it easier to participate?
          </p>
        </div>
      </Block>

      <Block n="03" title="Test the discovery model">
        <div className="prose">
          <p>
            During exploration, I compared an AI-first prompt with a more structured discovery approach. The prompt assumed students could already articulate what they wanted. In testing, that assumption created friction for people who were still figuring out what options existed.
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
            <figcaption>Retrospective illustration of an explored concept; this was not part of the production interface.</figcaption>
          </figure>
        </div>
        <div className="prose">
          <p>
            I tested both approaches with users. The feedback helped me understand the limits of asking students to generate a natural-language prompt before they had a clear idea of the available organizations. I treated this as comparative user testing, not a statistically controlled A/B experiment.
          </p>
          <p>
            The takeaway was not that AI was inherently wrong; it was that discovery needed a lower-friction starting point and clearer structure.
          </p>
        </div>
      </Block>

      <Block n="04" title="From discovery to explainable recommendations">
        <div className="prose">
          <p>
            The production experience moved toward structured onboarding and interpretable recommendations. Students select interests, choose a major, and indicate their desired time commitment. They can also browse the directory through keyword search and category filters.
          </p>
          <p>
            The matching system ranks clubs against those preferences and provides human-readable reasons for recommendations. The goal was to reduce the effort of evaluating a large directory without presenting the score as an unquestionable answer.
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
              <p className="mt-2 text-lg leading-snug">Choose interests and preferences</p>
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
              One campus directory, with keyword search, category filters, and interpretable preference-based recommendations.
            </p>
          </div>
        </div>

        <div className="cs-figs">
          <Figure
            src={img('eventully-directory.webp')}
            w={1440}
            h={900}
            alt="Eventully club directory listing 1,231 clubs, with category, status and sort filters above the results"
            caption="The searchable directory, with category, status, and sort controls."
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
            caption="Production build: previously deployed at eventully.org."
          />
        </div>
        <div className="prose">
          <p>
            The production build brought together <strong>1,231 UW student organizations across 18 categories</strong>, preference-based recommendations, keyword search, category filters, memberships, saved clubs, events, RSVPs, messaging, and officer tools. The product was previously deployed at eventully.org; that hosted instance is currently offline.
          </p>
          <p>
            I do not publish usage or conversion figures that I cannot substantiate. The evidence I can show here
            is the product scope, the shipped interface and the design decisions that connect the research to it.
          </p>
        </div>
      </Block>

      <Reflection>
        The early prototype taught me that a compelling interaction is not necessarily the most useful one. Comparing an AI-first prompt with structured discovery helped me prioritize a more understandable path: collect a small amount of preference context, explain why organizations are recommended, and preserve direct browsing for people who already know what they want.
      </Reflection>

      <NextCase slug="eventully" />
    </article>
  );
}
