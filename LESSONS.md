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

---

## Added after Tier 1 execution (2026-07-03)

- **Stale git lock files blocked every git operation.** `.git/index.lock`, `.git/HEAD.lock` and `.git/objects/maintenance.lock` were sitting there since May 11 (zero bytes, no git process running). If git fails with "Unable to create ... .lock", check `find .git -name "*.lock"` — this repo had three.
- **`next@16.2.10` does NOT clear the postcss moderate advisory.** The audit assumed it would. GHSA-qx2v-qp2m-jg93 postcss is vendored *inside* next, and the advisory range covers every next release through 16.3.0-canary.5. Final state: 0 high/critical, 2 moderate (both that vendored chain). npm's only offered "fix" is `--force` → next@9.3.3. Never take it.
- **The images are now local placeholder SVGs** (`public/work/<slug>.svg`, palette-correct plates with number/client/title). The site is no longer visibly broken, but these are stand-ins — the real-image work is HUMAN-ACTIONS.md item 1, and T2.1 (drop `unoptimized`) stays blocked until real rasters land. Note: SVG `og:image` won't render in social scrapers, so `/work/*` link previews stay imageless until then.
- **cursor.tsx fix pattern:** the `set-state-in-effect` error is properly solved with `useSyncExternalStore` subscribed to the `(hover: none)` media query (server snapshot = touch, so SSR renders no cursor). Don't reintroduce a `useState`+`useEffect` capability check.
- **Mobile menu ↔ lenis:** on touch devices lenis rides native scroll, so `document.documentElement.style.overflow = "hidden"` is a sufficient scroll lock for the overlay. The overlay carries `data-lenis-prevent` and auto-closes if the viewport crosses the md breakpoint (otherwise the lock could linger with the menu display:none).
- **Verified-in-browser beats verified-by-build:** the mobile menu was tested at 375×812 in a real browser (open, navigate, scroll lock/unlock, Escape, desktop regression at 1280px). The Claude Preview `launch.json` for this lives at the *session root* (`~/Projects/.claude/launch.json`, config name `khalwani-portfolio-dev`, port 4331) — preview_start reads that one, not the repo's own `.claude/launch.json`.

## CORRECTION (2026-07-03): the images were never dead — read error bodies

The section above ("the images are dead, and git can't save you") is **wrong**. The CDN 400 body says `{"errors":{"h":"hash is required"}}` — Adobe added mandatory hash-signed URLs; the assets are all still there. The portfolio itself is still live at **`https://khalwani.myportfolio.com`** and its HTML contains signed URLs (`?h=...`) for every image, in sizes up to the original upload width. All 23 were recovered from there, optimized (≤1600w JPEG), and committed to `public/work/`. Lessons:
- **Read the error response body, not just the status code.** "400 on every URL" read as "CDN is gone"; the body said "signature missing" — a completely different, recoverable failure.
- **Check whether the upstream site is still live before declaring assets unrecoverable.** Five minutes of subdomain guessing (`khalwani.myportfolio.com`) found the whole portfolio.
- The `_carw_202x158x{N}` suffix is crop-aspect naming, N = render width — `..._carw_202x158x1920.png` is a 1920-wide image, not a 202px thumbnail. The audit misread these as thumbnails.
- Animated-GIF land mines: `ca-drive` and `paid-social` are 7–24MB GIFs in every size Adobe serves — they ship as extracted still frames. If motion matters, get MP4s from Khaled (HUMAN-ACTIONS.md item 1).
