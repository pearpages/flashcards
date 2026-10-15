import { describe, expect, it } from "vitest";
import { parseRoute } from "./route";

describe("parseRoute", () => {
  it("shows the deck picker for an empty hash", () => {
    expect(parseRoute("design-system", "")).toEqual({ view: "study" });
    expect(parseRoute("design-system", "#/")).toEqual({ view: "study" });
  });

  it("studies a deck from its first card", () => {
    expect(parseRoute(undefined, "#/design-system")).toEqual({
      deckId: "design-system",
      view: "study",
    });
  });

  it("opens a card and the browse list", () => {
    expect(parseRoute(undefined, "#/design-system/card/sheet")).toEqual({
      deckId: "design-system",
      view: "study",
      cardId: "sheet",
    });
    expect(parseRoute(undefined, "#/design-system/browse")).toEqual({
      deckId: "design-system",
      view: "browse",
    });
  });

  it("falls back to the deck when the card id is missing", () => {
    expect(parseRoute(undefined, "#/design-system/card")).toEqual({
      deckId: "design-system",
      view: "study",
    });
  });

  it("decodes encoded ids", () => {
    expect(parseRoute(undefined, "#/my%20deck/card/a%2Fb").cardId).toBe("a/b");
  });

  it("opens legacy links in the default deck", () => {
    expect(parseRoute("design-system", "#card/tabs")).toEqual({
      deckId: "design-system",
      view: "study",
      cardId: "tabs",
    });
    expect(parseRoute("design-system", "#browse")).toEqual({
      deckId: "design-system",
      view: "browse",
    });
  });
});
