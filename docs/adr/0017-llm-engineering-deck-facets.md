# 0017. LLM Engineering deck: area and kind filters, stage as a badge, model providers as platforms

- **Date:** 2026-10-31
- **Status:** Proposed

## Context

The ninth deck covers building applications on LLMs: prompting, context, tool use,
retrieval, agents, evals, safety, cost and deploys. Most of these techniques are offered as
a named feature by each big model provider, under a different name (prompt caching vs
context caching, tool use vs function calling). Learners need to study one area at a time,
to tell concepts from techniques, patterns and pitfalls, and to know when a technique
starts to matter so they don't over-engineer a prototype.

LLM theory (attention, training, quantization) was considered for the same deck but has no
provider feature to compare, so it got its own deck ([ADR-0018](0018-llm-internals-deck-facets.md)).

## Decision

- **Area** (models, prompting, context, tools, retrieval, agents, evals, safety, cost,
  deploy) groups the browse list.
- **Kind** (concept, technique, pattern, pitfall) is a second filter.
- **Matters at** is a badge without a filter row: `prototype`, `production` or `scale`.
- **Platforms** are `anthropic`, `openai` and `google` (Gemini API / Vertex AI), filled only
  where a provider has a named feature for the card.

## Consequences

+ One card answers "what is it called on the API I use", like the cloud columns in system design.
+ The stage badge says when to bother, so beginners can study the prototype cards first.
− Provider features change fast and were written from memory; the platform cells need a
  check against current docs and a pass every few months.
− Other providers (Mistral, open-weights runtimes) get no column; they appear in text and aliases.
