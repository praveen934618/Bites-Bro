import React, { useEffect, useRef } from 'react';
import { NavAction, NavItem } from '../../types/navigation';
import { MenuBookIcon, OrderReceiptIcon, CartIcon, ProfileIcon } from './NavIcons';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId?: string;
  onNavigate?: (item: NavItem) => void;
  profileAction: NavAction;
  primaryAction: NavAction;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  items,
  activeId,
  onNavigate,
  profileAction,
  primaryAction,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Lock body scroll while menu is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Move focus into the drawer for accessibility
      const focusTimer = setTimeout(() => {
        const firstFocusable = drawerRef.current?.querySelector<HTMLElement>('a, button');
        firstFocusable?.focus();
      }, 50);

      return () => {
        clearTimeout(focusTimer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose]);

  // Handle link click
  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(item);
    }
    onClose();
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'menu':
        return <MenuBookIcon size={20} className="mobile-nav-link__icon" />;
      case 'cart':
        return <CartIcon size={20} className="mobile-nav-link__icon" />;
      case 'orders':
        return <OrderReceiptIcon size={20} className="mobile-nav-link__icon" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`mobile-nav-backdrop ${isOpen ? 'mobile-nav-backdrop--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
        hidden={!isOpen}
        data-testid="mobile-backdrop"
      />

      {/* Mobile Drawer */}
      <div
        ref={drawerRef}
        id="mobile-nav-menu"
        className={`mobile-nav-drawer ${isOpen ? 'mobile-nav-drawer--open' : ''}`}
        role={isOpen ? 'dialog' : undefined}
        aria-modal={isOpen ? 'true' : undefined}
        aria-hidden={!isOpen}
        hidden={!isOpen}
        aria-label="Mobile Navigation Menu"
        data-testid="mobile-drawer"
      >
        <nav aria-label="Mobile Navigation">
          <ul className="mobile-nav-list">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} className="mobile-nav-item">
                  <a
                    href={item.href}
                    className={`mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => handleItemClick(e, item)}
                  >
                    <div className="mobile-nav-link__content">
                      <span className="mobile-nav-link__label">{item.label}</span>
                      {item.description && (
                        <span className="mobile-nav-link__desc">{item.description}</span>
                      )}
                    </div>
                    {getIcon(item.id)}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="mobile-nav-cta">
            {/* Customer Profile shortcut in mobile drawer */}
            <a
              href={profileAction.href || '/profile'}
              className="mobile-nav-profile-link"
              onClick={onClose}
              aria-label={profileAction.ariaLabel}
            >
              <ProfileIcon size={18} />
              <span>Customer Profile</span>
            </a>

            {/* Primary Order Action */}
            <a
              href={primaryAction.href || '/me'}
              className="mobile-nav-cta__btn"
              onClick={onClose}
              aria-label={primaryAction.ariaLabel}
            >
              {primaryAction.label}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
