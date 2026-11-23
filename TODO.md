# Twin Towers — refinement round (21 Nov 2026)

## Palette + curves + PageSpeed round (23 Nov 2026)
Source: `errors.md` (PageSpeed mobile report, 77 perf / 97 a11y).

### A. Palette — warm sandstone / muted taupe
- [x] A1. `--color-paper: #e9e1d5`, `--color-paper-2: #f0ebe3`; walnut sections
      (`Estate`, `SiteFooter`, building collage) untouched.
- [x] A2. `.surface-warm` / `.surface-warm-2` radial washes applied to all
      major light homepage sections; neutral, tonal only, no new hues.
- [x] A3. Closing CTA moved off plain ivory onto the warm surface;
      `themeColor` in `app/layout.tsx` updated to `#e9e1d5`.
- [x] A4. `stone` darkened `#746a66 → #675d57`, `mist → #d2c6b7`,
      `sand → #ded2c2`, `blush → #ecdfd8` so secondary text keeps ≥4.5:1.

### B. Organic curved section transitions
- [x] B1. `components/ui/SectionCurve.tsx`: one broad asymmetric SVG path,
      three cycled silhouettes, filled with the outgoing tone, `z-index:-1`,
      `pointer-events:none`, no animation.
- [x] B2. Curves at every homepage tone change: hero→statement,
      paper→walnut (Estate), walnut→paper (Suites), paper↔paper-2 bands,
      CTA→footer. Same-tone paper/paper boundaries intentionally skipped.
- [x] B3. Parent sections `isolate`; content stays above the curve. Verified at
      390 px, 768 px and desktop — nothing clipped, no overlap, no overflow.

### C. PageSpeed — images & LCP
- [x] C1. Removed `unoptimized: true`; AVIF/WebP srcsets now emitted. Verified
      `sharp` in the build copy and AVIF negotiation (poster @640w = 17.7 KiB).
- [x] C2. Nav logo 113 KiB PNG → 11 KiB WebP, rendered at 96×86, `priority`
      + `fetchPriority="high"`; preload present in the initial HTML.
- [x] C3. Poster 238 KiB → 153 KiB WebP (then served as AVIF: 27 KiB @828w).
- [x] C4. 1080p 7.96 MB → 4.1 MB, 720p 4.71 MB → 2.7 MB (24 fps, CRF 32/33,
      `faststart`); poster-first, video loads on idle, no preload of both files.
- [x] C5. Audited every `next/image`: added missing `sizes`, trimmed Estate
      cards `34vw → 22vw`, gallery/suites/blog hints matched to real rendered
      widths. No source image is now requested at more than ~2× its slot.

### D. PageSpeed — accessibility / JS / CSS
- [x] D1. All 4 contrast failures fixed: building labels `ink/75`, gallery
      caption on a solid `paper-2` plate, footer small print `ivory/65`,
      GuestNotes `ink/70`; Lighthouse accessibility re-run = 100.
- [x] D2. Modern `browserslist` targets added → legacy polyfill chunk gone.
- [x] D3. Booking popup split into `BookingPopupLoader` (dynamic, idle-loaded,
      event-driven so Reserve still opens it instantly) — form/router/validation
      code no longer ships in the initial payload. Event constant moved to
      `lib/events.ts` so sections don't import the popup module.
- [x] D4. `SiteChrome` scroll listener → 1px IntersectionObserver sentinel;
      no per-frame `scrollY` read / forced reflow.
- [x] D5. Render-blocking CSS is framework-level (two Next App Router stylesheets,
      ~16.8 KiB total). Tested `experimental.optimizeCss` + `critters`: it only
      re-inlined an existing 170-byte rule and left both sheets blocking, so it
      was reverted rather than add a dependency with no gain. Fonts are already
      self-hosted/preloaded by `next/font`; no other preconnect candidates.

### E. Verification
- [x] E1. `tsc --noEmit` clean; `next build` clean — 32 pages generated.
- [x] E2. Computed styles: body `rgb(233,225,213)`, alternating `surface-warm*`
      gradients, 38 px mobile / 70 px desktop curve heights with correct fills.
      CDP screenshots at 390 px and 768 px: no overflow, 0 broken images, 0
      console errors. Lighthouse a11y / best-practices / SEO = 100/100/100.
- [x] E3. Asset savings: logo 113→11 KB; poster 238→153 KB (AVIF 27 KB @828w);
      video 7.96→4.1 MB and 4.71→2.7 MB; responsive images remove ~525 KiB of
      oversized photo downloads (PageSpeed estimate).
- [x] E4. TODO updated; all changes left uncommitted and unpushed for review.

