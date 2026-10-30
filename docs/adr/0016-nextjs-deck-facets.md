# 0016. Next.js deck: area and kind filters, where it runs as a badge

- **Date:** 2026-10-30
- **Status:** Proposed

## Context

The eighth deck covers the questions Next.js interviews and code reviews ask, for the App
Router in current Next.js (16: `proxy.ts`, Cache Components and `"use cache"`, Turbopack by
default). Learners need to study one area at a time, separate APIs and file conventions from
concepts and pitfalls, and know where each piece of code runs, the source of most Next.js
confusion.

## Decision

- **Area** (routing, rendering, data, caching, mutations, proxy, assets, metadata, config,
  deploy) groups the browse list.
- **Kind** (concept, api, file-convention, practice, pitfall) is a second filter.
- **Runs on** is a badge without a filter row: `server`, `client`, `edge`, `build` or `any`.
- No `platforms` columns. Pages Router counterparts and older names (`middleware.ts`,
  `getServerSideProps`) go in `aliases`, so search still finds them.

## Consequences

+ Each card says where its code runs, which answers many "why doesn't this work" questions.
+ Pitfalls (secrets in `NEXT_PUBLIC_`, auth only in proxy, hydration mismatches) are easy to drill.
− App Router only: Pages Router codebases get aliases, not their own cards.
− Next.js changes defaults often (caching flipped in 15 and again in 16), so the deck needs a
  pass on every major release.
