# HUMAN ACTIONS — khalwani-portfolio

Things only Khaled can do. Everything below is blocked on owner access
(credentials, source files, or purchases). Code-side workarounds are already
in place — see notes per item.

---

## 1. Supply the 23 original project images (AUDIT T1.1 — CRITICAL)

The Adobe Portfolio CDN (`cdn.myportfolio.com`, account
`65284a12-f311-4d98-a206-a0fcf391081f`) returns HTTP 400 for every URL. The
originals are not in this repo and cannot be recovered from the CDN.

**Interim state (already shipped):** every project now renders a branded
placeholder plate (`public/work/<slug>.svg` — bone/ink/ember palette, project
number + client + title), so the site is no longer visibly broken. But these
are placeholders, not the work.

**Where to look for the originals:**
1. Adobe Portfolio account — log in at portfolio.adobe.com and export the
   site/media library (best: original uploads, not the 202×158 thumbnails).
2. The archived Windows PC (untouched until ~May 2026 per migration notes) —
   search for the source files used to build the Adobe Portfolio.
3. `~/Downloads/slim-migration/` — the flat Drive export from the migration.

**When you have them:**
1. Prefer ≥1600px-wide sources (the old CDN URLs were mostly 202×158
   thumbnails — too small for full-bleed heroes).
2. Drop them in `public/work/` named by slug: `levis-150.jpg`, `gucci.jpg`, …
   (slugs = `id` fields in `data/projects.ts`; the 23 placeholder `.svg`
   files there show the exact names).
3. Update the `image:` fields in `data/projects.ts` from `.svg` to the real
   extension, delete the placeholder SVGs, and run `npm run build`.
4. That unlocks AUDIT T2.1 (drop `unoptimized`, real image pipeline) —
   any agent can do step 3–4 once the files exist.

## 2. khalwani.com domain (AUDIT T1.2)

`khalwani.com` does not resolve (verified 2026-07-02/03). Either:

- **Option A — buy/configure it:** purchase khalwani.com at a registrar, then
  in Vercel → project `khalwani-portfolio` → Settings → Domains → add
  `khalwani.com` (and `www`), and set the DNS records Vercel shows you.
- **Option B — decide against it** and the Vercel URL stays canonical.

**Interim state (already shipped):** `metadataBase` in `app/layout.tsx` now
points at `https://khalwani-portfolio.vercel.app` with a `TODO` comment marking
the one-line swap back to `https://khalwani.com` once the domain is live.

## 3. Per-project OG images are placeholder SVGs

Social scrapers (WhatsApp/LinkedIn/X) generally do not render SVG `og:image`.
Until item 1 lands real raster images, link previews for `/work/*` pages will
show no image. No action beyond item 1 — this fixes itself when real
`.jpg`/`.png` files replace the SVGs.
