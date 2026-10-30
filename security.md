# Security

The security surface of Flashcards and the rules that protect it. General
rules are in [principles.md](principles.md); how the pieces fit in
[architecture.md](architecture.md). Update this file whenever the surface changes (new
input, endpoint, secret, dependency, permission).

## Reporting a vulnerability

Use GitHub's private vulnerability reporting on
[pearpages/flashcards](https://github.com/pearpages/flashcards) (Security → Report a
vulnerability). Never open a public issue for an unfixed vulnerability. Private
reporting is enabled, and the issue form links to it.

## Surface

A static single-page app with no backend, accounts, cookies or network calls of its own.
Its only storage is the list of cards a learner hid, in `localStorage`. Everything it shows is bundled at build time from `src/decks/`.

- **URL hash** (`#/<deck>/card/<id>`, `#/<deck>/browse`, legacy `#card/<id>`): untrusted
  input. Deck and card ids are looked up among the bundled decks; unknown decks show the
  picker, unknown cards fall back to the first card, and ids are escaped with
  `CSS.escape` before reaching a selector.
- **Search field and filters:** local only; the query filters an in-memory list.
- **localStorage** (`flashcards:hidden:<deckId>`): card ids only, nothing personal. Read
  as untrusted: invalid JSON, non-arrays and ids that aren't bundled cards are dropped, and
  blocked or full storage is caught (nothing is hidden, the app still works). The ids are
  only compared with card ids, never rendered or put in a selector.
- **Rendering:** all card text is rendered as React text (escaped); there is no
  `dangerouslySetInnerHTML`. SVG drawings are loaded through `<img>`, so scripts inside an
  SVG would not run.
- **Deck data:** authored in the repo and reviewed like code; `pnpm validate` checks its
  shape, not its intent.

## Secrets

- None. The app and its build use no API keys or tokens.
- `.env*` files are gitignored; an example file (`.env.example`) would list names only.
- CI (`ci.yml`) runs with a read-only `GITHUB_TOKEN`, including on pull requests from
  forks, and has no secrets to leak.
- GitHub Pages deploys with the workflow's `GITHUB_TOKEN` (`contents: read`, `pages: write`,
  `id-token: write`) only. No stored secrets.
- Anyone who can push a `v*` tag can publish the site; only the repository owner can push.

## Dependencies

- Runtime: `react`, `react-dom`, `framer-motion`, and `@pearpages/credit` (the owner's
  shared footer: one stylesheet and a small React component). Everything else is build-time tooling
  (including `vitest` for tests).
- `pnpm-lock.yaml` is the committed lockfile; the GitHub workflow installs with
  `--frozen-lockfile`.
- The deploy workflow uses GitHub's own actions plus `pnpm/action-setup`, pinned to major
  versions (not commit SHAs).
- No automated update or audit yet; run `pnpm audit` before releases and when adding a
  dependency.

## Known risks

- **Actions pinned to major tags.** A compromised action release could alter the published
  site. Accepted for now; pin to commit SHAs if the site gains users.
