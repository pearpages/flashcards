# 0012. Card drawings are separate files, not inlined

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

Vite inlines assets under 4 kB as data URIs, which covered almost every card drawing. With
five decks (618 SVGs, ~860 kB of SVG text) the single JS bundle reached ~1.8 MB (~337 kB
gzipped), and the home screen downloaded every deck's drawings before anyone picked one.

Options considered:

1. **Stop inlining SVGs** (`build.assetsInlineLimit`): each drawing is its own hashed file,
   fetched when shown.
2. **Split each deck into its own chunk** (cards and drawings loaded on entering a deck):
   smaller first load still, but `decks/index.ts`, `App` and `DeckView` become async and
   the picker needs card counts and preview drawings without loading the cards.
3. **Keep inlining**, accept the size.

## Decision

Option 1. SVGs are never inlined; other small assets keep Vite's default. Browse
thumbnails get `loading="lazy"` so a long list only fetches what scrolls into view.

## Consequences

+ The JS drops to ~670 kB (~210 kB gzipped); drawings load on demand and, with hashed
  names, cache forever.
+ No change to how decks are written or loaded (P1, ADR-0002 unchanged).
− More requests: a study screen or a browse list fetches its drawings individually
  (cheap over HTTP/2 on GitHub Pages).
− Card text for every deck is still in the main bundle; option 2 remains open if that
  grows.
