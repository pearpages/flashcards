# Flashcards

A mobile-first flashcard app with six decks (design system, CSS, accessibility, web
performance, web security, system design). Each deck is a data folder in `src/decks/`
with its own filters, badges, drawings and, where it declares them, platform equivalents
(iOS/Android, SwiftUI/Compose, AWS/GCP/Azure); all decks share one browse view and
study stack. It is a static React + Vite site; the source is public on GitHub, and
pushing a `v*` tag publishes it to GitHub Pages at flashcards.pearpages.com.

## Project documents — read before working

| File | Holds |
|---|---|
| [principles.md](principles.md) | The rules every change must follow |
| [architecture.md](architecture.md) | How the project is built: modules, data flow, build, deploy |
| [decisions.md](decisions.md) | Index of ADRs in `docs/adr/`: why each choice was made |
| [tasks.md](tasks.md) | Open work and the dated log of what was done |
| [security.md](security.md) | Threat surface, secrets, dependency policy, how to report a vulnerability |
| [LICENSE](LICENSE) | MIT |

[README.md](README.md) is the user-facing entry point.

## Working rules

1. **Read `principles.md` before changing code or docs.** If a change would break a
   principle, stop and ask; don't work around it.
2. **Every change updates `tasks.md`**: tick or add Open items, and add a dated line at the
   top of Done.
3. **A structural or behavioural change updates `architecture.md` in the same commit**, and
   the README too when users can see it.
4. **A choice between real alternatives** (API shape, dependency, convention, process) gets
   a new ADR in `docs/adr/` plus a line in `decisions.md`. Propose it to the user before
   marking it Accepted. Never edit an accepted ADR; supersede it with a new one.
5. **Anything touching auth, secrets, input handling or dependencies is checked against
   `security.md`**, and updates it when the surface changes.
6. **At the end of a session, outcomes go to those files, not here.** This file keeps only
   how to work and pointers — never a session log.
7. Confirm before anything outward-facing: pushes, releases, publishing, deploys.

## Development commands

- `pnpm install`: install dependencies (pnpm is the package manager; `pnpm-lock.yaml` is the lockfile).
- `pnpm dev`: Vite dev server, also reachable from other devices on the network (`--host`).
- `pnpm validate`: check every deck's JSON and images (ids, facets, text lengths, image pairs).
- `pnpm build`: validate decks, type-check (`tsc -b`) and build to `dist/`.
- `pnpm lint`: ESLint over the repo.
- `pnpm preview`: serve the production build locally.
- `/release patch|minor|major` (skill in `.claude/skills/release/`): bump the version, tag
  `v*`, push and create the GitHub release; the tag deploys the site. Only from `main`.

- `pnpm test --run`: Vitest once (plain `pnpm test` starts watch mode). Tests sit next to
  the code as `*.test.ts`.

The checks are `pnpm validate`, `pnpm lint`, `pnpm test --run` and `pnpm build`; CI runs
them on every push to `main` and every pull request.

## Pitfalls that have bitten before

- **`mise ERROR No version is set for shim: pnpm`** → mise has no pnpm version selected for
  this directory → set one with `mise use pnpm@<version>`, or run the same script with
  `npm run <script>`.
- **Animations or scroll-spy look frozen when checked from automation** → Chrome pauses
  `requestAnimationFrame` and IntersectionObserver in background or headless tabs, so
  framer-motion springs and the jump-bar highlight never finish → verify motion in a
  foreground tab; in headless runs, check end states by setting them directly.
- **Headless screenshots at phone width look cut off** → headless Chrome won't lay out
  narrower than ~500px → load the app in a 375px `<iframe>` inside a wrapper page instead.
