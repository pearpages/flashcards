import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@pearpages/pulp-react/button";
import { IconButton } from "@pearpages/pulp-react/icon-button";
import { Heading } from "@pearpages/pulp-react/heading";
import { SegmentedControl } from "@pearpages/pulp-react/segmented-control";
import { Badge } from "@pearpages/pulp-react/badge";
import { useToast } from "@pearpages/pulp-react/toast";
import { ChevronLeft } from "@pearpages/pulp-icons";
import type { Deck, Flashcard, FilterState } from "../types";
import { parseRoute, pushRoute, replaceRoute, type View } from "../route";
import { countActive, matchesFilters, relaxFilters } from "../filters";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useHiddenCards } from "../hooks/useHiddenCards";
import CardStack from "./CardStack";
import FilterSheet from "./FilterSheet";
import BrowseView from "./BrowseView";
import { SlidersGlyph } from "./icons";
import "./DeckView.css";

interface DeckViewProps {
  deck: Deck;
  initialView: View;
  initialCardId?: string;
  onBack: () => void;
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [position, setPosition] = useState({ index: 0, total: 0 });
  const { toast } = useToast();

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
  // Cards marked known in the whole deck, for the filters sheet
  const hiddenCount = hidden.size;
  // What the filter chips count: the deck narrowed by Essentials and known cards, before facet filters
  const countableCards = useMemo(
    () => orderedCards.filter((card) => (!essentialOnly || card.essential) && (showHidden || !hidden.has(card.id))),
    [orderedCards, essentialOnly, showHidden, hidden],
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

  const handlePosition = useCallback((index: number, total: number) => setPosition({ index, total }), []);

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

  const clearAll = () => {
    setFilters({});
    setEssentialOnly(false);
    setShowHidden(false);
  };

  const activeCount = countActive(filters) + (essentialOnly ? 1 : 0) + (showHidden ? 1 : 0);

  // Closing the sheet with filters on says how many cards are left, with a way out.
  const handleFiltersOpenChange = (open: boolean) => {
    setFiltersOpen(open);
    if (open || activeCount === 0) return;
    const n = studyCards.length;
    toast({
      title: n === 0 ? "No cards match your filters." : `${n} ${n === 1 ? "card matches" : "cards match"} your filters.`,
      duration: 6000,
      action: { label: "Clear", onClick: clearAll },
    });
  };

  const activeFilters = deck.facets
    .filter((facet) => facet.key !== groupFacet?.key && filters[facet.key])
    .map((facet) => ({ facet, value: filters[facet.key]! }));

  const counter =
    view === "study" || isDesktop
      ? studyCards.length === 0
        ? "No cards"
        : `Card ${Math.min(position.index + 1, position.total)} of ${position.total}`
      : `${browseCards.length} ${browseCards.length === 1 ? "card" : "cards"}`;

  return (
    <div className={`app app--view-${view}`}>
      <header className="deck-header">
        <IconButton variant="ghost" icon={<ChevronLeft />} label="All decks" onClick={onBack} />
        <Heading level={1} size="md" className="deck-header__title">
          {deck.title}
        </Heading>
        <Button variant="secondary" iconStart={<SlidersGlyph />} onClick={() => setFiltersOpen(true)}>
          Filters
          {activeCount > 0 && (
            <span className="deck-header__badge">
              <Badge count={activeCount} tone="action" variant="solid" size="sm" label="filters on" />
            </span>
          )}
        </Button>
      </header>

      <div className="deck-bar">
        <span className="deck-bar__count" aria-live="polite">
          {counter}
        </span>
        <SegmentedControl
          className="deck-bar__views"
          label="View"
          options={[
            { value: "study", label: "Study" },
            { value: "browse", label: "Browse" },
          ]}
          value={view}
          onValueChange={showView}
        />
      </div>

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

      <main className="app__study">
        <CardStack
          key={`${JSON.stringify(filters)}-${essentialOnly}-${showHidden}-${openCount}`}
          deck={deck}
          cards={studyCards}
          startCardId={currentCardId}
          onCardChange={handleCardChange}
          onPositionChange={handlePosition}
          hiddenIds={hidden}
          dropHidden={!showHidden}
          onHiddenChange={setCardHidden}
          onShowHidden={() => setShowHidden(true)}
        />
      </main>

      <FilterSheet
        open={filtersOpen}
        onOpenChange={handleFiltersOpenChange}
        placement={isDesktop ? "end" : "bottom"}
        facets={deck.facets}
        filters={filters}
        onFiltersChange={setFilters}
        countableCards={countableCards}
        matchCount={studyCards.length}
        essentialOnly={essentialOnly}
        onEssentialOnlyChange={setEssentialOnly}
        showHidden={showHidden}
        onShowHiddenChange={setShowHidden}
        hiddenCount={hiddenCount}
        onClearAll={clearAll}
      />
    </div>
  );
}
