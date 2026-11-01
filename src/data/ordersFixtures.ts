/**
 * BitesBro Customer Orders Demonstration Fixtures (Task 05)
 *
 * IMPORTANT COMPLIANCE NOTICE (AGENTS.md & Task 05 specification):
 * There is no live orders backend connected yet.
 * The records below are explicitly marked demonstration fixtures for UI development,
 * accessibility review, and testing. Never present these fictional statuses as live tracking.
 */

import { CustomerOrder, OrderStatus, StatusPresentationMeta } from '../types/orders';

export const DEMO_ORDERS_DISCLAIMER =
  'Demonstration order records for prototype preview. In production, live order status, authenticated access, payments, and kitchen workflows are securely validated and managed server-side by Supabase Edge Functions with PostgreSQL RLS.';

export const STATUS_PRESENTATION_MAP: Record<OrderStatus, StatusPresentationMeta> = {
  PENDING: {
    label: 'Payment Pending',
    category: 'active',
    colorToken: '#B7791F', // Amber Ochre
    bgToken: 'rgba(244, 174, 82, 0.16)',
    borderToken: 'rgba(244, 174, 82, 0.4)',
    description: 'Simulated pending payment review for prototype demonstration',
  },
  CONFIRMED: {
    label: 'Order Confirmed',
    category: 'active',
    colorToken: '#16845B', // Forest Green
    bgToken: 'rgba(22, 132, 91, 0.12)',
    borderToken: 'rgba(22, 132, 91, 0.35)',
    description: 'Simulated payment authorization; order queued for kitchen preparation',
  },
  PREPARING: {
    label: 'Kitchen Preparing',
    category: 'active',
    colorToken: '#943803', // Accessible Deep Terracotta
    bgToken: 'rgba(212, 98, 26, 0.12)',
    borderToken: 'rgba(212, 98, 26, 0.35)',
    description: 'Simulated kitchen preparation stage for prototype demonstration',
  },
  READY: {
    label: 'Ready for Pickup',
    category: 'active',
    colorToken: '#16845B', // Forest Green
    bgToken: 'rgba(22, 132, 91, 0.16)',
    borderToken: 'rgba(22, 132, 91, 0.4)',
    description: 'Simulated packaging completed for prototype demonstration',
  },
  COMPLETED: {
    label: 'Completed',
    category: 'completed',
    colorToken: '#2A1A0E', // Espresso Brown
    bgToken: 'rgba(42, 26, 14, 0.08)',
    borderToken: 'rgba(42, 26, 14, 0.2)',
    description: 'Simulated delivery completion for prototype demonstration',
  },
  CANCELLED: {
    label: 'Cancelled',
    category: 'cancelled',
    colorToken: '#C0393B', // Crimson Red
    bgToken: 'rgba(192, 57, 59, 0.12)',
    borderToken: 'rgba(192, 57, 59, 0.35)',
    description: 'Simulated cancellation scenario for prototype demonstration',
  },
};

