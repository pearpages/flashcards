import { useState } from "react";
import { motion } from "framer-motion";
import type { Flashcard } from "../types";
import "./FlashCard.css";

interface FlashCardProps {
  card: Flashcard;
}

export default function FlashCard({ card }: FlashCardProps) {
  const [revealed, setRevealed] = useState(false);

  const toggleReveal = () => setRevealed((prev) => !prev);

  return (
    <div className="flashcard" onClick={toggleReveal}>
      {card.image && (
        <div className="flashcard-image">
          <img src={card.image} alt={card.title} />
        </div>
      )}
      <h2 className="flashcard-title">{card.title}</h2>

      <motion.div
        className="flashcard-description"
        initial={false}
        animate={{
          opacity: revealed ? 1 : 0,
          y: revealed ? 0 : 20,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: revealed ? "auto" : "none" }}
      >
        <p>{card.description}</p>
      </motion.div>

      {!revealed && (
        <p className="flashcard-hint">Tap to reveal</p>
      )}
    </div>
  );
}
