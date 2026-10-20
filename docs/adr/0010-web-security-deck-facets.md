# 0010. Web security deck: area and kind filters, OWASP Top 10 (2025) as a badge

- **Date:** 2026-10-20
- **Status:** Proposed

## Context

The fourth deck covers attacks, the defences against them and the browser and protocol
mechanisms both rely on. Learners want to study one area at a time (everything about
sessions) and to tell attacks from defences. The OWASP Top 10 is the shared vocabulary for
web risk, but filtering by ten categories would add a long chip row, and the 2025 edition
reshuffled categories (SSRF folded into A01; A03 is now Software Supply Chain Failures;
A10 is Mishandling of Exceptional Conditions). Every card must carry a value for every
facet.

## Decision

- **Area** (injection, browser, auth, sessions, transport, data, supply-chain,
  infrastructure) groups the browse list.
- **Kind** (attack, defence, mechanism) is a second filter. A mechanism is a standard or
  browser feature that is neither an attack nor a defence on its own (same-origin policy,
  OAuth, TLS).
- **OWASP** is a badge without a filter row: the 2025 category an attack belongs to, or
  the one a defence or mechanism mainly protects against. Values carry the number and a
  short name (`a05-injection`) so the badge reads on its own.
- No `platforms` columns: the useful equivalents would be per framework, and those names
  change too often to keep accurate. A deck can add them later in `deck.json`.

## Consequences

+ Study by area, or only attacks, with the OWASP risk always visible.
+ Uses the current OWASP edition, so it matches what auditors and scanners report.
− One OWASP category per card simplifies defences that cover several risks.
− When OWASP publishes a new edition, the badge values need a pass.
