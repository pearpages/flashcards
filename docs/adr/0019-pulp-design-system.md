# 0019. Build the UI on the pulp design system

- **Date:** 2026-10-31
- **Status:** Proposed

## Context

The UI was hand-styled: every component carried its own colours, radii and controls (chip
rows, toggles, an undo bar), with literal hex values spread over seven stylesheets. A mobile
redesign ("Flashcards: mobile redesign on pulp", a seven-screen canvas) was drawn on pulp,
the owner's design system: tokens (DTCG → CSS custom properties), a reset and base layer, and
accessible React components, published as `@pearpages/pulp-*`. The alternatives were to
restyle by hand to match the canvas, or to adopt pulp.

## Decision

Adopt pulp for v1.0.0:

- `@pearpages/pulp-css` (layer order, tokens, reset, base) and `@pearpages/pulp-tokens`
  replace the app's reset and literal colours; app CSS uses semantic tokens only
  (`--color-*`, `--space-*`, `--radius-*`, `--font-*`).
- `@pearpages/pulp-react` components replace hand-built controls: Button, IconButton,
  SegmentedControl (Study/Browse), Sheet (filters: bottom on phones, side panel from 960px),
  Chip, Switch, TextField, Progress, Badge, EmptyState and ToastProvider (one toast at a
  time, replacing the undo bar). `@pearpages/modals` comes with the Sheet.
- Each component's stylesheet is imported on its own in `src/index.css` (not the full
  `styles.css`); app styles are unlayered, so they win over pulp's layers, and only target the
  app's own classes.
- Fonts (Archivo, Instrument Sans, Geist Mono) are self-hosted from `@fontsource-variable/*`.
- The page is pinned to the light scheme (`data-scheme="light"`): the card drawings are
  drawn for a light background.
- Filters move from always-visible chip rows into a "Filter cards" sheet, which also holds
  the Essentials and known-cards switches; facet values are labelled with `valueLabel()`.

## Consequences

- + One source for colour, type, spacing and controls; the app restyles with pulp and gains
  its accessibility work (focus trap, live regions, radio-group view switch).
- + Matches the redesign canvas closely.
- − Four runtime packages more, plus fonts; CSS grows to ~170 kB (~25 kB gzipped) because
  pulp's tokens file carries every brand.
- − Toasts are pulp's Alert, not the canvas's dark toast; the look follows pulp.
- − Dark mode is off until the drawings work on a dark background.
- − Facet values no longer have per-value colours (`Tag.css` is gone): they read as a mono
  line on the card and in the list.
