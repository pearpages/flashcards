import { useState, useCallback } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import type { Flashcard } from "../types";
import FlashCard from "./FlashCard";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import "./CardStack.css";

interface CardStackProps {
  cards: Flashcard[];
}

const SWIPE_THRESHOLD = 50;

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
  }),
};

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function CardStack({ cards }: CardStackProps) {
  const [deck, setDeck] = useState(cards);
  const [[currentIndex, direction], setPage] = useState([0, 0]);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  const goNext = useCallback(() => {
    setPage(([prev]) => {
      if (prev >= deck.length - 1) return [prev, 0];
      return [prev + 1, 1];
    });
  }, [deck.length]);

  const goPrev = useCallback(() => {
    setPage(([prev]) => {
      if (prev <= 0) return [prev, 0];
      return [prev - 1, -1];
    });
  }, []);

  const revealCard = useCallback(() => {
    const cardId = deck[currentIndex]?.id;
    if (cardId == null) return;
    setRevealedIds((prev) => {
      if (prev.has(cardId)) return prev;
      const next = new Set(prev);
      next.add(cardId);
      return next;
    });
  }, [deck, currentIndex]);

  const handleShuffle = () => {
    setDeck(shuffleArray(cards));
    setPage([0, 0]);
    setRevealedIds(new Set());
  };

  useKeyboardNav(goPrev, goNext, revealCard);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    }
  };

  if (deck.length === 0) {
    return <div className="card-stack-empty">No flashcards found.</div>;
  }

  return (
    <div className="card-stack">
      <div className="card-stack-container">
        {/* Background stacked cards for depth effect */}
        {currentIndex < deck.length - 1 && (
          <div className="stack-card stack-card-2" />
        )}
        {currentIndex < deck.length - 2 && (
          <div className="stack-card stack-card-3" />
        )}

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={deck[currentIndex].id}
            className="card-wrapper"
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={springTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
          >
            <FlashCard
              card={deck[currentIndex]}
              revealed={revealedIds.has(deck[currentIndex].id)}
              onReveal={revealCard}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="card-stack-footer">
        <button
          className="nav-button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Previous card"
        >
          ←
        </button>
        <span className="card-counter">
          {currentIndex + 1} / {deck.length}
        </span>
        <button
          className="nav-button"
          onClick={goNext}
          disabled={currentIndex === deck.length - 1}
          aria-label="Next card"
        >
          →
        </button>
        <button
          className="nav-button shuffle-button"
          onClick={handleShuffle}
          aria-label="Shuffle cards"
        >
          ⟳
        </button>
      </div>
    </div>
  );
}
