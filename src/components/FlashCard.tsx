import { motion } from "framer-motion";
import type { Flashcard } from "../types";
import "./FlashCard.css";

interface FlashCardProps {
  card: Flashcard;
  revealed: boolean;
  onReveal: () => void;
}

export default function FlashCard({ card, revealed, onReveal }: FlashCardProps) {
  return (
    <div className="flashcard" onClick={onReveal}>
      <h2 className="flashcard-title">{card.title}</h2>

      <div className="flashcard-image">
        {card.image ? (
          <img src={card.image} alt={card.title} />
        ) : (
          <span className="flashcard-placeholder">?</span>
        )}
      </div>

      <div className="flashcard-bottom">
        <p className={`flashcard-hint ${revealed ? "flashcard-hint--hidden" : ""}`}>
          Tap to reveal
        </p>

        <motion.div
          className="flashcard-description"
          initial={false}
          animate={{
            opacity: revealed ? 1 : 0,
            y: revealed ? 0 : 10,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{ pointerEvents: revealed ? "auto" : "none" }}
        >
          <p>{card.description}</p>
        </motion.div>
      </div>
    </div>
  );
}
