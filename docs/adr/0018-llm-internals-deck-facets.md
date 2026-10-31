# 0018. LLM Internals deck: area and kind filters, training phase as a badge

- **Date:** 2026-10-31
- **Status:** Proposed

## Context

The tenth deck explains how LLMs work inside: tokenization, transformer architecture,
attention, training, alignment, inference, efficiency, scaling and interpretability. It is
split from LLM Engineering ([ADR-0017](0017-llm-engineering-deck-facets.md)) because these
cards have no provider feature to put in platform columns, and mixing them would leave half
the cells empty. A common confusion is *when* something happens: during pretraining, during
post-training, or each time the model generates.

## Decision

- **Area** (tokens, architecture, attention, training, alignment, inference, efficiency,
  scaling, interpretability) groups the browse list.
- **Kind** (concept, component, technique, phenomenon) is a second filter: phenomenon
  covers observed behaviours like attention sinks, reward hacking or grokking.
- **Happens in** is a badge without a filter row: `pretraining`, `post-training`,
  `inference` or `any` (architecture that applies throughout).
- No `platforms` columns.

## Consequences

+ Cards tie internals to visible behaviour (tokenizer blind spots, sycophancy, non-determinism),
  so the deck stays useful to engineers, not just researchers.
+ The phase badge separates training-time from inference-time ideas at a glance.
− Research moves quickly; claims about mechanisms (hallucination, CoT faithfulness, MoE
  details) need a review against current papers.
