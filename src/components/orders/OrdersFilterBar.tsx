import React from 'react';
import { OrderCategoryFilter } from '../../types/orders';

export interface OrdersFilterBarProps {
  currentFilter: OrderCategoryFilter;
  onFilterChange: (filter: OrderCategoryFilter) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
    cancelled: number;
  };
}

interface FilterOption {
  id: OrderCategoryFilter;
  label: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Orders' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const OrdersFilterBar: React.FC<OrdersFilterBarProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  return (
    <div
      className="orders-filter-bar"
      role="tablist"
      aria-label="Filter orders by status category"
    >
      {FILTER_OPTIONS.map((option) => {
        const isSelected = currentFilter === option.id;
        const count = counts[option.id] || 0;

        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls="orders-list-panel"
            className={`orders-filter-btn ${isSelected ? 'orders-filter-btn--active' : ''}`}
            onClick={() => onFilterChange(option.id)}
          >
            <span>{option.label}</span>
            <span
              className={`orders-filter-badge ${isSelected ? 'orders-filter-badge--active' : ''}`}
              aria-label={`${count} orders`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
