import type { Flashcard } from "./types";
import flashcardsData from "./flashcards.json";
import CardStack from "./components/CardStack";
import "./App.css";

const cards: Flashcard[] = flashcardsData;

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Flashcards</h1>
      </header>
      <main className="app-main">
        <CardStack cards={cards} />
      </main>
    </div>
  );
}

export default App;
