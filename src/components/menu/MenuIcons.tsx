import React from 'react';
import { DietaryType, SpiceLevel } from '../../types/menu';

interface IconProps {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export const SearchIcon: React.FC<IconProps> = ({
  className = '',
  size = 18,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const ClearIcon: React.FC<IconProps> = ({
  className = '',
  size = 16,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({
  className = '',
  size = 18,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  className = '',
  size = 16,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({
  className = '',
  size = 14,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const FlameIcon: React.FC<IconProps & { level?: SpiceLevel }> = ({
  className = '',
  size = 14,
  level = 'mild',
  'aria-hidden': ariaHidden = true,
}) => {
  const getFill = () => {
    switch (level) {
      case 'spicy':
        return '#C0393B';
      case 'medium':
        return '#D4621A';
      case 'mild':
        return '#F4AE52';
      default:
        return 'none';
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={getFill()}
      stroke={level === 'none' ? 'currentColor' : '#943803'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 17c1.38 0 2.5-1.12 2.5-2.5 0-1.63-1.4-3.23-2.5-4.5-1.1 1.27-2.5 2.87-2.5 4.5z" />
      <path d="M12 2c1 3 4 5 4 9a6 6 0 1 1-12 0c0-4 3-6 4-9 1 1.5 2 2.5 4 0z" />
    </svg>
  );
};

export const InfoIcon: React.FC<IconProps> = ({
  className = '',
  size = 16,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({
  className = '',
  size = 16,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

export const CalorieIcon: React.FC<IconProps> = ({
  className = '',
  size = 14,
  'aria-hidden': ariaHidden = true,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden={ariaHidden}
  >
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

/**
 * Standard Indian food safety dietary indicator
 * Green square with dot = Vegetarian
 * Brown/Red square with triangle = Non-Vegetarian
 */
export const DietarySymbol: React.FC<{
  type: DietaryType;
  size?: number;
  className?: string;
}> = ({ type, size = 16, className = '' }) => {
  if (type === 'veg' || type === 'vegan') {
    return (
      <span
        className={`dietary-symbol dietary-symbol--veg ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" width={size} height={size}>
          <rect
            x="1.5"
            y="1.5"
            width="17"
            height="17"
            rx="3"
            fill="none"
            stroke="#16845B"
            strokeWidth="2"
          />
          <circle cx="10" cy="10" r="4.5" fill="#16845B" />
        </svg>
      </span>
    );
  }

  if (type === 'non-veg') {
    return (
      <span
        className={`dietary-symbol dietary-symbol--non-veg ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 20 20" width={size} height={size}>
          <rect
            x="1.5"
            y="1.5"
            width="17"
            height="17"
            rx="3"
            fill="none"
            stroke="#943803"
            strokeWidth="2"
          />
          <polygon points="10,5 15,14 5,14" fill="#943803" />
        </svg>
      </span>
    );
  }

  return null;
};
