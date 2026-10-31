import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders semantic section with accessible heading binding', () => {
    render(<Hero />);

    const heroSection = screen.getByRole('region', { name: /Freshly Crafted Bites/i });
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveAttribute('aria-labelledby', 'hero-heading');

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('id', 'hero-heading');
    expect(heading).toHaveTextContent(/Freshly Crafted Bites/i);
    expect(heading).toHaveTextContent(/Straight from the Kitchen/i);
  });

  it('renders kicker badge indicating cloud kitchen craft', () => {
    render(<Hero />);

    const kicker = screen.getByTestId('hero-kicker');
    expect(kicker).toBeInTheDocument();
    expect(kicker).toHaveTextContent(/Cloud Kitchen · Fresh to Order/i);
  });

  it('renders engaging lead description copy', () => {
    render(<Hero />);

    const description = screen.getByText(/Explore freshly prepared culinary selections/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('hero-description');
  });

  it('renders primary CTA linking to documented customer menu route (/me)', () => {
    render(<Hero />);

    const primaryCta = screen.getByRole('link', { name: "Explore today's menu to order" });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute('href', '/me');
    expect(primaryCta).toHaveTextContent('Explore Menu');
  });

  it('invokes onNavigate and click handler when primary CTA is clicked', () => {
    const handleNavigate = vi.fn();
    const handleClick = vi.fn();

    render(
      <Hero
        primaryAction={{
          label: 'Explore Menu',
          href: '/me',
          ariaLabel: "Explore today's menu to order",
          onClick: handleClick,
        }}
        onNavigate={handleNavigate}
      />
    );

    const primaryCta = screen.getByRole('link', { name: "Explore today's menu to order" });
    fireEvent.click(primaryCta);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleNavigate).toHaveBeenCalledWith('/me');
  });

  it('renders secondary action linking to order tracking (/me#orders)', () => {
    render(<Hero />);

    const secondaryCta = screen.getByRole('link', { name: 'Track existing orders' });
    expect(secondaryCta).toBeInTheDocument();
    expect(secondaryCta).toHaveAttribute('href', '/me#orders');
    expect(secondaryCta).toHaveTextContent('Track Orders');
  });

  it('renders culinary centerpiece image with descriptive alt text and dimensions', () => {
    render(<Hero />);

    const dishImg = screen.getByTestId('hero-dish-image');
    expect(dishImg).toBeInTheDocument();
    expect(dishImg).toHaveAttribute('src', '/images/hero-culinary-dish.svg');
    expect(dishImg).toHaveAttribute(
      'alt',
      'Artisanal grain bowl with glazed caramelized protein, fresh avocado, charred tender greens, and toasted sesame'
    );
    expect(dishImg).toHaveAttribute('width', '560');
    expect(dishImg).toHaveAttribute('height', '560');
    expect(dishImg).toHaveAttribute('loading', 'eager');
  });

  it('renders authentic detail badges (Small-Batch Kitchen & Made to Order)', () => {
    render(<Hero />);

    // Small-Batch Kitchen Badge
    const freshBadge = screen.getByLabelText('Small-Batch Kitchen Standard');
    expect(freshBadge).toBeInTheDocument();
    expect(freshBadge).toHaveTextContent('Small-Batch Kitchen');
    expect(freshBadge).toHaveTextContent('Prepped fresh daily');

    // Made to Order Badge (Neutral Authentic Branding)
    const madeToOrderBadge = screen.getByLabelText('Made to Order Standard');
    expect(madeToOrderBadge).toBeInTheDocument();
    expect(madeToOrderBadge).toHaveTextContent('Made to Order');
    expect(madeToOrderBadge).toHaveTextContent('Cooked upon ticket confirmation');
  });

  it('renders authentic cloud kitchen service trust highlights without fabricated claims', () => {
    render(<Hero />);

    const trustList = screen.getByRole('list', { name: 'Kitchen Service Highlights' });
    expect(trustList).toBeInTheDocument();

    const items = within(trustList).getAllByRole('listitem');
    expect(items).toHaveLength(3);

    expect(items[0]).toHaveTextContent('Made to Order');
    expect(items[0]).toHaveTextContent('Prepared upon confirmation');

    expect(items[1]).toHaveTextContent('Direct Kitchen Flow');
    expect(items[1]).toHaveTextContent('Live prep & ready status');

    expect(items[2]).toHaveTextContent('Daily Provisions');
    expect(items[2]).toHaveTextContent('Freshly prepped ingredients');
  });

  it('supports custom headline and description overrides', () => {
    render(
      <Hero
        headline="Seasonal Specials, Handcrafted Daily"
        description="Fresh culinary creations prepared by our cloud kitchen specialists."
      />
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Seasonal Specials, Handcrafted Daily');

    const desc = screen.getByText('Fresh culinary creations prepared by our cloud kitchen specialists.');
    expect(desc).toBeInTheDocument();
  });
});
