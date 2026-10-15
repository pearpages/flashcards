import type { Facet, FilterState } from "../types";
import "./DeckFilters.css";

interface DeckFiltersProps {
  facets: Facet[];
  filters: FilterState;
  count: number;
  onChange: (filters: FilterState) => void;
}

interface ChipRowProps {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
}

function ChipRow({ label, options, value, onChange }: ChipRowProps) {
  return (
    <div className="deck-filters__row" role="group" aria-label={label}>
      <span className="deck-filters__label">{label}</span>
      <button
        type="button"
        className="deck-filters__chip"
        aria-pressed={value === null}
        onClick={() => onChange(null)}
      >
        All
      </button>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className="deck-filters__chip"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function DeckFilters({ facets, filters, count, onChange }: DeckFiltersProps) {
  return (
    <div className="deck-filters">
      {facets
        .filter((facet) => facet.filter !== false)
        .map((facet) => (
          <ChipRow
            key={facet.key}
            label={facet.label}
            options={facet.values}
            value={filters[facet.key] ?? null}
            onChange={(value) => onChange({ ...filters, [facet.key]: value })}
          />
        ))}
      <p className="deck-filters__count" aria-live="polite">
        {count} {count === 1 ? "card" : "cards"}
      </p>
    </div>
  );
}
