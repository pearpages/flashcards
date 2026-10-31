import { useEffect, useMemo, useRef, useState } from "react";
import type { Deck, Facet, Flashcard } from "../types";
import { TextField } from "@pearpages/pulp-react/text-field";
import { Chip } from "@pearpages/pulp-react/chip";
import { Button } from "@pearpages/pulp-react/button";
import { Icon } from "@pearpages/pulp-react/icon";
import { VisuallyHidden } from "@pearpages/pulp-react/visually-hidden";
import { getCardImages } from "../decks";
import { valueLabel } from "../valueLabel";
import { StarGlyph } from "./icons";
import "./BrowseView.css";

interface ActiveFilter {
  facet: Facet;
  value: string;
}

interface BrowseViewProps {
  deck: Deck;
  /** Cards to list, already narrowed by every filter except the grouping facet. */
  cards: Flashcard[];
  /** Facet whose values become the sections (e.g. purpose). */
  groupFacet: Facet;
  activeFilters: ActiveFilter[];
  activeCardId?: string;
  /** False while the view is hidden (mobile study view). */
  visible: boolean;
  onSelect: (card: Flashcard) => void;
  onClearFilter: (facetKey: string) => void;
  essentialOnly: boolean;
  onClearEssential: () => void;
  /** Cards marked known; listed faded with a Put back button. */
  hiddenIds: ReadonlySet<string>;
  onUnhide: (cardId: string) => void;
}

type Block = "start" | "center" | "nearest";

/**
 * Scrolls `el` into view inside the list when the list is its own scroll area (desktop sidebar),
 * so the page itself doesn't move; otherwise (mobile) scrolls the page.
 */
function scrollToElement(list: HTMLElement, el: HTMLElement, block: Block, smooth = false) {
  const behavior = smooth ? "smooth" : "auto";
  const listScrolls = getComputedStyle(list).overflowY !== "visible";
  if (!listScrolls) {
    el.scrollIntoView({ block, behavior });
    return;
  }
  const margin = 8;
  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;
  let target: number;
  if (block === "start") target = top - margin;
  else if (block === "center") target = top - (list.clientHeight - el.offsetHeight) / 2;
  else if (top < list.scrollTop) target = top - margin;
  else if (bottom > list.scrollTop + list.clientHeight) target = bottom - list.clientHeight + margin;
  else return;
  list.scrollTo({ top: target, behavior });
}

