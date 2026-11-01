import React, { useRef } from 'react';
import { SearchIcon, ClearIcon } from './MenuIcons';
import { DietaryType } from '../../types/menu';

export interface MenuSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  totalResults: number;
  dietaryFilter: DietaryType | 'all';
  onSelectDietaryFilter: (dietary: DietaryType | 'all') => void;
}

const DIETARY_OPTIONS: Array<{ id: DietaryType | 'all'; label: string }> = [
  { id: 'all', label: 'All Dietary' },
  { id: 'veg', label: 'Vegetarian' },
  { id: 'non-veg', label: 'Non-Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'high-protein', label: 'High Protein' },
];

export const MenuSearch: React.FC<MenuSearchProps> = ({
  searchQuery,
  onSearchChange,
  onClearSearch,
  totalResults,
  dietaryFilter,
  onSelectDietaryFilter,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onClearSearch();
    inputRef.current?.focus();
  };

  return (
    <div className="menu-search-filter-bar">
      {/* Search Input Control */}
      <div className="menu-search-input-wrapper">
        <label htmlFor="menu-search-input" className="sr-only">
          Search food menu by dish name or ingredient
        </label>
        <span className="menu-search-icon-adornment" aria-hidden="true">
          <SearchIcon size={18} />
        </span>
        <input
          id="menu-search-input"
          ref={inputRef}
          type="search"
          role="searchbox"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by dish name, spice, or ingredient..."
          className="menu-search-input"
          autoComplete="off"
          spellCheck="false"
        />
        {searchQuery.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="menu-search-clear-btn"
            aria-label="Clear search input"
            title="Clear search"
          >
            <ClearIcon size={16} />
          </button>
        )}
      </div>

      {/* Quick Dietary Filters */}
      <div
        className="menu-dietary-filters"
        role="group"
        aria-label="Filter dishes by dietary preference"
      >
        <span className="menu-dietary-label" aria-hidden="true">
          Dietary:
        </span>
        {DIETARY_OPTIONS.map((option) => {
          const isSelected = dietaryFilter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`menu-dietary-pill ${isSelected ? 'menu-dietary-pill--active' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelectDietaryFilter(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Screen reader live announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {totalResults === 1
          ? '1 dish found'
          : `${totalResults} dishes found`}
      </div>
    </div>
  );
};
