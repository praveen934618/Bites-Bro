import React, { useEffect, useRef } from 'react';
import { MenuItem } from '../../types/menu';
import {
  ClearIcon,
  DietarySymbol,
  FlameIcon,
  ClockIcon,
  CalorieIcon,
  PlusIcon,
} from './MenuIcons';

export interface FoodDetailsModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (item: MenuItem) => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Store previously focused element and restore when modal closes
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;

      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Set initial focus to close button
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
        previousActiveElementRef.current?.focus();
      };
    }
  }, [isOpen]);

  // Handle Escape key and Tab focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const primaryDietary =
    item.dietary.find((d) => d === 'veg' || d === 'non-veg' || d === 'vegan') ||
    'veg';

  const handleAddToCart = () => {
    if (!item.isAvailable) return;
    onAddToCart?.(item);
    onClose();
  };

  return (
    <div
      className="food-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-food-title"
        aria-describedby="modal-food-description"
        className="food-modal-dialog"
      >
        {/* Modal Close Button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="food-modal-close-btn"
          aria-label="Close food details dialog"
        >
          <ClearIcon size={20} />
        </button>

        {/* Modal Media */}
        <div className="food-modal-media-wrapper">
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            onError={(e) => {
              e.currentTarget.src = '/images/menu/dish-fallback.svg';
            }}
            className="food-modal-image"
          />
          <div className="food-modal-dietary-badge" title={primaryDietary}>
            <DietarySymbol type={primaryDietary} size={20} />
          </div>
          {!item.isAvailable && (
            <div className="food-modal-sold-out-badge">Sold Out</div>
          )}
        </div>

        {/* Modal Content */}
        <div className="food-modal-content">
          <div className="food-modal-header">
            <div className="food-modal-meta-pills">
              {item.spiceLevel && item.spiceLevel !== 'none' && (
                <span className="food-modal-pill" title={`Spice Level: ${item.spiceLevel}`}>
                  <FlameIcon size={14} level={item.spiceLevel} />
                  <span className="capitalize">{item.spiceLevel}</span>
                </span>
              )}

              <span className="food-modal-pill">
                <ClockIcon size={14} />
                <span>{item.preparationTimeMinutes} min preparation</span>
              </span>

              {item.calories && (
                <span className="food-modal-pill">
                  <CalorieIcon size={14} />
                  <span>{item.calories} kcal</span>
                </span>
              )}
            </div>

            <h2 id="modal-food-title" className="food-modal-title">
              {item.name}
            </h2>

            <div className="food-modal-price-tag">
              <span className="food-modal-currency">₹</span>
              <span className="food-modal-price-val">{item.price}</span>
            </div>
          </div>

          <p id="modal-food-description" className="food-modal-description">
            {item.description}
          </p>

          {/* Ingredients Section */}
          <div className="food-modal-section">
            <h3 className="food-modal-section-title">Ingredients</h3>
            <ul className="food-modal-ingredients-list" aria-label="Ingredients">
              {item.ingredients.map((ingredient, idx) => (
                <li key={idx} className="food-modal-ingredient-chip">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Allergens Section */}
          <div className="food-modal-section">
            <h3 className="food-modal-section-title">Allergen Information</h3>
            {item.allergens && item.allergens.length > 0 ? (
              <p className="food-modal-allergen-alert">
                <strong>Contains:</strong> {item.allergens.join(', ')}
              </p>
            ) : (
              <p className="food-modal-allergen-none">
                No common allergens declared in demo specification. Kitchen allergen profiles will be verified in production.
              </p>
            )}
          </div>

          {/* Prototype disclaimer note */}
          {item.isDemonstration && (
            <div className="food-modal-demo-notice">
              <span>Prototype Notice:</span> Menu item details, nutrition estimates, and preparation times
              are demonstration fixtures for interface verification. Operational availability and values will be confirmed by cloud kitchen systems upon order placement.
            </div>
          )}

          {/* Modal Footer / Add to Cart */}
          <div className="food-modal-footer">
            <button
              type="button"
              className="food-modal-add-btn"
              disabled={!item.isAvailable}
              onClick={handleAddToCart}
              aria-label={
                !item.isAvailable
                  ? `${item.name} is currently sold out`
                  : `Add ${item.name} to cart for ₹${item.price}`
              }
            >
              {!item.isAvailable ? (
                <span>Currently Sold Out</span>
              ) : (
                <>
                  <PlusIcon size={18} aria-hidden="true" />
                  <span>Add to Cart • ₹{item.price}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