function matches(card: Flashcard, query: string) {
  if (!query) return true;
  const haystack = [
    card.title,
    card.summary,
    ...(card.aliases ?? []),
    ...Object.values(card.platforms ?? {}),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export default function BrowseView({
  deck,
  cards,
  groupFacet,
  activeFilters,
  activeCardId,
  visible,
  onSelect,
  onClearFilter,
  essentialOnly,
  onClearEssential,
  hiddenIds,
  onUnhide,
}: BrowseViewProps) {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const query = search.trim().toLowerCase();

  const groups = useMemo(
    () =>
      groupFacet.values
        .map((value) => ({
          value,
          cards: cards.filter((card) => card.facets[groupFacet.key] === value && matches(card, query)),
        }))
        .filter((group) => group.cards.length > 0),
    [cards, groupFacet, query],
  );

  // Highlight the section currently at the top of the list as the user scrolls.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !visible) return;
    const sections = [...list.querySelectorAll<HTMLElement>("[data-group]")];
    const onScreen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const group = (entry.target as HTMLElement).dataset.group!;
          if (entry.isIntersecting) onScreen.add(group);
          else onScreen.delete(group);
        }
        const first = sections.find((s) => onScreen.has(s.dataset.group!));
        if (first) setActiveGroup(first.dataset.group!);
      },
      { rootMargin: "-140px 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [groups, visible]);

  // Keep the card being studied in view: centred when the list appears, minimal scroll after that.
  const wasVisible = useRef(false);
  useEffect(() => {
    if (!visible || !activeCardId) {
      wasVisible.current = visible;
      return;
    }
    const list = listRef.current;
    const row = list?.querySelector<HTMLElement>(`[data-card-id="${CSS.escape(activeCardId)}"]`);
    if (list && row) scrollToElement(list, row, wasVisible.current ? "nearest" : "center");
    wasVisible.current = true;
  }, [visible, activeCardId]);

  const jumpTo = (group: string) => {
    setActiveGroup(group);
    const list = listRef.current;
    const section = list?.querySelector<HTMLElement>(`[data-group="${CSS.escape(group)}"]`);
    if (list && section) scrollToElement(list, section, "start", true);
  };

  const otherFacets = deck.facets.filter((facet) => facet.key !== groupFacet.key);

  return (
    <section className="browse" aria-label="Browse cards">
      <div className="browse__toolbar">
        <TextField
          type="search"
          label="Search cards"
          hideLabel
          placeholder={`Search ${cards.length} ${cards.length === 1 ? "card" : "cards"}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
        />

        {(activeFilters.length > 0 || essentialOnly) && (
          <div className="browse__filters">
            <span className="browse__filters-label">Filtered by</span>
            {essentialOnly && (
              <Chip size="sm" onRemove={onClearEssential} removeLabel="Remove filter">
                Essential only
              </Chip>
            )}
            {activeFilters.map(({ facet, value }) => (
              <Chip key={facet.key} size="sm" onRemove={() => onClearFilter(facet.key)} removeLabel="Remove filter">
                {valueLabel(value)}
              </Chip>
            ))}
          </div>
        )}

        <nav className="browse__jump" aria-label={`Jump to ${groupFacet.label.toLowerCase()}`}>
          {groups.map((group) => (
            <button
              key={group.value}
              type="button"
              className="browse__jump-chip"
              aria-current={activeGroup === group.value ? "true" : undefined}
              onClick={() => jumpTo(group.value)}
            >
              {valueLabel(group.value)}
              <span className="browse__jump-count">{group.cards.length}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="browse__list" ref={listRef}>
        {groups.map((group) => (
          <section
            key={group.value}
            className="browse__group"
            data-group={group.value}
            aria-labelledby={`group-${group.value}`}
          >
            <h2 className="browse__group-title" id={`group-${group.value}`}>
              {valueLabel(group.value)}
              <span className="browse__group-count">
                {group.cards.length} {group.cards.length === 1 ? "card" : "cards"}
              </span>
            </h2>
            <ul className="browse__items">
              {group.cards.map((card) => {
                const thumb = getCardImages(deck.id, card.id).desktop;
                const isHidden = hiddenIds.has(card.id);
                const meta = otherFacets.map(({ key }) => card.facets[key]).filter(Boolean).map(valueLabel);
                return (
                  <li key={card.id} className={`browse__row ${isHidden ? "browse__row--hidden" : ""}`}>
                    <button
                      type="button"
                      className="browse__item"
                      data-card-id={card.id}
                      aria-current={card.id === activeCardId ? "true" : undefined}
                      onClick={() => onSelect(card)}
                    >
                      <span className="browse__thumb" aria-hidden="true">
                        {thumb ? <img src={thumb} alt="" loading="lazy" decoding="async" /> : "?"}
                      </span>
                      <span className="browse__item-text">
                        <span className="browse__item-title">
                          {card.title}
                          {card.essential && (
                            <span className="browse__star">
                              <Icon size="inherit" label="Essential">
                                <StarGlyph />
                              </Icon>
                            </span>
                          )}
                          {isHidden && <VisuallyHidden>, known</VisuallyHidden>}
                        </span>
                        <span className="browse__item-summary">{card.summary}</span>
                        {meta.length > 0 && <span className="browse__item-meta">{meta.join(" · ")}</span>}
                      </span>
                    </button>
                    {isHidden && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="browse__unhide"
                        onClick={() => onUnhide(card.id)}
                        aria-label={`Put ${card.title} back in study`}
                      >
                        Put back
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        {groups.length === 0 && (
          <p className="browse__empty">
            {query ? `No cards match “${search.trim()}”.` : "No cards match these filters."}
          </p>
        )}
      </div>
    </section>
  );
}
