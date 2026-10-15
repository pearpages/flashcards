# 0003. Local SVG drawings, with mobile and iOS/Android variants

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

Cards first used hotlinked Wikimedia thumbnails, which broke (HTTP 400) when Wikimedia
restricted thumbnail sizes. Generic components have no logo to show anyway, and many of
them look different on phones and between iOS and Android.

## Decision

- Every card has a hand-drawn wireframe `images/<id>.svg` (160×120, shared grey + accent
  palette) stored in the repo.
- Optional variants sit next to it and are found by file name: `<id>.mobile.svg` (60×120
  phone frame), or an `<id>.ios.svg` + `<id>.android.svg` pair when the platforms differ
  visibly. The pair replaces the mobile drawing; the card shows Desktop · iOS · Android.
- Native equivalents are text on the card (`platforms.ios` / `platforms.android`).

## Consequences

+ Images can't break from outside; drawings share one visual style.
+ Adding a variant is dropping in a file; the validator warns about orphans and half pairs.
− Every new card needs a drawing (or shows a `?` placeholder).
− Inlined SVGs grow the JS bundle (~750 kB, ~175 kB gzipped).
