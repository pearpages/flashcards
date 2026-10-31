import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from "framer-motion";
import { Button } from "@pearpages/pulp-react/button";
import { IconButton } from "@pearpages/pulp-react/icon-button";
import { Progress } from "@pearpages/pulp-react/progress";
import { EmptyState } from "@pearpages/pulp-react/empty-state";
import { useToast } from "@pearpages/pulp-react/toast";
import { ArrowLeft, ArrowRight, Check, Undo, Eye } from "@pearpages/pulp-icons";
import type { Deck, Flashcard } from "../types";
import FlashCard from "./FlashCard";
import { FlipGlyph, ShuffleGlyph } from "./icons";
import { useKeyboardNav } from "../hooks/useKeyboardNav";
import "./CardStack.css";

interface CardStackProps {
  deck: Deck;
  cards: Flashcard[];
  /** Card to open first; falls back to the first card when it isn't in `cards`. */
  startCardId?: string;
  onCardChange?: (cardId: string) => void;
  /** Where the learner is: card `index` (0-based) of `total`. */
  onPositionChange?: (index: number, total: number) => void;
  hiddenIds: ReadonlySet<string>;
  /** True when known cards are out of study: marking a card known then takes it out of the stack. */
  dropHidden: boolean;
  onHiddenChange: (cardId: string, hidden: boolean) => void;
  /** Brings known cards back into study. */
  onShowHidden: () => void;
}

/** An action with an Undo button stays a little longer. */
const ACTION_TOAST_MS = 6000;

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

const plural = (n: number) => `${n} ${n === 1 ? "card" : "cards"}`;

