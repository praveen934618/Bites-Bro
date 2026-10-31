import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Navbar from './Navbar';
import { NAVBAR_CONFIG } from './navigation.config';

describe('Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the brand wordmark with Bricolage Grotesque styling and no customer tagline', () => {
    render(<Navbar />);

    const brandLink = screen.getByRole('link', { name: /BitesBro Home/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', NAVBAR_CONFIG.brand.homeHref);

    // Verify wordmark elements
    expect(brandLink.querySelector('.navbar-wordmark__bites')).toHaveTextContent('Bites');
    expect(brandLink.querySelector('.navbar-wordmark__bro')).toHaveTextContent('Bro');

    // Tagline should be removed
    expect(brandLink.querySelector('.navbar-tagline')).not.toBeInTheDocument();
  });

  it('renders customer navigation links (Menu, Orders) from docs/ROUTES.md without duplicate Cart link in center nav', () => {
    render(<Navbar activeId="menu" />);

    const nav = screen.getByRole('navigation', { name: 'Main Navigation' });
    expect(nav).toBeInTheDocument();

    const menuLink = screen.getByRole('link', { name: 'Menu' });
    const ordersLink = screen.getByRole('link', { name: 'Orders' });

    expect(menuLink).toBeInTheDocument();
    expect(ordersLink).toBeInTheDocument();

    // Verify href routes
    expect(menuLink).toHaveAttribute('href', '/me');
    expect(ordersLink).toHaveAttribute('href', '/me#orders');

    // Center navigation does NOT duplicate the Cart link (Cart is dedicated in actions zone)
    const centerNavLinks = nav.querySelectorAll('a');
    const centerNavLabels = Array.from(centerNavLinks).map((a) => a.textContent?.trim());
    expect(centerNavLabels).toContain('Menu');
    expect(centerNavLabels).toContain('Orders');
    expect(centerNavLabels).not.toContain('Cart');
  });

  it('marks the currently active item with aria-current="page"', () => {
    render(<Navbar activeId="orders" />);

    const ordersLink = screen.getByRole('link', { name: 'Orders' });
    const menuLink = screen.getByRole('link', { name: 'Menu' });

    expect(ordersLink).toHaveAttribute('aria-current', 'page');
    expect(menuLink).not.toHaveAttribute('aria-current');
  });

  it('invokes onNavigate callback and changes active link when a navigation item is clicked', () => {
    const handleNavigate = vi.fn();
    render(<Navbar activeId="menu" onNavigate={handleNavigate} />);

    const ordersLink = screen.getByRole('link', { name: 'Orders' });
    fireEvent.click(ordersLink);

    expect(handleNavigate).toHaveBeenCalledTimes(1);
    expect(handleNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'orders', label: 'Orders' })
    );
    expect(ordersLink).toHaveAttribute('aria-current', 'page');
  });

  it('renders dedicated Cart action button with correct route and active state support', () => {
    const handleNavigate = vi.fn();
    const { rerender } = render(<Navbar activeId="menu" onNavigate={handleNavigate} />);

    const cartAction = screen.getByLabelText(/View Cart/i);
    expect(cartAction).toBeInTheDocument();
    expect(cartAction).toHaveAttribute('href', '/me#cart');
    expect(cartAction).not.toHaveAttribute('aria-current');

    // Click cart action triggers onNavigate with cart item
    fireEvent.click(cartAction);
    expect(handleNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'cart', label: 'Cart', href: '/me#cart' })
    );

    // Active state
    rerender(<Navbar activeId="cart" />);
    const activeCartAction = screen.getByLabelText(/View Cart/i);
    expect(activeCartAction).toHaveAttribute('aria-current', 'page');
    expect(activeCartAction).toHaveClass('navbar-icon-btn--active');
  });

  it('renders customer action affordances (Cart, Profile, Order Now)', () => {
    const { container } = render(<Navbar />);

    const actionsContainer = container.querySelector('.navbar-actions');
    expect(actionsContainer).toBeInTheDocument();

    const cartAction = within(actionsContainer as HTMLElement).getByLabelText(/View Cart/i);
    const profileAction = within(actionsContainer as HTMLElement).getByLabelText(/Customer Profile and Settings/i);
    const orderAction = within(actionsContainer as HTMLElement).getByLabelText(/Browse menu to order/i);

    expect(cartAction).toBeInTheDocument();
    expect(cartAction).toHaveAttribute('href', '/me#cart');

    expect(profileAction).toBeInTheDocument();
    expect(profileAction).toHaveAttribute('href', '/profile');

    expect(orderAction).toBeInTheDocument();
    expect(orderAction).toHaveAttribute('href', '/me');
    expect(orderAction).toHaveAttribute('aria-label', 'Browse menu to order');
    expect(orderAction).toHaveTextContent('Order Now');
  });

  it('does NOT render a fabricated cart badge when cartCount is 0 or undefined', () => {
    const { rerender } = render(<Navbar cartCount={0} />);
    expect(screen.queryByLabelText(/items in cart/i)).not.toBeInTheDocument();

    rerender(<Navbar cartCount={undefined} />);
    expect(screen.queryByLabelText(/items in cart/i)).not.toBeInTheDocument();
  });

  it('renders a verified cart badge when cartCount > 0', () => {
    render(<Navbar cartCount={3} />);

    const badge = screen.getByLabelText('3 items in cart');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('3');
  });

  it('caps cart badge display at 99+ when count exceeds 99', () => {
    render(<Navbar cartCount={105} />);

    const badge = screen.getByLabelText('105 items in cart');
    expect(badge).toHaveTextContent('99+');
  });

  describe('Mobile Navigation Drawer', () => {
    it('renders a mobile toggle button with correct accessibility attributes', () => {
      render(<Navbar />);

      const toggleBtn = screen.getByRole('button', { name: /Open navigation menu/i });
      expect(toggleBtn).toBeInTheDocument();
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      expect(toggleBtn).toHaveAttribute('aria-controls', 'mobile-nav-menu');

      // Verify closed drawer is hidden and not exposed as an active dialog
      const mobileDrawer = screen.getByTestId('mobile-drawer');
      expect(mobileDrawer).toHaveAttribute('hidden');
      expect(mobileDrawer).toHaveAttribute('aria-hidden', 'true');
      expect(mobileDrawer).not.toHaveAttribute('role');
    });

    it('opens mobile drawer when toggle button is clicked', () => {
      render(<Navbar />);

      const toggleBtn = screen.getByRole('button', { name: /Open navigation menu/i });
      fireEvent.click(toggleBtn);

      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');
      expect(toggleBtn).toHaveAttribute('aria-label', 'Close navigation menu');

      const mobileDrawer = screen.getByTestId('mobile-drawer');
      expect(mobileDrawer).toHaveClass('mobile-nav-drawer--open');
      expect(mobileDrawer).not.toHaveAttribute('hidden');
      expect(mobileDrawer).toHaveAttribute('aria-hidden', 'false');
      expect(mobileDrawer).toHaveAttribute('role', 'dialog');
      expect(mobileDrawer).toHaveAttribute('aria-modal', 'true');
    });

    it('closes mobile drawer when Escape key is pressed', () => {
      render(<Navbar />);

      const toggleBtn = screen.getByRole('button', { name: /Open navigation menu/i });
      fireEvent.click(toggleBtn);
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'true');

      // Press Escape
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
      const mobileDrawer = screen.getByTestId('mobile-drawer');
      expect(mobileDrawer).not.toHaveClass('mobile-nav-drawer--open');
      expect(mobileDrawer).toHaveAttribute('hidden');
      expect(mobileDrawer).toHaveAttribute('aria-hidden', 'true');
    });

    it('closes mobile drawer when backdrop is clicked', () => {
      render(<Navbar />);

      const toggleBtn = screen.getByRole('button', { name: /Open navigation menu/i });
      fireEvent.click(toggleBtn);

      const backdrop = screen.getByTestId('mobile-backdrop');
      fireEvent.click(backdrop);

      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes mobile drawer and triggers onNavigate when a mobile link is clicked', () => {
      const handleNavigate = vi.fn();
      render(<Navbar activeId="menu" onNavigate={handleNavigate} />);

      const toggleBtn = screen.getByRole('button', { name: /Open navigation menu/i });
      fireEvent.click(toggleBtn);

      const mobileDrawer = screen.getByTestId('mobile-drawer');
      const ordersLink = mobileDrawer.querySelector('a[href="/me#orders"]');
      expect(ordersLink).toBeInTheDocument();

      if (ordersLink) {
        fireEvent.click(ordersLink);
      }

      expect(handleNavigate).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'orders', label: 'Orders' })
      );
      expect(toggleBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Role-Aware Navigation Extensibility', () => {
    it('renders kitchen navigation items when role="kitchen" is supplied', () => {
      render(<Navbar role="kitchen" />);

      const kitchenQueueLink = screen.getByRole('link', { name: 'Order Queue' });
      expect(kitchenQueueLink).toBeInTheDocument();
      expect(kitchenQueueLink).toHaveAttribute('href', '/kitchen/queue');
    });
  });
});
