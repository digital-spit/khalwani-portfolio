# AUDIT — khalwani-portfolio

**Date:** 2026-07-02 · **Auditor:** Claude Code (investigation only, no source changes)
**Verified by actually running:** `npm install` (364 pkgs, clean), `npm run build`, `npm run lint`, `npx tsc --noEmit`, `npm audit`, plus live HTTP checks against the deployed site and the image CDN.

---

## Executive Summary

The site builds clean and deploys, but **every one of the 23 project images is broken in production** — they hotlink `cdn.myportfolio.com` (Adobe Portfolio) which now returns HTTP 400 for all URLs. A portfolio with zero images is the single most urgent problem in this repo. Secondary: `metadataBase` points to `khalwani.com` which does not resolve; `next@16.2.4` carries a HIGH npm-audit advisory set (patch to 16.2.10 is trivial); lint fails with 11 errors and nothing gates it; and mobile users have no navigation at all (links are `hidden md:flex`). Code quality is otherwise decent for its size (~1,900 LOC, consistent conventions, strict TS passes) — the gaps are operational, not architectural.

---

## Verify Results (real output, 2026-07-02)

| Check | Result | Detail |
|---|---|---|
| `npm install` | PASS | 364 packages, 20s, no errors |
| `npm run build` | PASS | Next.js 16.2.4 (Turbopack), 28 static pages (/, /work, /_not-found, 23× /work/[slug] + 2 system), compiled 2.4s, TS 1.7s |
| `npx tsc --noEmit` | PASS | exit 0, strict mode |
| `npm run lint` | **FAIL — 11 errors, 0 warnings** | 9× `react/no-unescaped-entities`, 1× `react-hooks/set-state-in-effect` (cursor.tsx:22), 1 continuation |
| `npm test` | **N/A — no test script, no test files, no runner installed** | Confirmed by `.planning/codebase/TESTING.md` and re-verified |
| `npm audit` | **5 vulnerabilities: 1 high, 3 moderate, 1 low** | HIGH = `next` 16.2.4 (14 advisories incl. cache poisoning, middleware bypass, DoS, XSS). Fix: `next@16.2.10` (same-minor). Moderate: postcss (bundled in next), js-yaml, brace-expansion. Low: @babel/core |
| Live site | UP (200) | https://khalwani-portfolio.vercel.app |
| Image CDN | **BROKEN — HTTP 400** | All `cdn.myportfolio.com/65284a12-…/*` URLs return 400 (`server: adobe`, JSON error body). Verified with and without browser UA/referer. Live HTML still references these URLs → **all images on the deployed site are dead** |
| khalwani.com | **DOES NOT RESOLVE** (curl exit 000) | Yet it is the `metadataBase` in app/layout.tsx:32 |

---

## Findings Table

