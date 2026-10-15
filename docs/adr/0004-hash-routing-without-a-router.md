# 0004. Hash routing without a router library

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

The browse view needed shareable links to a card and a working Back button. The app is a
static site on GitLab Pages (no server rewrites) with a handful of routes: the deck picker,
and per deck the list and a card.

## Decision

- The URL hash is the route: empty for the deck picker, `#/<deck>` to study a deck,
  `#/<deck>/card/<id>` for a card and `#/<deck>/browse` for the list. `src/route.ts`
  parses and writes it with `history.pushState` / `replaceState`.
- Entering or leaving a deck, picking a card or switching views pushes a history entry;
  swiping replaces the hash so history isn't flooded. `popstate` restores the deck, the
  view and the card.
- Links from before the deck picker (`#card/<id>`, `#browse`) still open the first deck.

## Consequences

+ No dependency, works on any static host, links survive reloads.
− Routing logic (relaxing filters on Back, open and entry counters) lives in `App.tsx` and
  `DeckView.tsx` by hand.
− The card id from the hash is untrusted input (see [security.md](../../security.md)).
