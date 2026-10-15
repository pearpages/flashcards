import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Flashcard, FilterState } from "./types";
import { decks } from "./decks";
import { parseRoute, pushRoute, replaceRoute, type View } from "./route";
import { useMediaQuery } from "./hooks/useMediaQuery";
import CardStack from "./components/CardStack";
import DeckFilters from "./components/DeckFilters";
import BrowseView from "./components/BrowseView";
import "./App.css";

const initialRoute = parseRoute();

function matchesFilters(card: Flashcard, filters: FilterState, skipKey?: string) {
  return Object.entries(filters).every(
    ([key, value]) => key === skipKey || value === null || card.facets[key] === value,
  );
}

/** Keeps each filter only if the card still matches it, so the card is in the study deck. */
function relaxFilters(filters: FilterState, card: Flashcard): FilterState {
  return Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, value === null || card.facets[key] === value ? value : null]),
  );
}

function App() {
  const [deckId, setDeckId] = useState(decks[0]?.id);
  const [filters, setFilters] = useState<FilterState>({});
  const [view, setView] = useState<View>(initialRoute.view);
  // The card on screen; the stack reopens on it whenever it remounts (filters change, a card is picked).
  const [currentCardId, setCurrentCardId] = useState(initialRoute.cardId);
  // Bumped to remount the stack on a picked card even when the filters stay the same.
  const [openCount, setOpenCount] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 960px)");

  const deck = decks.find((d) => d.id === deckId) ?? decks[0];
  // The list is grouped by the deck's first filterable facet (purpose in the design-system deck).
  const groupFacet = deck?.facets.find((facet) => facet.filter !== false);

  // Cards in list order (grouped like the sidebar), so swiping walks the list top to bottom.
  const orderedCards = useMemo(() => {
    if (!deck || !groupFacet) return deck?.cards ?? [];
    const rank = (card: Flashcard) => groupFacet.values.indexOf(card.facets[groupFacet.key]);
    return [...deck.cards].sort((a, b) => rank(a) - rank(b));
  }, [deck, groupFacet]);

  const studyCards = useMemo(
    () => orderedCards.filter((card) => matchesFilters(card, filters)),
    [orderedCards, filters],
  );
  const browseCards = useMemo(
    () => orderedCards.filter((card) => matchesFilters(card, filters, groupFacet?.key)),
    [orderedCards, filters, groupFacet],
  );

  // Back/forward buttons
  const currentCardRef = useRef(currentCardId);
  const deckRef = useRef(deck);
  useEffect(() => {
    currentCardRef.current = currentCardId;
    deckRef.current = deck;
  }, [currentCardId, deck]);
  useEffect(() => {
    const onPopState = () => {
      const route = parseRoute();
      setView(route.view);
      const card = deckRef.current?.cards.find((c) => c.id === route.cardId);
      if (card && card.id !== currentCardRef.current) {
        setFilters((prev) => relaxFilters(prev, card));
        setCurrentCardId(card.id);
        setOpenCount((n) => n + 1);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const handleCardChange = useCallback((cardId: string) => {
    setCurrentCardId(cardId);
    if (viewRef.current === "study") replaceRoute({ view: "study", cardId });
  }, []);

  if (!deck) {
    return <div className="app">No decks found in src/decks.</div>;
  }

  const showView = (next: View) => {
    if (next === view) return;
    pushRoute({ view: next, cardId: currentCardId });
    setView(next);
  };

  const handleSelect = (card: Flashcard) => {
    // Study the card among its group (e.g. all overlays)
    setFilters((prev) => ({
      ...relaxFilters(prev, card),
      ...(groupFacet && { [groupFacet.key]: card.facets[groupFacet.key] }),
    }));
    setCurrentCardId(card.id);
    setOpenCount((n) => n + 1);
    pushRoute({ view: "study", cardId: card.id });
    setView("study");
  };

  const handleDeckChange = (id: string) => {
    setDeckId(id);
    setFilters({});
    setCurrentCardId(undefined);
    setOpenCount((n) => n + 1);
    pushRoute({ view: "study" });
    setView("study");
  };

  const activeFilters = deck.facets
    .filter((facet) => facet.key !== groupFacet?.key && filters[facet.key])
    .map((facet) => ({ facet, value: filters[facet.key]! }));

  return (
    <div className={`app app--view-${view}`}>
      <header className="app-header">
        <h1>{deck.title} Flashcards</h1>
        {decks.length > 1 && (
          <select
            className="app-header__deck-select"
            value={deck.id}
            onChange={(e) => handleDeckChange(e.target.value)}
            aria-label="Deck"
          >
            {decks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        )}
        <div className="app-header__views" role="group" aria-label="View">
          {(["study", "browse"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className="app-header__view"
              aria-pressed={view === v}
              onClick={() => showView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      {groupFacet && (
        <aside className="app__browse">
          <BrowseView
            deck={deck}
            cards={browseCards}
            groupFacet={groupFacet}
            activeFilters={activeFilters}
            activeCardId={currentCardId}
            visible={view === "browse" || isDesktop}
            onSelect={handleSelect}
            onClearFilter={(key) => setFilters((prev) => ({ ...prev, [key]: null }))}
          />
        </aside>
      )}

      <div className="app__study">
        <DeckFilters
          facets={deck.facets}
          filters={filters}
          count={studyCards.length}
          onChange={setFilters}
        />
        <main className="app-main">
          <CardStack
            key={`${deck.id}-${JSON.stringify(filters)}-${openCount}`}
            deck={deck}
            cards={studyCards}
            startCardId={currentCardId}
            onCardChange={handleCardChange}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