| # | Dimension | Finding | Files | Severity |
|---|---|---|---|---|
| F1 | Correctness / Assets | All 23 project images hotlink Adobe Portfolio CDN which returns HTTP 400 → site renders with zero imagery in production | `data/projects.ts:34` (CDN const) and every `image:` field; consumed in `components/case-hero.tsx:28`, `components/work-grid.tsx:29`, `components/work-index.tsx:73`, `app/work/[slug]/page.tsx:130` | **CRITICAL** |
| F2 | SEO / Correctness | `metadataBase: new URL("https://khalwani.com")` — domain does not resolve; all absolute OG/canonical URLs are dead. OG images also point at the dead CDN (`app/work/[slug]/page.tsx:30`) | `app/layout.tsx:32` | **HIGH** |
| F3 | Security | `next@16.2.4` has 14 HIGH advisories (GHSA-8h8q-6873-q5fj, GHSA-3g8h-86w9-wvmq, GHSA-ffhc-5mcf-pf4q, middleware bypass family, image-optimization DoS, etc.). Fully static site with no middleware/API routes so practical exposure is low, but the fix is a patch bump to 16.2.10 | `package.json:14` | **HIGH** |
| F4 | Consistency / CI | `npm run lint` fails with 11 errors; no CI, no pre-commit hook, nothing gates lint or build. 9 are `react/no-unescaped-entities` (`app/work/[slug]/page.tsx:161-162`, `components/about.tsx:42-51`, `components/contact.tsx:14`, `components/work-index.tsx:47,51`), 1 is `react-hooks/set-state-in-effect` (`components/cursor.tsx:22`) | multiple | **HIGH** |
| F5 | Error handling / UX | No mobile navigation: nav links are `hidden md:flex` with no hamburger/fallback. On phones the only nav is the brand mark → `/work`, `#about`, `#services`, `#contact` unreachable from the header. Contradicts CLAUDE.md's "Mobile-first" rule | `components/nav.tsx:29` (`hidden md:flex`), `:44` ("Available for work" also hidden) | **HIGH** |
| F6 | Performance | Every `<Image>` sets `unoptimized`, bypassing Next image optimization entirely — which makes `next.config.ts:4-11` (`remotePatterns`) dead config. Worse: most source images are 202×158px thumbnails (`_carw_202x158x32`) upscaled to full-bleed heroes (`fill` + `object-cover` at 100vw). LCP/CLS and visual quality both suffer (currently moot because images 400, but must be fixed together with F1) | `components/case-hero.tsx:34`, `components/work-grid.tsx:35`, `components/work-index.tsx:78`, `app/work/[slug]/page.tsx:136`; `next.config.ts:4-11` | **HIGH** (bundled with F1) |
| F7 | SEO | No `sitemap.ts`, no `robots.ts`, no root OG image, no Twitter card, no canonical strategy. CLAUDE.md:104 lists this as an unresolved TBD | `app/` (files absent) | MEDIUM |
| F8 | Dead/dummy code | Template leftovers: stock create-next-app `README.md` (still says "Geist font", generic boilerplate); unused template SVGs `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` (zero references in source) | `README.md`, `public/*.svg` | MEDIUM |
| F9 | Dead/dummy code | Unused data-model fields: `featured?` is set on 4 projects but never read anywhere (landing `work-index.tsx` renders ALL 23, not featured); `href?`, `context?`, `approach?`, `outcome?` declared but never populated nor rendered. The case-study body is a generic "request the deck" CTA for all 23 projects | `data/projects.ts:9-19` (type), `:56,72,88,104` (featured flags); `app/work/[slug]/page.tsx:147-177` (generic CTA) | MEDIUM |
| F10 | Docs | CLAUDE.md is materially wrong on the palette: claims "Snap yellow `#FFD600`, cream `#f4efe5`, ink `#1c1b19`" (line 54) — actual tokens are ember orange `#e8511d`, bone `#f3efe6`, ink `#0f0e0c` (`app/globals.css:4-10`). TBD section (lines 100-106) never resolved. Architecture/stack sections are accurate | `CLAUDE.md:54,58,100-106` | MEDIUM |
| F11 | Testing | Zero automated tests, no test script, no runner. Highest-value gap: nothing validates `data/projects.ts` integrity (unique ids/numbers, resolvable image paths) — exactly the failure class that F1 is (a data-integrity test hitting image URLs would have caught the CDN outage) | `package.json:5-10` | MEDIUM |
| F12 | Accessibility | (a) Services accordion `<button>` lacks `aria-expanded`/`aria-controls` (`components/services.tsx:33-38`); (b) no `prefers-reduced-motion` handling anywhere — marquee, hero split-text, parallax all always animate; (c) `cursor-none` forced with `!important` on everything >768px (`app/globals.css:113-116`) — JS-disabled desktop users get NO cursor; (d) cursor.tsx re-renders React state on every mousemove | `components/services.tsx:33`, `app/globals.css:107-123`, `components/cursor.tsx:26-40` | MEDIUM |
| F13 | Consistency / content drift | Hardcoded copy duplicating data: "23-piece" (`components/hero.tsx:92`), "Twenty-three pieces" (`app/work/page.tsx:24`), stat "23" (`components/about.tsx:7`) — not derived from `projects.length`. "© 2026" and "Available · Q3 onward" hardcoded (`components/contact.tsx:113-116`). Will silently go stale | as listed | LOW |
| F14 | Architecture | Repeated section-header pattern (eyebrow label col-span-3 + display heading col-span-9) copy-pasted across 6+ components; `mono text-[11px] uppercase tracking-[0.22em]` appears ~30×. A `<SectionHeader>` component + one utility class would pay for itself. Unused CSS: `.eyebrow` class, `--color-ember-soft`, `--color-mist` tokens (`app/globals.css:9-10,148-153`) | `components/{about,services,contact,work-index}.tsx`, `app/work/page.tsx` | LOW |
| F15 | Error handling | No `app/error.tsx` / `global-error.tsx`. Acceptable for a fully static site (no data fetching, no forms — contact is `mailto:` only, so no silent form failures exist). Root 404 falls back to Next default (only `/work/[slug]` has a custom not-found). Fine; note only | `app/` | LOW |

