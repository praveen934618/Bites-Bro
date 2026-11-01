import React, { useState } from 'react';
import { CustomerOrder, OrderItemRecord } from '../../types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import {
  ArrowLeftIcon,
  ReceiptIcon,
  ShieldInfoIcon,
  SearchXIcon,
} from './OrderIcons';

export interface OrderDetailViewProps {
  order?: CustomerOrder | null;
  orderIdParam?: string;
  onBack: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  orderIdParam,
  onBack,
}) => {
  // Handle invalid or unavailable order identifier
  if (!order) {
    return (
      <div
        className="order-detail-not-found"
        role="status"
        aria-label="Order not found"
      >
        <div className="order-detail-not-found-icon" aria-hidden="true">
          <SearchXIcon size={44} />
        </div>
        <h2 className="order-detail-not-found-title">Order Not Found</h2>
        <p className="order-detail-not-found-desc">
          The requested order identifier{' '}
          {orderIdParam ? (
            <code className="order-detail-code">{orderIdParam}</code>
          ) : (
            'provided'
          )}{' '}
          could not be found in your demonstration order history.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="order-detail-back-btn"
          aria-label="Back to orders list"
        >
          <ArrowLeftIcon size={16} aria-hidden="true" />
          <span>Back to All Orders</span>
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-container" aria-labelledby="order-detail-heading">
      {/* Top Navigation Affordance */}
      <button
        type="button"
        onClick={onBack}
        className="order-detail-back-btn"
        aria-label="Back to orders list"
      >
        <ArrowLeftIcon size={16} aria-hidden="true" />
        <span>Back to Orders</span>
      </button>

      {/* Order Detail Header */}
      <header className="order-detail-header">
        <div className="order-detail-header-main">
          <div className="order-detail-id-row">
            <span className="order-detail-receipt-icon" aria-hidden="true">
              <ReceiptIcon size={18} />
            </span>
            <h1 id="order-detail-heading" className="order-detail-title">
              Order {order.id}
            </h1>
            <span className="order-detail-demo-tag">Demo Order</span>
          </div>
          <p className="order-detail-meta">
            Placed on <time dateTime={order.createdAt}>{order.createdAt}</time> · Demonstration
            Record
          </p>
        </div>

        <div className="order-detail-status-wrapper">
          <OrderStatusBadge status={order.status} size="medium" />
        </div>
      </header>

      {/* Cancellation Notice if Cancelled */}
      {order.status === 'CANCELLED' && order.cancellationReason && (
        <div className="order-detail-cancel-alert" role="alert">
          <strong>Cancellation Notice:</strong> {order.cancellationReason}
        </div>
      )}

      {/* Main Two-Column Layout: Items Breakdown & Timeline/Summary */}
      <div className="order-detail-grid">
        {/* Left Column: Items Breakdown */}
        <section
          className="order-detail-items-section"
          aria-label="Dishes in this order"
        >
          <h2 className="order-detail-section-title">Items in Order</h2>
          <div className="order-detail-items-list" role="list">
            {order.items.map((item) => (
              <OrderDetailItemCard key={item.id} item={item} />
            ))}
          </div>

          {order.customerNote && (
            <div className="order-detail-note-card">
              <span className="order-detail-note-label">Order Note</span>
              <p className="order-detail-note-text">{order.customerNote}</p>
            </div>
          )}
        </section>

        {/* Right Column: Order Summary & Status Timeline */}
        <div className="order-detail-sidebar">
          {/* Status Timeline */}
          <section
            className="order-detail-timeline-card"
            aria-label="Demonstration status timeline"
          >
            <OrderTimeline
              timeline={order.timeline}
              isCancelled={order.status === 'CANCELLED'}
            />
          </section>

          {/* Demonstration Summary Breakdown */}
          <aside
            className="order-detail-summary-card"
            aria-label="Order financial summary"
          >
            <h3 className="order-detail-summary-title">Order Summary</h3>

            <div className="order-detail-summary-row">
              <span className="order-detail-summary-label">Demonstration Subtotal</span>
              <span className="order-detail-summary-val">₹{order.subtotal}</span>
            </div>

            <div className="order-detail-summary-row order-detail-summary-row--muted">
              <span className="order-detail-summary-label">Estimated Taxes</span>
              <span className="order-detail-summary-val">₹{order.estimatedTax}</span>
            </div>

            <div className="order-detail-summary-row order-detail-summary-row--muted">
              <span className="order-detail-summary-label">Estimated Delivery</span>
              <span className="order-detail-summary-val">
                {order.estimatedDelivery > 0 ? `₹${order.estimatedDelivery}` : 'Free'}
              </span>
            </div>

            <div className="order-detail-summary-divider" />

            <div className="order-detail-summary-total-row">
              <span className="order-detail-summary-total-label">Total Amount</span>
              <span className="order-detail-summary-total-val">₹{order.totalAmount}</span>
            </div>

            {/* Prototype Security Notice */}
            <div className="order-detail-compliance-note" role="note">
              <div className="order-detail-compliance-header">
                <ShieldInfoIcon size={15} />
                <span>Security & Prototype Scope</span>
              </div>
              <p className="order-detail-compliance-text">
                All order numbers, timestamps, and amounts are simulated for
                prototype demonstration. In production, order retrieval is verified
                using Supabase Auth session tokens and PostgreSQL RLS.
              </p>
            </div>

            {/* Disabled Reorder Affordance */}
            <button
              type="button"
              disabled
              className="order-detail-reorder-btn"
              title="Reordering will be available in future releases with backend integration"
            >
              <span>Reorder Dishes</span>
              <span className="order-detail-reorder-tag">Future Feature</span>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

interface OrderDetailItemCardProps {
  item: OrderItemRecord;
}

const OrderDetailItemCard: React.FC<OrderDetailItemCardProps> = ({ item }) => {
  const [imageSrc, setImageSrc] = useState<string>(
    item.imageUrl || '/images/menu/dish-fallback.svg'
  );

  const handleImageError = () => {
    setImageSrc('/images/menu/dish-fallback.svg');
  };

  const lineTotal = item.price * item.quantity;

  return (
    <article className="order-detail-item-card" role="listitem">
      <div className="order-detail-item-thumb">
        <img
          src={imageSrc}
          alt={item.imageAlt || item.name}
          onError={handleImageError}
          className="order-detail-item-img"
          loading="lazy"
        />
      </div>

      <div className="order-detail-item-info">
        <div className="order-detail-item-title-row">
          <h3 className="order-detail-item-name">{item.name}</h3>
          <span className="order-detail-item-line-total">₹{lineTotal}</span>
        </div>

        <div className="order-detail-item-meta">
          <span className="order-detail-item-qty">Qty: {item.quantity}</span>
          <span className="order-detail-item-unit">₹{item.price} each</span>
          {item.dietary && item.dietary.length > 0 && (
            <span className="order-detail-item-dietary">
              {item.dietary.join(' · ')}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
