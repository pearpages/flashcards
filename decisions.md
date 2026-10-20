# Decisions

Architecture Decision Records for Flashcards. Each ADR in `docs/adr/` records
one choice, its context and its trade-off. The rules that follow from them are in
[principles.md](principles.md).

New ADR: copy the format below, take the next number, and add a line here. An accepted ADR
is not edited; reversing it means a new ADR whose status says `Supersedes NNNN`, and the old
one's status becomes `Superseded by NNNN`. ADRs are proposed to the user before they are
accepted.

| # | Decision | Status | Date |
|---|---|---|---|
| [0001](docs/adr/0001-project-knowledge-files.md) | Project knowledge lives in principles, architecture, decisions, tasks and security | Accepted | 2026-10-15 |
| [0002](docs/adr/0002-decks-are-self-describing-data-folders.md) | Decks are self-describing data folders | Proposed | 2026-10-15 |
| [0003](docs/adr/0003-local-svg-drawings-with-platform-variants.md) | Local SVG drawings, with mobile and iOS/Android variants | Proposed | 2026-10-15 |
| [0004](docs/adr/0004-hash-routing-without-a-router.md) | Hash routing without a router library | Proposed | 2026-10-15 |
| [0005](docs/adr/0005-purpose-layer-and-atomic-facets.md) | Purpose and layer filter the deck; atomic level is a badge | Proposed | 2026-10-15 |
| [0006](docs/adr/0006-deploy-to-github-pages-on-version-tags.md) | Deploy to GitHub Pages on `v*` tags at flashcards.pearpages.com | Proposed | 2026-10-15 |
| [0007](docs/adr/0007-vitest-for-unit-tests.md) | Vitest for unit tests, CI on push and pull requests | Proposed | 2026-10-15 |
| [0008](docs/adr/0008-accessibility-deck-facets.md) | Accessibility deck: kind and who-it-helps filters, WCAG level as a badge | Proposed | 2026-10-20 |
| [0009](docs/adr/0009-decks-declare-their-platforms.md) | Decks declare their own platform columns (`platforms` in `deck.json`) | Proposed | 2026-10-20 |
| [0010](docs/adr/0010-web-security-deck-facets.md) | Web security deck: area and kind filters, OWASP Top 10 (2025) as a badge | Proposed | 2026-10-20 |
| [0011](docs/adr/0011-web-performance-deck-facets.md) | Web performance deck: area and kind filters, the metric it improves as a badge | Proposed | 2026-10-20 |
| [0012](docs/adr/0012-card-drawings-as-separate-files.md) | Card drawings are separate files, not inlined as data URIs | Proposed | 2026-10-20 |
| [0013](docs/adr/0013-css-deck-facets.md) | CSS deck: area and kind filters, Baseline status as a badge | Proposed | 2026-10-20 |

## Format

```md
# NNNN. Title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded by NNNN

## Context
What forces the choice.

## Decision
What we do.

## Consequences
What gets better (+) and what it costs (−).
```