**What's fine (checked, no action):** TypeScript strict passes; component naming (kebab-case files, PascalCase default exports) is consistent; `generateStaticParams`/`generateMetadata` in the slug route are correct Next 16 async-params usage; fonts via `next/font` with `display: swap` is right; `getAdjacentProjects` wraparound is intentional and correct; `.gitignore` properly excludes `.vercel` and `.env*`; no secrets anywhere in the repo (verified — the only "keys" are public CDN paths and a public Vercel project ID).

---

## Improvement Roadmap

### Tier 1 — Correctness & Security (must fix)

**T1.1 — Rescue and self-host all 23 project images** (fixes F1, prerequisite for F6) · **Blast radius: cross-cutting**
Every image URL under `https://cdn.myportfolio.com/65284a12-f311-4d98-a206-a0fcf391081f/…` (defined in `data/projects.ts`) returns HTTP 400 — Adobe Portfolio no longer serves them. Khaled must supply source images (original Adobe Portfolio account export, the Windows-PC archive, or `~/Downloads/slim-migration/`); the agent cannot recover them from the CDN. Once sourced: place optimized originals in `public/work/<slug>.{jpg,png,webp}` (or `/public/work/<slug>/hero.jpg` if multiple per project), update every `image:` field in `data/projects.ts` to local paths, delete the `CDN` const (line 34). Prefer ≥1600px-wide sources — the old URLs were 202×158 thumbnails, unusable for full-bleed heroes. **Acceptance:** `npm run build` passes; every `/work/[slug]` page and both grids render a real image locally (`npm run dev`, spot-check 5 slugs); zero references to `cdn.myportfolio.com` remain (`grep -r myportfolio` empty); deployed site shows images.

**T1.2 — Fix metadataBase / resolve the production-domain decision** (fixes F2) · **Blast radius: isolated**
`app/layout.tsx:32` sets `metadataBase: new URL("https://khalwani.com")` but that domain doesn't resolve (verified 2026-07-02). Either (a) Khaled buys/configures khalwani.com in Vercel, or (b) change metadataBase to `https://khalwani-portfolio.vercel.app` until the domain exists. Also update `app/work/[slug]/page.tsx:30` OG images (currently dead CDN URLs — depends on T1.1). Record the decision in CLAUDE.md's TBD section. **Acceptance:** `curl -sI <metadataBase>` returns 200; rendered `og:url`/`og:image` in page source point at live URLs.

**T1.3 — Patch Next.js to 16.2.10 and clear npm audit** (fixes F3) · **Blast radius: isolated**
`npm install next@16.2.10 eslint-config-next@16.2.10` (same minor — safe), then `npm audit fix` for the rest. This clears the 14 HIGH `next` advisories and the bundled postcss moderate. Do NOT use `npm audit fix --force`. **Acceptance:** `npm audit` reports 0 high/critical; `npm run build` still passes; site renders locally.

