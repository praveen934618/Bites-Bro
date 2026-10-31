import React from 'react';

export interface NavbarVerificationStudioProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  cartCount: number;
  onSetCartCount: (count: number) => void;
  onClose?: () => void;
}

/**
 * Navbar Verification Studio (Development Preview Component)
 *
 * Dedicated workbench for testing navbar behaviors, states, and accessibility
 * completely isolated from the customer-facing application shell.
 */
export const NavbarVerificationStudio: React.FC<NavbarVerificationStudioProps> = ({
  activeSection,
  onSelectSection,
  cartCount,
  onSetCartCount,
  onClose,
}) => {
  return (
    <section
      aria-label="Development Verification Studio"
      style={{
        margin: '24px auto',
        maxWidth: '1200px',
        padding: '0 24px',
      }}
    >
      <div
        style={{
          border: '1px dashed var(--color-border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          backgroundColor: 'rgba(42, 26, 14, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-orange)',
              }}
              aria-hidden="true"
            />
            <h2
              style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-espresso)',
                margin: 0,
              }}
            >
              Navbar Interactive Verification Studio
            </h2>
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-hover-tint)',
                color: 'var(--color-text-accent)',
              }}
            >
              Dev Tool
            </span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-surface-card)',
              }}
            >
              Hide Studio
            </button>
          )}
        </div>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Active state:{' '}
          <strong style={{ color: 'var(--color-text-accent)' }}>
            {activeSection.toUpperCase()}
          </strong>
          {' · '}
          Cart items: <strong>{cartCount}</strong>
          {' · '}
          Use the quick triggers below to inspect state and interaction responses.
        </p>

        {/* Section Navigation Test Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-secondary)',
            }}
          >
            Navigation Active States:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['menu', 'orders', 'cart'] as const).map((sectionId) => {
              const isSelected = activeSection === sectionId;
              return (
                <button
                  key={sectionId}
                  type="button"
                  onClick={() => onSelectSection(sectionId)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-medium)',
                    backgroundColor: isSelected
                      ? 'var(--color-espresso)'
                      : 'var(--color-surface-card)',
                    color: isSelected
                      ? 'var(--color-cream)'
                      : 'var(--color-espresso)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cart Count Test Triggers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-secondary)',
            }}
          >
            Cart Badge Scenarios:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'Empty (Count: 0)', count: 0 },
              { label: 'Items (Count: 3)', count: 3 },
              { label: 'Capped (Count: 105 -> 99+)', count: 105 },
            ].map((scenario) => {
              const isSelected = cartCount === scenario.count;
              return (
                <button
                  key={scenario.count}
                  type="button"
                  onClick={() => onSetCartCount(scenario.count)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-medium)',
                    backgroundColor: isSelected
                      ? 'var(--color-espresso)'
                      : 'var(--color-surface-card)',
                    color: isSelected
                      ? 'var(--color-cream)'
                      : 'var(--color-espresso)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  {scenario.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sticky Scroll Elevation Test Spacer */}
        <div
          style={{
            marginTop: '16px',
            padding: '48px 16px',
            border: '1px dashed var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            backgroundColor: 'rgba(42, 26, 14, 0.01)',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
            }}
          >
            Scroll viewport downward to verify sticky navbar scroll elevation and border shadow transition
          </span>
          <div style={{ height: '700px' }} />
        </div>
      </div>
    </section>
  );
};

export default NavbarVerificationStudio;
