# Tasks

What's open and what's been done. Every change updates this file: tick or add an Open
item, and add a dated line at the top of **Done**.

## Open

- [ ] **Deck review follow-ups (2026-10-31).** All decks were checked against current
      docs; couldn't confirm: Next.js `template.tsx` under Cache Components and Edge
      `middleware.ts` status; Azure Monitor SLOs GA; Front Door edge actions; Safari passive
      listeners and HTTP/2 push; `aria-busy`/`aria-controls` screen reader claims; Compose
      Material 3 1.5.0 going stable (Expressive names). Re-check Baseline badges (css) and
      provider names (system-design, llm-engineering) every few months. Facet ADRs
      0008–0016 are still Proposed.
- [ ] **LLM decks: open points from the 2026-10-31 review.** Couldn't confirm: Google's
      ranking API name after the Agent Search rename, OpenAI Evals' replacement (Datasets?),
      whether any Claude model is fine-tunable today. Provider features churn: re-check the
      llm-engineering platform cells every few months. ADR-0017 and ADR-0018 still Proposed.
- [ ] **Verify motion in a real browser.** Card slide (~0.7s spring) and 3D flip timing,
      jump-bar smooth scroll and section highlight were only checked frozen or headless.
- [ ] **Split card text per deck** if the bundle grows again: the JS is ~1,040 kB (~325 kB
      gzipped) with ten decks, a growing share of it card text. Loading a
      deck's cards on entry needs async loading in `decks/index.ts`, `App` and `DeckView`.
- [ ] **Review Proposed ADRs 0006–0007** (GitHub Pages on `v*` tags; Vitest and CI).
- [ ] **Review Proposed ADR-0015 and the essential picks** (about 20% of each deck, chosen by
      judgement). Open questions: css has no essential card in colour or architecture
      (candidates: `color-scheme`, `currentcolor`, `design-tokens`).
- [ ] **Social card still says six decks.** `public/og.webp` predates the testing,
      Next.js and LLM decks; regenerate it with ten.

