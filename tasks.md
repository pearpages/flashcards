# Tasks

What's open and what's been done. Every change updates this file: tick or add an Open
item, and add a dated line at the top of **Done**.

## Open

- [ ] **Escape the card id in BrowseView selectors.** A crafted `#card/<id>` link can blank
      the page — use `CSS.escape` (or ignore ids not in the deck) in `BrowseView.tsx`
      ([security.md](security.md) Known risks).
- [ ] **Verify motion in a real browser.** Card slide (~0.7s spring) and 3D flip timing,
      jump-bar smooth scroll and section highlight were only checked frozen or headless.
- [ ] **Arrow buttons below the fold on phones.** After loosening the spacing they end at
      ~830px; consider a compact phone header (title + Study/Browse on one line).
- [ ] **Review native-platform names.** Newer Material 3 Expressive names (ButtonGroup,
      SplitButtonLayout, FloatingToolbar) and some iOS approximations (TipKit for Tour) were
      written from memory — check against current docs in `cards.json`.
- [ ] **Bundle size.** Inlined SVGs push the JS to ~750 kB (~175 kB gzipped) — consider
      `build.assetsInlineLimit` or lazy-loading images.
- [ ] **Retake the README demo screenshot.** `docs/static/demo.png` still shows the old
      generic deck.

### Scaffold follow-ups

- [ ] **Enable GitHub private vulnerability reporting** — security.md points reporters
      there — repository Settings → Security.
- [ ] **Review Proposed ADRs 0002–0005** — reconstructed from this session's work — accept
      or amend in `docs/adr/` and `decisions.md`.

## Done

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
