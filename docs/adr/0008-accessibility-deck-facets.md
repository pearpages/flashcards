# 0008. Accessibility deck: kind and who-it-helps filters, WCAG level as a badge

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

The second deck mixes very different things: ARIA widget patterns, roles, attributes,
techniques and WCAG success criteria. Learners want to group by what a card is, and to ask
"what matters for keyboard users?". Grouping by WCAG principle (perceivable, operable,
understandable, robust) was considered, but almost every ARIA card lands in robust, so it
barely filters. Every card must carry a value for every facet (`pnpm validate`).

## Decision

- **Kind** (pattern, role, attribute, technique, criterion) groups the browse list.
- **Helps most** (screen-reader, keyboard, low-vision, motor, cognitive, hearing,
  vestibular) is a second filter: the group of users a card matters most to.
- **WCAG level** (wcag-a, wcag-aa, wcag-aaa) is a badge without a filter row: the level of
  the main success criterion a card helps meet. Values carry the `wcag-` prefix so the badge
  reads as WCAG-AA rather than a bare "AA".
- Criteria list their number (`SC 1.4.3`) in `aliases`, so browse search finds them.
- `platforms` holds the SwiftUI and Compose equivalent, as in the design-system deck.

## Consequences

+ No component code changes: the deck is only data plus badge colours in `Tag.css`.
+ "Helps most" teaches who a technique is for, which WCAG principle wouldn't.
− One user group per card is a simplification; many cards help several.
− Roles and attributes all show WCAG-A (4.1.2 or 1.3.1), so the badge varies mostly among
  criteria and techniques.
