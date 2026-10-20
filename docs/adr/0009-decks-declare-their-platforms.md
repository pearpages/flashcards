# 0009. Decks declare their own platform columns

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

Cards list equivalents on their back, but the code hard-coded two of them: `platforms`
allowed only `ios` and `android`, and `FlashCard` printed the labels "iOS" and "Android".
A system-design deck's useful equivalents are cloud services (AWS, GCP, Azure), so the
deck couldn't add them without component changes, against P1 and the spirit of P2.

Options considered:

1. **Deck-declared columns.** `deck.json` lists `platforms: [{ key, label }]`; cards keep
   `platforms: { <key>: "…" }`.
2. **Free-form pairs on each card** (`[{ label, value }]`). No deck config, but labels can
   drift between cards ("GCP" vs "Google Cloud") and nothing validates them.
3. **No equivalents for decks other than iOS/Android.** Least work, loses the most useful
   part of a cloud card.

## Decision

Option 1. A deck declares its platforms, in display order, in `deck.json`; the validator
rejects a card key that isn't declared; the card back shows one row per declared
platform the card fills; search covers every value. The field keeps its name
`platforms` (cloud providers are platforms too), so existing card data is unchanged.
Drawing variants (`<id>.ios.svg` / `<id>.android.svg`) are separate and stay as they are.

## Consequences

+ A new deck brings its own columns with no code change.
+ Labels are written once per deck and can't drift.
− Every deck with equivalents must declare them; the two existing decks now list iOS and
  Android in `deck.json`.
