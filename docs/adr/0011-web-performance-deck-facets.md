# 0011. Web performance deck: area and kind filters, the metric it improves as a badge

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

The fifth deck covers metrics, the browser mechanisms behind them, techniques and common
anti-patterns. Learners study one layer at a time (network, rendering) and need to tell a
fix from a mistake. Performance work is judged by Core Web Vitals (LCP, INP, CLS), so every
card should say which number it moves. Every card must carry a value for every facet.

## Decision

- **Area** (metrics, measurement, network, server, caching, loading, assets, javascript,
  rendering) groups the browse list, roughly in the order a request travels.
- **Kind** (metric, mechanism, technique, anti-pattern) is a second filter. Anti-patterns
  get their own value because "what not to do" (render-blocking scripts, layout
  thrashing, lazy-loading the LCP image) is half of the craft.
- **Improves** is a badge without a filter row: the metric a card mainly moves (lcp, inp,
  cls, fcp, ttfb) or `page-weight` for cards that mostly cut bytes. Metric cards carry
  their own metric.
- No `platforms` columns.

## Consequences

+ Every card ties back to a number users and Search measure.
+ Anti-patterns are easy to drill on their own.
− One metric per card simplifies techniques that help several (a CDN helps TTFB, FCP and
  LCP; the badge says TTFB).
