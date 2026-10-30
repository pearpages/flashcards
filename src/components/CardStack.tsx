import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import type { Deck, Flashcard } from "../types";
import FlashCard from "./FlashCard";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import "./CardStack.css";

interface CardStackProps {
  deck: Deck;
  cards: Flashcard[];
  /** Card to open first; falls back to the first card when it isn't in `cards`. */
  startCardId?: string;
  onCardChange?: (cardId: string) => void;
  hiddenIds: ReadonlySet<string>;
  /** True when hidden cards are out of study: hiding a card then takes it out of the stack. */
  dropHidden: boolean;
  onHiddenChange: (cardId: string, hidden: boolean) => void;
}

/** The card just hidden, and where it was, so Undo can put it back. */
interface Undo {
  card: Flashcard;
  index: number;
}

const UNDO_MS = 5000;

const SWIPE_THRESHOLD = 50;

const SLIDE_DISTANCE = 240;

const cardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? SLIDE_DISTANCE : -SLIDE_DISTANCE,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -SLIDE_DISTANCE : SLIDE_DISTANCE,
    opacity: 0,
    scale: 0.92,
  }),
};

// A soft, critically damped spring (~0.7s, no bounce) for movement, and an eased fade
// that runs on its own clock so cards don't pop in.
const glide = { type: "spring" as const, stiffness: 110, damping: 21, mass: 1 };
const cardTransition = {
  x: glide,
  scale: glide,
  opacity: { duration: 0.45, ease: "easeInOut" as const },
};

// With reduced motion, cards only cross-fade.
const reducedVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};
const reducedTransition = { opacity: { duration: 0.2 } };


function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function CardStack({
  deck,
  cards,
  startCardId,
  onCardChange,
  hiddenIds,
  dropHidden,
  onHiddenChange,
}: CardStackProps) {
  const [stack, setStack] = useState(cards);
  const [[currentIndex, direction], setPage] = useState(() => [
    Math.max(0, cards.findIndex((card) => card.id === startCardId)),
    0,
  ]);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const reduceMotion = useReducedMotion();

  const goNext = useCallback(() => {
    setPage(([prev]) => {
      if (prev >= stack.length - 1) return [prev, 0];
      return [prev + 1, 1];
    });
  }, [stack.length]);

  const goPrev = useCallback(() => {
    setPage(([prev]) => {
      if (prev <= 0) return [prev, 0];
      return [prev - 1, -1];
    });
  }, []);

  // Tapping flips the card: front → back → front.
  const toggleReveal = useCallback(() => {
    const cardId = stack[currentIndex]?.id;
    if (cardId == null) return;
    setRevealedIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }, [stack, currentIndex]);

  const [undo, setUndo] = useState<Undo | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(undoTimer.current), []);

  const toggleHidden = useCallback(() => {
    const card = stack[currentIndex];
    if (!card) return;
    if (hiddenIds.has(card.id)) {
      onHiddenChange(card.id, false);
      return;
    }
    onHiddenChange(card.id, true);
    if (!dropHidden) return;
    // Take the card out and slide the next one in (or the previous one, at the end).
    setStack((prev) => prev.filter((c) => c.id !== card.id));
    const atEnd = currentIndex >= stack.length - 1;
    setPage([Math.max(0, atEnd ? currentIndex - 1 : currentIndex), atEnd ? -1 : 1]);
    setUndo({ card, index: currentIndex });
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), UNDO_MS);
  }, [stack, currentIndex, hiddenIds, dropHidden, onHiddenChange]);

  const handleUndo = () => {
    if (!undo) return;
    window.clearTimeout(undoTimer.current);
    onHiddenChange(undo.card.id, false);
    setStack((prev) => [...prev.slice(0, undo.index), undo.card, ...prev.slice(undo.index)]);
    setPage([undo.index, -1]);
    setUndo(null);
  };

  const handleShuffle = () => {
    // The current stack, so cards hidden since it mounted stay out.
    setStack(shuffleArray(stack));
    setPage([0, 0]);
    setRevealedIds(new Set());
  };

  useKeyboardNav(goPrev, goNext, toggleReveal, toggleHidden);

  const currentCardId = stack[currentIndex]?.id;
  useEffect(() => {
    if (currentCardId) onCardChange?.(currentCardId);
  }, [currentCardId, onCardChange]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    }
  };

  const undoBar = (
    <div className="card-stack__undo-region" aria-live="polite">
      {undo && (
        <div className="card-stack__undo">
          <span>Card hidden</span>
          <button type="button" className="card-stack__undo-button" onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}
    </div>
  );

  if (stack.length === 0) {
    return (
      <div className="card-stack card-stack--empty">
        <div className="card-stack-empty">
          {cards.length > 0 ? "You've hidden every card here." : "No cards match these filters."}
        </div>
        {undoBar}
      </div>
    );
  }

  const currentHidden = hiddenIds.has(stack[currentIndex].id);

  return (
    <div className="card-stack">
      <div className="card-stack-container">
        {/* Background stacked cards for depth effect */}
        {currentIndex < stack.length - 1 && (
          <div className="stack-card stack-card-2" />
        )}
        {currentIndex < stack.length - 2 && (
          <div className="stack-card stack-card-3" />
        )}

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={stack[currentIndex].id}
            className="card-wrapper"
            custom={direction}
            variants={reduceMotion ? reducedVariants : cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : cardTransition}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={handleDragEnd}
          >
            <FlashCard
              deck={deck}
              card={stack[currentIndex]}
              revealed={revealedIds.has(stack[currentIndex].id)}
              hidden={currentHidden}
              onReveal={toggleReveal}
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
          {currentIndex + 1} / {stack.length}
        </span>
        <button
          className="nav-button"
          onClick={goNext}
          disabled={currentIndex === stack.length - 1}
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
        <button
          className="hide-button"
          onClick={toggleHidden}
          title={currentHidden ? "Put this card back in study (H)" : "I know this: hide it from study (H)"}
        >
          <span aria-hidden="true">{currentHidden ? "↺" : "✓"}</span> {currentHidden ? "Unhide" : "Hide"}
        </button>
      </div>

      {undoBar}
    </div>
  );
}
