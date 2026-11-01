import React from 'react';
import { EmptyBagIcon, ArrowLeftIcon } from './CartIcons';

export interface CartEmptyStateProps {
  onBrowseMenu: () => void;
}

export const CartEmptyState: React.FC<CartEmptyStateProps> = ({
  onBrowseMenu,
}) => {
  return (
    <div
      className="cart-empty-state"
      role="status"
      aria-label="Your cart is currently empty"
    >
      <div className="cart-empty-icon-bubble" aria-hidden="true">
        <EmptyBagIcon size={44} />
      </div>

      <h2 className="cart-empty-title">Your Cart is Empty</h2>

      <p className="cart-empty-text">
        You haven&apos;t selected any dishes yet. Explore our curated cloud kitchen
        menu to discover freshly crafted grain bowls, slow-braised mains, and
        chilled artisanal refreshers.
      </p>

      <button
        type="button"
        onClick={onBrowseMenu}
        className="cart-empty-browse-btn"
        aria-label="Browse menu to add dishes"
      >
        <ArrowLeftIcon size={16} aria-hidden="true" />
        <span>Browse Menu</span>
      </button>
    </div>
  );
};
