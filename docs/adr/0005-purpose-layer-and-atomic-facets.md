# 0005. Purpose and layer filter the deck; atomic level is a badge

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

The design-system deck first had Category and Atomic filters, then Purpose, Layer and
Atomic. Category and Purpose were near-duplicates, and three filter rows crowded the phone
layout.

## Decision

- **Purpose** (typography, content, layout, actions, forms, navigation, overlays, feedback,
  data, utilities) replaces Category and groups the browse list.
- **Layer** (primitive, component, pattern) is a second filter.
- **Atomic** (atom, molecule, organism, template) stays on every card as a badge but has
  no filter row (`"filter": false`).

## Consequences

+ Two filter rows; the browse list and study order share one grouping.
+ Atomic level is still visible while studying.
− You can't filter by atomic level any more.
