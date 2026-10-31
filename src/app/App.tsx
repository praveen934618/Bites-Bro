import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '../components/navigation/Navbar';
import { NavItem } from '../types/navigation';
import type { NavbarVerificationStudioProps } from '../dev/NavbarVerificationStudio';
import '../styles/globals.css';

// Guard development workbench: only loaded in development builds
const isDev = Boolean(import.meta.env.DEV);
const NavbarVerificationStudio = React.lazy<React.ComponentType<NavbarVerificationStudioProps>>(() =>
  import.meta.env.DEV
    ? import('../dev/NavbarVerificationStudio').then((m) => ({
        default: m.NavbarVerificationStudio || m.default,
      }))
    : Promise.resolve({ default: (() => null) as React.FC<NavbarVerificationStudioProps> })
);

/**
 * BitesBro Customer Application Shell
 *
 * Strict scope adherence:
 * - Production-ready Navbar mounted at the top
 * - Development-only Verification Studio isolated and excluded from production builds
 * - Clean customer layout container ready for subsequent feature sections
 */
export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('menu');
  const [cartCount, setCartCount] = useState<number>(0);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(() => {
    if (isDev && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('dev') === 'true' || window.location.hash === '#dev-studio';
    }
    return false;
  });

  // Keep hash in sync only during development
  useEffect(() => {
    if (!isDev) return;

    const handleHashChange = () => {
      if (window.location.hash === '#dev-studio') {
        setIsStudioOpen(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (item: NavItem) => {
    setActiveSection(item.id);
  };

  return (
    <div className="bitesbro-app">
      {/* Accessible skip link for keyboard & screen-reader users */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      {/* Production Customer Navbar */}
      <Navbar
        activeId={activeSection}
        onNavigate={handleNavigate}
        cartCount={cartCount}
      />

      {/* Main Content Area */}
      <main id="main-content">
        {isDev && isStudioOpen ? (
          /* Development-only preview route/component — excluded in production */
          <Suspense fallback={<div style={{ padding: '32px', textAlign: 'center' }}>Loading Studio...</div>}>
            <NavbarVerificationStudio
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              cartCount={cartCount}
              onSetCartCount={setCartCount}
              onClose={() => setIsStudioOpen(false)}
            />
          </Suspense>
        ) : (
          /* Clean customer canvas ready for future phase sections */
          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '64px 24px',
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-brand)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--color-espresso)',
                letterSpacing: '-0.02em',
                marginBottom: '12px',
              }}
            >
              BitesBro
            </div>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                maxWidth: '480px',
                lineHeight: 1.6,
                margin: '0 0 24px 0',
              }}
            >
              The customer-facing Navbar is actively mounted and verified above.
              Page content sections will be added in subsequent implementation phases.
            </p>

            {/* Development-only studio trigger inside the placeholder */}
            {isDev && (
              <button
                type="button"
                onClick={() => setIsStudioOpen(true)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-accent)',
                  backgroundColor: 'var(--color-hover-tint)',
                  border: '1px solid var(--color-amber)',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 140ms ease',
                }}
              >
                Open Navbar Verification Studio (Dev Only)
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating dev preview trigger — strictly excluded in production builds */}
      {isDev && !isStudioOpen && (
        <aside
          aria-label="Developer Preview Trigger"
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: 999,
          }}
        >
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              backgroundColor: 'var(--color-espresso)',
              color: 'var(--color-cream)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(254, 243, 226, 0.2)',
              boxShadow: 'var(--shadow-dropdown)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              opacity: 0.88,
              transition: 'opacity 140ms ease, transform 140ms ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '1';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = '0.88';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-amber)',
              }}
              aria-hidden="true"
            />
            Dev Studio
          </button>
        </aside>
      )}
    </div>
  );
};

export default App;
