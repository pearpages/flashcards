# Security

The security surface of Design System Flashcards and the rules that protect it. General
rules are in [principles.md](principles.md); how the pieces fit in
[architecture.md](architecture.md). Update this file whenever the surface changes (new
input, endpoint, secret, dependency, permission).

## Reporting a vulnerability

Use GitHub's private vulnerability reporting on
[pearpages/flashcards](https://github.com/pearpages/flashcards) (Security → Report a
vulnerability). Never open a public issue for an unfixed vulnerability.
TODO: enable private vulnerability reporting in the repository settings (tracked in
[tasks.md](tasks.md)).

## Surface

A static single-page app with no backend, accounts, cookies, storage or network calls of
its own. Everything it shows is bundled at build time from `src/decks/`.

- **URL hash** (`#browse`, `#card/<id>`): untrusted input. The id is looked up among the
  deck's cards; unknown ids fall back to the first card.
- **Search field and filters:** local only; the query filters an in-memory list.
- **Rendering:** all card text is rendered as React text (escaped); there is no
  `dangerouslySetInnerHTML`. SVG drawings are loaded through `<img>`, so scripts inside an
  SVG would not run.
- **Deck data:** authored in the repo and reviewed like code; `pnpm validate` checks its
  shape, not its intent.

## Secrets

- None. The app and its build use no API keys or tokens.
- `.env*` files are gitignored; an example file (`.env.example`) would list names only.
- GitLab Pages deploys with the CI job's built-in permissions; no stored secrets.

## Dependencies

- Runtime: `react`, `react-dom`, `framer-motion`. Everything else is build-time tooling.
- `pnpm-lock.yaml` is the committed lockfile; CI installs with pnpm.
- No automated update or audit yet; run `pnpm audit` before releases and when adding a
  dependency.

## Known risks

- **Crafted `#card/<id>` link can blank the page.** The hash id reaches
  `querySelector(`[data-card-id="${id}"]`)` in `BrowseView.tsx` unescaped; an id with a
  quote or bracket makes the selector invalid, the call throws inside an effect, and with
  no error boundary React unmounts the app. Impact is limited to the visitor who opens the
  link (no injection, no data). Fix tracked in [tasks.md](tasks.md): escape with
  `CSS.escape`, or only use ids that exist in the deck.
- **CI uses floating versions.** `.gitlab-ci.yml` uses `node:22-alpine` and
  `pnpm@latest`, so a deploy can pick up a new pnpm or base image unannounced. Accepted for
  now because deploys are manual and the output is static.
