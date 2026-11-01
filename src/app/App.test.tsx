import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Shell Integration', () => {
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
});
