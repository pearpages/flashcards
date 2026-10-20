# 0014. Testing deck: area and kind filters, test level as a badge

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

The seventh deck covers how you know software works and keeps working: strategy, test
doubles, every test level, API and non-functional testing, CI and suite maintenance. The
other decks assume this discipline (query by role, budgets in CI, dependency scanning)
without teaching it. Learners need to study one area at a time, separate good practice
from anti-patterns, and know where on the testing trophy a card sits. Concrete tool names
help, but the deck must not become a Vitest manual.

## Decision

- **Area** (strategy, unit, doubles, integration, api, ui, e2e, non-functional, ci,
  maintenance) groups the browse list.
- **Kind** (concept, practice, technique, anti-pattern) is a second filter.
- **Level** is a badge without a filter row: `static`, `unit`, `integration`, `e2e`, or
  `any` for cards that apply at every level (naming, flakiness, AAA).
- `platforms` declares **JavaScript** (Vitest, Testing Library, Playwright) and **Python**
  (pytest and its common plugins) columns (ADR-0009), filled only where an API maps exactly.

## Consequences

+ Each card says where in the suite it lives and what it looks like in two ecosystems.
+ Anti-patterns (over-mocking, fixed sleeps, coverage as a target) are easy to drill.
− Two ecosystems only; Java, Go or .NET readers get no column.
− Tool APIs drift (Vitest and Playwright move fast), so the columns need a periodic pass.
