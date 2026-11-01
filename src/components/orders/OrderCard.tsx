import React from 'react';
import { CustomerOrder } from '../../types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ArrowRightIcon, ReceiptIcon } from './OrderIcons';

export interface OrderCardProps {
  order: CustomerOrder;
  onViewDetails: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
}) => {
  const totalItemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const dishesSummary = order.items
    .map((item) => `${item.name} × ${item.quantity}`)
    .join(', ');

  return (
    <article
      id={`order-card-${order.id}`}
      className="order-card"
      aria-labelledby={`order-title-${order.id}`}
    >
      {/* Top Meta Bar */}
      <div className="order-card-header">
        <div className="order-card-id-group">
          <div className="order-card-badge-row">
            <span className="order-card-receipt-icon" aria-hidden="true">
              <ReceiptIcon size={14} />
            </span>
            <h2 id={`order-title-${order.id}`} className="order-card-id">
              {order.id}
            </h2>
            <span className="order-card-demo-badge">Demo</span>
          </div>
          <time className="order-card-date" dateTime={order.createdAt}>
            {order.createdAt}
          </time>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* Dishes Summary Preview */}
      <div className="order-card-body">
        <div className="order-card-items-preview">
          <span className="order-card-items-count">
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}:
          </span>
          <p className="order-card-dishes-text">{dishesSummary}</p>
        </div>

        {order.cancellationReason && (
          <div
            className="order-card-cancel-note"
            role="note"
            aria-label={`Cancellation note for order ${order.id}`}
          >
            <span>{order.cancellationReason}</span>
          </div>
        )}
      </div>

      {/* Footer: Amount & Action */}
      <div className="order-card-footer">
        <div className="order-card-total-group">
          <span className="order-card-total-label">Estimated Total</span>
          <span className="order-card-total-value">₹{order.totalAmount}</span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetails(order.id)}
          className="order-card-view-btn"
          aria-label={`View order details for ${order.id}`}
        >
          <span>View Details</span>
          <ArrowRightIcon size={15} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};
