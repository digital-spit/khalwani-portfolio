# khalwani-portfolio — Operating Doc

Personal portfolio site for Khaled Halwani. Read this before touching the repo.

---

## What This Is

The public-facing portfolio at `khalwani.com` (or `khalwani-portfolio.vercel.app`). Showcases creative strategy work, case studies, and a public footprint that supports the LinkedIn brand. Built modern (Next.js 16, React 19, Tailwind 4, framer-motion, lenis for smooth scroll).

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
- **Next.js 16.2.4** (App Router, breaking-changes version — read `node_modules/next/dist/docs/` before assuming APIs)
- **React 19**
- **Tailwind 4** with `@tailwindcss/postcss`
- **framer-motion 12** for component motion
- **lenis 1.3** for smooth scroll on the page

---

## Visual Direction

This site IS the public surface of the `khaled-art-direction` skill — Cocozza ink illustration aesthetic, Snap yellow `#FFD600` as the single accent, cream `#f4efe5` background, near-black `#1c1b19` ink. The brand language is the same as LinkedIn carousels.

Pair with `khaled-art-direction` skill when generating any new visual (illustrations, hero artwork, case study assets) for this site. If you're shipping new layouts, also pair with the `frontend-design` skill so the typography and motion feel distinctive, not generic.

Color tokens in `globals.css` should mirror the art-direction palette. If they drift, fix them — there should only be one accent color across the site.

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
- Mobile-first. Hero, marquee, and work-grid need to land on a phone before they get the polish.

---

## Failure Modes

1. **Lenis breaking scroll on mobile Safari.** Smooth-scroll libs occasionally fight iOS rubber-band. Test on real device after any smooth-scroll wrapper change.
2. **framer-motion over-animating.** When everything moves, nothing reads. If a new component has 3+ motion variants, cut one.
3. **Visual drift from `khaled-art-direction`.** New components should use the cream/ink/yellow palette. If you find yourself adding a new color, it's wrong.
4. **Case study slugs without redirects.** Don't rename a published case study slug without adding a redirect — LinkedIn comments and external links break otherwise.

---

## TBD (open decisions)

- Confirm current stage: which case studies are live vs in-draft? Update this section once you know.
- Confirm production domain (khalwani.com vs current Vercel URL).
- Confirm SEO baseline (sitemap, robots.txt, OG tags) — verify before any public launch.

This doc was drafted from the repo on 2026-05-11. Update the TBD section once you confirm the stage.
