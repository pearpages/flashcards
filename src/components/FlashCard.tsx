import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@pearpages/pulp-react/badge";
import { Icon } from "@pearpages/pulp-react/icon";
import { VisuallyHidden } from "@pearpages/pulp-react/visually-hidden";
import type { Deck, Flashcard } from "../types";
import { getCardImages, type CardImages } from "../decks";
import { valueLabel } from "../valueLabel";
import InlineText from "./InlineText";
import { FlipGlyph, StarGlyph } from "./icons";
import "./FlashCard.css";

interface FlashCardProps {
  deck: Deck;
  card: Flashcard;
  revealed: boolean;
  /** Hidden by the learner but shown anyway ("Show cards I know" is on). */
  hidden?: boolean;
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

function Title({ card }: { card: Flashcard }) {
  return (
    <h2 className="flashcard__title">
      {card.essential && (
        <span className="flashcard__star">
          <Icon size="inherit" label="Essential card">
            <StarGlyph />
          </Icon>
        </span>
      )}
      <span>{card.title}</span>
    </h2>
  );
}

/** One card: the drawing and summary on the front, the answer on the back; tapping flips it. */
export default function FlashCard({ deck, card, revealed, hidden = false, onReveal }: FlashCardProps) {
  const variants = imageVariants(getCardImages(deck.id, card.id));
  const platforms = (deck.platforms ?? []).filter(({ key }) => card.platforms?.[key]);
  const facetValues = deck.facets.map(({ key }) => card.facets[key]).filter(Boolean).map(valueLabel);
  const reduceMotion = useReducedMotion();

  return (
    <div className={`flashcard ${card.essential ? "flashcard--essential" : ""}`} onClick={onReveal}>
      <motion.div
        className="flashcard__inner"
        initial={false}
        animate={{ rotateY: revealed ? 180 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flashcard__face flashcard__face--front" aria-hidden={revealed}>
          <div className="flashcard__meta">
            <span className="flashcard__facets">{facetValues.join(" · ")}</span>
            {hidden && (
              <Badge size="sm" tone="neutral">
                Known
              </Badge>
            )}
          </div>

          <Title card={card} />

          {variants.length > 1 ? (
            <div className="flashcard__image flashcard__image--split">
              {variants.map((variant) => (
                <figure
                  key={variant.key}
                  className={`flashcard__variant flashcard__variant--${variant.phone ? "phone" : "desktop"}`}
                >
                  <img src={variant.src} alt="" draggable={false} />
                  <figcaption>{variant.label}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="flashcard__image">
              {variants[0] ? (
                <img src={variants[0].src} alt="" draggable={false} />
              ) : (
                <span className="flashcard__placeholder" aria-hidden="true">
                  ?
                </span>
              )}
            </div>
          )}

          <p className="flashcard__summary">
            <InlineText text={card.summary} />
          </p>

          <p className="flashcard__hint">
            <Icon size="sm">
              <FlipGlyph />
            </Icon>
            Tap the card to flip it
          </p>
        </div>

        <div className="flashcard__face flashcard__face--back" aria-hidden={!revealed}>
          <div className="flashcard__panel">
            <Title card={card} />
            <p className="flashcard__description">
              <InlineText text={card.description} />
            </p>

            {card.aliases && card.aliases.length > 0 && (
              <div className="flashcard__aliases">
                <span className="flashcard__label" id={`aliases-${card.id}`}>
                  Also known as
                </span>
                <ul className="flashcard__alias-list" aria-labelledby={`aliases-${card.id}`}>
                  {card.aliases.map((alias) => (
                    <li key={alias} className="flashcard__alias">
                      {alias}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {platforms.length > 0 && (
              <dl className="flashcard__platforms">
                {platforms.map(({ key, label }) => (
                  <div key={key} className="flashcard__platform">
                    <dt>{label}</dt>
                    <dd>
                      <InlineText text={card.platforms?.[key] ?? ""} />
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {hidden && <VisuallyHidden>You marked this card as known.</VisuallyHidden>}
          </div>

          <p className="flashcard__hint">
            <Icon size="sm">
              <FlipGlyph />
            </Icon>
            Tap the card to see the question
          </p>
        </div>
      </motion.div>
    </div>
  );
}
