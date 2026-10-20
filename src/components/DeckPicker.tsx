import { useEffect } from "react";
import type { Deck } from "../types";
import { getCardImages } from "../decks";
import "./DeckPicker.css";

interface DeckPickerProps {
  decks: Deck[];
  onSelect: (deckId: string) => void;
}

const PREVIEW_COUNT = 3;

/** A few drawings spread across the deck, as a peek at what's inside. */
function previewImages(deck: Deck): string[] {
  const withImages = deck.cards
    .map((card) => getCardImages(deck.id, card.id).desktop)
    .filter((src): src is string => Boolean(src));
  if (withImages.length <= PREVIEW_COUNT) return withImages;
  const step = withImages.length / PREVIEW_COUNT;
  return Array.from({ length: PREVIEW_COUNT }, (_, i) => withImages[Math.floor(i * step + step / 2)]);
}

export default function DeckPicker({ decks, onSelect }: DeckPickerProps) {
  useEffect(() => {
    document.title = "Flashcards";
  }, []);

  return (
    <main className="deck-picker">
      <header className="deck-picker__header">
        <h1 className="deck-picker__title">Flashcards</h1>
        <p className="deck-picker__subtitle">Choose a deck to study</p>
      </header>

      {decks.length === 0 ? (
        <p className="deck-picker__empty">No decks yet. Add a folder to src/decks/.</p>
      ) : (
        <ul className="deck-picker__list">
          {decks.map((deck) => {
            const previews = previewImages(deck);
            return (
              <li key={deck.id}>
                <button type="button" className="deck-tile" onClick={() => onSelect(deck.id)}>
                  {previews.length > 0 && (
                    <span className="deck-tile__preview" aria-hidden="true">
                      {previews.map((src, i) => (
                        <span key={src} className={`deck-tile__mini deck-tile__mini--${i}`}>
                          <img src={src} alt="" draggable={false} />
                        </span>
                      ))}
                    </span>
                  )}
                  <span className="deck-tile__title">{deck.title}</span>
                  <span className="deck-tile__description">{deck.description}</span>
                  <span className="deck-tile__footer">
                    <span className="deck-tile__count">
                      {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                    </span>
                    <span className="deck-tile__arrow" aria-hidden="true">
                      →
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
