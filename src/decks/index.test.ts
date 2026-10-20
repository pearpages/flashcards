import { describe, expect, it } from "vitest";
import { decks, getCardImages } from "./index";

describe("decks", () => {
  it("discovers the design-system deck with its cards", () => {
    const deck = decks.find((d) => d.id === "design-system");
    expect(deck).toBeDefined();
    expect(deck!.cards.length).toBeGreaterThan(100);
  });

  it("discovers the accessibility deck with a drawing for every card", () => {
    const deck = decks.find((d) => d.id === "accessibility");
    expect(deck).toBeDefined();
    expect(deck!.cards.length).toBeGreaterThan(40);
    for (const card of deck!.cards) expect(getCardImages(deck!.id, card.id).desktop).toBeTruthy();
  });

  it("gives every card a unique id", () => {
    for (const deck of decks) {
      const ids = deck.cards.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe("getCardImages", () => {
  it("groups desktop and mobile drawings by card", () => {
    const images = getCardImages("design-system", "action-bar");
    expect(images.desktop).toBeTruthy();
    expect(images.mobile).toBeTruthy();
  });

  it("finds iOS and Android pairs", () => {
    const images = getCardImages("design-system", "action-sheet");
    expect(images.ios).toBeTruthy();
    expect(images.android).toBeTruthy();
  });

  it("returns nothing for unknown decks and cards", () => {
    expect(getCardImages("nope", "sheet")).toEqual({});
    expect(getCardImages("design-system", "nope")).toEqual({});
  });
});
