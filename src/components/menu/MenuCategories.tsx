import React, { useRef } from 'react';
import { MenuCategory } from '../../types/menu';

export interface MenuCategoriesProps {
  categories: MenuCategory[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  categoryCounts?: Record<string, number>;
}

export const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts = {},
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const sortedCategories = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (index + 1) % sortedCategories.length;
      onSelectCategory(sortedCategories[nextIndex].id);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex =
        (index - 1 + sortedCategories.length) % sortedCategories.length;
      onSelectCategory(sortedCategories[prevIndex].id);
    }
  };

  return (
    <nav
      className="menu-categories-wrapper"
      aria-label="Menu categories navigation"
    >
      <div
        className="menu-categories-scroll"
        ref={scrollContainerRef}
        role="tablist"
        aria-orientation="horizontal"
      >
        {sortedCategories.map((cat, index) => {
          const isSelected = cat.id === selectedCategoryId;
          const count = categoryCounts[cat.id];

          return (
            <button
              key={cat.id}
              role="tab"
              type="button"
              id={`tab-${cat.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${cat.id}`}
              tabIndex={isSelected ? 0 : -1}
              className={`menu-category-tab ${isSelected ? 'menu-category-tab--active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              title={cat.description}
            >
              <span className="menu-category-name">{cat.name}</span>
              {typeof count === 'number' && (
                <span
                  className={`menu-category-count ${isSelected ? 'menu-category-count--active' : ''}`}
                  aria-label={`${count} items available`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
