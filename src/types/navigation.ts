/**
 * Navigation Types for BitesBro — Lean Integrated Ordering System
 */

export type UserRole = 'customer' | 'kitchen' | 'admin' | 'finance';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  description?: string;
  badge?: string | number;
  icon?: 'menu' | 'cart' | 'orders' | 'profile';
  isExternal?: boolean;
}

export interface NavAction {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  icon?: 'cart' | 'profile' | 'order';
  badgeCount?: number;
  variant?: 'primary' | 'ghost' | 'icon';
}

/**
 * Link-based navigation action with a mandatory route href
 */
export interface NavActionLink extends NavAction {
  href: string;
}

export interface NavbarConfig {
  brand: {
    name: string;
    tagline?: string;
    homeHref: string;
  };
  customerItems: NavItem[];
  actions: {
    cart: NavActionLink;
    profile: NavActionLink;
    primaryAction: NavActionLink;
  };
}

export interface NavbarProps {
  /** Currently active navigation ID (e.g. 'menu', 'cart', 'orders') */
  activeId?: string;
  /** Custom navigation callback (useful when tabs/views are controlled inside /me) */
  onNavigate?: (item: NavItem) => void;
  /** User role for navigation view (defaults to 'customer') */
  role?: UserRole;
  /** Live cart count if available from state; undefined/0 means no count displayed */
  cartCount?: number;
  /** Optional class name */
  className?: string;
}
