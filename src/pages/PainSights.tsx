import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { ImageSlot, Ph } from '../components/Placeholder';
import BodyMap, { Caseload } from '../visuals/BodyMap';

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`;
const DEVPOST = 'https://devpost.com/software/painsights';
const PROTOTYPE = 'https://www.figma.com/proto/3qsWtlluXq8KKnCkaAjHPk/PainSights?node-id=0-1';

/** The prototype's clinical workflow, in the order a doctor moves through it. */
const WORKFLOW = [
  { name: 'Patient queue', does: 'Every patient, prioritised by urgency and whether they need a scan.' },
  { name: 'Patient profile', does: 'Vitals, medical history, and whether the patient can communicate.' },
  { name: 'Neural pain scan', does: 'Reads the brain activity associated with pain perception.' },
  { name: 'Pain visualisation', does: 'Maps the signal onto the body, colour-coded by severity.' },
  { name: 'Clinical report', does: 'An AI summary of pain severity, risks and possible actions.' },
];

export default function PainSights() {
  return (
    <article className="cs gutter">
      <CaseHeader
        slug="painsights"
        lede="A doctor isn't diagnosing pain. They're diagnosing a description of it. And some patients can't give one."
        meta={[
          { k: 'Context', v: <>FigBuild 2026, Figma’s student design-a-thon. <a href={DEVPOST} target="_blank" rel="noopener noreferrer">Devpost</a> · <a href={PROTOTYPE} target="_blank" rel="noopener noreferrer">Prototype</a></> },
          { k: 'Team', v: 'Ian Simmons, Aryan Taywade, Ujjawal Agrawal' },
          { k: 'My role', v: <Ph>what I owned on the team</Ph> },
        ]}
      />

      <div className="rv">
        <BodyMap />
      </div>

      <Block n="01" title="The prompt, reframed">
        <div className="prose">
          <p>
            FigBuild asked for speculative design rooted in human need, built around senses beyond the visible ones.
            We took <strong>the sense nobody can see</strong>. Pain has no external signal. It's the one thing in
            medicine that's entirely self-reported, which means a doctor isn't diagnosing pain, they're diagnosing a
            description of pain.
          </p>
          <p>
            That breaks completely when the patient can't communicate: unconscious trauma patients, sedated ICU
            patients, young children, and patients facing language barriers or neurological impairments. Doctors
            fall back on indirect signals like heart rate, blood pressure or delayed imaging, which makes hidden
            injuries hard to catch and care hard to prioritise when time matters.
          </p>
          <p>
            <strong>How might we help doctors detect and understand pain in patients who cannot communicate it?</strong>
          </p>
        </div>
      </Block>

      <Block n="02" title="The speculative leap">
        <div className="prose">
          <p>
            We assumed a near-future EEG capable of reading pain directly from the patient. That one assumption
            changes the problem: <strong>pain stops being a story a patient tells and becomes data a clinician can
            see</strong>, whether or not the patient can tell it.
          </p>
          <p>
            To make that tangible in the demo, we 3D printed a mock EEG-style headset: what the patient would wear.
          </p>
        </div>
        <div className="cs-figs">
          <ImageSlot
            need="photo of the 3D-printed EEG prop"
            src={img('painsights-eeg.webp')}
            alt="The 3D-printed mock EEG headset the team built for the PainSights demo"
            caption="The mock neural interface, modelled in Onshape and Blender, then 3D printed."
          />
        </div>
      </Block>

      <Block n="03" title="The design">
        <div className="prose">
          <p>
            PainSights renders that signal on a body model, so a doctor can see exactly where a patient hurts and
            how much, instead of parsing "sharp", "dull" or a number out of ten. We explored several approaches
            before landing on colour-coded severity levels, because in triage the reading has to land at a glance.
          </p>
          <p>
            Across a caseload, it surfaces every patient's pain at once and turns that into prioritisation:
            <strong> who is suffering most, right now</strong>.
          </p>
        </div>
        <Caseload />

        <h3 className="mono-label" style={{ marginTop: '3rem' }}>The prototype, in workflow order</h3>
        <ol className="steps">
          {WORKFLOW.map((w, i) => (
            <li key={w.name}>
              <span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <span className="name">{w.name}</span>
              <span className="does">{w.does}</span>
            </li>
          ))}
        </ol>
        <p className="prose" style={{ marginTop: '1.5rem' }}>
          <span style={{ color: 'var(--muted-fg)', lineHeight: 1.75 }}>
            Built as an interactive prototype in Figma and Figma Make, simulating a real hospital workflow from
            intake to report. PainSights supports clinical judgement rather than replacing it.
          </span>
        </p>
        <a className="ctl" href={PROTOTYPE} target="_blank" rel="noopener noreferrer" style={{ marginTop: '1.5rem' }}>
          Open the Figma prototype <span aria-hidden="true">↗</span>
        </a>

        <div className="cs-figs two">
          <ImageSlot
            need="pain visualisation screen (body map)"
            src={img('painsights-scan.webp')}
            alt="PainSights patient profile after a scan: a body model with pain glowing at the head, right shoulder and upper chest, and a list of detected pain points rated critical and moderate"
            caption="After a scan: detected pain points on the body, ranked by severity."
          />
          <ImageSlot
            need="patient queue dashboard"
            src={img('painsights-queue.webp')}
            alt="PainSights patient queue: patient cards tagged comatose, sedated, intubated and pediatric, each with detected pain or a scan-required warning, filterable by urgency"
            caption="The patient queue. Patients who can't communicate are flagged for a scan."
          />
        </div>
      </Block>

      <Block n="04" title="Who it's for">
        <div className="prose">
          <p>
            We designed for the clinician, not the patient. The patient wears the sensor; the doctor gets the
            interface. Speculative tech is easy to make magical for the person experiencing it, but the real unmet
            need was on the other side of the room, most of all when the patient can't say what hurts.
          </p>
        </div>
        <div className="who">
          <div>
            <h3>Patient</h3>
            <p>Wears the sensor. Doesn't need to describe anything, or be able to.</p>
          </div>
          <div className="arrow" aria-hidden="true">&rarr;</div>
          <div className="focus">
            <h3>Clinician · the user we designed for</h3>
            <p>Sees where it hurts, how much, and who to see first.</p>
          </div>
        </div>
      </Block>

      <Block n="05" title="Team and tools">
        <div className="prose">
          <p>
            Built at FigBuild 2026 by Ian Simmons, Aryan Taywade and me. Designed in Figma and Figma Make; the
            headset prop was modelled in Onshape and Blender. The full submission is on{' '}
            <a href={DEVPOST} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>Devpost</a>.
          </p>
          <p><Ph>what I owned on the team</Ph></p>
        </div>
        <div className="cs-figs">
          <div style={{ maxWidth: '22rem' }}>
            <ImageSlot
              need="team photo at FigBuild"
              src={img('painsights-team.webp')}
              alt="Ujjawal Agrawal, Aryan Taywade and Ian Simmons holding a Figma pennant in a photo-booth print at FigBuild 2026"
              caption="Team A.P.E at FigBuild 2026."
            />
          </div>
        </div>
      </Block>

      <Reflection>
        Speculative tech is easy to make magical for the person wearing it. The unmet need was on the{' '}
        other side of the room.
      </Reflection>

      <NextCase slug="painsights" />
    </article>
  );
}
