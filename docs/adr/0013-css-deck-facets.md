# 0013. CSS deck: area and kind filters, Baseline status as a badge

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

The sixth deck covers CSS from the cascade to architecture. Learners study one area at a
time (grid, colour) and, for any feature, need to know two things: what kind of thing it
is (a property, a selector, a function, an at-rule) and whether they can ship it today.
The web platform answers the second question with Baseline (web-features): *widely
available* (in all core browsers for 30 months), *newly available* (in all core browsers
recently) or *limited availability*. Layout maps closely onto native UI layout, which the
other UI decks already pair with SwiftUI and Compose.

## Decision

- **Area** (cascade, selectors, box-model, flexbox, grid, positioning, responsive,
  typography, colour, motion, architecture) groups the browse list.
- **Kind** (concept, property, selector, function, at-rule, pattern) is a second filter.
- **Baseline** is a badge without a filter row: `baseline-widely`, `baseline-newly` or
  `limited`. Concepts and patterns that aren't one feature carry the status of what they
  rely on (usually widely available).
- `platforms` declares **SwiftUI** and **Compose** columns (ADR-0009), filled only where a
  layout or styling primitive clearly corresponds.

## Consequences

+ Every card says whether the feature is safe to use without a fallback.
+ Layout cards link web and native mental models.
− Baseline statuses change as browsers ship: newly available features become widely
  available 30 months later and limited ones get promoted, so the badge needs a periodic
  pass against web-features data.