- [ ] **Review Proposed ADR-0019** (UI on the pulp design system).
- [ ] **Dark mode.** pulp's tokens support it, but the page is pinned to light: card
      drawings use a light palette (#1a1a2e ink). Needs drawings that work on dark, or a light
      plate behind them.
- [ ] **Toast look.** pulp's toast is its info Alert; the redesign canvas drew a dark toast.
      Decide whether pulp should offer that variant.
- [ ] **README demo image** (`docs/static/demo.png`) and `public/og.webp` show the old UI.

### Advertising readiness

- [ ] **A8 Open Graph live.** The tags and `og.webp` exist in the repo but the live site has
      none yet (og.webp 404), so shared links show no preview — commit, then `/release minor`
      to deploy, and check a LinkedIn preview (WebP card; switch to PNG if it comes up blank).

### Scaffold follow-ups

- [ ] **Review Proposed ADRs 0002–0005** — reconstructed from this session's work — accept
      or amend in `docs/adr/` and `decisions.md`.

## Done

- [x] 2026-10-31: Released v1.0.0.
- [x] 2026-10-31: Redesigned the app on the pulp design system, following the "Flashcards: mobile redesign on pulp" canvas: deck list, study screen with progress and Show answer / I know this / Next card, filters in a sheet with counts and switches, browse sections as surfaces, toasts with Undo; ADR-0019.
- [x] 2026-10-31: Released v0.6.2.
- [x] 2026-10-31: Reviewed the other eight decks against current docs: 86 fixes, e.g. Baseline badges (forced-colors widely; anchor positioning, line-clamp, display: contents limited), OWASP 2025 categories by CWE mapping, Next.js 16.4 (Edge runtime deprecated, prefetch defaults, slot `default.tsx`), renamed services (Timestream for InfluxDB, Azure Managed Redis), Material 3 Expressive names, WCAG/APG wording.
- [x] 2026-10-31: Released v0.6.1.
- [x] 2026-10-31: Reviewed the LLM decks against current docs and papers: fixed 17 internals/engineering text errors (perplexity, KV cache, BPE, cosine 0…) and the provider cells (Claude sampling params and prefill now rejected, `output_config.format`, Workbench evals retired; OpenAI GPT-6 names, Evals and stored prompts shutting down, fine-tuning closed; Vertex AI renamed Agent Platform, `responseFormat`).
- [x] 2026-10-31: Released v0.6.0.
- [x] 2026-10-31: Two LLM decks: LLM Engineering (107 cards, Anthropic/OpenAI/Google equivalents, stage badge) and LLM Internals (100 cards, training-phase badge), a drawing per card; ADR-0017, ADR-0018.
- [x] 2026-10-30: Released v0.5.1.
- [x] 2026-10-30: Card drawings: the image box hugs the drawing (scaled up to 280px wide, capped at 30% of the screen height) instead of stretching to fill the taller card; content is centred vertically.
- [x] 2026-10-30: Released v0.5.0.
- [x] 2026-10-30: Next.js deck: 104 interview-style App Router cards (routing, rendering, data, caching, mutations, proxy, assets, metadata, config, deploy) with a drawing each and a "runs on" badge (ADR-0016).
- [x] 2026-10-30: Essential cards: about a fifth of every deck marked `"essential": true`, painted gold on both faces with a ★ before the title, a ★ toggle in the header (★ Essentials on desktop), stars in the list and counts on the deck picker; the validator checks the flag and the share (ADR-0015).
- [x] 2026-10-30: Hide cards you know: ✓ button or `H` with Undo, remembered per deck in localStorage, faded with Unhide in browse, a hidden-cards counter in the header to study them again (ADR-0015).
- [x] 2026-10-30: Taller phone card: packed one-row header, no credit on the study screen, card 380–680px (the page scrolls below the minimum).
- [x] 2026-10-20: Released v0.4.0.
- [x] 2026-10-20: Testing deck: 100 cards (strategy, unit, doubles, integration, APIs, UI, e2e, non-functional, CI, maintenance) with a drawing each, a test-level badge and JavaScript/Python equivalents (ADR-0014).
- [x] 2026-10-20: Rebranded to plain "Flashcards": page title, meta and Open Graph/Twitter tags, a new `og.webp` ("Learn the web, one card at a time", six decks), `document.title` on the picker, package.json, README and the knowledge files.
- [x] 2026-10-20: CSS deck: 100 cards (cascade, selectors, box model, flexbox, grid, positioning, responsive, typography, colour, motion, architecture) with a drawing each, a Baseline status badge and SwiftUI/Compose equivalents for layout (ADR-0013).
- [x] 2026-10-20: Bundle size: card drawings are separate hashed files instead of inlined data URIs, browse thumbnails lazy-load; JS 1.8 MB → 670 kB (337 → 210 kB gzipped) (ADR-0012).
- [x] 2026-10-20: Web Performance deck: 100 cards (metrics, measurement, network, server, caching, loading, assets, JavaScript, rendering) with a drawing each, anti-patterns as their own kind, and the metric each card improves as a badge (ADR-0011).
- [x] 2026-10-20: Web Security deck: 100 cards (attacks, defences and mechanisms across injection, browser, auth, sessions, transport, data, supply chain and infrastructure) with a drawing each and an OWASP Top 10 (2025) badge (ADR-0010).
- [x] 2026-10-20: Grew the accessibility deck to 100 cards (14 more patterns, alertdialog, 10 more ARIA attributes, 24 more WCAG 2.2 criteria; new `photosensitive` value for Three Flashes) and the system-design deck to 104 (45 more: storage internals, data systems, distributed systems, service infrastructure, operations), each card with a drawing.
- [x] 2026-10-20: System Design deck: 59 cards (data, caching, messaging, scaling, reliability, consistency, networking, observability) with a drawing each and AWS/GCP/Azure equivalents. Decks now declare their own platform columns in `deck.json` (ADR-0009).
- [x] 2026-10-20: Accessibility deck: 51 cards (10 patterns, 5 roles, 10 ARIA attributes, 11 techniques, 15 WCAG 2.2 criteria) with a drawing each, `kind`/`helps` filters and a WCAG level badge. Legacy links (`#card/<id>`) stay on the design-system deck now that it isn't first alphabetically.
- [x] 2026-10-16: Released v0.3.0.
- [x] 2026-10-16: Reviewed the facets of all 155 design-system cards; recategorised 23 (e.g. Link → navigation, Label → forms, Avatar/Tag/Timeline/Carousel → content, Picker/FilterBar → pattern).
- [x] 2026-10-16: Compact phone study screen: one-row header, tighter filters, card sized to the leftover height; everything fits one viewport and the page no longer bounces while swiping.
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
