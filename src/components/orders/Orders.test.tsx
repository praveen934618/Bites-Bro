import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { OrderCard } from './OrderCard';
import { OrderDetailView } from './OrderDetailView';
import { OrdersFilterBar } from './OrdersFilterBar';
import { OrdersEmptyState } from './OrdersEmptyState';
import { OrdersSection } from './OrdersSection';
import { CustomerOrder, OrderStatus } from '../../types/orders';
import { DEMO_CUSTOMER_ORDERS, DEMO_ORDERS_DISCLAIMER } from '../../data/ordersFixtures';

// Mock test orders
const mockActiveOrder: CustomerOrder = {
  id: 'BB-TEST-0001',
  createdAt: 'Today, 1:15 PM',
  status: 'PREPARING',
  items: [
    {
      id: 'item-1',
      menuItemId: 'dish-grain-bowl',
      name: 'Artisanal Salmon Grain Bowl',
      price: 420,
      quantity: 2,
      imageUrl: '/images/menu/bowl-salmon.svg',
      imageAlt: 'Salmon grain bowl',
      dietary: ['gluten-free'],
    },
  ],
  subtotal: 840,
  estimatedTax: 42,
  estimatedDelivery: 0,
  totalAmount: 882,
  timeline: [
    {
      status: 'CONFIRMED',
      label: 'Order Confirmed',
      description: 'Order validated',
      timestamp: '1:15 PM',
      isCompleted: true,
      isCurrent: false,
    },
    {
      status: 'PREPARING',
      label: 'Kitchen Preparing',
      description: 'Chef is crafting your dishes',
      timestamp: '1:20 PM',
      isCompleted: false,
      isCurrent: true,
    },
    {
      status: 'READY',
      label: 'Order Ready',
      description: 'Dishes boxed',
      isCompleted: false,
      isCurrent: false,
    },
    {
      status: 'COMPLETED',
      label: 'Delivered',
      description: 'Handed over',
      isCompleted: false,
      isCurrent: false,
    },
  ],
  isDemonstration: true,
  customerNote: 'Please do not include plastic cutlery.',
};

const mockCompletedOrder: CustomerOrder = {
  id: 'BB-TEST-0002',
  createdAt: 'Yesterday, 7:45 PM',
  status: 'COMPLETED',
  items: [
    {
      id: 'item-2',
      menuItemId: 'dish-dum-aloo',
      name: 'Kashmiri Dum Aloo',
      price: 280,
      quantity: 1,
      imageUrl: '/images/menu/main-dum-aloo.svg',
      imageAlt: 'Dum Aloo',
      dietary: ['veg'],
    },
  ],
  subtotal: 280,
  estimatedTax: 14,
  estimatedDelivery: 40,
  totalAmount: 334,
  timeline: [
    {
      status: 'CONFIRMED',
      label: 'Order Confirmed',
      description: 'Order validated',
      timestamp: '7:45 PM',
      isCompleted: true,
      isCurrent: false,
    },
    {
      status: 'COMPLETED',
      label: 'Delivered',
      description: 'Enjoy your meal',
      timestamp: '8:25 PM',
      isCompleted: true,
      isCurrent: true,
    },
  ],
  isDemonstration: true,
};

const mockCancelledOrder: CustomerOrder = {
  id: 'BB-TEST-0003',
  createdAt: '3 days ago',
  status: 'CANCELLED',
  items: [
    {
      id: 'item-3',
      menuItemId: 'dish-biryani',
      name: 'Awadhi Jackfruit Dum Biryani',
      price: 380,
      quantity: 1,
      dietary: ['vegan'],
    },
  ],
  subtotal: 380,
  estimatedTax: 19,
  estimatedDelivery: 0,
  totalAmount: 399,
  timeline: [
    {
      status: 'CONFIRMED',
      label: 'Order Confirmed',
      description: 'Order validated',
      timestamp: '12:00 PM',
      isCompleted: true,
      isCurrent: false,
    },
    {
      status: 'CANCELLED',
      label: 'Order Cancelled',
      description: 'Out of key seasonal ingredients',
      timestamp: '12:08 PM',
      isCompleted: true,
      isCurrent: true,
    },
  ],
  isDemonstration: true,
  cancellationReason: 'Out of seasonal jackfruit. Refund simulated for demonstration.',
};

