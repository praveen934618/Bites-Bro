import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Shell Integration', () => {
  it('renders skip link, customer navbar, and homepage hero section', () => {
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
  });
});
