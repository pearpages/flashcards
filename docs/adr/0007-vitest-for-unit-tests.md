# 0007. Vitest for unit tests, CI on push and pull requests

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

The project had no tests: `pnpm validate`, `tsc` and ESLint were the only checks, and CI
ran them only when a `v*` tag was pushed, so a broken `main` was found at release time.
Routing (`src/route.ts`) and deck discovery (`src/decks/index.ts`) are pure logic that
regress silently.

## Decision

- Use **Vitest** (it shares Vite's config and transforms, so `import.meta.glob` works in
  tests) in the node environment, with `*.test.ts` files next to the code they test.
- `pnpm test` is Vitest; one-shot runs use `pnpm test --run`.
- A `ci.yml` workflow runs lint, tests and build on every push to `main` and every pull
  request; the deploy workflow runs the tests too.

Alternatives: Jest (needs a separate transform setup for Vite features), Node's built-in
test runner (no `import.meta.glob`, no TS without a loader).

## Consequences

+ Regressions in routing and deck loading fail CI before a release.
+ Same toolchain as the app; no extra config file.
− No component (DOM) tests yet; adding them needs jsdom or a browser runner.
− One more dev dependency to keep updated.
