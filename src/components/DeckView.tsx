import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Deck, Flashcard, FilterState } from "../types";
import { parseRoute, pushRoute, replaceRoute, type View } from "../route";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useHiddenCards } from "../hooks/useHiddenCards";
import CardStack from "./CardStack";
import DeckFilters from "./DeckFilters";
import BrowseView from "./BrowseView";

interface DeckViewProps {
  deck: Deck;
  initialView: View;
  initialCardId?: string;
  onBack: () => void;
}

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

/** One deck: filters, the card stack and the browse list. Mounted fresh each time a deck is entered. */
export default function DeckView({ deck, initialView, initialCardId, onBack }: DeckViewProps) {
  const [filters, setFilters] = useState<FilterState>({});
  const [view, setView] = useState<View>(initialView);
  // The card on screen; the stack reopens on it whenever it remounts (filters change, a card is picked).
  const [currentCardId, setCurrentCardId] = useState(initialCardId);
  // Bumped to remount the stack on a picked card even when the filters stay the same.
  const [openCount, setOpenCount] = useState(0);
  // Study only the deck's must-know cards; bring hidden ("I know this") cards back into study.
  const [essentialOnly, setEssentialOnly] = useState(false);
  const [showHidden, setShowHidden] = useState(false);
  const { hidden, setCardHidden } = useHiddenCards(deck);
  const isDesktop = useMediaQuery("(min-width: 960px)");

  // The list is grouped by the deck's first filterable facet (purpose in the design-system deck).
  const groupFacet = deck.facets.find((facet) => facet.filter !== false);

  // Cards in list order (grouped like the sidebar), so swiping walks the list top to bottom.
  const orderedCards = useMemo(() => {
    if (!groupFacet) return deck.cards;
    const rank = (card: Flashcard) => groupFacet.values.indexOf(card.facets[groupFacet.key]);
    return [...deck.cards].sort((a, b) => rank(a) - rank(b));
  }, [deck, groupFacet]);

  // The stack copies these cards when it mounts and isn't keyed by `hidden`, so hiding a card
  // doesn't remount it: the stack drops the card itself and slides to the next one.
  const studyCards = useMemo(
    () =>
      orderedCards.filter(
        (card) =>
          matchesFilters(card, filters) &&
          (!essentialOnly || card.essential) &&
          (showHidden || !hidden.has(card.id)),
      ),
    [orderedCards, filters, essentialOnly, showHidden, hidden],
  );
  // Browse keeps hidden cards (faded, with Unhide) so they can be found again.
  const browseCards = useMemo(
    () =>
      orderedCards.filter(
        (card) => matchesFilters(card, filters, groupFacet?.key) && (!essentialOnly || card.essential),
      ),
    [orderedCards, filters, groupFacet, essentialOnly],
  );
  const hiddenCount = useMemo(
    () => browseCards.filter((card) => hidden.has(card.id) && matchesFilters(card, filters)).length,
    [browseCards, hidden, filters],
  );

  /** Turns off whatever would keep `card` out of the study stack. */
  const revealInStudy = useCallback(
    (card: Flashcard) => {
      if (!card.essential) setEssentialOnly(false);
      if (hidden.has(card.id)) setShowHidden(true);
    },
    [hidden],
  );

  useEffect(() => {
    const previous = document.title;
    document.title = `${deck.title} · Flashcards`;
    return () => {
      document.title = previous;
    };
  }, [deck.title]);

  // Back/forward buttons within this deck (leaving the deck is handled by App)
  const currentCardRef = useRef(currentCardId);
  useEffect(() => {
    currentCardRef.current = currentCardId;
  }, [currentCardId]);
  useEffect(() => {
    const onPopState = () => {
      const route = parseRoute();
      if (route.deckId !== deck.id) return;
      setView(route.view);
      const card = deck.cards.find((c) => c.id === route.cardId);
      if (card && card.id !== currentCardRef.current) {
        setFilters((prev) => relaxFilters(prev, card));
        revealInStudy(card);
        setCurrentCardId(card.id);
        setOpenCount((n) => n + 1);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [deck, revealInStudy]);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const handleCardChange = useCallback(
    (cardId: string) => {
      setCurrentCardId(cardId);
      if (viewRef.current === "study") replaceRoute({ deckId: deck.id, view: "study", cardId });
    },
    [deck.id],
  );

  const showView = (next: View) => {
    if (next === view) return;
    pushRoute({ deckId: deck.id, view: next, cardId: currentCardId });
    setView(next);
  };

  const handleSelect = (card: Flashcard) => {
    // Study the card among its group (e.g. all overlays)
    setFilters((prev) => ({
      ...relaxFilters(prev, card),
      ...(groupFacet && { [groupFacet.key]: card.facets[groupFacet.key] }),
    }));
    revealInStudy(card);
    setCurrentCardId(card.id);
    setOpenCount((n) => n + 1);
    pushRoute({ deckId: deck.id, view: "study", cardId: card.id });
    setView("study");
  };

  const activeFilters = deck.facets
    .filter((facet) => facet.key !== groupFacet?.key && filters[facet.key])
    .map((facet) => ({ facet, value: filters[facet.key]! }));

  return (
    <div className={`app app--view-${view}`}>
      <header className="app-header">
        <button type="button" className="app-header__back" onClick={onBack} aria-label="Back to decks">
          <span aria-hidden="true">←</span>
          <span className="app-header__back-label">Decks</span>
        </button>
        <h1>{deck.title}</h1>
        <div className="app-header__actions">
          <button
            type="button"
            className="app-header__essentials"
            aria-pressed={essentialOnly}
            aria-label="Essentials"
            title="Study only the essential cards"
            onClick={() => setEssentialOnly((on) => !on)}
          >
            <span aria-hidden="true">★</span>
            <span className="app-header__essentials-label" aria-hidden="true">
              Essentials
            </span>
          </button>
          {(hiddenCount > 0 || showHidden) && (
            <button
              type="button"
              className="app-header__hidden"
              aria-pressed={showHidden}
              aria-label={`Study hidden cards (${hiddenCount})`}
              title="Study the cards you hid"
              onClick={() => setShowHidden((on) => !on)}
            >
              <svg className="app-header__hidden-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M4 20 20 4" />
              </svg>
              <span className="app-header__hidden-label" aria-hidden="true">
                Hidden ·
              </span>
              <span aria-hidden="true">{hiddenCount}</span>
            </button>
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
            essentialOnly={essentialOnly}
            onClearEssential={() => setEssentialOnly(false)}
            hiddenIds={hidden}
            onUnhide={(cardId) => setCardHidden(cardId, false)}
          />
        </aside>
      )}

      <div className="app__study">
        <DeckFilters
          facets={deck.facets}
          filters={filters}
          count={studyCards.length}
          onChange={setFilters}
          hiddenCount={showHidden ? 0 : hiddenCount}
        />
        <main className="app-main">
          <CardStack
            key={`${JSON.stringify(filters)}-${essentialOnly}-${showHidden}-${openCount}`}
            deck={deck}
            cards={studyCards}
            startCardId={currentCardId}
            onCardChange={handleCardChange}
            hiddenIds={hidden}
            dropHidden={!showHidden}
            onHiddenChange={setCardHidden}
          />
        </main>
      </div>
    </div>
  );
}
