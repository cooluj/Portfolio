# Ujjawal Agrawal's portfolio

Live at https://www.ujjawalportfolio.com (Vercel, deployed from this repo's default branch on every push).
Vite + React 18 + TypeScript + react-router 6, plain CSS on tokens. No new dependencies without asking.

## Rules that never change
- No em dashes anywhere (the build fails on U+2014). No "passionate", no "leverage". No emoji, sparkle icons, glassmorphism or purple-blue gradients. Sentence case.
- Never invent facts, numbers, quotes or dates about Ujjawal. Allowed facts come from the resume (`public/Ujjawal-Agrawal-Resume.pdf`), `src/data/*.ts` and `src/lab/copy.ts`. Anything unknown is left out or asked for.
- Typography is Schibsted Grotesk + IBM Plex Mono; one accent (`--ember`); dark by default.
- Everything keyboard operable with visible focus, reduced motion respected, no horizontal overflow at 390px, every listener and rAF cleaned up.
- Never touch any Superpowr repository. Everything lives here.

## Where things are
- Pages: `src/pages/{Home,Eventully,Superpowr,PainSights,Lab}.tsx`; shell: `src/components/{Layout,CaseShell}.tsx`.
- Data and copy: `src/data/home.ts` (featured, timeline, photos), `src/data/work.ts`, `src/data/spatial.ts`, `src/lab/copy.ts` (hero voices).
- Design lab: `src/lab/registry.ts` is the contract (dimensions, options, `DEFAULTS`). Each option is a CSS block in `src/styles/lab/<dimension>.css` or a component in `src/lab/heroes` / `src/lab/work` / `src/lab/features`. Selected options are written on `<html>` as `data-l-<dimension>`. `node scripts/lab-list.mjs` regenerates `LAB.md`. To change what visitors see, change `DEFAULTS`.
- Head and SEO: `index.html`, `src/components/useHead.ts`, `public/{robots.txt,sitemap.xml,og.png,favicon.svg}`.
- `docs/` is only a redirect from the old GitHub Pages address. `vercel.json` has the SPA rewrite and cache headers.

## Verify before pushing
`npm run build` (runs the copy check, tsc and vite). Then look at the real thing: `npx vite preview --port 4190` and Playwright from `/opt/node22/lib/node_modules/playwright` (contexts need `{ ignoreHTTPSErrors: true }` in the sandbox or web fonts will not load). Check every route at 1440 and 390 for errors and overflow, and the keyboard.

## Facts settled
- Email is `ujjawal-agrawal@outlook.com` everywhere (site and resume agree).

## Open questions only Ujjawal can answer
- One true sentence on what he coded at Superpowr.
- Whether the real old Superpowr testing flow exists as a capture.
