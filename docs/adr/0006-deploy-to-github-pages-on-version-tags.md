# 0006. Deploy to GitHub Pages on version tags

- **Date:** 2026-10-15
- **Status:** Proposed

## Context

The site was published by a manual GitLab Pages job on `main`, on a GitLab host tied to a
work instance, while the source lives in a public GitHub repository. The app should live at
its own domain, `flashcards.pearpages.com`, and a release should be a deliberate act rather
than every merge.

## Decision

- Pushing a tag matching `v*` runs `.github/workflows/deploy.yml`, which lints, validates,
  type-checks and builds the app and publishes `dist/` to GitHub Pages. The workflow can
  also be started by hand.
- `public/CNAME` holds `flashcards.pearpages.com`; DNS has a CNAME to
  `pearpages.github.io`, and the custom domain is set in the repository's Pages settings.
- Merging to `main` does not deploy. The GitLab Pages job (`.gitlab-ci.yml`) is removed.

## Consequences

+ Releases are explicit and traceable to a tag; the site has a stable public domain.
+ No stored secrets: the workflow uses the short-lived `GITHUB_TOKEN`.
− The old GitLab Pages site is no longer updated.
− Anyone with push rights can publish by pushing a tag.
