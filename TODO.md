# Twin Towers — refinement round (21 Nov 2026)

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
