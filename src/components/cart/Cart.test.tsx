import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { CartItemCard } from './CartItemCard';
import { CartSummaryCard } from './CartSummaryCard';
import { CartEmptyState } from './CartEmptyState';
import { CartSection } from './CartSection';
import { CartItem, CartSummary, MenuItem } from '../../types/menu';

const mockMenuItem1: MenuItem = {
  id: 'dish-grain-bowl',
  name: 'Artisanal Salmon Grain Bowl',
  description: 'Pan-seared Atlantic salmon with quinoa, avocado, and ponzu drizzle.',
  price: 420,
  categoryId: 'bowls',
  imageUrl: '/images/menu/bowl-salmon.svg',
  imageAlt: 'Salmon grain bowl with avocado',
  isAvailable: true,
  dietary: ['gluten-free'],
  spiceLevel: 'mild',
  preparationTimeMinutes: 18,
  ingredients: ['Atlantic salmon', 'Quinoa', 'Avocado', 'Ponzu glaze', 'Edamame'],
  allergens: ['Fish', 'Soy'],
  calories: 520,
  isDemonstration: true,
};

const mockMenuItem2: MenuItem = {
  id: 'dish-dum-aloo',
  name: 'Kashmiri Dum Aloo',
  description: 'Baby potatoes slow-simmered in rich Kashmiri red chili gravy.',
  price: 280,
  categoryId: 'mains',
  imageUrl: '/images/menu/main-dum-aloo.svg',
  imageAlt: 'Kashmiri Dum Aloo bowl',
  isAvailable: true,
  dietary: ['veg'],
  spiceLevel: 'medium',
  preparationTimeMinutes: 20,
  ingredients: ['Baby potatoes', 'Kashmiri chili gravy', 'Yogurt', 'Fennel', 'Ginger'],
  allergens: ['Dairy'],
  calories: 410,
  isDemonstration: true,
};

const mockSoldOutMenuItem: MenuItem = {
  ...mockMenuItem2,
  id: 'dish-sold-out',
  name: 'Sold Out Special Biryani',
  price: 350,
  isAvailable: false,
};

const mockCartItem1: CartItem = {
  menuItem: mockMenuItem1,
  quantity: 2,
};

const mockCartItem2: CartItem = {
  menuItem: mockMenuItem2,
  quantity: 1,
};

const mockCartItemSoldOut: CartItem = {
  menuItem: mockSoldOutMenuItem,
  quantity: 1,
};

const mockPopulatedCart: CartSummary = {
  items: {
    [mockMenuItem1.id]: mockCartItem1,
    [mockMenuItem2.id]: mockCartItem2,
  },
  totalCount: 3,
  totalAmount: 420 * 2 + 280 * 1, // 840 + 280 = 1120
};

const mockEmptyCart: CartSummary = {
  items: {},
  totalCount: 0,
  totalAmount: 0,
};

