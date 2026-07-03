# khalwani-portfolio — Operating Doc

Personal portfolio site for Khaled Halwani. Read this before touching the repo.

---

## What This Is

The public-facing portfolio at `https://khalwani-portfolio.vercel.app` (`khalwani.com` is NOT purchased/configured yet — see HUMAN-ACTIONS.md). Showcases creative strategy work, case studies, and a public footprint that supports the LinkedIn brand. Built modern (Next.js 16, React 19, Tailwind 4, framer-motion, lenis for smooth scroll).

Positioning: practitioner-builder who codifies creative judgment into systems. The site has to feel like the LinkedIn voice — direct, editorial, not corporate.

---

## Architecture

```
app/
├── layout.tsx                 # Root layout (smooth-scroll wrapper, cursor)
├── page.tsx                   # Landing: Hero → Marquee → WorkIndex → About → Services → Contact
├── globals.css
├── favicon.ico
└── work/
    ├── page.tsx               # Index of all case studies
    └── [slug]/
        ├── page.tsx           # Individual case study (CaseHero + content)
        └── not-found.tsx

components/
├── nav.tsx                    # Top nav
├── cursor.tsx                 # Custom cursor
├── smooth-scroll.tsx          # lenis wrapper
├── hero.tsx                   # Landing hero
├── marquee.tsx                # Scrolling band
├── work-index.tsx             # Featured work on landing
├── work-grid.tsx              # Full work grid on /work
├── case-hero.tsx              # Case study hero
├── about.tsx
├── services.tsx
└── contact.tsx
```

Stack:
- **Next.js 16.2.10** (App Router, breaking-changes version — read `node_modules/next/dist/docs/` before assuming APIs)
- **React 19**
- **Tailwind 4** with `@tailwindcss/postcss`
- **framer-motion 12** for component motion
- **lenis 1.3** for smooth scroll on the page

Content lives in one place: `data/projects.ts` (23 projects; `id` doubles as the URL slug — don't rename a published slug without a redirect). Images are served locally from `public/work/<slug>.svg` — currently **branded placeholder plates**, because the original Adobe Portfolio CDN died and the source images only exist with Khaled (HUMAN-ACTIONS.md item 1).

CI: `.github/workflows/ci.yml` runs `npm ci && npm run lint && npm run build` on every push/PR. Lint must stay at 0 errors.

---

## Visual Direction

The actual shipped palette (source of truth: `app/globals.css` `@theme`) is:

- **Ember orange `#e8511d`** (`--color-ember`) — the single accent
- **Bone `#f3efe6`** (`--color-bone`) background, with `#ece7da` (`--color-bone-2`) as the raised surface
- **Ink `#0f0e0c`** (`--color-ink`) near-black, `#2a2823` (`--color-ink-soft`) for body text

Fonts: **Fraunces** (display, weight 300, tight tracking), **IBM Plex Mono** (labels/eyebrows, uppercase, wide tracking), **Inter** (body) — all via `next/font`.

> Historical note: earlier drafts of this doc claimed a "Snap yellow `#FFD600` / cream `#f4efe5` / ink `#1c1b19`" palette from the `khaled-art-direction` skill. **That was never what shipped.** Trust `globals.css`. If you pair with `khaled-art-direction` for new assets, map its accent role to ember `#e8511d`, not yellow.

There should only be one accent color across the site. If you find yourself adding a new color, it's wrong.

---

## Case Studies (`/work/[slug]`)

Each case study lives at `app/work/[slug]/page.tsx`. Dynamic route. Add a new case by:

1. Creating a new slug directory or extending the data source that drives `work-index.tsx` and `work-grid.tsx`.
2. Adding the case study content following the `case-hero.tsx` pattern.
3. Updating `work-index.tsx` if it should appear on the landing page.

Each case study should answer: what was the brief, what was the tension, what was the build, what was the outcome. Mirrors the Builder's Log structure from LinkedIn — methodology stack + happy accident + blocker confession + architecture insight. The site is the long-form expansion of LinkedIn posts.

---

## Deployment

- Vercel project: `khalwani-portfolio` (ID `prj_6ShIv5tPwsgBo9rsj8SeHkq1YPB8`)
- Auto-deploy on push to `main`
- Custom domain: configure in Vercel project settings

---

## Working Rules

- Tailwind 4 — uses the new CSS-based config. Don't add a `tailwind.config.ts` without checking the current setup first.
- framer-motion — animations should feel intentional, not decorative. Pair with lenis smooth scroll. High-impact moments only (hero load, work-grid entry, case-hero reveal).
- Never compromise the aesthetic for a stock template. The site exists to differentiate from corporate portfolios.
- The site is desktop-led, not mobile-first — it was designed at desktop and adapted down. Mobile now has a working full-screen nav menu (added 2026-07-03; `components/nav.tsx`), but every layout change still needs an explicit check at ~375px: hero, marquee, work-grid and the mobile menu itself.

---

## Failure Modes

1. **Lenis breaking scroll on mobile Safari.** Smooth-scroll libs occasionally fight iOS rubber-band. Test on real device after any smooth-scroll wrapper change.
2. **framer-motion over-animating.** When everything moves, nothing reads. If a new component has 3+ motion variants, cut one.
3. **Visual drift.** New components must use the bone/ink/ember palette from `globals.css`. If you find yourself adding a new color, it's wrong.
4. **Case study slugs without redirects.** Don't rename a published case study slug without adding a redirect — LinkedIn comments and external links break otherwise.
5. **Remote-hosted images.** The original site hotlinked Adobe Portfolio's CDN, which died silently in 2026 and left the deployed site imageless for months with a green build. Images must be local files in `public/` — never hotlink an external host for content the site depends on.

---

## Current State (confirmed 2026-07-03)

- **Case studies:** all 23 are live at `/work/[slug]` — but thin (meta + overview + a generic "request the deck" CTA). No per-project narrative content exists yet (AUDIT T3.2).
- **Production domain:** `khalwani.com` does not resolve and is not configured anywhere. `metadataBase` points at `https://khalwani-portfolio.vercel.app` with a TODO comment in `app/layout.tsx` for the swap. Buying/attaching the domain is Khaled's call — HUMAN-ACTIONS.md item 2.
- **Images:** all 23 project images are local branded placeholder SVGs in `public/work/`. The real work imagery is blocked on Khaled supplying sources — HUMAN-ACTIONS.md item 1.
- **SEO baseline:** OG tags resolve to live absolute URLs; still missing sitemap.ts, robots.ts, root OG image, Twitter card (AUDIT T2.2).
- **Quality gates:** lint is at 0 errors and CI (lint + build) runs on push/PR. No tests yet (AUDIT T2.3).

This doc was drafted 2026-05-11 and corrected 2026-07-03 against the actual codebase (palette, mobile claims and TBDs were wrong). See AUDIT.md for the full findings and roadmap.
