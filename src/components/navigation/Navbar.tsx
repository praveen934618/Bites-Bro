import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavbarProps, NavItem } from '../../types/navigation';
import { NAVBAR_CONFIG, ROLE_NAVIGATION_ITEMS } from './navigation.config';
import { CartIcon, ProfileIcon, MenuToggleIcon } from './NavIcons';
import { MobileNavigation } from './MobileNavigation';
import '../../styles/navbar.css';

/**
 * BitesBro Navbar Component
 *
 * Features:
 * - Four official brand colors: Warm Cream (#FEF3E2), Golden Amber (#F4AE52), Burnt Orange (#D4621A), Espresso Brown (#2A1A0E)
 * - Typographic branding: Bricolage Grotesque display wordmark + IBM Plex Sans interface labels
 * - 3-zone desktop layout & accessible responsive mobile drawer
 * - WCAG 2.2 AA compliant with verified high-contrast controls
 * - Subtle scroll-linked elevation without layout shift
 * - Compact desktop profile (68px) with accessible touch targets (>= 44px)
 * - Deduplicated Cart affordance dedicated in the persistent actions cluster
 */
export const Navbar: React.FC<NavbarProps> = ({
  activeId = 'menu',
  onNavigate,
  role = 'customer',
  cartCount,
  className = '',
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentActiveId, setCurrentActiveId] = useState(activeId);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Sync internal activeId if external prop updates
  useEffect(() => {
    setCurrentActiveId(activeId);
  }, [activeId]);

  // Handle scroll detection for subtle header elevation
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 8;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Handle navigation item selection
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
      setCurrentActiveId(item.id);
      if (onNavigate) {
        e.preventDefault();
        onNavigate(item);
      }
    },
    [onNavigate]
  );

  // Toggle mobile navigation menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
    // Restore focus to toggle button for keyboard navigation accessibility
    mobileToggleRef.current?.focus();
  }, []);

  const navItems = ROLE_NAVIGATION_ITEMS[role] || NAVBAR_CONFIG.customerItems;
  const { actions, brand } = NAVBAR_CONFIG;

  const isCartActive = currentActiveId === 'cart';
  const cartAriaLabel =
    typeof cartCount === 'number' && cartCount > 0
      ? `View Cart (${cartCount} item${cartCount === 1 ? '' : 's'})`
      : actions.cart.ariaLabel;

  return (
    <header
      role="banner"
      className={`bitesbro-header ${isScrolled ? 'bitesbro-header--scrolled' : ''} ${className}`.trim()}
    >
      <div className="navbar-container">
        {/* ==================================================================
            LEFT ZONE: Brand Identity & Wordmark
            ================================================================== */}
        <div className="navbar-brand-wrapper">
          <a
            href={brand.homeHref}
            className="navbar-brand"
            aria-label={`${brand.name} Home`}
            onClick={(e) => {
              const homeItem = navItems.find((i) => i.id === 'menu') || {
                id: 'menu',
                label: 'Menu',
                href: brand.homeHref,
              };
              handleNavClick(e, homeItem);
            }}
          >
            <span className="navbar-wordmark">
              <span className="navbar-wordmark__bites">Bites</span>
              <span className="navbar-wordmark__bro">Bro</span>
              <span className="navbar-wordmark__dot" aria-hidden="true" />
            </span>
          </a>
        </div>

        {/* ==================================================================
            CENTER ZONE: Desktop Navigation Links (Menu, Orders)
            ================================================================== */}
        <nav className="navbar-nav-desktop" aria-label="Main Navigation">
          <ul className="navbar-nav-list">
            {navItems.map((item) => {
              const isActive = currentActiveId === item.id;
              return (
                <li key={item.id} className="navbar-nav-item">
                  <a
                    href={item.href}
                    className={`navbar-nav-link ${isActive ? 'navbar-nav-link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => handleNavClick(e, item)}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="navbar-nav-link__indicator" aria-hidden="true" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ==================================================================
            RIGHT ZONE: Customer Actions & Mobile Toggle
            ================================================================== */}
        <div className="navbar-actions">
          {/* Dedicated Cart Action (avoiding duplication with center nav links) */}
          <a
            href={actions.cart.href}
            className={`navbar-icon-btn ${isCartActive ? 'navbar-icon-btn--active' : ''}`}
            aria-label={cartAriaLabel}
            aria-current={isCartActive ? 'page' : undefined}
            onClick={(e) => {
              const cartItem: NavItem = {
                id: 'cart',
                label: 'Cart',
                href: actions.cart.href || '/me#cart',
              };
              handleNavClick(e, cartItem);
            }}
          >
            <CartIcon size={21} />
            {/* Live Cart Count Badge — Rendered ONLY if count > 0 */}
            {typeof cartCount === 'number' && cartCount > 0 && (
              <span className="navbar-cart-badge" aria-label={`${cartCount} items in cart`}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </a>

          {/* Profile Affordance (Desktop) */}
          <a
            href={actions.profile.href}
            className="navbar-icon-btn"
            aria-label={actions.profile.ariaLabel}
          >
            <ProfileIcon size={21} />
          </a>

          {/* Primary High-Contrast Order Button (Navigates to menu /me without implying checkout) */}
          <a
            href={actions.primaryAction.href}
            className="navbar-btn-primary"
            aria-label={actions.primaryAction.ariaLabel}
            onClick={(e) => {
              const menuItem = navItems.find((i) => i.id === 'menu') || {
                id: 'menu',
                label: 'Menu',
                href: actions.primaryAction.href || '/me',
              };
              handleNavClick(e, menuItem);
            }}
          >
            {actions.primaryAction.label}
          </a>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            ref={mobileToggleRef}
            type="button"
            className="navbar-mobile-toggle"
            aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-menu"
            onClick={toggleMobileMenu}
          >
            <MenuToggleIcon isOpen={isMobileOpen} size={22} />
          </button>
        </div>
      </div>

      {/* Accessible Responsive Mobile Navigation Drawer */}
      <MobileNavigation
        isOpen={isMobileOpen}
        onClose={closeMobileMenu}
        items={navItems}
        activeId={currentActiveId}
        onNavigate={onNavigate}
        profileAction={actions.profile}
        primaryAction={actions.primaryAction}
      />
    </header>
  );
};

export default Navbar;
