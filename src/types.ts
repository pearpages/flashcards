export interface Facet {
  key: string;
  label: string;
  values: string[];
}

export interface Flashcard {
  id: string;
  title: string;
  facets: Record<string, string>;
  summary: string;
  description: string;
  aliases?: string[];
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  facets: Facet[];
  cards: Flashcard[];
}

export type FilterState = Record<string, string | null>;
