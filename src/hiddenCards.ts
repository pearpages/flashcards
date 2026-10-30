// Cards the learner has hidden ("I know this"), remembered per deck in this browser only.

/** The part of the Web Storage API this module needs, so tests can pass a stub. */
export type HiddenStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const keyFor = (deckId: string) => `flashcards:hidden:${deckId}`;

function defaultStorage(): HiddenStorage | undefined {
  try {
    return globalThis.localStorage;
  } catch {
    // Accessing localStorage throws when site data is blocked.
    return undefined;
  }
}

/**
 * Reads the hidden ids for a deck. Stored data is untrusted: anything that isn't an array of
 * ids of cards in `validIds` is dropped, and unavailable storage means nothing is hidden.
 */
export function loadHidden(
  deckId: string,
  validIds: Iterable<string>,
  storage: HiddenStorage | undefined = defaultStorage(),
): Set<string> {
  try {
    const raw = storage?.getItem(keyFor(deckId));
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const valid = new Set(validIds);
    return new Set(parsed.filter((id): id is string => typeof id === "string" && valid.has(id)));
  } catch {
    return new Set();
  }
}

/** Saves the hidden ids for a deck; an empty set removes the entry. Fails silently. */
export function saveHidden(
  deckId: string,
  ids: ReadonlySet<string>,
  storage: HiddenStorage | undefined = defaultStorage(),
) {
  try {
    if (ids.size === 0) storage?.removeItem(keyFor(deckId));
    else storage?.setItem(keyFor(deckId), JSON.stringify([...ids]));
  } catch {
    // Quota exceeded or storage blocked: hiding still works until the page reloads.
  }
}
