# What I still need to supply

Everything below shows on the site as a bright yellow `[PLACEHOLDER: ...]`. Nothing here was invented.

## How to swap one in
Drop the file in `public/images/`, then set `src="/images/<file>"` on the matching `ImageSlot`
(or on the `before` / `after` side of a `BeforeAfter`). The alt text is already written.
For text placeholders, replace the `<Ph>...</Ph>` with the real text.

## Images (8)
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

Before/after pairs should be the same size and crop so the slider lines up.

## Numbers and facts (2)
- Eventully: usage numbers (sign-ups, searches, clubs joined), if you have them
- Superpowr: any before/after metric (flow completion, sign-up rate)

## Already filled in
- PainSights role, from the resume (designed the clinical dashboard, built the hi-fi prototype, presented at FigBuild)
- Toolkit logos, from the simple-icons package
- Resume PDF, dates, journey and toolkit, from your resume
- Earlier Eventully design (July 2026 rebuild, from the Eventully-Project git history)
- PainSights scan result, patient queue, EEG prop and team photo, from the Figma prototype and FigBuild deck
- Superpowr research plan (deliverable 01 from the Superpowr Figma file)
- ArtisanCrafts prototype link
- Portrait and six hero photos
- PainSights team, tools, workflow and patient groups, from the Devpost page
- Eventully landing page and club directory, screenshotted from a local run of `cooluj/Eventully-Project`

## Checked and ruled out
- The Superpowr Figma file (Product Deliverables) holds nine research boards: 01 Research Plan through 09 Sketch Test. The only product UI in it is 08 Dashboard (an employer dashboard with illustrative values), and Figma refuses to render that board. No landing page, testing flow, brand system or light/dark screens are in that file.
- The Eventully-Project repo history has no AI-only search version; the match score exists from the first commit.

## Please double-check
- Email: the site uses ujjawal.agrawal@outlook.com (from your brief), but your resume says ujjawal-agrawal@outlook.com. One of them is wrong.
- The resume PDF on the site includes your phone number.
- The PainSights body map and caseload on the page use illustrative readings, and they are labelled as illustrative
