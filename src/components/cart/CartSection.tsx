import React from 'react';
import { CartSummary } from '../../types/menu';
import { CartItemCard } from './CartItemCard';
import { CartSummaryCard } from './CartSummaryCard';
import { CartEmptyState } from './CartEmptyState';
import { ArrowLeftIcon } from './CartIcons';

export interface CartSectionProps {
  cart: CartSummary;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart?: () => void;
  onBrowseMenu: () => void;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBrowseMenu,
}) => {
  const cartItemArray = Object.values(cart.items);
  const isEmpty = cart.totalCount === 0 || cartItemArray.length === 0;

  return (
    <section
      id="cart-section"
      className="bitesbro-cart-section"
      aria-labelledby="cart-heading"
    >
      <div className="cart-container">
        {/* Navigation & Header */}
        <div className="cart-header">
          <button
            type="button"
            onClick={onBrowseMenu}
            className="cart-back-btn"
            aria-label="Back to food menu"
          >
            <ArrowLeftIcon size={16} aria-hidden="true" />
            <span>Back to Menu</span>
          </button>

          <div className="cart-header-titles">
            <div className="cart-eyebrow">
              <span className="cart-eyebrow-dot" aria-hidden="true" />
              <span>Customer Cart</span>
            </div>
            <h1 id="cart-heading" className="cart-title">
              Your Food Cart
            </h1>
            <p className="cart-subtitle">
              Review and adjust your selected dishes. Estimated amounts will be
              validated server-side before order preparation.
            </p>
          </div>
        </div>

        {/* Cart Content: Empty State vs 2-Column Staging Layout */}
        {isEmpty ? (
          <CartEmptyState onBrowseMenu={onBrowseMenu} />
        ) : (
          <div className="cart-layout-grid">
            {/* Left: Cart Items Staging */}
            <div
              className="cart-items-wrapper"
              role="region"
              aria-label="Dishes in your cart"
            >
              <div className="cart-items-header-bar">
                <span className="cart-items-count-badge">
                  {cart.totalCount} {cart.totalCount === 1 ? 'Dish' : 'Dishes'}
                </span>
                <span className="cart-items-note">
                  Prices in INR (₹) · Fresh to Order
                </span>
              </div>

              <div className="cart-items-list" role="list">
                {cartItemArray.map((item) => (
                  <div key={item.menuItem.id} role="listitem">
                    <CartItemCard
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemoveItem={onRemoveItem}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <aside className="cart-summary-sidebar" aria-label="Cart calculation">
              <CartSummaryCard
                cart={cart}
                onBrowseMenu={onBrowseMenu}
                onClearCart={onClearCart}
              />
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};
