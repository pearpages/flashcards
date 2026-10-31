import { describe, expect, it } from "vitest";
import { countActive, facetCounts, matchesFilters, relaxFilters } from "./filters";
import type { Facet, Flashcard } from "./types";

const card = (id: string, kind: string, level: string): Flashcard => ({
  id,
  title: id,
  facets: { kind, level },
  summary: "",
  description: "",
});

const cards = [card("a", "pattern", "a"), card("b", "pattern", "aa"), card("c", "role", "a")];
const kind: Facet = { key: "kind", label: "Kind", values: ["pattern", "role", "technique"] };

describe("matchesFilters", () => {
  it("matches when every set filter matches", () => {
    expect(matchesFilters(cards[0], { kind: "pattern", level: null })).toBe(true);
    expect(matchesFilters(cards[0], { kind: "role" })).toBe(false);
  });

  it("ignores the skipped facet", () => {
    expect(matchesFilters(cards[0], { kind: "role", level: "a" }, "kind")).toBe(true);
  });
});

describe("relaxFilters", () => {
  it("clears only the filters the card doesn't match", () => {
    expect(relaxFilters({ kind: "role", level: "a" }, cards[0])).toEqual({ kind: null, level: "a" });
  });
});

describe("countActive", () => {
  it("counts the set filters", () => {
    expect(countActive({ kind: "role", level: null })).toBe(1);
    expect(countActive({})).toBe(0);
  });
});

describe("facetCounts", () => {
  it("counts each value under the other facets' filters", () => {
    expect(facetCounts(cards, kind, { kind: "role", level: "a" })).toEqual({ pattern: 1, role: 1, technique: 0 });
    expect(facetCounts(cards, kind, {})).toEqual({ pattern: 2, role: 1, technique: 0 });
  });
});
