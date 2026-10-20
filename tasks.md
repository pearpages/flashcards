# Tasks

What's open and what's been done. Every change updates this file: tick or add an Open
item, and add a dated line at the top of **Done**.

## Open

- [ ] **Verify motion in a real browser.** Card slide (~0.7s spring) and 3D flip timing,
      jump-bar smooth scroll and section highlight were only checked frozen or headless.
- [ ] **Review native-platform names.** Newer Material 3 Expressive names (ButtonGroup,
      SplitButtonLayout, FloatingToolbar) and some iOS approximations (TipKit for Tour) were
      written from memory — check against current docs in `cards.json`.
- [ ] **Bundle size.** Inlined SVGs push the JS to ~1.5 MB (~295 kB gzipped) with five decks, up from ~750 kB with one; every deck's drawings load on the home screen — consider
      `build.assetsInlineLimit` or lazy-loading images.
- [ ] **Review Proposed ADRs 0006–0007** (GitHub Pages on `v*` tags; Vitest and CI).
- [ ] **Review the accessibility deck** (100 cards, ADR-0008 Proposed): check the content and
      the SwiftUI/Compose names in `src/decks/accessibility/cards.json` against current
      WAI-ARIA APG, WCAG 2.2 and platform docs; written from memory. Least sure:
      `PlainTooltip`/`TooltipBox`, `.isToggle`, `CommandMenu`, `Table`, `OutlineGroup`,
      `Gauge`, `HorizontalPager`, `stateDescription`, `android:autofillHints`; and the
      support claims on `aria-controls`, `aria-busy` and `aria-errormessage`.
- [ ] **Review the web-security deck** (100 cards, ADR-0010 Proposed): check content
      against current OWASP cheat sheets and specs; written from memory. Least sure: the
      OWASP 2025 category on judgement-call cards (xxe, redos, file-upload, reverse
      tabnabbing, secrets-management, waf, ddos-protection, data-minimization), NIST SP
      800-63B rev 4 password figures, OAuth 2.1 status, Trusted Types browser support,
      CWE-1336 / CWE-915 / CWE-1392 / CWE-636 aliases.
- [ ] **Review the web-performance deck** (100 cards, ADR-0011 Proposed): check content
      against web.dev and MDN; written from memory. Least sure: TTFB ≤ 0.8 s and FCP
      ≤ 1.8 s guides, INP's "one of the slowest" rule, CLS session windows and the 500 ms
      input exclusion, TCP initial window (~14 kB), passive-by-default listeners in Safari,
      Speculation Rules support, stale-while-revalidate in browsers, the `improves` badge
      on judgement-call cards (core-web-vitals, p75, head-of-line-blocking, http3).
- [ ] **Branding with five decks.** The page title, OG tags, `og.webp` and `document.title`
      in `DeckPicker` still say "Design System Flashcards" and "155 components" — decide
      whether the site becomes plain "Flashcards".
- [ ] **Review the system-design deck** (104 cards, ADR-0009 Proposed): check the
      descriptions and the AWS/GCP/Azure service names in
      `src/decks/system-design/cards.json` against current provider docs; written from memory.
      Least sure: GCP Managed Service for Apache Kafka, Backup and DR Service, Service
      Directory; CloudWatch Application Signals SLOs; Amazon Timestream (now Timestream for
      InfluxDB?); Azure built-in PgBouncer, Synapse / Fabric, Istio add-on for AKS,
      Functions Premium always-ready instances.

### Advertising readiness

- [ ] **A8 Open Graph live.** The tags and `og.webp` exist in the repo but the live site has
      none yet (og.webp 404), so shared links show no preview — commit, then `/release minor`
      to deploy, and check a LinkedIn preview (WebP card; switch to PNG if it comes up blank).

### Scaffold follow-ups

- [ ] **Review Proposed ADRs 0002–0005** — reconstructed from this session's work — accept
      or amend in `docs/adr/` and `decisions.md`.

## Done

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
