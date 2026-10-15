// The URL hash mirrors where the user is, so links can be shared and Back works:
//   (empty) or #/                → the deck picker
//   #/<deck>                     → studying a deck, first card
//   #/<deck>/card/<card-id>      → studying that card
//   #/<deck>/browse              → the component list (mobile)
// Links from before decks had their own screen (#card/<id>, #browse) open the default deck.
export type View = "study" | "browse";

export interface Route {
  /** Undefined on the deck picker. */
  deckId?: string;
  view: View;
  cardId?: string;
}

export function parseRoute(defaultDeckId?: string, hash: string = window.location.hash): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);

  // Legacy links
  if (parts[0] === "browse") return { deckId: defaultDeckId, view: "browse" };
  if (parts[0] === "card") return { deckId: defaultDeckId, view: "study", cardId: parts[1] };

  const [deckId, section, cardId] = parts;
  if (!deckId) return { view: "study" };
  if (section === "browse") return { deckId, view: "browse" };
  if (section === "card" && cardId) return { deckId, view: "study", cardId };
  return { deckId, view: "study" };
}

function toUrl(route: Route): string {
  if (!route.deckId) return window.location.pathname + window.location.search;
  const deck = `#/${encodeURIComponent(route.deckId)}`;
  if (route.view === "browse") return `${deck}/browse`;
  if (route.cardId) return `${deck}/card/${encodeURIComponent(route.cardId)}`;
  return deck;
}

/** Adds a history entry (Back returns to the previous route). */
export function pushRoute(route: Route) {
  window.history.pushState(null, "", toUrl(route));
}

/** Updates the URL in place, e.g. while swiping through cards. */
export function replaceRoute(route: Route) {
  window.history.replaceState(null, "", toUrl(route));
}