/** The study screen's card, its progress and its buttons. */
export default function CardStack({
  deck,
  cards,
  startCardId,
  onCardChange,
  onPositionChange,
  hiddenIds,
  dropHidden,
  onHiddenChange,
  onShowHidden,
}: CardStackProps) {
  const [stack, setStack] = useState(cards);
  const [[currentIndex, direction], setPage] = useState(() => [
    Math.max(0, cards.findIndex((card) => card.id === startCardId)),
    0,
  ]);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const reduceMotion = useReducedMotion();
  const { toast } = useToast();

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

  const putBack = useCallback(
    (card: Flashcard, index: number) => {
      onHiddenChange(card.id, false);
      setStack((prev) =>
        prev.some((c) => c.id === card.id) ? prev : [...prev.slice(0, index), card, ...prev.slice(index)],
      );
      setPage([index, -1]);
      toast({ title: `${card.title} is back in the deck.` });
    },
    [onHiddenChange, toast],
  );

  // "I know this": hide the card from study (or, when known cards are shown, toggle it back).
  const toggleHidden = useCallback(() => {
    const card = stack[currentIndex];
    if (!card) return;
    if (hiddenIds.has(card.id)) {
      onHiddenChange(card.id, false);
      toast({ title: `${card.title} is back in the deck.` });
      return;
    }
    onHiddenChange(card.id, true);
    if (!dropHidden) {
      toast.undo(`${card.title} marked as known.`, () => onHiddenChange(card.id, false), {
        duration: ACTION_TOAST_MS,
      });
      return;
    }
    // Take the card out and slide the next one in (or the previous one, at the end).
    const left = stack.length - 1;
    setStack((prev) => prev.filter((c) => c.id !== card.id));
    const atEnd = currentIndex >= stack.length - 1;
    setPage([Math.max(0, atEnd ? currentIndex - 1 : currentIndex), atEnd ? -1 : 1]);
    const index = currentIndex;
    if (left === 0) {
      toast({
        title: "You know every card in this view.",
        duration: ACTION_TOAST_MS,
        action: { label: "Show them", onClick: onShowHidden },
      });
      return;
    }
    toast.undo(`${card.title} hidden. ${plural(left)} left.`, () => putBack(card, index), {
      duration: ACTION_TOAST_MS,
    });
  }, [stack, currentIndex, hiddenIds, dropHidden, onHiddenChange, onShowHidden, putBack, toast]);

  const handleShuffle = () => {
    // The current stack, so cards hidden since it mounted stay out.
    const before = stack;
    const beforeIndex = currentIndex;
    setStack(shuffleArray(stack));
    setPage([0, 0]);
    setRevealedIds(new Set());
    toast.undo(
      "Cards shuffled.",
      () => {
        // Back to the old order, minus any card hidden since
        setStack((now) => before.filter((card) => now.some((c) => c.id === card.id)));
        setPage([beforeIndex, 0]);
      },
      { duration: ACTION_TOAST_MS },
    );
  };

  useKeyboardNav(goPrev, goNext, toggleReveal, toggleHidden);

  const currentCardId = stack[currentIndex]?.id;
  useEffect(() => {
    if (currentCardId) onCardChange?.(currentCardId);
  }, [currentCardId, onCardChange]);
  useEffect(() => {
    onPositionChange?.(currentIndex, stack.length);
  }, [currentIndex, stack.length, onPositionChange]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    }
  };

  if (stack.length === 0) {
    const allKnown = cards.length > 0;
    return (
      <div className="card-stack card-stack--empty">
        <EmptyState
          headingLevel={2}
          icon={allKnown ? <Check /> : <Eye />}
          title={allKnown ? "You know every card here" : "No cards match"}
          description={
            allKnown
              ? "Every card in this view is marked as known."
              : "Change the filters to see more cards."
          }
          action={
            allKnown && (
              <Button variant="secondary" onClick={onShowHidden}>
                Show cards I know
              </Button>
            )
          }
        />
      </div>
    );
  }

  const card = stack[currentIndex];
  const revealed = revealedIds.has(card.id);
  const currentHidden = hiddenIds.has(card.id);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === stack.length - 1;

  const knowButton = (variant: "secondary" | "ghost", className?: string) => (
    <Button
      className={className}
      variant={variant}
      size={variant === "secondary" ? "lg" : "md"}
      iconStart={currentHidden ? <Undo /> : <Check />}
      onClick={toggleHidden}
    >
      {currentHidden ? "Put back" : "I know this"}
    </Button>
  );

  return (
    <div className="card-stack">
      <Progress
        className="card-stack__progress"
        label="Progress through the deck"
        hideLabel
        size="sm"
        value={currentIndex + 1}
        max={stack.length}
        valueText={`Card ${currentIndex + 1} of ${stack.length}`}
      />

      <div className="card-stack__stage">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={card.id}
            className="card-stack__card"
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
            <FlashCard deck={deck} card={card} revealed={revealed} hidden={currentHidden} onReveal={toggleReveal} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="card-stack__controls">
        <div className="card-stack__primary">
          <IconButton variant="secondary" size="lg" icon={<ArrowLeft />} label="Previous card" onClick={goPrev} disabled={isFirst} />
          {revealed ? (
            <>
              {knowButton("secondary", "card-stack__grow")}
              <Button className="card-stack__grow" size="lg" iconEnd={<ArrowRight />} onClick={goNext} disabled={isLast}>
                Next card
              </Button>
            </>
          ) : (
            <>
              <Button className="card-stack__grow" size="lg" iconStart={<FlipGlyph />} onClick={toggleReveal}>
                Show answer
              </Button>
              <IconButton variant="secondary" size="lg" icon={<ArrowRight />} label="Next card" onClick={goNext} disabled={isLast} />
            </>
          )}
        </div>
        <div className="card-stack__secondary">
          <Button variant="ghost" iconStart={<ShuffleGlyph />} onClick={handleShuffle} disabled={stack.length < 2}>
            Shuffle
          </Button>
          {revealed ? (
            <Button variant="ghost" iconStart={<FlipGlyph />} onClick={toggleReveal}>
              Show question
            </Button>
          ) : (
            knowButton("ghost")
          )}
        </div>
      </div>
    </div>
  );
}
