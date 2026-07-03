# LESSONS — khalwani-portfolio

Things future sessions should know before touching this repo. Discovered during the 2026-07-02 audit (see AUDIT.md).

## The big one: the images are dead, and git can't save you
Every project image is a hotlink to `cdn.myportfolio.com` (Adobe Portfolio, account `65284a12-f311-4d98-a206-a0fcf391081f`). As of 2026-07-02 that CDN returns **HTTP 400 for every URL** — the deployed site renders with zero images and no error was ever raised (the `<Image>` tags just show empty boxes). The originals are NOT in this repo. Recovery requires Khaled: original Adobe Portfolio account, the archived Windows PC (untouched until ~May 2026 per his global notes), or `~/Downloads/slim-migration/`. Do not attempt to re-fetch from the CDN; it's gone. Also: the old URLs were mostly 202×158px thumbnails (`_carw_202x158x32` suffix) — even when they worked, they were being upscaled to full-bleed heroes. Get real-resolution sources.

## CLAUDE.md lies about the palette
CLAUDE.md says Snap yellow `#FFD600` / cream `#f4efe5` / ink `#1c1b19`. The actual site (app/globals.css `@theme`) is **ember orange `#e8511d` / bone `#f3efe6` / ink `#0f0e0c`**, tokens named `--color-ember`, `--color-bone`, `--color-ink`. Trust globals.css, not CLAUDE.md, until T3.1 fixes the doc. The `khaled-art-direction` skill pairing advice in CLAUDE.md may carry the same wrong palette — verify before generating assets.

## Build passes ≠ healthy
`npm run build` is green (28 static pages) while the production site is imageless, lint has 11 errors, and metadataBase points at a domain (`khalwani.com`) that doesn't resolve. There is no CI, no tests, no gate of any kind. Don't infer health from a green build here.

## Everything renders `unoptimized`
All four `<Image>` call sites pass `unoptimized`, so the `remotePatterns` config in next.config.ts is dead code and Next's image optimizer is fully bypassed. This was presumably to dodge optimizing cross-origin CDN images. When images go local (T1.1/T2.1), remove `unoptimized` — but not before, or builds may fail on unreachable remotes.

## Data model quirks
- `data/projects.ts` is the single content source (23 projects). `id` doubles as the URL slug — renaming one breaks published links (CLAUDE.md failure mode #4: add redirects).
- `featured` is set on 4 projects but **nothing reads it** — the landing "index" deliberately(?) lists all 23. Don't assume the landing shows a curated subset.
- `context`/`approach`/`outcome` fields exist in the type but are never populated or rendered; every case page shows the same generic "request the deck" CTA instead. There is no per-project body content anywhere.
- `getAdjacentProjects` wraps around (last→first) on purpose.

## Interaction layer gotchas
- The whole app hides the native cursor via `cursor-none` on `<body>` + `!important` rules in globals.css (media-query fallback only below 768px). The custom cursor (components/cursor.tsx) is a client component listening to window mousemove with React state — it also has the one non-trivial lint error (`set-state-in-effect`).
- Lenis smooth scroll wraps everything in layout.tsx. Nav anchor links (`/#about`) rely on native hash jumps, not lenis scrollTo. Test scroll behavior on real mobile Safari after touching smooth-scroll (CLAUDE.md failure mode #1).
- Nav links are `hidden md:flex` — **mobile has no navigation**. Known, tracked as T1.5.

## Environment facts
- Live at https://khalwani-portfolio.vercel.app (Vercel project `khalwani-portfolio`, auto-deploy on push to main). `khalwani.com` is not configured anywhere despite being metadataBase.
- Remote: github.com/digital-spit/khalwani-portfolio. Only 3 commits; `.planning/` (gsd-map-codebase output, 2026-06-01, accurate) is untracked.
- Next.js 16 with async `params` (`Promise<{slug}>`) — the slug page already handles this correctly; follow that pattern. AGENTS.md warns to read `node_modules/next/dist/docs/` before assuming Next APIs.
- `npm run lint` is bare `eslint` (ESLint 9 flat config) — it does lint the whole repo and currently exits nonzero.
- No secrets in this repo at all; nothing to rotate.
