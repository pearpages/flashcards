import type { Deck, Flashcard } from "../types";

type DeckMeta = Omit<Deck, "cards">;

const metaModules = import.meta.glob<DeckMeta>("./*/deck.json", {
  eager: true,
  import: "default",
});
const cardModules = import.meta.glob<Flashcard[]>("./*/cards.json", {
  eager: true,
  import: "default",
});
const imageModules = import.meta.glob<string>("./*/images/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

// "./design-system/images/tabs.svg" -> ["design-system", "images", "tabs.svg"]
const segments = (path: string) => path.slice(2).split("/");

export const decks: Deck[] = Object.entries(metaModules)
  .map(([path, meta]) => {
    const folder = segments(path)[0];
    return { ...meta, cards: cardModules[`./${folder}/cards.json`] ?? [] };
  })
  .sort((a, b) => a.title.localeCompare(b.title));

const imagesByDeck: Record<string, Record<string, string>> = {};
for (const [path, url] of Object.entries(imageModules)) {
  const [deckId, , file] = segments(path);
  imagesByDeck[deckId] ??= {};
  imagesByDeck[deckId][file.slice(0, -".svg".length)] = url;
}

export function getCardImage(deckId: string, cardId: string): string | undefined {
  return imagesByDeck[deckId]?.[cardId];
}
