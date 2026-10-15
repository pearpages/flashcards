// The URL hash mirrors where the user is, so links can be shared and Back works:
//   #browse          → the component list (mobile)
//   #card/<card-id>  → studying that card
//   (empty)          → studying, first card
export type View = "study" | "browse";

export interface Route {
  view: View;
  cardId?: string;
}

export function parseRoute(hash: string = window.location.hash): Route {
  const path = hash.replace(/^#\/?/, "");
  if (path === "browse") return { view: "browse" };
  if (path.startsWith("card/")) return { view: "study", cardId: decodeURIComponent(path.slice(5)) };
  return { view: "study" };
}

function toUrl(route: Route): string {
  if (route.view === "browse") return "#browse";
  if (route.cardId) return `#card/${encodeURIComponent(route.cardId)}`;
  return window.location.pathname + window.location.search;
}

/** Adds a history entry (Back returns to the previous route). */
export function pushRoute(route: Route) {
  window.history.pushState(null, "", toUrl(route));
}

/** Updates the URL in place, e.g. while swiping through cards. */
export function replaceRoute(route: Route) {
  window.history.replaceState(null, "", toUrl(route));
}