**T1.4 — Fix the 11 lint errors and add a CI gate** (fixes F4) · **Blast radius: moderate**
Fix `react/no-unescaped-entities` in `app/work/[slug]/page.tsx:161-162`, `components/about.tsx:42-51`, `components/contact.tsx:14`, `components/work-index.tsx:47,51` (use `&apos;`/`&rsquo;` or refactor strings). Fix `components/cursor.tsx:22` `set-state-in-effect` by initializing `enabled` from a lazy initial state or deriving touch capability without a synchronous setState (e.g. `useState(() => typeof window === "undefined" || !window.matchMedia("(hover: none)").matches)` won't work in SSR — use the established pattern: keep initial `true`, but move the check into the state initializer guarded for SSR, or suppress with a media-query listener via `useSyncExternalStore`). Then add `.github/workflows/ci.yml` running `npm ci && npm run lint && npm run build` on push/PR. **Acceptance:** `npm run lint` exits 0 with 0 errors; CI workflow passes on main.

**T1.5 — Add mobile navigation** (fixes F5) · **Blast radius: moderate**
`components/nav.tsx:29` hides all nav links below `md`. Add a mobile menu: minimal acceptable version is a compact inline row (Work / About / Contact) at small sizes; better is a full-screen overlay menu consistent with the editorial aesthetic (ink background, display type, staggered framer-motion reveal — see CLAUDE.md visual direction; keep the ember/bone/ink palette). Include the "Available for work" mailto. Must not fight lenis scroll (lock scroll while open). **Acceptance:** at 375px viewport, all four destinations + email are reachable from the header; menu opens/closes without scroll bugs; desktop nav unchanged; `npm run build` passes.

### Tier 2 — Structural upleveling (should fix)

**T2.1 — Real image pipeline: drop `unoptimized`, proper sizing, blur placeholders** (fixes F6; depends on T1.1) · **Blast radius: cross-cutting**
Once images are local (T1.1), remove `unoptimized` from all four `<Image>` call sites (`components/case-hero.tsx:34`, `components/work-grid.tsx:35`, `components/work-index.tsx:78`, `app/work/[slug]/page.tsx:136`) so Next serves AVIF/WebP at responsive sizes. Remove the now-unneeded `remotePatterns` from `next.config.ts` (or keep if any remote images remain). Add `placeholder="blur"` using static imports or generated blurDataURLs for hero images; keep `priority` only on above-fold heroes. **Acceptance:** production build serves `/_next/image` optimized variants; Lighthouse (mobile) LCP < 2.5s on `/` and one case page; no layout shift on image load (CLS < 0.1).

**T2.2 — SEO baseline: sitemap, robots, OG image, Twitter card** (fixes F7) · **Blast radius: isolated**
Add `app/sitemap.ts` (static routes + all 23 slugs from `data/projects.ts`), `app/robots.ts`, a designed root OG image (`app/opengraph-image.png` or generated — pair with the khaled-art-direction palette: bone/ink/ember), and `twitter` metadata in `app/layout.tsx`. Per-project OG images come from T1.1 local images. **Acceptance:** `/sitemap.xml` lists 26 URLs; `/robots.txt` serves; OG debugger (or `curl | grep og:`) shows valid absolute image URLs on `/` and one case page.

**T2.3 — Minimal high-value test suite** (fixes F11) · **Blast radius: isolated**
Vitest + a data-integrity suite for `data/projects.ts`: unique `id`, unique `number`, sequential numbering 01–23, `year` in sane range, every `image` path exists on disk (this exact test class would have caught the F1 CDN outage at build time), `getProjectBySlug`/`getAdjacentProjects` behavior including wraparound and unknown-slug. Optionally 2–3 render smoke tests (`Nav`, `WorkGrid`) with @testing-library/react + jsdom. Wire into the T1.4 CI workflow. `.planning/codebase/TESTING.md` already specifies the exact recommended setup — follow it. **Acceptance:** `npm test` script exists and passes; a deliberately broken image path fails the suite; CI runs tests.

**T2.4 — Purge template leftovers and dead data fields** (fixes F8, F9) · **Blast radius: isolated**
Delete `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg` (verify zero references first). Rewrite `README.md` to describe this actual project (stack, scripts, deploy target) in ~20 lines. In `data/projects.ts`: either implement `featured` (landing `work-index.tsx` currently shows all 23 — decide: filter to featured for the landing index, or delete the flag) and delete unused `href`; keep `context/approach/outcome` only if T3.2 (case content) is planned, otherwise remove from the type. **Acceptance:** `grep -r "next.svg\|vercel.svg\|globe.svg\|window.svg\|file.svg" app components data` is empty; README describes the real project; no unused fields remain in the `Project` type (or `featured` is actually consumed).

**T2.5 — Accessibility pass** (fixes F12) · **Blast radius: moderate**
(a) Add `aria-expanded={isOpen}` and `aria-controls` to the services accordion button (`components/services.tsx:33`). (b) Add `prefers-reduced-motion` support: pause `.marquee-track` animation via media query in `app/globals.css`, and use framer-motion's `useReducedMotion()` (or `MotionConfig reducedMotion="user"` in layout) to suppress hero/parallax animation. (c) Make lenis respect reduced motion too (skip instantiation). (d) Fix the global `cursor: none !important` so it only applies when the custom cursor actually mounted (e.g. add a class from the Cursor component instead of hardcoding on body in `app/layout.tsx:47`). **Acceptance:** with macOS "Reduce Motion" enabled, marquee is static and hero renders without translate animations; axe/devtools reports no button-state violations; disabling JS still shows a native cursor.

### Tier 3 — Polish & nice-to-have

**T3.1 — Correct CLAUDE.md and resolve TBDs** (fixes F10) · **Blast radius: isolated**
Fix the Visual Direction section (`CLAUDE.md:54,58`): actual palette is ember `#e8511d` / bone `#f3efe6` / ink `#0f0e0c` / fonts Fraunces + IBM Plex Mono + Inter — not Snap yellow/cream. Resolve the three TBDs (lines 100-106): all 23 case studies are live (thin — meta + overview + CTA only); production domain per T1.2 decision; SEO baseline per T2.2. Add the audit-discovered failure mode: "images must be local — the Adobe Portfolio CDN died silently in 2026." **Acceptance:** every color/font claim in CLAUDE.md matches `app/globals.css`; TBD section replaced with confirmed facts.

**T3.2 — Deepen case-study content** (extends F9) · **Blast radius: moderate, content-heavy**
All 23 case pages share one generic "request the deck" body (`app/work/[slug]/page.tsx:147-177`). For the 4 currently-flagged `featured` projects (levis-150, gucci, vans, mercedes), populate `context`/`approach`/`outcome` in `data/projects.ts` and render them as sections on the case page (brief → tension → build → outcome, per CLAUDE.md:70). Keep the deck CTA for the rest. Requires Khaled's input for the actual copy — an agent can scaffold the rendering sections and placeholder-free structure but must not invent client results. **Acceptance:** featured case pages show real narrative sections; no lorem/invented metrics; non-featured pages unchanged.

**T3.3 — Derive counts and dates from data** (fixes F13) · **Blast radius: isolated**
Replace hardcoded "23"/"Twenty-three" in `components/hero.tsx:92`, `app/work/page.tsx:24`, `components/about.tsx:7` with `projects.length` (number-to-word only where the display copy needs it). Replace "© 2026" in `components/contact.tsx:113` with `new Date().getFullYear()`. Review "Available · Q3 onward" (`contact.tsx:116`) — stale availability copy is worse than none; either maintain it consciously or generalize. Year range "2016 — 2024" (`work-index.tsx:41`, `work/page.tsx:18`) can derive from `Math.min/max` over `projects[].year`. **Acceptance:** adding a 24th project to `data/projects.ts` updates all counts with zero copy edits; grep for "23" and "2026" in components returns nothing load-bearing.

**T3.4 — Small refactors + dependency housekeeping** (fixes F14) · **Blast radius: moderate**
Extract a `<SectionHeader eyebrow number title>` component to replace the 6× duplicated header grid (about/services/contact/work-index/work page); promote `mono text-[11px] uppercase tracking-[0.22em]` into the existing `.eyebrow` utility (currently defined in `app/globals.css:148-153` but never used) or a Tailwind component class. Delete unused tokens `--color-ember-soft`, `--color-mist` (`globals.css:9-10`) or start using them. Bump minor deps (`framer-motion`, `lenis`, `tailwindcss` per `npm outdated`). **Acceptance:** visual diff-free refactor (screenshot compare landing + one case page before/after); `npm run build` and lint pass; no unused CSS custom properties remain.

---

## Priority order for execution sessions

1. **T1.1** (images — nothing else matters while the site is imageless; needs Khaled to supply sources)
2. T1.3 + T1.4 (one session: patch next, fix lint, add CI) 
3. T1.2 + T2.2 (one session: domain/metadata + SEO baseline)
4. T1.5 (mobile nav)
5. T2.1 (image pipeline, immediately after T1.1 lands)
6. T2.3 + T2.4 (tests + cleanup, one session)
7. T2.5, then Tier 3 in any order.
