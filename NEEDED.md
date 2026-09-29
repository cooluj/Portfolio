# What I still need to supply

Everything below shows on the site as a bright yellow `[PLACEHOLDER: ...]`. Nothing here was invented.

## How to swap one in
Drop the file in `public/images/`, then set `src="/images/<file>"` on the matching `ImageSlot`
(or on the `before` / `after` side of a `BeforeAfter`). The alt text is already written.
For text placeholders, replace the `<Ph>...</Ph>` with the real text.

## Images (12)
| Where | What | File |
|---|---|---|
| Eventully | AI-only search version | `src/pages/Eventully.tsx` |
| Eventully | Recommendations screen with the match score visible | `src/pages/Eventully.tsx` |
| Eventully | A/B test notes or results | `src/pages/Eventully.tsx` |
| Superpowr | Old testing flow | `src/pages/Superpowr.tsx` |
| Superpowr | New testing flow | `src/pages/Superpowr.tsx` |
| Superpowr | Old landing page | `src/pages/Superpowr.tsx` |
| Superpowr | New landing page | `src/pages/Superpowr.tsx` |
| Superpowr | Brand system | `src/pages/Superpowr.tsx` |
| Superpowr | Light mode screen + dark mode screen (2) | `src/pages/Superpowr.tsx` |
| PainSights | Pain visualisation screen (body map) | `src/pages/PainSights.tsx` |
| PainSights | Patient queue dashboard | `src/pages/PainSights.tsx` |
| PainSights | Photo of the 3D-printed EEG prop | `src/pages/PainSights.tsx` |
| PainSights | Team photo at FigBuild | `src/pages/PainSights.tsx` |

Before/after pairs should be the same size and crop so the slider lines up.

## Numbers and facts (3)
- Eventully: usage numbers (sign-ups, searches, clubs joined), if you have them
- Superpowr: any before/after metric (flow completion, sign-up rate)
- PainSights: what I owned on the team (Devpost lists the team but not who did what)

## Links (1)
- Resume PDF (put it at `public/resume.pdf` and replace the placeholder in the About section)

## Already filled in
- Portrait and six hero photos
- PainSights team, tools, workflow and patient groups, from the Devpost page
- Eventully landing page and club directory, screenshotted from a local run of `cooluj/Eventully-Project`

## Please double-check
- Superpowr dates: shown as "Full time, summer 2025" (the year comes from the old Journey timeline)
- Eventully year: shown as "2026"
- The body map and caseload on the PainSights page use illustrative readings, and they are labelled as illustrative