describe('Customer Cart Experience (Task 04)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* --------------------------------------------------------------------------
     1. CartItemCard Component Tests
     -------------------------------------------------------------------------- */
  describe('CartItemCard', () => {
    it('renders dish details including image, name, unit price, quantity, and line subtotal', () => {
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      render(
        <CartItemCard
          item={mockCartItem1}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );

      // Title & accessibility
      const heading = screen.getByRole('heading', { level: 3, name: mockMenuItem1.name });
      expect(heading).toBeInTheDocument();

      // Unit price and line subtotal (420 * 2 = 840)
      expect(screen.getByText('₹420 each')).toBeInTheDocument();
      expect(screen.getByText('₹840')).toBeInTheDocument();

      // Dietary tag
      expect(screen.getByText('gluten-free')).toBeInTheDocument();

      // Demo badge
      expect(screen.getByText(/Demo Item/i)).toBeInTheDocument();

      // Quantity displayed in stepper
      const stepperCount = screen.getByLabelText(/Current quantity: 2/i);
      expect(stepperCount).toBeInTheDocument();
      expect(stepperCount).toHaveTextContent('2');

      // Image
      const img = screen.getByRole('img', { name: mockMenuItem1.imageAlt });
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', mockMenuItem1.imageUrl);
    });

    it('handles quantity increase and decrease via stepper controls', () => {
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      render(
        <CartItemCard
          item={mockCartItem1}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );

      // Increase quantity
      const increaseBtn = screen.getByRole('button', {
        name: `Increase quantity of ${mockMenuItem1.name}`,
      });
      fireEvent.click(increaseBtn);
      expect(onUpdateQuantity).toHaveBeenCalledWith(mockMenuItem1.id, 3);

      // Decrease quantity (quantity > 1)
      const decreaseBtn = screen.getByRole('button', {
        name: `Decrease quantity of ${mockMenuItem1.name}`,
      });
      fireEvent.click(decreaseBtn);
      expect(onUpdateQuantity).toHaveBeenCalledWith(mockMenuItem1.id, 1);
      expect(onRemoveItem).not.toHaveBeenCalled();
    });

    it('calls onRemoveItem when decreasing an item with quantity 1', () => {
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      render(
        <CartItemCard
          item={mockCartItem2} // quantity = 1
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );

      // Scope to the quantity stepper group to target stepper control specifically
      const stepperGroup = screen.getByRole('group', {
        name: `Adjust quantity for ${mockMenuItem2.name}`,
      });
      const stepperRemoveBtn = within(stepperGroup).getByRole('button', {
        name: `Remove ${mockMenuItem2.name} from cart`,
      });
      fireEvent.click(stepperRemoveBtn);

      expect(onRemoveItem).toHaveBeenCalledWith(mockMenuItem2.id);
      expect(onUpdateQuantity).not.toHaveBeenCalled();
    });

    it('calls onRemoveItem when clicking the explicit Remove button', () => {
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      render(
        <CartItemCard
          item={mockCartItem1}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );

      const removeBtn = screen.getByRole('button', {
        name: `Remove ${mockMenuItem1.name} from cart`,
      });
      fireEvent.click(removeBtn);

      expect(onRemoveItem).toHaveBeenCalledWith(mockMenuItem1.id);
    });

    it('displays sold out status, disables stepper increase, and renders alert banner for unavailable items', () => {
      const onUpdateQuantity = vi.fn();
      const onRemoveItem = vi.fn();

      render(
        <CartItemCard
          item={mockCartItemSoldOut}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      );

      // Sold out badge and alert banner
      expect(screen.getByText('Sold Out')).toBeInTheDocument();
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/This dish is currently sold out/i);

      // Increase button disabled
      const increaseBtn = screen.getByRole('button', {
        name: `Increase quantity of ${mockSoldOutMenuItem.name}`,
      });
      expect(increaseBtn).toBeDisabled();

      fireEvent.click(increaseBtn);
      expect(onUpdateQuantity).not.toHaveBeenCalled();
    });

    it('switches to fallback SVG image when dish image fails to load', () => {
      render(
        <CartItemCard
          item={mockCartItem1}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
        />
      );

      const img = screen.getByRole('img', { name: mockMenuItem1.imageAlt });
      fireEvent.error(img);

      expect(img).toHaveAttribute('src', '/images/menu/dish-fallback.svg');
    });
  });

  /* --------------------------------------------------------------------------
     2. CartSummaryCard Component Tests
     -------------------------------------------------------------------------- */
  describe('CartSummaryCard', () => {
    it('calculates and renders estimated subtotal, item count, and delivery notes', () => {
      const onBrowseMenu = vi.fn();
      const onClearCart = vi.fn();

      render(
        <CartSummaryCard
          cart={mockPopulatedCart}
          onBrowseMenu={onBrowseMenu}
          onClearCart={onClearCart}
        />
      );

      // Heading
      expect(
        screen.getByRole('heading', { level: 2, name: /Estimated Summary/i })
      ).toBeInTheDocument();

      // Item count breakdown
      expect(screen.getByText(/Total Items \(3 items\)/i)).toBeInTheDocument();

      // Estimated Subtotal (₹1120)
      const subtotalValues = screen.getAllByText('₹1120');
      expect(subtotalValues.length).toBeGreaterThan(0);

      // Delivery and tax notes
      expect(screen.getByText(/Calculated at checkout/i)).toBeInTheDocument();
      expect(screen.getByText(/Verified server-side/i)).toBeInTheDocument();

      // Security prototype note
      const note = screen.getByRole('note');
      expect(note).toHaveTextContent(/Security & Prototype Baseline/i);
      expect(note).toHaveTextContent(/Frontend cart values are demonstration estimates/i);

      // Disabled checkout button (strictly adheres to prototype boundaries)
      const checkoutBtn = screen.getByRole('button', { name: /Proceed to Checkout/i });
      expect(checkoutBtn).toBeDisabled();
      expect(checkoutBtn).toHaveTextContent('Demo Prototype');

      // Clear cart button
      const clearBtn = screen.getByRole('button', { name: /Clear all items from cart/i });
      fireEvent.click(clearBtn);
      expect(onClearCart).toHaveBeenCalledTimes(1);

      // Add more dishes button
      const continueBtn = screen.getByRole('button', { name: /Add More Dishes/i });
      fireEvent.click(continueBtn);
      expect(onBrowseMenu).toHaveBeenCalledTimes(1);
    });

    it('displays warning alert when cart includes unavailable items', () => {
      const cartWithUnavailable: CartSummary = {
        items: {
          [mockSoldOutMenuItem.id]: mockCartItemSoldOut,
        },
        totalCount: 1,
        totalAmount: 350,
      };

      render(
        <CartSummaryCard
          cart={cartWithUnavailable}
          onBrowseMenu={vi.fn()}
        />
      );

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/Your cart includes dishes marked sold out/i);
    });
  });

  /* --------------------------------------------------------------------------
     3. CartEmptyState Component Tests
     -------------------------------------------------------------------------- */
  describe('CartEmptyState', () => {
    it('renders empty cart message and accessible Browse Menu button', () => {
      const onBrowseMenu = vi.fn();

      render(<CartEmptyState onBrowseMenu={onBrowseMenu} />);

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label', 'Your cart is currently empty');

      expect(
        screen.getByRole('heading', { level: 2, name: /Your Cart is Empty/i })
      ).toBeInTheDocument();

      const browseBtn = screen.getByRole('button', { name: /Browse menu to add dishes/i });
      expect(browseBtn).toBeInTheDocument();

      fireEvent.click(browseBtn);
      expect(onBrowseMenu).toHaveBeenCalledTimes(1);
    });
  });

  /* --------------------------------------------------------------------------
     4. CartSection Layout & Integration Tests
     -------------------------------------------------------------------------- */
  describe('CartSection Component', () => {
    it('renders empty state when cart has no items', () => {
      render(
        <CartSection
          cart={mockEmptyCart}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
          onBrowseMenu={vi.fn()}
        />
      );

      expect(screen.getByRole('heading', { level: 2, name: /Your Cart is Empty/i })).toBeInTheDocument();
      expect(screen.queryByRole('heading', { level: 2, name: /Estimated Summary/i })).not.toBeInTheDocument();
    });

    it('renders 2-column layout with items list and summary when cart has items', () => {
      const onBrowseMenu = vi.fn();

      render(
        <CartSection
          cart={mockPopulatedCart}
          onUpdateQuantity={vi.fn()}
          onRemoveItem={vi.fn()}
          onBrowseMenu={onBrowseMenu}
        />
      );

      // Section and header
      expect(screen.getByRole('heading', { level: 1, name: /Your Food Cart/i })).toBeInTheDocument();

      // Back button
      const backBtn = screen.getByRole('button', { name: /Back to food menu/i });
      expect(backBtn).toBeInTheDocument();
      fireEvent.click(backBtn);
      expect(onBrowseMenu).toHaveBeenCalledTimes(1);

      // Region containing items
      const itemsRegion = screen.getByRole('region', { name: /Dishes in your cart/i });
      expect(itemsRegion).toBeInTheDocument();

      // List of items
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBe(2);

      // Summary sidebar
      expect(screen.getByRole('complementary', { name: /Cart calculation/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: /Estimated Summary/i })).toBeInTheDocument();
    });
  });
});
