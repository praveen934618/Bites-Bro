import React, { useState } from 'react';
import { MenuItem } from '../../types/menu';
import {
  DietarySymbol,
  FlameIcon,
  ClockIcon,
  PlusIcon,
  CheckIcon,
  InfoIcon,
} from './MenuIcons';

export interface FoodCardProps {
  item: MenuItem;
  onAddToCart?: (item: MenuItem) => void;
  onViewDetails?: (item: MenuItem) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  item,
  onAddToCart,
  onViewDetails,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(item.imageUrl);
  const [isAddedRecently, setIsAddedRecently] = useState<boolean>(false);

  const handleImageError = () => {
    setImageSrc('/images/menu/dish-fallback.svg');
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.isAvailable) return;

    if (onAddToCart) {
      onAddToCart(item);
      setIsAddedRecently(true);
      setTimeout(() => setIsAddedRecently(false), 1400);
    }
  };

  const primaryDietary = item.dietary.find(
    (d) => d === 'veg' || d === 'non-veg' || d === 'vegan'
  ) || 'veg';

  const secondaryDietary = item.dietary.filter(
    (d) => d !== 'veg' && d !== 'non-veg'
  );

  return (
    <article
      className={`food-card ${!item.isAvailable ? 'food-card--unavailable' : ''}`}
      aria-labelledby={`food-title-${item.id}`}
    >
      {/* Dish Media Container */}
      <div className="food-card-media-wrapper">
        <img
          src={imageSrc}
          alt={item.imageAlt}
          onError={handleImageError}
          className="food-card-image"
          loading="lazy"
        />

        {/* Dietary symbol badge */}
        <div className="food-card-dietary-badge" title={primaryDietary}>
          <DietarySymbol type={primaryDietary} size={18} />
        </div>

        {/* Sold-out or Demonstration overlay tags */}
        {!item.isAvailable ? (
          <div className="food-card-status-badge food-card-status-badge--sold-out">
            Sold Out
          </div>
        ) : item.isDemonstration ? (
          <div className="food-card-status-badge food-card-status-badge--demo">
            Demo Kitchen
          </div>
        ) : null}

        {/* Quick Details Trigger Button */}
        <button
          type="button"
          onClick={() => onViewDetails?.(item)}
          className="food-card-details-trigger"
          aria-label={`View ingredients and details for ${item.name}`}
          title="View Dish Details"
        >
          <InfoIcon size={16} />
          <span>Details</span>
        </button>
      </div>

      {/* Dish Information */}
      <div className="food-card-content">
        <div className="food-card-header">
          <div className="food-card-meta-row">
            {item.spiceLevel && item.spiceLevel !== 'none' && (
              <span
                className="food-card-meta-pill"
                title={`Spice Level: ${item.spiceLevel}`}
              >
                <FlameIcon size={13} level={item.spiceLevel} />
                <span className="capitalize">{item.spiceLevel}</span>
              </span>
            )}

            <span
              className="food-card-meta-pill"
              title={`Estimated preparation time: ${item.preparationTimeMinutes} minutes`}
            >
              <ClockIcon size={13} />
              <span>{item.preparationTimeMinutes}m prep</span>
            </span>

            {secondaryDietary.map((tag) => (
              <span
                key={tag}
                className="food-card-dietary-tag"
                title={`Dietary: ${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 id={`food-title-${item.id}`} className="food-card-title">
            {item.name}
          </h3>
        </div>

        <p className="food-card-description">{item.description}</p>

        {/* Footer: Price & Action */}
        <div className="food-card-footer">
          <div className="food-card-price-container">
            <span className="food-card-currency">₹</span>
            <span className="food-card-price-val">{item.price}</span>
            {item.calories && (
              <span className="food-card-calories">
                • {item.calories} kcal
              </span>
            )}
          </div>

          <button
            type="button"
            className={`food-card-action-btn ${isAddedRecently ? 'food-card-action-btn--added' : ''}`}
            onClick={handleAddToCartClick}
            disabled={!item.isAvailable}
            aria-label={
              !item.isAvailable
                ? `${item.name} is sold out`
                : isAddedRecently
                ? `Added ${item.name} to cart`
                : `Add ${item.name} to cart for ₹${item.price}`
            }
          >
            {!item.isAvailable ? (
              <span>Unavailable</span>
            ) : isAddedRecently ? (
              <>
                <CheckIcon size={16} aria-hidden="true" />
                <span>Added</span>
              </>
            ) : (
              <>
                <PlusIcon size={16} aria-hidden="true" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
