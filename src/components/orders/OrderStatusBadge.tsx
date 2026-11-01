import React from 'react';
import { OrderStatus } from '../../types/orders';
import { STATUS_PRESENTATION_MAP } from '../../data/ordersFixtures';
import { ClockIcon, CheckCircleIcon, AlertCircleIcon, ChefHatIcon } from './OrderIcons';

export interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  size?: 'small' | 'medium';
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  className = '',
  size = 'medium',
}) => {
  const meta = STATUS_PRESENTATION_MAP[status] || {
    label: status,
    colorToken: 'var(--color-espresso)',
    bgToken: 'rgba(42, 26, 14, 0.08)',
    borderToken: 'var(--color-border-subtle)',
    description: '',
  };

  const renderIcon = () => {
    const iconSize = size === 'small' ? 12 : 14;
    switch (status) {
      case 'PENDING':
        return <ClockIcon size={iconSize} aria-hidden="true" />;
      case 'CONFIRMED':
      case 'READY':
      case 'COMPLETED':
        return <CheckCircleIcon size={iconSize} aria-hidden="true" />;
      case 'PREPARING':
        return <ChefHatIcon size={iconSize} aria-hidden="true" />;
      case 'CANCELLED':
        return <AlertCircleIcon size={iconSize} aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <span
      role="status"
      className={`order-status-badge order-status-badge--${status.toLowerCase()} order-status-badge--${size} ${className}`.trim()}
      style={{
        color: meta.colorToken,
        backgroundColor: meta.bgToken,
        borderColor: meta.borderToken,
      }}
      title={meta.description}
      aria-label={`Order status: ${meta.label}`}
    >
      {renderIcon()}
      <span className="order-status-badge-text">{meta.label}</span>
    </span>
  );
};
