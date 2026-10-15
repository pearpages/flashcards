# 0004. Hash routing without a router library

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

The browse view needed shareable links to a card and a working Back button. The app is a
static site on GitLab Pages (no server rewrites) with only two routes: the list and a card.

## Decision

- The URL hash is the route: `#browse`, `#card/<id>`, or empty for studying.
  `src/route.ts` parses and writes it with `history.pushState` / `replaceState`.
- Picking a card or switching views pushes a history entry; swiping replaces the hash so
  history isn't flooded. `popstate` restores the view and the card.

## Consequences

+ No dependency, works on any static host, links survive reloads.
− Routing logic (relaxing filters on Back, open counters) lives in `App.tsx` by hand.
− The card id from the hash is untrusted input (see [security.md](../../security.md)).