## Follow-up round (21 Nov 2026)
- [x] Google Sheet phone "Formula parse error" hardened in `booking.gs`:
      `sheetText_()` now strips line breaks, the phone column is forced to
      plain text (`@`), and a one-time `repairSheetPhones()` helper repairs
      old error cells. USER ACTION: paste the new `booking.gs` into Apps
      Script → Deploy → Manage deployments → New version, then run
      `repairSheetPhones()` once from the editor.
- [x] Favicon is now the Defoy logo, matching Jade: `app/icon.png`,
      `app/favicon.ico`, `app/apple-icon.png`, PWA icons in `public/icons/`
      and a branded `app/manifest.ts`; removed the old crimson `app/icon.svg`.
- [x] "01 — The building" replaced: short section (~600px) with three
      clickable/hoverable/swipeable views of the property (house / lawn /
      facade) using real property photos; the fake floor labels are gone.
- [x] Navbar at scroll top now has a translucent tinted background with blur
      (`bg-forest/55 backdrop-blur-md`, light text), like Jade River, instead
      of only a soft gradient.
- [x] "02 — The house" on mobile appears quickly: swapped the 1.05s clip-path
      mask + 1.25s image zoom for a 0.32s fade, first two images eager, no
      `reveal-media` scale.
- [x] Statement section after the hero now animates on scroll: "25" counts up,
      rules and underline draw in, fact rows react to hover. `SplitText` got a
      `forceDelay` prop so this headline waits for the scroll instead of
      firing while the hero is still on screen.
- [x] Ported Jade's `mark-sage` keyword highlight: same CSS (skewed sage
      rectangle `#c8d5a5`, charcoal 800 text + 0.012em stroke) and applied to
      curated headline keywords on plain backgrounds only — removed from the
      hotel and dining headers, which sit over photos. Highlights now on 9
      page H1s and 5 homepage lines (statement, guest notes, gallery, location,
      journal). Rewrote the highlighted sentences in plain English.
      Statement highlights the whole phrase "A quieter kind of escape.";
      highlight text stroke thickened to 0.022em for extra weight.
- [x] Highlight colour kept as muted sage (#c8d5a5) — user preferred green;
      homepage highlights now skip consecutive sections
      (statement, 06 gallery, 08 location, 10 journal — guest notes skipped).
- [x] "03 — Stay" headline is now "Two ways to stay." with sage highlight on
      "stay." Added an optional `highlight` word prop to `SplitText`
      (reduced-motion aware) and widened word gap to 0.3em.
- [x] "01 — The building" image switch now uses a pixel dissolve: 8x6 tile
      overlay reveals the new photo in a staggered order, then becomes the base.
      Reduced motion falls back to an instant swap.
- [x] Navbar on /contact no longer shifts the primary links: the hidden
      "Reserve directly" CTA keeps its 202px slot on desktop (invisible +
      pointer-events-none), and is fully hidden below lg so the hamburger stays
      flush right. Verified link x-positions identical to the homepage.
- [x] Removed all blanket "every room has a balcony" claims site-wide
      (Statement, Estate, Suites, hotel page, FAQ, manifest, dining/breakfast
      copy). Kept the "Premium Room with Balcony" room type name, its room-specific
      descriptions and the balcony gallery, per user's choice.
- [x] `npx tsc --noEmit` clean, `npm run build` passes (32 pages), no browser
      console errors.

## This round
- [x] Hotel page story shortened; quote tightened.
- [x] "01 — The building" heading fixed to "Five floors. One roof."
- [x] Navbar: Defoy logo image (copied from Jade repo) instead of text.
- [x] Travel time changed to "1.5 to 2 hours" everywhere.
- [x] Location places: Aru Valley / Betaab Valley (The river bend) /
      Chandanwari, numbered 01/02/03 with arrows (already present; note fixed).
- [x] Contact form wrapped in a visible card (border + tint + shadow);
      navbar "Reserve directly" hidden on /contact.
- [x] Popup form: portrait, only Name/Phone/Email/Travel date on all screens;
      name + phone required (*) with inline validation; /api/booking, Sanity,
      Google Script sheet headers + test row all updated to match.
- [x] Build + browser verification (all passed, no console errors).

## Earlier completed rounds (see git history / conversation)
- Booking popup + /api/booking + thank-you + Apps Script + Sanity fallback.
- Blog / Sanity hero images, uniform tiles, full-bleed articles, 60s revalidate.
- Jade reveal values + image curtain reveals; Lenis tuned.
- Removed unused features (experiences, dead components), copy audit,
  room split 22 premium + 3 attic, section reorder, direct image serving,
  all three forms validated, Google Sheet logging (phone #ERROR fixed).
