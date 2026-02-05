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

export default function CardStack({ cards }: CardStackProps) {
  const [[currentIndex, direction], setPage] = useState([0, 0]);

  const goNext = useCallback(() => {
    setPage(([prev]) => {
      if (prev >= cards.length - 1) return [prev, 0];
      return [prev + 1, 1];
    });
  }, [cards.length]);

  const goPrev = useCallback(() => {
    setPage(([prev]) => {
      if (prev <= 0) return [prev, 0];
      return [prev - 1, -1];
    });
  }, []);

  useKeyboardNav(goPrev, goNext);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    }
  };

  if (cards.length === 0) {
    return <div className="card-stack-empty">No flashcards found.</div>;
  }

  return (
    <div className="card-stack">
      <div className="card-stack-container">
        {/* Background stacked cards for depth effect */}
        {currentIndex < cards.length - 1 && (
          <div className="stack-card stack-card-2" />
        )}
        {currentIndex < cards.length - 2 && (
          <div className="stack-card stack-card-3" />
        )}

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentIndex}
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
            <FlashCard card={cards[currentIndex]} />
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
          {currentIndex + 1} / {cards.length}
        </span>
        <button
          className="nav-button"
          onClick={goNext}
          disabled={currentIndex === cards.length - 1}
          aria-label="Next card"
        >
          →
        </button>
      </div>
    </div>
  );
}