export const DEMO_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'BB-ORD-9420',
    createdAt: '28 Oct 2026, 01:15 PM',
    status: 'PREPARING',
    isDemonstration: true,
    customerNote: 'Extra napkins requested. Fragrant basmati rice fresh from oven.',
    items: [
      {
        id: 'item-9420-1',
        menuItemId: 'dish-01',
        name: 'Glazed Salmon & Haas Avocado Bowl',
        price: 440,
        quantity: 2,
        imageUrl: '/images/menu/bowl-salmon.svg',
        imageAlt: 'Pan-seared glazed salmon bowl with avocado',
        dietary: ['gluten-free'],
      },
      {
        id: 'item-9420-2',
        menuItemId: 'dish-05',
        name: 'Hibiscus Berry Botanical Fizz',
        price: 190,
        quantity: 1,
        imageUrl: '/images/menu/drink-orange.svg',
        imageAlt: 'Hibiscus berry fizz glass',
        dietary: ['vegan', 'gluten-free'],
      },
    ],
    subtotal: 1070, // (440 * 2) + 190 = 880 + 190 = 1070
    estimatedTax: 54,
    estimatedDelivery: 40,
    totalAmount: 1164,
    timeline: [
      {
        status: 'PENDING',
        label: 'Order Placed',
        description: 'Demonstration record created with unique request key',
        timestamp: '28 Oct 2026, 01:15 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'CONFIRMED',
        label: 'Payment Verified',
        description: 'Simulated payment verified from trustworthy provider evidence',
        timestamp: '28 Oct 2026, 01:17 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'PREPARING',
        label: 'Kitchen Preparation',
        description: 'Simulated kitchen preparation stage for prototype demonstration',
        timestamp: '28 Oct 2026, 01:22 PM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        status: 'READY',
        label: 'Ready for Dispatch',
        description: 'Simulated packaging and inspection at kitchen counter',
        isCompleted: false,
        isCurrent: false,
      },
      {
        status: 'COMPLETED',
        label: 'Delivery Fulfilled',
        description: 'Simulated delivery completion to customer address',
        isCompleted: false,
        isCurrent: false,
      },
    ],
  },
  {
    id: 'BB-ORD-9435',
    createdAt: '28 Oct 2026, 02:40 PM',
    status: 'CONFIRMED',
    isDemonstration: true,
    items: [
      {
        id: 'item-9435-1',
        menuItemId: 'dish-03',
        name: 'Kashmiri Dum Aloo',
        price: 280,
        quantity: 1,
        imageUrl: '/images/menu/main-dum-aloo.svg',
        imageAlt: 'Baby potatoes in rich Kashmiri gravy',
        dietary: ['veg'],
      },
      {
        id: 'item-9435-2',
        menuItemId: 'dish-04',
        name: 'Crisp Lotus Stem & Sesame Chips',
        price: 260,
        quantity: 1,
        imageUrl: '/images/menu/starter-lotus.svg',
        imageAlt: 'Thinly sliced lotus stem crisps with toasted sesame',
        dietary: ['veg', 'gluten-free'],
      },
    ],
    subtotal: 540, // 280 + 260
    estimatedTax: 27,
    estimatedDelivery: 40,
    totalAmount: 607,
    timeline: [
      {
        status: 'PENDING',
        label: 'Order Placed',
        description: 'Demonstration record created with unique request key',
        timestamp: '28 Oct 2026, 02:40 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'CONFIRMED',
        label: 'Order Confirmed',
        description: 'Simulated payment authorized; queued for kitchen preparation',
        timestamp: '28 Oct 2026, 02:42 PM',
        isCompleted: false,
        isCurrent: true,
      },
      {
        status: 'PREPARING',
        label: 'Kitchen Preparation',
        description: 'Simulated kitchen station cooking stage',
        isCompleted: false,
        isCurrent: false,
      },
      {
        status: 'READY',
        label: 'Ready for Dispatch',
        description: 'Simulated packaging for delivery partner',
        isCompleted: false,
        isCurrent: false,
      },
      {
        status: 'COMPLETED',
        label: 'Delivered',
        description: 'Simulated delivery handoff',
        isCompleted: false,
        isCurrent: false,
      },
    ],
  },
  {
    id: 'BB-ORD-8812',
    createdAt: '25 Oct 2026, 07:30 PM',
    status: 'COMPLETED',
    isDemonstration: true,
    items: [
      {
        id: 'item-8812-1',
        menuItemId: 'dish-02',
        name: 'Awadhi Jackfruit & Saffron Dum Biryani',
        price: 390,
        quantity: 2,
        imageUrl: '/images/menu/main-biryani.svg',
        imageAlt: 'Layered Awadhi jackfruit biryani with saffron rice',
        dietary: ['veg'],
      },
      {
        id: 'item-8812-2',
        menuItemId: 'dish-06',
        name: 'Cardamom Rose Pots de Crème',
        price: 240,
        quantity: 2,
        imageUrl: '/images/menu/dessert-mango.svg',
        imageAlt: 'Silky dessert cream with pistachio crumble',
        dietary: ['veg', 'gluten-free'],
      },
    ],
    subtotal: 1260, // (390 * 2) + (240 * 2) = 780 + 480 = 1260
    estimatedTax: 63,
    estimatedDelivery: 40,
    totalAmount: 1363,
    timeline: [
      {
        status: 'PENDING',
        label: 'Order Placed',
        description: 'Demonstration record created with unique request key',
        timestamp: '25 Oct 2026, 07:30 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'CONFIRMED',
        label: 'Payment Verified',
        description: 'Simulated payment authorization and receipt confirmation',
        timestamp: '25 Oct 2026, 07:32 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'PREPARING',
        label: 'Kitchen Preparation',
        description: 'Simulated kitchen slow-dum simmering stage',
        timestamp: '25 Oct 2026, 07:45 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'READY',
        label: 'Ready for Dispatch',
        description: 'Simulated packaging in insulated carrier',
        timestamp: '25 Oct 2026, 08:00 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'COMPLETED',
        label: 'Delivered',
        description: 'Simulated delivery completion',
        timestamp: '25 Oct 2026, 08:22 PM',
        isCompleted: true,
        isCurrent: true,
      },
    ],
  },
  {
    id: 'BB-ORD-8104',
    createdAt: '20 Oct 2026, 12:10 PM',
    status: 'CANCELLED',
    isDemonstration: true,
    cancellationReason:
      'Demonstration scenario: Simulated payment review window expired; order voided without charge per prototype policy.',
    items: [
      {
        id: 'item-8104-1',
        menuItemId: 'dish-07',
        name: 'Za\'atar Spiced Paneer Tikka',
        price: 320,
        quantity: 1,
        imageUrl: '/images/menu/starter-paneer.svg',
        imageAlt: 'Grilled paneer cubes with zaatar marinade',
        dietary: ['veg', 'gluten-free'],
      },
    ],
    subtotal: 320,
    estimatedTax: 16,
    estimatedDelivery: 0,
    totalAmount: 336,
    timeline: [
      {
        status: 'PENDING',
        label: 'Order Placed',
        description: 'Demonstration record created with unique request key',
        timestamp: '20 Oct 2026, 12:10 PM',
        isCompleted: true,
        isCurrent: false,
      },
      {
        status: 'CANCELLED',
        label: 'Order Cancelled',
        description: 'Simulated payment verification expired; voided prior to kitchen prep',
        timestamp: '20 Oct 2026, 12:40 PM',
        isCompleted: true,
        isCurrent: true,
      },
    ],
  },
];
