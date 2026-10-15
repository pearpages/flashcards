# 0002. Decks are self-describing data folders

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

The app started as one generic deck in `src/flashcards.json` with hard-coded filters
(category, atomic level). Growing the deck, or adding another topic, meant editing types and
components. Card data isn't type-checked, so a typo could break the app silently.

## Decision

- Each deck is a folder `src/decks/<deck-id>/` with `deck.json` (title, description,
  `facets`), `cards.json` and `images/`. `src/decks/index.ts` discovers folders with
  `import.meta.glob`; a deck picker appears when there is more than one.
- The deck declares its facets (key, label, values, optional `"filter": false` for a
  badge-only facet). Filter rows, badges and browse sections are rendered from them; the
  first facet with a filter row groups the browse list.
- Cards carry generic `facets` plus `summary`, `description`, optional `aliases` and
  `platforms`.
- `scripts/validate-decks.mjs` checks every deck and runs before `pnpm build`.

## Consequences

+ Adding cards or a whole deck is a data change; no component knows facet names.
+ Bad data fails the build with a clear message instead of a broken page.
− Facet values are plain strings, so typos are caught by the validator, not TypeScript.
− Value-specific styling (e.g. atomic colours in `Tag.css`) lives in CSS by value name.
