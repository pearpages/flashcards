# 0015. Essential cards as a card field, hidden cards in localStorage

- **Date:** 2026-10-30
- **Status:** Proposed

## Context

Decks have grown to 100+ cards each. Learners want to spend most of their time on the 20% of
concepts that matter most ("must know"), and to stop seeing cards they already know. Both
apply to every deck in the same way, unlike facets, which differ per deck. Until now the app
stored nothing: a reload started from the URL hash.

## Decision

- **Essential** is an optional card field, `"essential": true`, not a facet. Every deck
  marks about a fifth of its cards (`pnpm validate` warns outside 10–30%). Essential cards
  are painted a subtle gold on both faces with a ★ before the title (no badge; screen
  readers get "Essential card"), get a ★ in the browse list and a count on the deck
  picker. A ★ toggle in the header next to Study/Browse (★ alone on phones, "★ Essentials"
  on desktop) keeps only them, in study and browse; it takes no filter row, so the card
  keeps its height on phones.
- **Hidden cards** (the labelled "✓ Hide" button under the card, or `H`) leave the study stack. They are kept
  per deck in `localStorage` under `flashcards:hidden:<deckId>` as a JSON array of card
  ids. Browse still lists them, faded, with an Unhide button; once any are hidden, a
  counter appears in the header next to ★ (eye icon and count on phones, "Hidden · N" on
  desktop) and toggles studying them; on a hidden card the button reads "↺ Unhide". A five-second Undo follows each hide.
- Stored data is read as untrusted: anything that isn't an id of a bundled card is dropped,
  and blocked or failing storage means nothing is hidden.

## Consequences

+ One generic field works in every deck with no component naming a facet (P2 holds).
+ Hiding survives reloads with no backend, account or cookie; nothing leaves the browser.
− Hidden cards don't sync between devices or browsers, and clearing site data unhides them.
− Which cards are essential is an editorial judgement and needs review like card content.
− Renaming a card id silently unhides it for people who had hidden it.
