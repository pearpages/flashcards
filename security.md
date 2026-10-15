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

- **URL hash** (`#/<deck>/card/<id>`, `#/<deck>/browse`, legacy `#card/<id>`): untrusted
  input. Deck and card ids are looked up among the bundled decks; unknown decks show the
  picker, unknown cards fall back to the first card, and ids are escaped with
  `CSS.escape` before reaching a selector.
- **Search field and filters:** local only; the query filters an in-memory list.
- **Rendering:** all card text is rendered as React text (escaped); there is no
  `dangerouslySetInnerHTML`. SVG drawings are loaded through `<img>`, so scripts inside an
  SVG would not run.
- **Deck data:** authored in the repo and reviewed like code; `pnpm validate` checks its
  shape, not its intent.

## Secrets

- None. The app and its build use no API keys or tokens.
- `.env*` files are gitignored; an example file (`.env.example`) would list names only.
- GitHub Pages deploys with the workflow's `GITHUB_TOKEN` (`contents: read`, `pages: write`,
  `id-token: write`) only. No stored secrets.
- Anyone who can push a `v*` tag can publish the site; only the repository owner can push.

## Dependencies

- Runtime: `react`, `react-dom`, `framer-motion`. Everything else is build-time tooling.
- `pnpm-lock.yaml` is the committed lockfile; the GitHub workflow installs with
  `--frozen-lockfile`.
- The deploy workflow uses GitHub's own actions plus `pnpm/action-setup`, pinned to major
  versions (not commit SHAs).
- No automated update or audit yet; run `pnpm audit` before releases and when adding a
  dependency.

## Known risks

- **Actions pinned to major tags.** A compromised action release could alter the published
  site. Accepted for now; pin to commit SHAs if the site gains users.
