import type { Facet, FilterState, Flashcard } from "./types";

/** True when the card matches every set filter, ignoring `skipKey` (e.g. the grouping facet). */
export function matchesFilters(card: Flashcard, filters: FilterState, skipKey?: string) {
  return Object.entries(filters).every(
    ([key, value]) => key === skipKey || value === null || card.facets[key] === value,
  );
}

/** Keeps each filter only if the card still matches it, so the card is in the study deck. */
export function relaxFilters(filters: FilterState, card: Flashcard): FilterState {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value === null || card.facets[key] === value ? value : null]),
  );
}

/** How many filters are set (facet values only). */
export function countActive(filters: FilterState) {
  return Object.values(filters).filter((value) => value !== null).length;
}

/**
 * For each value of `facet`, how many of `cards` would be left if that value were picked,
 * keeping every other facet's filter as it is.
 */
export function facetCounts(cards: Flashcard[], facet: Facet, filters: FilterState): Record<string, number> {
  const counts: Record<string, number> = Object.fromEntries(facet.values.map((value) => [value, 0]));
  for (const card of cards) {
    if (!matchesFilters(card, filters, facet.key)) continue;
    const value = card.facets[facet.key];
    if (value in counts) counts[value] += 1;
  }
  return counts;
}
