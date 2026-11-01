import React from 'react';
import { CartSummary } from '../../types/menu';
import { ShieldInfoIcon } from './CartIcons';

export interface CartSummaryCardProps {
  cart: CartSummary;
  onBrowseMenu: () => void;
  onClearCart?: () => void;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  cart,
  onBrowseMenu,
  onClearCart,
}) => {
  const hasUnavailableItems = Object.values(cart.items).some(
    (item) => !item.menuItem.isAvailable
  );

  return (
    <div className="cart-summary-card" role="region" aria-label="Order Summary">
      <h2 className="cart-summary-title">Estimated Summary</h2>

      {/* Item Counts & Breakdown */}
      <div className="cart-summary-row">
        <span className="cart-summary-label">
          Total Items ({cart.totalCount} {cart.totalCount === 1 ? 'item' : 'items'})
        </span>
        <span className="cart-summary-value">₹{cart.totalAmount}</span>
      </div>

      <div className="cart-summary-row cart-summary-row--muted">
        <span className="cart-summary-label">Estimated Delivery</span>
        <span className="cart-summary-value-tag">Calculated at checkout</span>
      </div>

      <div className="cart-summary-row cart-summary-row--muted">
        <span className="cart-summary-label">Estimated Taxes</span>
        <span className="cart-summary-value-tag">Verified server-side</span>
      </div>

      <div className="cart-summary-divider" />

      {/* Subtotal Calculation */}
      <div className="cart-summary-total-row">
        <div className="cart-summary-total-label-group">
          <span className="cart-summary-total-label">Estimated Subtotal</span>
          <span className="cart-summary-total-hint">Excludes taxes & delivery</span>
        </div>
        <span className="cart-summary-total-val">₹{cart.totalAmount}</span>
      </div>

      {/* Unavailable Items Warning */}
      {hasUnavailableItems && (
        <div className="cart-summary-warning" role="alert">
          <strong>Action Required:</strong> Your cart includes dishes marked sold out.
          Please remove them to proceed.
        </div>
      )}

      {/* Architectural Security Notice */}
      <div className="cart-summary-compliance-note" role="note">
        <div className="cart-summary-compliance-header">
          <ShieldInfoIcon size={16} />
          <span>Security & Prototype Baseline</span>
        </div>
        <p className="cart-summary-compliance-text">
          Frontend cart values are demonstration estimates. Final dish pricing,
          live cloud kitchen availability, taxes, and idempotency keys will be
          validated server-side by Supabase Edge Functions upon checkout.
        </p>
      </div>

      {/* Primary Action Affordance (Pending Edge Function Integration) */}
      <button
        type="button"
        disabled
        className="cart-checkout-btn"
        aria-describedby="checkout-notice-text"
        title="Checkout is disabled pending backend Edge Function integration"
      >
        <span>Proceed to Checkout</span>
        <span className="cart-checkout-tag">Demo Prototype</span>
      </button>

      <p id="checkout-notice-text" className="cart-checkout-disclaimer">
        Order creation and payment verification are strictly handled server-side
        per AGENTS.md security invariants.
      </p>

      {/* Secondary Quick Actions */}
      <div className="cart-summary-actions">
        <button
          type="button"
          onClick={onBrowseMenu}
          className="cart-continue-btn"
        >
          Add More Dishes
        </button>

        {onClearCart && cart.totalCount > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="cart-clear-btn"
            aria-label="Clear all items from cart"
          >
            Clear Cart
          </button>
        )}
      </div>
    </div>
  );
};
