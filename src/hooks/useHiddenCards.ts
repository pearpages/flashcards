import { useCallback, useEffect, useRef, useState } from "react";
import type { Deck } from "../types";
import { loadHidden, saveHidden } from "../hiddenCards";

/** The deck's hidden cards, loaded once on mount and saved to this browser on every change. */
export function useHiddenCards(deck: Deck) {
  const [hidden, setHidden] = useState(() => loadHidden(deck.id, deck.cards.map((card) => card.id)));

  const loaded = useRef(false);
  useEffect(() => {
    // Skip the first run: it would only write back what was just read.
    if (!loaded.current) {
      loaded.current = true;
      return;
    }
    saveHidden(deck.id, hidden);
  }, [deck.id, hidden]);

  const setCardHidden = useCallback((cardId: string, isHidden: boolean) => {
    setHidden((prev) => {
      if (prev.has(cardId) === isHidden) return prev;
      const next = new Set(prev);
      if (isHidden) next.add(cardId);
      else next.delete(cardId);
      return next;
    });
  }, []);

  return { hidden, setCardHidden };
}
