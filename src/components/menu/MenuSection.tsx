import React, { useState, useMemo } from 'react';
import { MenuItem, MenuCategory, DietaryType } from '../../types/menu';
import { MENU_CATEGORIES, DEMO_MENU_ITEMS, DEMO_CATALOG_DISCLAIMER } from '../../data/menuFixtures';
import { MenuCategories } from './MenuCategories';
import { MenuSearch } from './MenuSearch';
import { FoodCard } from './FoodCard';
import { FoodDetailsModal } from './FoodDetailsModal';
import { MenuEmptyState } from './MenuEmptyState';

export interface MenuSectionProps {
  categories?: MenuCategory[];
  items?: MenuItem[];
  onAddToCart?: (item: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  categories = MENU_CATEGORIES,
  items = DEMO_MENU_ITEMS,
  onAddToCart,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');
  const [inspectedItem, setInspectedItem] = useState<MenuItem | null>(null);

  // Compute category counts based on full catalog
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: items.length,
    };
    for (const item of items) {
      counts[item.categoryId] = (counts[item.categoryId] || 0) + 1;
    }
    return counts;
  }, [items]);

  // Combined search, category, and dietary filtering
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      // 1. Category match
      if (selectedCategoryId !== 'all' && item.categoryId !== selectedCategoryId) {
        return false;
      }

      // 2. Dietary filter match
      if (dietaryFilter !== 'all') {
        if (!item.dietary.includes(dietaryFilter)) {
          return false;
        }
      }

      // 3. Search query match (name, description, ingredients)
      if (query.length > 0) {
        const nameMatch = item.name.toLowerCase().includes(query);
        const descMatch = item.description.toLowerCase().includes(query);
        const ingredientMatch = item.ingredients.some((ing) =>
          ing.toLowerCase().includes(query)
        );

        if (!nameMatch && !descMatch && !ingredientMatch) {
          return false;
        }
      }

      return true;
    });
  }, [items, selectedCategoryId, dietaryFilter, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategoryId('all');
    setSearchQuery('');
    setDietaryFilter('all');
  };

  const currentCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <section
      id="menu-section"
      className="bitesbro-menu-section"
      aria-labelledby="menu-heading"
    >
      <div className="menu-container">
        {/* Section Header */}
        <div className="menu-header">
          <div className="menu-eyebrow">
            <span className="menu-eyebrow-dot" aria-hidden="true" />
            <span>Curated Culinary Lineup</span>
          </div>

          <h2 id="menu-heading" className="menu-title">
            Explore Our Menu
          </h2>

          <p className="menu-subtitle">
            Wholesome grain bowls, slow-braised kitchen mains, artisanal small
            plates, and chilled botanicals. Freshly prepared to order in our
            small-batch cloud kitchen.
          </p>

          {/* Prototype disclaimer compliance banner */}
          <div className="menu-disclaimer-card" role="note">
            <span className="menu-disclaimer-tag">Prototype Notice</span>
            <p className="menu-disclaimer-text">{DEMO_CATALOG_DISCLAIMER}</p>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <MenuCategories
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categoryCounts={categoryCounts}
        />

        {/* Search & Dietary Filter Bar */}
        <MenuSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          totalResults={filteredItems.length}
          dietaryFilter={dietaryFilter}
          onSelectDietaryFilter={setDietaryFilter}
        />

        {/* Results Metadata Bar */}
        <div className="menu-results-summary" aria-live="polite">
          <span className="menu-results-count">
            Showing <strong>{filteredItems.length}</strong>{' '}
            {filteredItems.length === 1 ? 'dish' : 'dishes'}
            {selectedCategoryId !== 'all' && (
              <> in <em>{currentCategory?.name}</em></>
            )}
            {dietaryFilter !== 'all' && (
              <> ({dietaryFilter})</>
            )}
          </span>

          {(searchQuery || selectedCategoryId !== 'all' || dietaryFilter !== 'all') && (
            <button
              type="button"
              className="menu-clear-all-link"
              onClick={handleResetFilters}
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Food Items Grid or Empty State */}
        {filteredItems.length > 0 ? (
          <div
            className="menu-grid"
            role="region"
            aria-label={`${currentCategory?.name || 'All'} dishes`}
          >
            {filteredItems.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onAddToCart={onAddToCart}
                onViewDetails={setInspectedItem}
              />
            ))}
          </div>
        ) : (
          <MenuEmptyState
            searchQuery={searchQuery}
            categoryName={currentCategory?.name}
            onResetFilters={handleResetFilters}
          />
        )}
      </div>

      {/* Accessible Food Details Modal */}
      <FoodDetailsModal
        item={inspectedItem}
        isOpen={Boolean(inspectedItem)}
        onClose={() => setInspectedItem(null)}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};
