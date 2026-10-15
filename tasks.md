# Tasks

What's open and what's been done. Every change updates this file: tick or add an Open
item, and add a dated line at the top of **Done**.

## Open

- [ ] **Verify motion in a real browser.** Card slide (~0.7s spring) and 3D flip timing,
      jump-bar smooth scroll and section highlight were only checked frozen or headless.
- [ ] **Arrow buttons below the fold on phones.** After loosening the spacing they end at
      ~830px; consider a compact phone header (title + Study/Browse on one line).
- [ ] **Review native-platform names.** Newer Material 3 Expressive names (ButtonGroup,
      SplitButtonLayout, FloatingToolbar) and some iOS approximations (TipKit for Tour) were
      written from memory — check against current docs in `cards.json`.
- [ ] **Bundle size.** Inlined SVGs push the JS to ~750 kB (~175 kB gzipped) — consider
      `build.assetsInlineLimit` or lazy-loading images.
- [ ] **Review Proposed ADRs 0006–0007** (GitHub Pages on `v*` tags; Vitest and CI).

### Advertising readiness

- [ ] **A8 Open Graph live.** The tags and `og.webp` exist in the repo but the live site has
      none yet (og.webp 404), so shared links show no preview — commit, then `/release minor`
      to deploy, and check a LinkedIn preview (WebP card; switch to PNG if it comes up blank).

### Scaffold follow-ups

- [ ] **Review Proposed ADRs 0002–0005** — reconstructed from this session's work — accept
      or amend in `docs/adr/` and `decisions.md`.

## Done

- [x] 2026-10-15: Released v0.2.1.
- [x] 2026-10-15: "Made by pearpages" footer (`@pearpages/credit`) on every screen.
- [x] 2026-10-15: Released v0.2.0.
- [x] 2026-10-15: Maturity assessment — verdict Ready after blockers, 1 gap added to Open.
- [x] 2026-10-15: Advertising readiness: OG/Twitter tags and 1200×630 card, favicon and touch icon, meta description, README badges/live link/new screenshot/155 count, package.json metadata, GitHub About and topics, private vulnerability reporting, Vitest + CI on push/PR, CONTRIBUTING, code of conduct, issue/PR templates.
- [x] 2026-10-15: Maturity assessment — verdict Ready after blockers, 10 gaps added to Open.
- [x] 2026-10-15: GitHub Pages set up for the tag deploy (Actions source, custom domain, HTTPS, `v*` tag rule).
- [x] 2026-10-15: Released v0.1.0.
- [x] 2026-10-15: `release` skill: bump with `npm version`, tag `v*`, push, GitHub release.
- [x] 2026-10-15: GitHub Actions deploy to GitHub Pages (flashcards.pearpages.com) on `v*` tags; removed the GitLab Pages job.
- [x] 2026-10-15: Deck picker home screen (preview tiles), back arrow, deck in the URL (`#/<deck>/…`), fresh start on each visit; legacy links still work.
- [x] 2026-10-15: Escaped card ids in BrowseView selectors — a crafted link no longer blanks the page.
- [x] 2026-10-15: Scaffolded project knowledge files — 14 created (incl. 5 ADRs), 4 fixed, 2 follow-ups.
- [x] 2026-10-15: Slower, smoother card transitions (soft spring, eased fade, reduced-motion cross-fade).
- [x] 2026-10-15: Evened out and loosened page spacing on phone and desktop.
- [x] 2026-10-15: 3D card flip with a patterned, legible card back.
- [x] 2026-10-15: Tap again to flip a card back to the front.
- [x] 2026-10-15: Added 36 components (155 total), native iOS/Android names and 14 iOS/Android drawing pairs.
- [x] 2026-10-15: Browse view grouped by purpose with search, jump bar, desktop sidebar and hash links.
- [x] 2026-10-15: Dropped the atomic filter; atomic level stays as a badge.
- [x] 2026-10-15: Mobile drawings next to desktop ones on 27 cards.
- [x] 2026-10-15: Pivoted to design-system component cards in a `src/decks/` data folder with a validator.
- [x] 2026-10-15: Dev server reachable on the network (`vite --host`).
- [x] 2026-02-05: Initial flashcard app and GitLab Pages publishing.