const mockOrderSet: CustomerOrder[] = [
  mockActiveOrder,
  mockCompletedOrder,
  mockCancelledOrder,
];

describe('Customer Orders Experience (Task 05)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* --------------------------------------------------------------------------
     1. OrderStatusBadge Component Tests
     -------------------------------------------------------------------------- */
  describe('OrderStatusBadge', () => {
    const statuses: OrderStatus[] = [
      'PENDING',
      'CONFIRMED',
      'PREPARING',
      'READY',
      'COMPLETED',
      'CANCELLED',
    ];

    statuses.forEach((status) => {
      it(`renders status badge for ${status} with accessible text and semantics`, () => {
        render(<OrderStatusBadge status={status} />);
        const badge = screen.getByRole('status');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveAttribute(
          'aria-label',
          expect.stringContaining('Order status:')
        );
      });
    });

    it('renders medium size variant when specified', () => {
      const { container } = render(
        <OrderStatusBadge status="PREPARING" size="medium" />
      );
      expect(
        container.querySelector('.order-status-badge--medium')
      ).toBeInTheDocument();
    });
  });

  /* --------------------------------------------------------------------------
     2. OrderTimeline Component Tests
     -------------------------------------------------------------------------- */
  describe('OrderTimeline', () => {
    it('renders ordered list with timeline steps', () => {
      render(<OrderTimeline timeline={mockActiveOrder.timeline} />);

      const list = screen.getByRole('list');
      expect(list).toBeInTheDocument();
      expect(list.tagName.toLowerCase()).toBe('ol');

      // Verify step labels are rendered
      expect(screen.getByText('Order Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Kitchen Preparing')).toBeInTheDocument();
      expect(screen.getByText('Order Ready')).toBeInTheDocument();
      expect(screen.getByText('Delivered')).toBeInTheDocument();
    });

    it('marks the current active step with aria-current="step"', () => {
      render(<OrderTimeline timeline={mockActiveOrder.timeline} />);

      const activeStep = screen.getByRole('listitem', {
        name: /Current: Kitchen Preparing/i,
      });
      expect(activeStep).toBeInTheDocument();
      expect(activeStep).toHaveAttribute('aria-current', 'step');
    });

    it('renders cancelled status indicators when order is cancelled', () => {
      render(
        <OrderTimeline
          timeline={mockCancelledOrder.timeline}
          isCancelled={true}
        />
      );

      expect(screen.getByText('Order Cancelled')).toBeInTheDocument();
      expect(screen.getByText('Out of key seasonal ingredients')).toBeInTheDocument();
    });
  });

  /* --------------------------------------------------------------------------
     3. OrderCard Component Tests
     -------------------------------------------------------------------------- */
  describe('OrderCard', () => {
    it('renders order summary details including ID, date, status, items summary, and total amount', () => {
      const onViewDetails = vi.fn();
      render(
        <OrderCard order={mockActiveOrder} onViewDetails={onViewDetails} />
      );

      // Order identifier & demo badge
      expect(screen.getByText('BB-TEST-0001')).toBeInTheDocument();
      expect(screen.getByText('Demo')).toBeInTheDocument();

      // Date
      expect(screen.getByText('Today, 1:15 PM')).toBeInTheDocument();

      // Status badge
      expect(screen.getByText('Kitchen Preparing')).toBeInTheDocument();

      // Items summary
      expect(screen.getByText(/Artisanal Salmon Grain Bowl × 2/i)).toBeInTheDocument();

      // Demonstration total amount
      expect(screen.getByText('₹882')).toBeInTheDocument();

      // View Details button
      const viewBtn = screen.getByRole('button', {
        name: 'View order details for BB-TEST-0001',
      });
      expect(viewBtn).toBeInTheDocument();
    });

    it('calls onViewDetails with order id when View Details button is clicked', () => {
      const onViewDetails = vi.fn();
      render(
        <OrderCard order={mockActiveOrder} onViewDetails={onViewDetails} />
      );

      const viewBtn = screen.getByRole('button', {
        name: 'View order details for BB-TEST-0001',
      });
      fireEvent.click(viewBtn);

      expect(onViewDetails).toHaveBeenCalledTimes(1);
      expect(onViewDetails).toHaveBeenCalledWith('BB-TEST-0001');
    });
  });

  /* --------------------------------------------------------------------------
     4. OrderDetailView Component Tests
     -------------------------------------------------------------------------- */
  describe('OrderDetailView', () => {
    it('renders order detail heading, status badge, items breakdown, and financial summary', () => {
      const onBack = vi.fn();
      render(<OrderDetailView order={mockActiveOrder} onBack={onBack} />);

      // Order Title
      expect(
        screen.getByRole('heading', { level: 1, name: 'Order BB-TEST-0001' })
      ).toBeInTheDocument();

      // Placed date
      expect(screen.getByText(/Placed on/i)).toBeInTheDocument();

      // Dish breakdown
      const itemsSection = screen.getByRole('region', { name: 'Dishes in this order' });
      expect(within(itemsSection).getByText('Artisanal Salmon Grain Bowl')).toBeInTheDocument();
      expect(within(itemsSection).getByText('₹420 each')).toBeInTheDocument();
      expect(within(itemsSection).getByText('Qty: 2')).toBeInTheDocument();
      expect(within(itemsSection).getByText('₹840')).toBeInTheDocument();

      // Customer note
      expect(
        screen.getByText('Please do not include plastic cutlery.')
      ).toBeInTheDocument();

      // Financial breakdown
      const summaryAside = screen.getByRole('complementary', { name: 'Order financial summary' });
      expect(within(summaryAside).getByText('Demonstration Subtotal')).toBeInTheDocument();
      expect(within(summaryAside).getByText('₹840')).toBeInTheDocument();
      expect(within(summaryAside).getByText('Estimated Taxes')).toBeInTheDocument();
      expect(within(summaryAside).getByText('Estimated Delivery')).toBeInTheDocument();
      expect(within(summaryAside).getByText('Total Amount')).toBeInTheDocument();
      expect(within(summaryAside).getByText('₹882')).toBeInTheDocument();

      // Prototype compliance note
      expect(
        screen.getByText(/All order numbers, timestamps, and amounts are simulated/i)
      ).toBeInTheDocument();

      // Disabled future-feature reorder button
      const reorderBtn = screen.getByRole('button', { name: /Reorder Dishes/i });
      expect(reorderBtn).toBeDisabled();
      expect(screen.getByText('Future Feature')).toBeInTheDocument();
    });

    it('renders cancellation alert for cancelled order', () => {
      const onBack = vi.fn();
      render(<OrderDetailView order={mockCancelledOrder} onBack={onBack} />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Cancellation Notice:/i);
      expect(alert).toHaveTextContent(/Out of seasonal jackfruit/i);
    });

    it('invokes onBack when Back to Orders button is clicked', () => {
      const onBack = vi.fn();
      render(<OrderDetailView order={mockActiveOrder} onBack={onBack} />);

      const backBtn = screen.getByRole('button', { name: /Back to orders list/i });
      fireEvent.click(backBtn);

      expect(onBack).toHaveBeenCalledTimes(1);
    });

    it('renders Order Not Found state when order is null or invalid identifier', () => {
      const onBack = vi.fn();
      render(
        <OrderDetailView
          order={null}
          orderIdParam="BB-INVALID-999"
          onBack={onBack}
        />
      );

      // Order Not Found heading
      expect(
        screen.getByRole('heading', { level: 2, name: 'Order Not Found' })
      ).toBeInTheDocument();
      expect(screen.getByText('BB-INVALID-999')).toBeInTheDocument();

      // Back to All Orders action
      const backBtn = screen.getByRole('button', { name: /Back to orders list/i });
      expect(backBtn).toHaveTextContent('Back to All Orders');

      fireEvent.click(backBtn);
      expect(onBack).toHaveBeenCalledTimes(1);
    });
  });

  /* --------------------------------------------------------------------------
     5. OrdersFilterBar Component Tests
     -------------------------------------------------------------------------- */
  describe('OrdersFilterBar', () => {
    const counts = { all: 4, active: 2, completed: 1, cancelled: 1 };

    it('renders tab list with all category filters and count chips', () => {
      const onFilterChange = vi.fn();
      render(
        <OrdersFilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          counts={counts}
        />
      );

      const tablist = screen.getByRole('tablist', { name: /Filter orders by status/i });
      expect(tablist).toBeInTheDocument();

      expect(screen.getByRole('tab', { name: /All Orders/i })).toHaveAttribute(
        'aria-selected',
        'true'
      );
      expect(screen.getByRole('tab', { name: /Active/i })).toHaveAttribute(
        'aria-selected',
        'false'
      );
      expect(screen.getByRole('tab', { name: /Completed/i })).toHaveAttribute(
        'aria-selected',
        'false'
      );
      expect(screen.getByRole('tab', { name: /Cancelled/i })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });

    it('calls onFilterChange when a different category tab is clicked', () => {
      const onFilterChange = vi.fn();
      render(
        <OrdersFilterBar
          currentFilter="all"
          onFilterChange={onFilterChange}
          counts={counts}
        />
      );

      const activeTab = screen.getByRole('tab', { name: /Active/i });
      fireEvent.click(activeTab);

      expect(onFilterChange).toHaveBeenCalledTimes(1);
      expect(onFilterChange).toHaveBeenCalledWith('active');
    });
  });

  /* --------------------------------------------------------------------------
     6. OrdersEmptyState Component Tests
     -------------------------------------------------------------------------- */
  describe('OrdersEmptyState', () => {
    it('renders overall empty state with Browse Menu action', () => {
      const onBrowseMenu = vi.fn();
      render(<OrdersEmptyState onBrowseMenu={onBrowseMenu} />);

      expect(
        screen.getByRole('heading', { level: 3, name: 'No Orders Yet' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/You haven’t placed any food orders yet/i)
      ).toBeInTheDocument();

      const browseBtn = screen.getByRole('button', {
        name: 'Browse menu to order fresh food',
      });
      fireEvent.click(browseBtn);
      expect(onBrowseMenu).toHaveBeenCalledTimes(1);
    });

    it('renders filtered empty state with Reset Filter action', () => {
      const onBrowseMenu = vi.fn();
      const onResetFilter = vi.fn();
      render(
        <OrdersEmptyState
          isFiltered
          filterLabel="completed"
          onBrowseMenu={onBrowseMenu}
          onResetFilter={onResetFilter}
        />
      );

      expect(
        screen.getByRole('heading', {
          level: 3,
          name: 'No completed Orders Found',
        })
      ).toBeInTheDocument();

      const resetBtn = screen.getByRole('button', { name: 'View All Orders' });
      fireEvent.click(resetBtn);
      expect(onResetFilter).toHaveBeenCalledTimes(1);
    });
  });

  /* --------------------------------------------------------------------------
     7. OrdersSection Container Tests
     -------------------------------------------------------------------------- */
  describe('OrdersSection', () => {
    it('renders page heading "Your Orders" and demonstration notice', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      render(
        <OrdersSection
          orders={mockOrderSet}
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      expect(
        screen.getByRole('heading', { level: 1, name: 'Your Orders' })
      ).toBeInTheDocument();

      // Demonstration disclaimer note
      expect(
        screen.getByRole('note', { name: /Demonstration Orders Notice/i })
      ).toHaveTextContent(DEMO_ORDERS_DISCLAIMER);

      // All 3 orders rendered in list
      expect(screen.getByText('BB-TEST-0001')).toBeInTheDocument();
      expect(screen.getByText('BB-TEST-0002')).toBeInTheDocument();
      expect(screen.getByText('BB-TEST-0003')).toBeInTheDocument();
    });

    it('filters orders by category tab correctly', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      render(
        <OrdersSection
          orders={mockOrderSet}
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      // Filter by Active
      const activeTab = screen.getByRole('tab', { name: /Active/i });
      fireEvent.click(activeTab);

      // Active order is visible, others are hidden
      expect(screen.getByText('BB-TEST-0001')).toBeInTheDocument();
      expect(screen.queryByText('BB-TEST-0002')).not.toBeInTheDocument();
      expect(screen.queryByText('BB-TEST-0003')).not.toBeInTheDocument();

      // Filter by Completed
      const completedTab = screen.getByRole('tab', { name: /Completed/i });
      fireEvent.click(completedTab);

      expect(screen.queryByText('BB-TEST-0001')).not.toBeInTheDocument();
      expect(screen.getByText('BB-TEST-0002')).toBeInTheDocument();
      expect(screen.queryByText('BB-TEST-0003')).not.toBeInTheDocument();

      // Filter by Cancelled
      const cancelledTab = screen.getByRole('tab', { name: /Cancelled/i });
      fireEvent.click(cancelledTab);

      expect(screen.queryByText('BB-TEST-0001')).not.toBeInTheDocument();
      expect(screen.queryByText('BB-TEST-0002')).not.toBeInTheDocument();
      expect(screen.getByText('BB-TEST-0003')).toBeInTheDocument();

      // Return to All Orders
      const allTab = screen.getByRole('tab', { name: /All Orders/i });
      fireEvent.click(allTab);

      expect(screen.getByText('BB-TEST-0001')).toBeInTheDocument();
      expect(screen.getByText('BB-TEST-0002')).toBeInTheDocument();
      expect(screen.getByText('BB-TEST-0003')).toBeInTheDocument();
    });

    it('renders filtered empty state when a category has zero orders and resets filter', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      // Pass only active orders
      const onlyActive: CustomerOrder[] = [mockActiveOrder];

      render(
        <OrdersSection
          orders={onlyActive}
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      // Click Completed tab which has 0 orders
      const completedTab = screen.getByRole('tab', { name: /Completed/i });
      fireEvent.click(completedTab);

      expect(
        screen.getByRole('heading', { level: 3, name: 'No completed Orders Found' })
      ).toBeInTheDocument();

      // Click View All Orders reset button
      const resetBtn = screen.getByRole('button', { name: 'View All Orders' });
      fireEvent.click(resetBtn);

      // All tab is restored and active order is displayed
      expect(screen.getByText('BB-TEST-0001')).toBeInTheDocument();
    });

    it('renders overall empty state when orders array is empty', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      render(
        <OrdersSection
          orders={[]}
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      expect(
        screen.getByRole('heading', { level: 3, name: 'No Orders Yet' })
      ).toBeInTheDocument();

      const browseBtn = screen.getByRole('button', {
        name: 'Browse menu to order fresh food',
      });
      fireEvent.click(browseBtn);
      expect(onBrowseMenu).toHaveBeenCalledTimes(1);
    });

    it('renders OrderDetailView when selectedOrderId matches an order in the dataset', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      render(
        <OrdersSection
          orders={mockOrderSet}
          selectedOrderId="BB-TEST-0001"
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      // Renders detail view for BB-TEST-0001
      expect(
        screen.getByRole('heading', { level: 1, name: 'Order BB-TEST-0001' })
      ).toBeInTheDocument();
      expect(screen.getByText('Artisanal Salmon Grain Bowl')).toBeInTheDocument();

      // Click Back to Orders
      const backBtn = screen.getByRole('button', { name: /Back to orders list/i });
      fireEvent.click(backBtn);

      expect(onSelectOrder).toHaveBeenCalledWith(null);
    });

    it('renders Order Not Found when selectedOrderId does not match any order', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      render(
        <OrdersSection
          orders={mockOrderSet}
          selectedOrderId="BB-NON-EXISTENT"
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      expect(
        screen.getByRole('heading', { level: 2, name: 'Order Not Found' })
      ).toBeInTheDocument();
      expect(screen.getByText('BB-NON-EXISTENT')).toBeInTheDocument();

      const backBtn = screen.getByRole('button', { name: /Back to orders list/i });
      fireEvent.click(backBtn);

      expect(onSelectOrder).toHaveBeenCalledWith(null);
    });

    it('uses DEMO_CUSTOMER_ORDERS as default orders prop', () => {
      const onSelectOrder = vi.fn();
      const onBrowseMenu = vi.fn();

      render(
        <OrdersSection
          onSelectOrder={onSelectOrder}
          onBrowseMenu={onBrowseMenu}
        />
      );

      // Verify fixture orders are rendered by default
      expect(screen.getByText(DEMO_CUSTOMER_ORDERS[0].id)).toBeInTheDocument();
    });
  });
});
