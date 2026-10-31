import { useEffect, type MouseEvent } from "react";
import { Heading } from "@pearpages/pulp-react/heading";
import { Text } from "@pearpages/pulp-react/text";
import { Icon } from "@pearpages/pulp-react/icon";
import { ChevronRight } from "@pearpages/pulp-icons";
import type { Deck } from "../types";
import { getCardImages } from "../decks";
import "./DeckPicker.css";

interface DeckPickerProps {
  decks: Deck[];
  onSelect: (deckId: string) => void;
}

/** The deck's cover: the drawing of its first essential card (or first card) that has one. */
function coverImage(deck: Deck): string | undefined {
  const ordered = [...deck.cards.filter((card) => card.essential), ...deck.cards];
  for (const card of ordered) {
    const src = getCardImages(deck.id, card.id).desktop;
    if (src) return src;
  }
  return undefined;
}

export default function DeckPicker({ decks, onSelect }: DeckPickerProps) {
  useEffect(() => {
    document.title = "Flashcards";
  }, []);

  // Real links, so a deck can be opened in a new tab; a plain click stays in the app.
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, deckId: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onSelect(deckId);
  };

  return (
    <main className="deck-picker">
      <header className="deck-picker__header">
        <Heading level={1} size="2xl">
          Flashcards
        </Heading>
        <Text tone="muted">Pick a deck to study. Each card has a drawing on the front and the answer on the back.</Text>
      </header>

      {decks.length === 0 ? (
        <Text tone="muted">No decks yet. Add a folder to src/decks/.</Text>
      ) : (
        <ul className="deck-picker__list">
          {decks.map((deck) => {
            const cover = coverImage(deck);
            const essentials = deck.cards.filter((card) => card.essential).length;
            return (
              <li key={deck.id} className="deck-picker__item">
                <a
                  className="deck-row"
                  href={`#/${encodeURIComponent(deck.id)}`}
                  onClick={(event) => handleClick(event, deck.id)}
                >
                  <span className="deck-row__cover" aria-hidden="true">
                    {cover && <img src={cover} alt="" draggable={false} />}
                  </span>
                  <span className="deck-row__text">
                    <span className="deck-row__title">{deck.title}</span>
                    <span className="deck-row__meta">
                      {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                      {essentials > 0 && ` · ${essentials} essential`}
                    </span>
                  </span>
                  <Icon size="md">
                    <ChevronRight />
                  </Icon>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
