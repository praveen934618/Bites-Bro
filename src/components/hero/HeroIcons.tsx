import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

/** Arrow Right Icon for primary CTA navigation */
export const ArrowRightIcon: React.FC<IconProps> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M4.167 10h11.666M10.833 5l5 5-5 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Sparkle / Fresh Craft Star Icon */
export const SparkleIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path d="M10 1.667l1.875 5.625L17.5 9.167l-5.625 1.875L10 16.667l-1.875-5.625L2.5 9.167l5.625-1.875L10 1.667z" />
  </svg>
);

/** Cloud Kitchen Skillet / Pan Icon */
export const KitchenPanIcon: React.FC<IconProps> = ({ size = 18, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 13h12a3 3 0 013 3v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1a3 3 0 013-3z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 15l4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 6c0 1.5-1 2.5-1 4M11 5c0 2-1 3-1 5M15 6c0 1.5-1 2.5-1 4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/** Order Flow Checkmark / Step Icon */
export const OrderFlowIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M16.667 5.833L7.5 15 3.333 10.833"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Fresh Leaf / Ingredients Icon */
export const LeafIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M17.5 2.5c-7.5 0-12.5 4.167-12.5 10 0 3.333 2.5 5 5 5 5.833 0 10-5 10-12.5v-2.5h-2.5z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 12.5c3.333-1.667 6.667-3.333 10-10"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/** Timer / Direct Prep Clock Icon */
export const PrepClockIcon: React.FC<IconProps> = ({ size = 16, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M10 5.833V10l2.5 2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
