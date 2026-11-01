import { NavbarConfig, NavItem, UserRole } from '../../types/navigation';

/**
 * BitesBro Navigation Configuration
 * Aligned with docs/ROUTES.md and docs/ARCHITECTURE.md
 */
export const NAVBAR_CONFIG: NavbarConfig = {
  brand: {
    name: 'BitesBro',
    homeHref: '/me',
  },
  // Primary customer browsing & tracking destinations from docs/ROUTES.md
  // Cart is dedicated in the right actions cluster to avoid duplication
  customerItems: [
    {
      id: 'menu',
      label: 'Menu',
      href: '/me',
      description: 'Explore today’s freshly prepared dishes',
      icon: 'menu',
    },
    {
      id: 'orders',
      label: 'Orders',
      href: '/me#orders',
      description: 'View demonstration order history and status',
      icon: 'orders',
    },
  ],
  actions: {
    cart: {
      id: 'action-cart',
      label: 'Cart',
      href: '/me#cart',
      ariaLabel: 'View Cart',
      icon: 'cart',
      variant: 'icon',
    },
    profile: {
      id: 'action-profile',
      label: 'Profile',
      href: '/profile',
      ariaLabel: 'Customer Profile and Settings',
      icon: 'profile',
      variant: 'icon',
    },
    primaryAction: {
      id: 'action-order',
      label: 'Order Now',
      href: '/me',
      ariaLabel: 'Browse menu to order',
      variant: 'primary',
    },
  },
};

/**
 * Role-aware navigation definitions
 * Extensible for future phase integrations without leaking privileged actions
 */
export const ROLE_NAVIGATION_ITEMS: Record<UserRole, NavItem[]> = {
  customer: NAVBAR_CONFIG.customerItems,
  kitchen: [
    { id: 'kitchen-queue', label: 'Order Queue', href: '/kitchen/queue', icon: 'orders' },
  ],
  admin: [
    { id: 'admin-menu', label: 'Menu Management', href: '/admin/menu', icon: 'menu' },
    { id: 'admin-orders', label: 'All Orders', href: '/admin/orders', icon: 'orders' },
    { id: 'admin-reports', label: 'Daily Reports', href: '/admin/reports/daily' },
  ],
  finance: [
    { id: 'finance-review', label: 'Payment Review', href: '/finance/review' },
    { id: 'finance-reconcile', label: 'Reconciliation', href: '/finance/reconcile' },
  ],
};
