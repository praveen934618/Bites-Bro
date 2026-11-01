import React from 'react';
import { OrderTimelineStep } from '../../types/orders';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from './OrderIcons';

export interface OrderTimelineProps {
  timeline: OrderTimelineStep[];
  isCancelled?: boolean;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  timeline,
  isCancelled = false,
}) => {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div
      className={`order-timeline ${isCancelled ? 'order-timeline--cancelled' : ''}`}
      aria-label="Order progress timeline"
    >
      <h3 className="order-timeline-heading">Order Status Timeline</h3>
      <ol className="order-timeline-list">
        {timeline.map((step, idx) => {
          const isFinal = idx === timeline.length - 1;
          const statusClass = step.isCompleted
            ? 'order-timeline-step--completed'
            : step.isCurrent
              ? 'order-timeline-step--current'
              : 'order-timeline-step--upcoming';

          return (
            <li
              key={`${step.status}-${idx}`}
              className={`order-timeline-step ${statusClass}`}
              aria-current={step.isCurrent ? 'step' : undefined}
              aria-label={step.isCurrent ? `Current: ${step.label}` : step.label}
            >
              {/* Connector Line */}
              {!isFinal && <div className="order-timeline-line" aria-hidden="true" />}

              {/* Node Icon */}
              <div
                className="order-timeline-node"
                aria-hidden="true"
              >
                {step.status === 'CANCELLED' ? (
                  <AlertCircleIcon size={16} />
                ) : step.isCompleted ? (
                  <CheckCircleIcon size={16} />
                ) : step.isCurrent ? (
                  <ClockIcon size={16} />
                ) : (
                  <span className="order-timeline-node-dot" />
                )}
              </div>

              {/* Content */}
              <div className="order-timeline-content">
                <div className="order-timeline-header">
                  <span className="order-timeline-label">{step.label}</span>
                  {step.timestamp && (
                    <time className="order-timeline-time">{step.timestamp}</time>
                  )}
                </div>
                <p className="order-timeline-desc">{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};
