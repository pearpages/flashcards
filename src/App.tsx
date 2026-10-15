import { useMemo, useState } from "react";
import type { FilterState } from "./types";
import { decks } from "./decks";
import CardStack from "./components/CardStack";
import DeckFilters from "./components/DeckFilters";
import "./App.css";

function App() {
  const [deckId, setDeckId] = useState(decks[0]?.id);
  const [filters, setFilters] = useState<FilterState>({});

  const deck = decks.find((d) => d.id === deckId) ?? decks[0];

  const filteredCards = useMemo(
    () =>
      deck?.cards.filter((card) =>
        Object.entries(filters).every(([key, value]) => value === null || card.facets[key] === value),
      ) ?? [],
    [deck, filters],
  );

  if (!deck) {
    return <div className="app">No decks found in src/decks.</div>;
  }

  const handleDeckChange = (id: string) => {
    setDeckId(id);
    setFilters({});
  };

  return (
    <div className="app">
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
      </header>
      <DeckFilters
        facets={deck.facets}
        filters={filters}
        count={filteredCards.length}
        onChange={setFilters}
      />
      <main className="app-main">
        <CardStack key={`${deck.id}-${JSON.stringify(filters)}`} deck={deck} cards={filteredCards} />
      </main>
    </div>
  );
}

export default App;
