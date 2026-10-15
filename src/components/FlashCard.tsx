import { motion, useReducedMotion } from "framer-motion";
import type { Deck, Flashcard } from "../types";
import { getCardImages, type CardImages } from "../decks";
import Tag from "./Tag";
import "./FlashCard.css";

interface FlashCardProps {
  deck: Deck;
  card: Flashcard;
  revealed: boolean;
  onReveal: () => void;
}

interface ImageVariant {
  key: string;
  label: string;
  src: string;
  phone: boolean;
}

/** Desktop image plus, when present, either iOS + Android drawings or one generic mobile drawing. */
function imageVariants(images: CardImages): ImageVariant[] {
  if (!images.desktop) return [];
  const variants: ImageVariant[] = [{ key: "desktop", label: "Desktop", src: images.desktop, phone: false }];
  if (images.ios && images.android) {
    variants.push({ key: "ios", label: "iOS", src: images.ios, phone: true });
    variants.push({ key: "android", label: "Android", src: images.android, phone: true });
  } else if (images.mobile) {
    variants.push({ key: "mobile", label: "Mobile", src: images.mobile, phone: true });
  }
  return variants;
}

export default function FlashCard({ deck, card, revealed, onReveal }: FlashCardProps) {
  const variants = imageVariants(getCardImages(deck.id, card.id));
  const { ios, android } = card.platforms ?? {};
  const reduceMotion = useReducedMotion();

  return (
    <div className="flashcard" onClick={onReveal}>
      <motion.div
        className="flashcard-inner"
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flashcard-face flashcard-face--front" aria-hidden={revealed}>
          <div className="flashcard-tags">
            {deck.facets.map(({ key }) =>
              card.facets[key] ? <Tag key={key} value={card.facets[key]} /> : null,
            )}
          </div>

          <h2 className="flashcard-title">{card.title}</h2>

          <div className="flashcard-body">
            {variants.length > 1 ? (
              <div
                className={`flashcard-image flashcard-image--split ${variants.length > 2 ? "flashcard-image--triple" : ""}`}
              >
                {variants.map((variant) => (
                  <figure
                    key={variant.key}
                    className={`flashcard-image__variant flashcard-image__variant--${variant.phone ? "phone" : "desktop"}`}
                  >
                    <img src={variant.src} alt="" draggable={false} />
                    <figcaption>{variant.label}</figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="flashcard-image">
                {variants[0] ? (
                  <img src={variants[0].src} alt="" draggable={false} />
                ) : (
                  <span className="flashcard-placeholder">?</span>
                )}
              </div>
            )}

            <p className="flashcard-summary">{card.summary}</p>
          </div>

          <p className="flashcard-hint">Tap to reveal</p>
        </div>

        <div className="flashcard-face flashcard-face--back" aria-hidden={!revealed}>
          <div className="flashcard-back">
            <h2 className="flashcard-back__title">{card.title}</h2>
            <p className="flashcard-back__description">{card.description}</p>
            {card.aliases && card.aliases.length > 0 && (
              <p className="flashcard-back__aliases">Also known as: {card.aliases.join(", ")}</p>
            )}
            {(ios || android) && (
              <dl className="flashcard-platforms">
                {ios && (
                  <div className="flashcard-platforms__row">
                    <dt>iOS</dt>
                    <dd>{ios}</dd>
                  </div>
                )}
                {android && (
                  <div className="flashcard-platforms__row">
                    <dt>Android</dt>
                    <dd>{android}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          <p className="flashcard-hint">Tap to go back</p>
        </div>
      </motion.div>
    </div>
  );
}
