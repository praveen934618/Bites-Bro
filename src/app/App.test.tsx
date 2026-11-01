import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Shell Integration', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('renders skip link, customer navbar, homepage hero section, and menu section', () => {
    render(<App />);

    // Accessible skip link
    const skipLink = screen.getByRole('link', { name: /Skip to main content/i });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');

    // Customer Navbar
    const brandLink = screen.getByRole('link', { name: /BitesBro Home/i });
    expect(brandLink).toBeInTheDocument();

    // Customer Hero Section
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading).toHaveTextContent(/Freshly Crafted Bites/i);

    // Primary CTA
    const exploreCta = screen.getByRole('link', { name: "Explore today's menu to order" });
    expect(exploreCta).toBeInTheDocument();
    expect(exploreCta).toHaveAttribute('href', '/me');

    // Customer Menu Section (Task 03)
    const menuHeading = screen.getByRole('heading', { level: 2, name: /Explore Our Menu/i });
    expect(menuHeading).toBeInTheDocument();
  });

  it('updates customer navbar cart count when items are added from menu', () => {
    render(<App />);

    // Initially Cart link is rendered
    const cartLink = screen.getByRole('link', { name: /View cart/i });
    expect(cartLink).toBeInTheDocument();

    // Find and click "Add to Cart" on the first available dish
    const addBtns = screen.getAllByRole('button', { name: /Add .* to cart/i });
    expect(addBtns.length).toBeGreaterThan(0);

    fireEvent.click(addBtns[0]);

    // Cart count in Navbar updates to 1
    const cartCountBadge = screen.getByLabelText(/1 items in cart/i);
    expect(cartCountBadge).toBeInTheDocument();
    expect(cartCountBadge).toHaveTextContent('1');
  });

  it('navigates to customer cart view when clicking Navbar cart icon', () => {
    render(<App />);

    // Add an item first
    const addBtns = screen.getAllByRole('button', { name: /Add .* to cart/i });
    fireEvent.click(addBtns[0]);

    // Click on Navbar Cart link
    const cartLink = screen.getByRole('link', { name: /View cart/i });
    fireEvent.click(cartLink);

    // Cart section is rendered
    expect(screen.getByRole('heading', { level: 1, name: /Your Food Cart/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Estimated Summary/i })).toBeInTheDocument();

    // Verify item is present in Cart
    expect(screen.getByRole('region', { name: /Dishes in your cart/i })).toBeInTheDocument();
  });

  it('preserves cart contents when switching back and forth between Menu and Cart', () => {
    render(<App />);

    // Add first dish
    const addBtns = screen.getAllByRole('button', { name: /Add .* to cart/i });
    fireEvent.click(addBtns[0]);

    // Navigate to Cart
    const cartLink = screen.getByRole('link', { name: /View cart/i });
    fireEvent.click(cartLink);

    expect(screen.getByRole('heading', { level: 1, name: /Your Food Cart/i })).toBeInTheDocument();

    // Increase quantity in Cart to 2
    const increaseBtns = screen.getAllByRole('button', { name: /Increase quantity/i });
    fireEvent.click(increaseBtns[0]);

    // Navbar badge updates to 2
    expect(screen.getByLabelText(/2 items in cart/i)).toHaveTextContent('2');

    // Click "Back to Menu"
    const backBtn = screen.getByRole('button', { name: /Back to food menu/i });
    fireEvent.click(backBtn);

    // Menu is visible again
    expect(screen.getByRole('heading', { level: 2, name: /Explore Our Menu/i })).toBeInTheDocument();

    // Navbar still has 2 items
    expect(screen.getByLabelText(/2 items in cart/i)).toHaveTextContent('2');

    // Return to Cart
    fireEvent.click(screen.getByRole('link', { name: /View cart/i }));

    // Cart still has the items with quantity 2
    expect(screen.getByLabelText(/Current quantity: 2/i)).toBeInTheDocument();
  });

  it('clears cart and displays empty state when clicking Clear Cart', () => {
    render(<App />);

    // Add dish
    const addBtns = screen.getAllByRole('button', { name: /Add .* to cart/i });
    fireEvent.click(addBtns[0]);

    // Navigate to Cart
    fireEvent.click(screen.getByRole('link', { name: /View cart/i }));

    // Click "Clear Cart"
    const clearBtn = screen.getByRole('button', { name: /Clear all items from cart/i });
    fireEvent.click(clearBtn);

    // Empty state is rendered
    expect(screen.getByRole('heading', { level: 2, name: /Your Cart is Empty/i })).toBeInTheDocument();

    // Navbar cart badge is gone (0 count)
    expect(screen.queryByLabelText(/items in cart/i)).not.toBeInTheDocument();
  });

  it('renders cart directly if initial hash is #cart', () => {
    window.history.replaceState(null, '', '/#cart');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Your Food Cart/i })).toBeInTheDocument();
  });

  /* --------------------------------------------------------------------------
     Customer Orders Experience Integration Tests (Task 05)
     -------------------------------------------------------------------------- */
  it('navigates to customer orders view when clicking Navbar orders link', () => {
    render(<App />);

    // Click on Navbar Orders link
    const ordersLink = screen.getByRole('link', { name: 'Orders' });
    expect(ordersLink).toBeInTheDocument();
    fireEvent.click(ordersLink);

    // Orders page heading and demonstration notice are displayed
    expect(screen.getByRole('heading', { level: 1, name: /Your Orders/i })).toBeInTheDocument();
    expect(
      screen.getByRole('note', { name: /Demonstration Orders Notice/i })
    ).toHaveTextContent(/Demonstration order records for prototype preview/i);
  });

  it('renders orders directly if initial hash is #orders', () => {
    window.history.replaceState(null, '', '/#orders');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Your Orders/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /Order history records/i })).toBeInTheDocument();
  });

  it('renders order detail directly if initial hash is #orders/:id', () => {
    window.history.replaceState(null, '', '/#orders/BB-ORD-9420');
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /Order BB-ORD-9420/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to orders list/i })).toBeInTheDocument();
  });

  it('navigates from orders list to order detail and back to orders list', () => {
    window.history.replaceState(null, '', '/#orders');
    render(<App />);

    // Click "View Details" on the first order
    const viewBtn = screen.getByRole('button', { name: /View order details for BB-ORD-9420/i });
    fireEvent.click(viewBtn);

    // Order detail view is rendered
    expect(screen.getByRole('heading', { level: 1, name: /Order BB-ORD-9420/i })).toBeInTheDocument();

    // Click "Back to Orders"
    const backBtn = screen.getByRole('button', { name: /Back to orders list/i });
    fireEvent.click(backBtn);

    // Returned to orders list
    expect(screen.getByRole('heading', { level: 1, name: /Your Orders/i })).toBeInTheDocument();
  });

  it('preserves cart state when switching between Menu, Cart, and Orders', () => {
    render(<App />);

    // 1. Add item from Menu
    const addBtns = screen.getAllByRole('button', { name: /Add .* to cart/i });
    fireEvent.click(addBtns[0]);

    // Verify cart count is 1
    expect(screen.getByLabelText(/1 items in cart/i)).toBeInTheDocument();

    // 2. Navigate to Orders
    const ordersLink = screen.getByRole('link', { name: 'Orders' });
    fireEvent.click(ordersLink);

    expect(screen.getByRole('heading', { level: 1, name: /Your Orders/i })).toBeInTheDocument();

    // Cart badge in navbar still indicates 1 item
    expect(screen.getByLabelText(/1 items in cart/i)).toBeInTheDocument();

    // 3. Navigate to Cart
    const cartLink = screen.getByRole('link', { name: /View cart/i });
    fireEvent.click(cartLink);

    expect(screen.getByRole('heading', { level: 1, name: /Your Food Cart/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Current quantity: 1/i)).toBeInTheDocument();

    // 4. Return to Menu via Browse Menu button
    const backMenuBtn = screen.getByRole('button', { name: /Back to food menu/i });
    fireEvent.click(backMenuBtn);

    expect(screen.getByRole('heading', { level: 2, name: /Explore Our Menu/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/1 items in cart/i)).toBeInTheDocument();
  });

  it('renders Order Not Found when deep linking to non-existent order id', () => {
    window.history.replaceState(null, '', '/#orders/BB-NON-EXISTENT-ID');
    render(<App />);

    expect(screen.getByRole('heading', { level: 2, name: /Order Not Found/i })).toBeInTheDocument();
    expect(screen.getByText('BB-NON-EXISTENT-ID')).toBeInTheDocument();
  });
});
