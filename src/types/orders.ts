/**
 * Orders Types & Data Contracts for BitesBro — Customer Orders Experience (Task 05)
 * Aligned with docs/DATA_MODEL.md (orders, order_items, order_events) and docs/API_CONTRACTS.md (GET /orders/:id)
 */

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type OrderCategoryFilter = 'all' | 'active' | 'completed' | 'cancelled';

export interface OrderItemRecord {
  id: string;
  menuItemId: string;
  name: string;
  price: number; // Unit price in INR
  quantity: number;
  imageUrl?: string;
  imageAlt?: string;
  dietary?: string[];
}

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp?: string; // Formatted demo timestamp
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface CustomerOrder {
  id: string; // e.g. "BB-ORD-9420"
  createdAt: string; // e.g. "28 Oct 2026, 01:15 PM"
  status: OrderStatus;
  items: OrderItemRecord[];
  subtotal: number; // Demonstration subtotal estimate in INR
  estimatedTax: number; // Demonstration tax estimate
  estimatedDelivery: number; // Demonstration delivery estimate
  totalAmount: number; // Demonstration total in INR
  timeline: OrderTimelineStep[];
  isDemonstration: true;
  customerNote?: string;
  cancellationReason?: string;
}

export interface StatusPresentationMeta {
  label: string;
  category: 'active' | 'completed' | 'cancelled';
  colorToken: string;
  bgToken: string;
  borderToken: string;
  description: string;
}
