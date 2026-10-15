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

const VARIANTS = ["mobile", "ios", "android"] as const;
type Variant = (typeof VARIANTS)[number];

export type CardImages = Partial<Record<"desktop" | Variant, string>>;

// "<id>.svg" is the default image; "<id>.mobile.svg", "<id>.ios.svg" and
// "<id>.android.svg" are optional variants shown next to it.
const imagesByDeck: Record<string, Record<string, CardImages>> = {};
for (const [path, url] of Object.entries(imageModules)) {
  const [deckId, , file] = segments(path);
  const name = file.slice(0, -".svg".length);
  const variant = VARIANTS.find((v) => name.endsWith(`.${v}`));
  const cardId = variant ? name.slice(0, -(variant.length + 1)) : name;
  imagesByDeck[deckId] ??= {};
  imagesByDeck[deckId][cardId] ??= {};
  imagesByDeck[deckId][cardId][variant ?? "desktop"] = url;
}

export function getCardImages(deckId: string, cardId: string): CardImages {
  return imagesByDeck[deckId]?.[cardId] ?? {};
}
