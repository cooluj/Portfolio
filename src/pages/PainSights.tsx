import { Block, CaseHeader, NextCase, Reflection } from '../components/CaseShell';
import { ImageSlot, Ph } from '../components/Placeholder';
import BodyMap, { Caseload } from '../visuals/BodyMap';

export default function PainSights() {
  return (
    <article className="cs gutter">
      <CaseHeader
        slug="painsights"
        lede="A doctor isn't diagnosing pain. They're diagnosing a description of it. And some patients can't give one."
        meta={[
          { k: 'Context', v: 'FigBuild 2026, Figma’s student design-a-thon' },
          { k: 'Brief', v: 'Speculative design rooted in human need, built around senses beyond the visible ones' },
          { k: 'My role', v: <Ph>my role and the team</Ph> },
        ]}
      />

      <div className="rv">
        <BodyMap />
      </div>

      <Block n="01" title="The prompt, reframed">
        <div className="prose">
          <p>
            We took <strong>the sense nobody can see</strong>. Pain has no external signal. It's the one thing in
            medicine that's entirely self-reported, which means a doctor isn't diagnosing pain, they're diagnosing a
            description of pain.
          </p>
          <p>
            That breaks completely when the patient can't communicate. No words, no number out of ten, nothing for
            the doctor to go on.
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
        </div>
      </Block>

      <Block n="03" title="The design">
        <div className="prose">
          <p>
            PainSights renders that data on a 3D body model, so a doctor can see exactly where a patient hurts and
            how much, instead of parsing "sharp", "dull" or a number out of ten.
          </p>
          <p>
            Across a caseload, it surfaces every patient's pain points at once and turns that into prioritisation:
            <strong> who is suffering most, right now</strong>.
          </p>
        </div>
        <Caseload />
        <div className="cs-figs two">
          <ImageSlot
            need="3D body model screen"
            alt="PainSights 3D body model with pain regions highlighted by intensity"
            caption="The body model a clinician reads."
          />
          <ImageSlot
            need="patient prioritisation dashboard"
            alt="PainSights dashboard listing patients ordered by current pain level"
            caption="The caseload, sorted by who needs attention first."
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

      <Block n="05" title="Team and result">
        <div className="prose">
          <p><Ph>team members and what I owned</Ph></p>
          <p><Ph>FigBuild result, if any</Ph></p>
        </div>
        <div className="cs-figs">
          <ImageSlot need="team photo or my-role breakdown" alt="The PainSights team at FigBuild 2026" ratio="16 / 7" />
        </div>
      </Block>

      <Reflection>
        Speculative tech is easy to make magical for the person wearing it. The unmet need was on the{' '}
        <span className="em">other side of the room</span>.
      </Reflection>

      <NextCase slug="painsights" />
    </article>
  );
}
