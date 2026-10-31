import { Sheet } from "@pearpages/pulp-react/sheet";
import { Button } from "@pearpages/pulp-react/button";
import { Chip } from "@pearpages/pulp-react/chip";
import { Switch } from "@pearpages/pulp-react/switch";
import type { Facet, FilterState, Flashcard } from "../types";
import { facetCounts } from "../filters";
import { valueLabel } from "../valueLabel";
import "./FilterSheet.css";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Bottom sheet on phones, side panel on wide screens. */
  placement: "bottom" | "end";
  facets: Facet[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  /** Cards the facet counts are taken from (already narrowed by Essentials and known cards). */
  countableCards: Flashcard[];
  /** Cards that study will show with the current choices. */
  matchCount: number;
  essentialOnly: boolean;
  onEssentialOnlyChange: (on: boolean) => void;
  showHidden: boolean;
  onShowHiddenChange: (on: boolean) => void;
  /** Cards marked "I know this" in this deck. */
  hiddenCount: number;
  onClearAll: () => void;
}

/** "Filter cards": one chip group per filterable facet, then the Essentials and known-cards switches. */
export default function FilterSheet({
  open,
  onOpenChange,
  placement,
  facets,
  filters,
  onFiltersChange,
  countableCards,
  matchCount,
  essentialOnly,
  onEssentialOnlyChange,
  showHidden,
  onShowHiddenChange,
  hiddenCount,
  onClearAll,
}: FilterSheetProps) {
  const filterable = facets.filter((facet) => facet.filter !== false);
  const anyActive = essentialOnly || showHidden || Object.values(filters).some((value) => value !== null);

  return (
    <Sheet id="filters" open={open} onOpenChange={onOpenChange}>
      <Sheet.Content placement={placement} className="filter-sheet">
        <Sheet.Header>
          <Sheet.Title>Filter cards</Sheet.Title>
          <Sheet.Close aria-label="Close filters" />
        </Sheet.Header>

        <Sheet.Body>
          <div className="filter-sheet__body">
            {filterable.map((facet) => {
              const counts = facetCounts(countableCards, facet, filters);
              const selected = filters[facet.key] ?? null;
              return (
                <fieldset key={facet.key} className="filter-sheet__group">
                  <legend className="filter-sheet__legend">{facet.label}</legend>
                  <div className="filter-sheet__chips">
                    {facet.values.map((value) => (
                      <Chip
                        key={value}
                        size="lg"
                        tone="action"
                        selected={selected === value}
                        onSelectedChange={(on) => onFiltersChange({ ...filters, [facet.key]: on ? value : null })}
                      >
                        <span>{valueLabel(value)}</span>
                        <span className="filter-sheet__count">{counts[value]}</span>
                      </Chip>
                    ))}
                  </div>
                </fieldset>
              );
            })}

            <div className="filter-sheet__switches">
              <Switch
                className="filter-sheet__switch"
                label="Essential cards only"
                description="The must-know cards of the deck"
                checked={essentialOnly}
                onChange={(event) => onEssentialOnlyChange(event.currentTarget.checked)}
              />
              <Switch
                className="filter-sheet__switch"
                label="Show cards I know"
                description={`Cards you hid with “I know this” (${hiddenCount})`}
                checked={showHidden}
                onChange={(event) => onShowHiddenChange(event.currentTarget.checked)}
              />
            </div>
          </div>
        </Sheet.Body>

        <Sheet.Footer>
          <Button variant="ghost" size="lg" onClick={onClearAll} disabled={!anyActive}>
            Clear all
          </Button>
          <Sheet.Close asChild>
            <Button size="lg" className="filter-sheet__apply">
              {matchCount === 0 ? "No cards match" : `Show ${matchCount} ${matchCount === 1 ? "card" : "cards"}`}
            </Button>
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
}
