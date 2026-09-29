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
Missing assets are listed in [NEEDED.md](NEEDED.md).
