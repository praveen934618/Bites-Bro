import React, { useState, useMemo } from 'react';
import { CustomerOrder, OrderCategoryFilter } from '../../types/orders';
import { DEMO_CUSTOMER_ORDERS, DEMO_ORDERS_DISCLAIMER, STATUS_PRESENTATION_MAP } from '../../data/ordersFixtures';
import { OrderCard } from './OrderCard';
import { OrderDetailView } from './OrderDetailView';
import { OrdersFilterBar } from './OrdersFilterBar';
import { OrdersEmptyState } from './OrdersEmptyState';
import { ShieldInfoIcon } from './OrderIcons';

export interface OrdersSectionProps {
  orders?: CustomerOrder[];
  selectedOrderId?: string | null;
  onSelectOrder: (orderId: string | null) => void;
  onBrowseMenu: () => void;
}

export const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders = DEMO_CUSTOMER_ORDERS,
  selectedOrderId = null,
  onSelectOrder,
  onBrowseMenu,
}) => {
  const [filter, setFilter] = useState<OrderCategoryFilter>('all');

  // Compute status counts for category filters
  const counts = useMemo(() => {
    const summary = {
      all: orders.length,
      active: 0,
      completed: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const meta = STATUS_PRESENTATION_MAP[order.status];
      if (meta) {
        summary[meta.category] += 1;
      }
    });

    return summary;
  }, [orders]);

  // Filter orders according to category
  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    return orders.filter((order) => {
      const meta = STATUS_PRESENTATION_MAP[order.status];
      return meta?.category === filter;
    });
  }, [orders, filter]);

  // If a specific order is selected or targeted via deep link, render detail view
  if (selectedOrderId) {
    const selectedOrder = orders.find((o) => o.id === selectedOrderId) || null;
    return (
      <section
        id="orders-section"
        className="bitesbro-orders-section"
        aria-label="Order Details"
      >
        <div className="orders-container">
          <OrderDetailView
            order={selectedOrder}
            orderIdParam={selectedOrderId}
            onBack={() => onSelectOrder(null)}
          />
        </div>
      </section>
    );
  }

  const isOverallEmpty = orders.length === 0;

  return (
    <section
      id="orders-section"
      className="bitesbro-orders-section"
      aria-labelledby="orders-heading"
    >
      <div className="orders-container">
        {/* Orders Page Header */}
        <header className="orders-header">
          <div className="orders-eyebrow">
            <span className="orders-eyebrow-dot" aria-hidden="true" />
            <span>Customer Account</span>
          </div>
          <h1 id="orders-heading" className="orders-title">
            Your Orders
          </h1>
          <p className="orders-subtitle">
            Explore demonstration order records, prototype status progression, and
            illustrated itemized receipts.
          </p>

          {/* Prototype Demonstration Notice (AGENTS.md & Task 05 Compliance) */}
          <div
            className="orders-disclaimer-note"
            role="note"
            aria-label="Demonstration Orders Notice"
          >
            <div className="orders-disclaimer-header">
              <ShieldInfoIcon size={16} aria-hidden="true" />
              <span>Demonstration Orders Notice</span>
            </div>
            <p className="orders-disclaimer-text">{DEMO_ORDERS_DISCLAIMER}</p>
          </div>
        </header>

        {isOverallEmpty ? (
          <OrdersEmptyState onBrowseMenu={onBrowseMenu} />
        ) : (
          <div className="orders-content">
            {/* Category Filter Bar */}
            <OrdersFilterBar
              currentFilter={filter}
              onFilterChange={setFilter}
              counts={counts}
            />

            {/* Orders List Panel */}
            <div
              id="orders-list-panel"
              role="region"
              aria-label="Order history records"
              className="orders-list-wrapper"
            >
              {filteredOrders.length === 0 ? (
                <OrdersEmptyState
                  isFiltered
                  filterLabel={filter}
                  onBrowseMenu={onBrowseMenu}
                  onResetFilter={() => setFilter('all')}
                />
              ) : (
                <div className="orders-grid" role="list">
                  {filteredOrders.map((order) => (
                    <div key={order.id} role="listitem">
                      <OrderCard order={order} onViewDetails={onSelectOrder} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
