import { useEffect, useRef, useState } from "react";
import "@pearpages/credit/credit.css";
import { Credit } from "@pearpages/credit/react";
import { decks } from "./decks";
import { parseRoute, pushRoute, type Route } from "./route";
import DeckPicker from "./components/DeckPicker";
import DeckView from "./components/DeckView";
import "./App.css";

// Legacy links (#card/<id>, #browse) predate decks, so they all point at design-system cards.
const LEGACY_DECK_ID = "design-system";
const defaultDeckId = decks.some((d) => d.id === LEGACY_DECK_ID) ? LEGACY_DECK_ID : decks[0]?.id;
const readRoute = () => parseRoute(defaultDeckId);

/** Chooses between the deck picker and a deck, following the URL. */
function App() {
  const [route, setRoute] = useState<Route>(readRoute);
  // Bumped every time a deck is entered so it starts fresh (first card, no filters).
  const [entryCount, setEntryCount] = useState(0);

  const deckIdRef = useRef(route.deckId);
  useEffect(() => {
    deckIdRef.current = route.deckId;
  }, [route.deckId]);

  useEffect(() => {
    const onPopState = () => {
      const next = readRoute();
      // Within the same deck, DeckView follows the URL itself
      if (next.deckId === deckIdRef.current) return;
      // Leaving a deck, or entering one (e.g. with Forward): a new visit starts fresh
      setRoute(next);
      setEntryCount((n) => n + 1);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const deck = decks.find((d) => d.id === route.deckId);

  if (!deck) {
    const openDeck = (deckId: string) => {
      const next: Route = { deckId, view: "study" };
      pushRoute(next);
      setRoute(next);
      setEntryCount((n) => n + 1);
    };
    return (
      <>
        <DeckPicker decks={decks} onSelect={openDeck} />
        <Credit />
      </>
    );
  }

  const goHome = () => {
    pushRoute({ view: "study" });
    setRoute({ view: "study" });
  };

  return (
    <>
      <DeckView
        key={`${deck.id}-${entryCount}`}
        deck={deck}
        initialView={route.view}
        initialCardId={route.cardId}
        onBack={goHome}
      />
      <Credit />
    </>
  );
}

export default App;
