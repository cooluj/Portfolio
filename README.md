# Ujjawal Agrawal · Portfolio

React + Vite + TypeScript, plain CSS on design tokens. Home, three case studies, and a design lab.

```
npm install
npm run dev          # local
npm run build        # copy check (no em dashes, banned phrases), typecheck, build
npm run build:pages  # rebuild docs/ for GitHub Pages
node scripts/lab-list.mjs   # regenerate LAB.md from the lab registry
```

- `/` home: hero, selected work, about, tools, timeline, contact
- `/work/eventully`, `/work/superpowr`, `/work/painsights`
- `/lab` the design lab: every exploration of the site, numbered, switchable live

## The design lab

Every axis of the site is a dimension in `src/lab/registry.ts`: typography, colour, surface, hero, work layout,
page transition, scroll reveal, image treatment, cursor, structure, voice, case study layout, and stackable features.
The chosen option is written on `<html>` as `data-l-<dimension>="<id>"` (the default writes nothing), so each option
is a CSS block in `src/styles/lab/<dimension>.css` or a component in `src/lab/`. Selections persist in
localStorage and can be shared as `?lab=type:fraunces,theme:paper`. Press `L` on any page to open the panel.
The full numbered list is in [LAB.md](LAB.md).

To make an option the default, change `DEFAULTS` in `src/lab/registry.ts`.

Hosted free on GitHub Pages from the `docs/` folder, at https://cooluj.github.io/Portfolio/.
After changing anything, run `npm run build && npm run build:pages` and commit `docs/`.
`vercel.json` covers Vercel too.

## Provenance

What each figure on the site is. Captures are screenshots of the real thing; mocks are built in JSX and CSS and say so in their caption.

- Eventully landing page and club directory (`eventully-landing.webp`, `eventully-directory.webp`): captures from a local run of the Eventully codebase.
- Eventully earlier design (`eventully-earlier.webp`): capture of the July 2026 rebuild, from the project's git history.
- Eventully version one search box: mock, built in JSX and CSS on the case page. The first prototype was never deployed.
- Eventully "two paths" diagram and discovery scatter: in-page components, not captures.
- Superpowr landing page before (`superpowr-landing-before.webp`): capture from the Wayback Machine archive of superpowr.ai, April 2026.
- Superpowr landing page after and dark mode (`superpowr-landing-after.webp`, `superpowr-dark.webp`): captures of the live superpowr.ai.
- Superpowr research plan (`superpowr-research-plan.webp`): export of deliverable 01 from the Superpowr Figma file. Participant counts in it are placeholders.
- PainSights scan result and patient queue (`painsights-scan.webp`, `painsights-queue.webp`): captures from the Figma prototype.
- PainSights EEG prop and team photo (`painsights-eeg.webp`, `painsights-team.webp`): photos from FigBuild 2026.
- PainSights body map and caseload: in-page mocks with illustrative readings, labeled as such.
- Portrait and photos on the home page: photos of Ujjawal.
