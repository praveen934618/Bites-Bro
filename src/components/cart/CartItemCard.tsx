import React, { useState } from 'react';
import { CartItem } from '../../types/menu';
import { MinusIcon, PlusIcon, TrashIcon } from './CartIcons';

export interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const { menuItem, quantity } = item;
  const [imageSrc, setImageSrc] = useState<string>(menuItem.imageUrl);

  const handleImageError = () => {
    setImageSrc('/images/menu/dish-fallback.svg');
  };

  const lineSubtotal = menuItem.price * quantity;

  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(menuItem.id, quantity - 1);
    } else {
      onRemoveItem(menuItem.id);
    }
  };

  const handleIncrease = () => {
    if (!menuItem.isAvailable) return;
    onUpdateQuantity(menuItem.id, quantity + 1);
  };

  return (
    <article
      className={`cart-item-card ${!menuItem.isAvailable ? 'cart-item-card--unavailable' : ''}`}
      aria-labelledby={`cart-item-name-${menuItem.id}`}
    >
      {/* Dish Thumbnail */}
      <div className="cart-item-image-wrapper">
        <img
          src={imageSrc}
          alt={menuItem.imageAlt || menuItem.name}
          onError={handleImageError}
          className="cart-item-image"
          loading="lazy"
        />
        {!menuItem.isAvailable ? (
          <span className="cart-item-badge cart-item-badge--sold-out">
            Sold Out
          </span>
        ) : menuItem.isDemonstration ? (
          <span className="cart-item-badge cart-item-badge--demo">
            Demo Item
          </span>
        ) : null}
      </div>

      {/* Item Details */}
      <div className="cart-item-info">
        <div className="cart-item-header">
          <div className="cart-item-title-group">
            <h3 id={`cart-item-name-${menuItem.id}`} className="cart-item-title">
              {menuItem.name}
            </h3>
            <div className="cart-item-meta">
              <span className="cart-item-unit-price">
                ₹{menuItem.price} each
              </span>
              {menuItem.dietary && menuItem.dietary.length > 0 && (
                <span className="cart-item-dietary-tag">
                  {menuItem.dietary.join(' · ')}
                </span>
              )}
            </div>
          </div>

          {/* Line Subtotal */}
          <div className="cart-item-subtotal-group">
            <span className="cart-item-subtotal-label">Subtotal</span>
            <span className="cart-item-subtotal-val">₹{lineSubtotal}</span>
          </div>
        </div>

        {/* Unavailable Dish Notice */}
        {!menuItem.isAvailable && (
          <div className="cart-item-alert" role="alert">
            <span>This dish is currently sold out. Please remove it from your cart.</span>
          </div>
        )}

        {/* Action Controls: Quantity Stepper & Remove */}
        <div className="cart-item-actions">
          <div
            className="cart-stepper"
            role="group"
            aria-label={`Adjust quantity for ${menuItem.name}`}
          >
            <button
              type="button"
              className="cart-stepper-btn"
              onClick={handleDecrease}
              aria-label={
                quantity === 1
                  ? `Remove ${menuItem.name} from cart`
                  : `Decrease quantity of ${menuItem.name}`
              }
              title={quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
            >
              {quantity === 1 ? <TrashIcon size={14} /> : <MinusIcon size={14} />}
            </button>

            <span
              className="cart-stepper-count"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Current quantity: ${quantity}`}
            >
              {quantity}
            </span>

            <button
              type="button"
              className="cart-stepper-btn"
              onClick={handleIncrease}
              disabled={!menuItem.isAvailable}
              aria-label={`Increase quantity of ${menuItem.name}`}
              title={
                !menuItem.isAvailable
                  ? 'Item is currently unavailable'
                  : 'Increase quantity'
              }
            >
              <PlusIcon size={14} />
            </button>
          </div>

          <button
            type="button"
            className="cart-item-remove-btn"
            onClick={() => onRemoveItem(menuItem.id)}
            aria-label={`Remove ${menuItem.name} from cart`}
          >
            <TrashIcon size={14} aria-hidden="true" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </article>
  );
};
