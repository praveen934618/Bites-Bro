import React from 'react';
import { HeroProps } from '../../types/hero';
import {
  ArrowRightIcon,
  SparkleIcon,
  KitchenPanIcon,
  OrderFlowIcon,
  LeafIcon,
  PrepClockIcon,
} from './HeroIcons';
import '../../styles/hero.css';

/**
 * BitesBro Premium Homepage Hero Component
 *
 * Designed exclusively for BitesBro — Lean Integrated Ordering System:
 * - Editorial headline pairing Bricolage Grotesque with IBM Plex Sans
 * - Official brand palette: Warm Cream, Burnt Orange, Golden Amber, Espresso Brown
 * - Primary CTA linking to documented customer menu route (/me)
 * - Secondary tracking affordance (/me#orders)
 * - Authentic cloud kitchen operational trust highlights (no invented ratings or claims)
 * - High-fidelity culinary centerpiece with ambient lighting aura and floating detail badges
 * - Full responsive layout (360px - 1440px) with prefers-reduced-motion accessibility
 */
export const Hero: React.FC<HeroProps> = ({
  headline,
  description = 'Explore freshly prepared culinary selections made to order in our dedicated cloud kitchen. Simple ordering, transparent preparation, and wholesome flavor in every bite.',
  primaryAction = {
    label: 'Explore Menu',
    href: '/me',
    ariaLabel: "Explore today's menu to order",
  },
  secondaryAction = {
    label: 'Track Orders',
    href: '/me#orders',
    ariaLabel: 'Track existing orders',
  },
  onNavigate,
  imageSrc = '/images/hero-culinary-dish.svg',
  imageAlt = 'Artisanal grain bowl with glazed caramelized protein, fresh avocado, charred tender greens, and toasted sesame',
  className = '',
}) => {
  const handlePrimaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    primaryAction.onClick?.();
    if (onNavigate) {
      e.preventDefault();
      onNavigate(primaryAction.href);
    }
  };

  const handleSecondaryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    secondaryAction.onClick?.();
    if (onNavigate) {
      e.preventDefault();
      onNavigate(secondaryAction.href);
    }
  };

  const defaultHeadline = (
    <>
      Freshly Crafted Bites,{' '}
      <span className="hero-headline__accent">Straight from the Kitchen.</span>
    </>
  );

  return (
    <section
      role="region"
      aria-labelledby="hero-heading"
      className={`bitesbro-hero ${className}`.trim()}
      data-testid="bitesbro-hero"
    >
      <div className="hero-container">
        {/* ==================================================================
            LEFT COLUMN: Editorial Content, CTAs & Kitchen Trust Highlights
            ================================================================== */}
        <div className="hero-content">
          {/* Category Kicker Badge */}
          <div className="hero-kicker" data-testid="hero-kicker">
            <span className="hero-kicker__icon">
              <KitchenPanIcon size={16} />
            </span>
            <span>Cloud Kitchen · Fresh to Order</span>
          </div>

          {/* Expressive Editorial Headline */}
          <h1 id="hero-heading" className="hero-headline">
            {headline || defaultHeadline}
          </h1>

          {/* Engaging Lead Description */}
          <p className="hero-description">{description}</p>

          {/* Action Affordance Cluster */}
          <div className="hero-actions">
            <a
              href={primaryAction.href}
              className="hero-btn-primary"
              aria-label={primaryAction.ariaLabel}
              onClick={handlePrimaryClick}
            >
              <span>{primaryAction.label}</span>
              <span className="hero-btn-primary__arrow">
                <ArrowRightIcon size={18} />
              </span>
            </a>

            {secondaryAction && (
              <a
                href={secondaryAction.href}
                className="hero-btn-secondary"
                aria-label={secondaryAction.ariaLabel}
                onClick={handleSecondaryClick}
              >
                <span>{secondaryAction.label}</span>
              </a>
            )}
          </div>

          {/* Authentic Cloud Kitchen Trust Highlights */}
          <ul className="hero-trust-list" aria-label="Kitchen Service Highlights">
            <li className="hero-trust-item">
              <span className="hero-trust-icon">
                <PrepClockIcon size={18} />
              </span>
              <div className="hero-trust-text">
                <span className="hero-trust-title">Made to Order</span>
                <span className="hero-trust-desc">Prepared upon confirmation</span>
              </div>
            </li>

            <li className="hero-trust-item">
              <span className="hero-trust-icon">
                <OrderFlowIcon size={18} />
              </span>
              <div className="hero-trust-text">
                <span className="hero-trust-title">Direct Kitchen Flow</span>
                <span className="hero-trust-desc">Live prep & ready status</span>
              </div>
            </li>

            <li className="hero-trust-item">
              <span className="hero-trust-icon">
                <LeafIcon size={18} />
              </span>
              <div className="hero-trust-text">
                <span className="hero-trust-title">Daily Provisions</span>
                <span className="hero-trust-desc">Freshly prepped ingredients</span>
              </div>
            </li>
          </ul>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: Culinary Centerpiece & Authentic Detail Badges
            ================================================================== */}
        <div className="hero-visual">
          <div className="hero-dish-wrapper">
            {/* Ambient Warm Golden Aura */}
            <div className="hero-dish-halo" aria-hidden="true" />

            {/* Central High-Fidelity Culinary Presentation */}
            <img
              src={imageSrc}
              alt={imageAlt}
              width={560}
              height={560}
              loading="eager"
              decoding="async"
              className="hero-dish-img"
              data-testid="hero-dish-image"
            />

            {/* Detail Badge 1: Small-Batch Kitchen Standard */}
            <aside
              className="hero-floating-badge hero-floating-badge--top"
              aria-label="Small-Batch Kitchen Standard"
            >
              <div className="hero-badge-icon-wrap">
                <SparkleIcon size={16} />
              </div>
              <div className="hero-badge-text-wrap">
                <span className="hero-badge-title">Small-Batch Kitchen</span>
                <span className="hero-badge-subtitle">Prepped fresh daily</span>
              </div>
            </aside>

            {/* Detail Badge 2: Made to Order Standard (Neutral Authentic Branding) */}
            <aside
              className="hero-floating-badge hero-floating-badge--bottom"
              aria-label="Made to Order Standard"
            >
              <div className="hero-badge-icon-wrap">
                <KitchenPanIcon size={16} />
              </div>
              <div className="hero-badge-text-wrap">
                <span className="hero-badge-title">Made to Order</span>
                <span className="hero-badge-subtitle">Cooked upon ticket confirmation</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
