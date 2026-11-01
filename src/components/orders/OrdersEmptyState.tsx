import React from 'react';
import { PackageIcon, ArrowLeftIcon } from './OrderIcons';

export interface OrdersEmptyStateProps {
  isFiltered?: boolean;
  filterLabel?: string;
  onBrowseMenu: () => void;
  onResetFilter?: () => void;
}

export const OrdersEmptyState: React.FC<OrdersEmptyStateProps> = ({
  isFiltered = false,
  filterLabel = '',
  onBrowseMenu,
  onResetFilter,
}) => {
  return (
    <div
      className="orders-empty-state"
      role="status"
      aria-label={
        isFiltered
          ? `No ${filterLabel} orders found`
          : 'You have no previous orders'
      }
    >
      <div className="orders-empty-icon-bubble" aria-hidden="true">
        <PackageIcon size={44} />
      </div>

      <h3 className="orders-empty-title">
        {isFiltered ? `No ${filterLabel} Orders Found` : 'No Orders Yet'}
      </h3>

      <p className="orders-empty-text">
        {isFiltered
          ? `You currently do not have any orders in the "${filterLabel}" status category.`
          : 'You haven’t placed any food orders yet. Explore our freshly crafted cloud kitchen menu to select artisan bowls, savory curries, and botanical refreshers.'}
      </p>

      <div className="orders-empty-actions">
        {isFiltered && onResetFilter ? (
          <button
            type="button"
            onClick={onResetFilter}
            className="orders-empty-reset-btn"
          >
            View All Orders
          </button>
        ) : (
          <button
            type="button"
            onClick={onBrowseMenu}
            className="orders-empty-browse-btn"
            aria-label="Browse menu to order fresh food"
          >
            <ArrowLeftIcon size={16} aria-hidden="true" />
            <span>Browse Today's Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};
