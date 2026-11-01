import React from 'react';
import { RefreshIcon, SearchIcon } from './MenuIcons';

export interface MenuEmptyStateProps {
  searchQuery?: string;
  categoryName?: string;
  onResetFilters: () => void;
}

export const MenuEmptyState: React.FC<MenuEmptyStateProps> = ({
  searchQuery,
  categoryName,
  onResetFilters,
}) => {
  return (
    <div
      className="menu-empty-state"
      role="status"
      aria-label="No dishes found"
    >
      <div className="menu-empty-icon-circle" aria-hidden="true">
        <SearchIcon size={32} />
      </div>
      <h3 className="menu-empty-title">No Dishes Match Your Search</h3>
      <p className="menu-empty-description">
        {searchQuery ? (
          <>
            We couldn&apos;t find any offerings matching &ldquo;
            <strong>{searchQuery}</strong>&rdquo;
            {categoryName && categoryName !== 'All Items' ? (
              <> in <em>{categoryName}</em></>
            ) : null}
            . Try adjusting your keywords or clearing dietary filters.
          </>
        ) : (
          <>
            No dishes currently available in this selected filter. Explore our
            other cloud kitchen categories or reset your filters.
          </>
        )}
      </p>
      <button
        type="button"
        className="menu-empty-reset-btn"
        onClick={onResetFilters}
      >
        <RefreshIcon size={16} aria-hidden="true" />
        <span>Reset All Filters</span>
      </button>
    </div>
  );
};
