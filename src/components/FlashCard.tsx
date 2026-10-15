import { motion } from "framer-motion";
import type { Deck, Flashcard } from "../types";
import { getCardImages } from "../decks";
import "./FlashCard.css";

interface FlashCardProps {
  deck: Deck;
  card: Flashcard;
  revealed: boolean;
  onReveal: () => void;
}

export default function FlashCard({ deck, card, revealed, onReveal }: FlashCardProps) {
  const { desktop, mobile } = getCardImages(deck.id, card.id);

  return (
    <div className="flashcard" onClick={onReveal}>
      <div className="flashcard-tags">
        {deck.facets.map(({ key }) => {
          const value = card.facets[key];
          return value ? (
            <span key={key} className={`flashcard__tag flashcard__tag--${value}`}>
              {value}
            </span>
          ) : null;
        })}
      </div>

      <h2 className="flashcard-title">{card.title}</h2>

      <div className="flashcard-body">
        {desktop && mobile ? (
          <div className="flashcard-image flashcard-image--split">
            <figure className="flashcard-image__variant flashcard-image__variant--desktop">
              <img src={desktop} alt="" draggable={false} />
              <figcaption>Desktop</figcaption>
            </figure>
            <figure className="flashcard-image__variant flashcard-image__variant--mobile">
              <img src={mobile} alt="" draggable={false} />
              <figcaption>Mobile</figcaption>
            </figure>
          </div>
        ) : (
          <div className="flashcard-image">
            {desktop ? (
              <img src={desktop} alt="" draggable={false} />
            ) : (
              <span className="flashcard-placeholder">?</span>
            )}
          </div>
        )}

        <p className="flashcard-summary">{card.summary}</p>

        <motion.div
          className={`flashcard-description ${revealed ? "flashcard-description--revealed" : ""}`}
          initial={false}
          animate={{
            opacity: revealed ? 1 : 0,
            y: revealed ? 0 : 10,
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p>{card.description}</p>
          {card.aliases && card.aliases.length > 0 && (
            <p className="flashcard-aliases">Also known as: {card.aliases.join(", ")}</p>
          )}
        </motion.div>
      </div>

      <p className={`flashcard-hint ${revealed ? "flashcard-hint--hidden" : ""}`}>
        Tap to reveal
      </p>
    </div>
  );
}
