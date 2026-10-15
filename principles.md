# Principles

Every change to this repository, whether code, docs, tests or process, complies with these
rules. When a change would break one, stop and ask the user instead of working around it.
Changing a principle is itself a decision: it needs the user's agreement and an ADR
([decisions.md](decisions.md)). How things are built is in
[architecture.md](architecture.md); security rules in [security.md](security.md).

Each rule has a **Why**, and a **Check** where something enforces it (a test, lint rule,
CI step, hook).

## Deck data

**P1. Content is data.** Adding a card, a deck, a filter or an image means editing files in
`src/decks/<deck>/` (`deck.json`, `cards.json`, `images/`) — never component code.
*Why:* anyone can grow a deck by editing JSON; the app discovers decks with
`import.meta.glob`. *Check:* review; `src/decks/index.ts` is the only loader.
[ADR-0002](docs/adr/0002-decks-are-self-describing-data-folders.md)

**P2. Components never name a facet.** Filter rows, card badges and browse grouping come
from `deck.json` `facets` (grouping uses the first facet with a filter row); no component
mentions `purpose`, `layer` or `atomic`.
*Why:* a second deck can bring its own facets without code changes. *Check:* review —
`grep -rn "purpose\|atomic" src/components src/App.tsx` finds only explanatory comments.
Styling a facet *value* (e.g. `.tag--atom` colours in `Tag.css`) is fine; an unknown value
falls back to the neutral tag.

**P3. Deck data passes `pnpm validate`.** Ids are unique kebab-case; every facet value is
declared in `deck.json`; `summary` ≤ 90, `description` ≤ 280 and each platform name ≤ 60
characters, so text fits the card at 375px.
*Why:* JSON isn't type-checked, and long text overflowed the card back once.
*Check:* `scripts/validate-decks.mjs`, run by `pnpm build` (CI fails on errors).

**P4. Images are local SVGs named after the card.** `images/<id>.svg` is the desktop
drawing; optional `<id>.mobile.svg`, or an `<id>.ios.svg` + `<id>.android.svg` pair, go
next to it. No hotlinked images.
*Why:* hotlinked Wikimedia thumbnails broke when the host changed its rules.
*Check:* the validator warns on missing, orphan and unpaired images.
[ADR-0003](docs/adr/0003-local-svg-drawings-with-platform-variants.md)

## UI

**P5. Styles live in the component's `.css` file with block-element class names.** No
inline `style`, CSS-in-JS or style objects; dynamic states are modifier classes.
*Why:* keeps components readable and styles in one place. *Check:* review —
`grep -rn "style={{" src` should find nothing.

**P6. Mobile first, no horizontal page scroll at 375px.** Rows that can't fit (filter and
jump chips) scroll inside themselves; layouts widen at breakpoints (720px, 960px).
*Why:* the app is used on phones first. *Check:* review at 375px and desktop.

**P7. Every animation respects `prefers-reduced-motion`.** Card slides become cross-fades
and the flip becomes instant.
*Why:* motion can make people unwell. *Check:* review — animated components use
`useReducedMotion`.

**P8. Interactive things are real buttons with their state exposed.** Filters and toggles
use `aria-pressed`, the current card or section uses `aria-current`, and only the visible
card face is exposed to screen readers (`aria-hidden` on the other).
*Why:* the deck must work with a keyboard and a screen reader. *Check:* review.

## Code

**P9. TypeScript strict and lint-clean.** `strict`, `noUnusedLocals` and
`noUnusedParameters` stay on; ESLint (react-hooks, react-refresh) passes with no errors.
*Why:* catches mistakes before the browser does. *Check:* `pnpm build` (`tsc -b`),
`pnpm lint`.

## Process

**P10. Knowledge lives in its file.** How to work → `AGENTS.md`; rules → here; how it is
built → `architecture.md`; why → an ADR; work → `tasks.md`; risk → `security.md`.
*Why:* a session log in the agent file hides decisions from the next person.
[ADR-0001](docs/adr/0001-project-knowledge-files.md)
