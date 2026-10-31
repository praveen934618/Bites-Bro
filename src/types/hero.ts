/**
 * Hero Section Types for BitesBro — Lean Integrated Ordering System
 */

export interface HeroAction {
  label: string;
  href: string;
  ariaLabel: string;
  onClick?: () => void;
}

export interface HeroTrustPoint {
  id: string;
  icon: 'prep' | 'track' | 'fresh';
  label: string;
  description: string;
}

export interface HeroProps {
  /** Custom headline override if needed */
  headline?: React.ReactNode;
  /** Custom description override if needed */
  description?: string;
  /** Primary call-to-action configuration (defaults to 'Explore Menu' -> '/me') */
  primaryAction?: HeroAction;
  /** Secondary action configuration (defaults to 'Track Orders' -> '/me#orders') */
  secondaryAction?: HeroAction;
  /** Navigation callback handler */
  onNavigate?: (route: string) => void;
  /** Custom hero image source (defaults to local optimized culinary artwork) */
  imageSrc?: string;
  /** Meaningful accessible image alt text */
  imageAlt?: string;
  /** Optional container class name */
  className?: string;
}
