export interface Facet {
  key: string;
  label: string;
  values: string[];
  /** Set to false to show the facet as a card badge without a filter row. */
  filter?: boolean;
}

/** A column of equivalents on the card back, e.g. { key: "ios", label: "iOS" }. */
export interface Platform {
  key: string;
  label: string;
}

export interface Flashcard {
  id: string;
  title: string;
  facets: Record<string, string>;
  summary: string;
  description: string;
  aliases?: string[];
  /** Equivalents keyed by the deck's platforms, e.g. { ios: "Toggle", android: "Switch" }. */
  platforms?: Record<string, string>;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  facets: Facet[];
  /** The platforms whose equivalents cards may list, in display order. */
  platforms?: Platform[];
  cards: Flashcard[];
}

export type FilterState = Record<string, string | null>;
