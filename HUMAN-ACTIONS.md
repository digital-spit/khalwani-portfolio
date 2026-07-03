# HUMAN ACTIONS — khalwani-portfolio

Things only Khaled can do. Code-side work is done — see notes per item.

---

## 0. GOOD NEWS FIRST — your Adobe Portfolio is still live

The images were never gone. **`https://khalwani.myportfolio.com` is up and
serving the full portfolio.** Adobe added hash-signing to its CDN
(`?h=<hash>` now required), which is why the repo's old unsigned URLs
returned HTTP 400 and the deployed site went imageless.

All 23 project images were recovered from the live site (2026-07-03),
optimized, and committed to `public/work/`. **No placeholders remain.**
While the myportfolio site is up, consider exporting/backing up the original
source files from your Adobe account anyway — Adobe could sunset it for real
one day, and this repo only holds web-resolution copies.

## 1. Optional image quality upgrades (needs your source files)

Everything recovered is the *largest size Adobe's CDN has* — Adobe never
upscales past the original upload, so several images are natively small and
will soften when stretched full-bleed:

| Project | Recovered size | Note |
|---|---|---|
| `video-ads` | 500×390 **animated GIF** (944KB) | kept animated; only size that exists |
| `collages` | 501×392 | small original |
| `levis-150` | 564×442 | small original |
| `prixim` | 662×518 | small original |
| `automotive-photo` | 981×768 | acceptable |
| `ca-drive` | **still frame** (1600w JPEG) from a 222-frame GIF | the animated original is 20–24MB in every size — unshippable; a representative frame was extracted |
| `paid-social` | **still frame** (1600w JPEG) from a 73-frame GIF | same reason (7–13MB animated) |

Everything else is 1000–1600px wide and fine.

**If you want to upgrade any of these:** drop a ≥1600px-wide source into
`public/work/<slug>.jpg` (same filename, overwrite) and push. For `ca-drive`
/ `paid-social`, if you want motion back, supply short MP4/WebM clips and
ask an agent to swap the `<Image>` for a `<video>` on those cards — do NOT
re-add multi-MB GIFs.

## 2. khalwani.com domain (blocked on purchase — registrar side)

`khalwani.com` does not resolve (re-verified 2026-07-03). To point it at
this site:

1. **Buy the domain** at any registrar (or transfer it in if you own it).
2. **Add it to the Vercel project:** vercel.com → project
   `khalwani-portfolio` → Settings → Domains → Add → `khalwani.com`
   (Vercel will offer to add `www.khalwani.com` with a redirect — accept).
3. **At your registrar, create these DNS records** (values verified against
   Vercel docs, 2026-07-03 — the Domains screen in step 2 shows the
   authoritative per-domain values; prefer whatever it displays):

   | Type | Name | Value |
   |---|---|---|
   | A | `@` (apex, khalwani.com) | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns-0.com` |

   (Current Vercel docs give `cname.vercel-dns-0.com` as the general CNAME
   target; older docs used `cname.vercel-dns.com`. Both are Vercel's —
   use the one the dashboard shows for your domain.)
4. Wait for DNS to propagate (minutes to ~1h). Vercel auto-issues the SSL
   certificate once it verifies.
5. **Flip metadataBase:** in `app/layout.tsx` there is a marked
   `TODO(domain)` comment — change
   `new URL("https://khalwani-portfolio.vercel.app")` to
   `new URL("https://khalwani.com")`, commit, push. That's the only code
   change needed.

## 3. Image pipeline note (no action needed, FYI)

All `<Image>` components still pass `unoptimized` (full bypass of Vercel
image optimization). Left as-is deliberately: flipping it changes
prod-serving behavior and belongs with AUDIT T2.1 (responsive sizes + blur
placeholders) as one verified change. Now unblocked since all images are
local — any agent can pick up T2.1.
