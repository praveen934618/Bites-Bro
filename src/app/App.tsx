import React, { useState, useEffect, Suspense } from "react";
import Navbar from "../components/navigation/Navbar";
import { Hero } from "../components/hero";
import { MenuSection } from "../components/menu";
import { NavItem } from "../types/navigation";
import { MenuItem, CartSummary } from "../types/menu";
import type { NavbarVerificationStudioProps } from "../dev/NavbarVerificationStudio";
import "../styles/globals.css";
import "../styles/menu.css";

// Guard development workbench: only loaded in development builds

const NavbarVerificationStudio = React.lazy<
  React.ComponentType<NavbarVerificationStudioProps>
>(() =>
  import.meta.env.DEV
    ? import("../dev/NavbarVerificationStudio").then((m) => ({
        default: m.NavbarVerificationStudio || m.default,
      }))
    : Promise.resolve({
        default: (() => null) as React.FC<NavbarVerificationStudioProps>,
      }),
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
  const [activeSection, setActiveSection] = useState<string>("menu");
  // Single authoritative frontend cart state
  const [cart, setCart] = useState<CartSummary>({
    items: {},
    totalCount: 0,
    totalAmount: 0,
  });

  // Derived Navbar cart count from authoritative cart state
  const cartCount = cart.totalCount;

  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(() => {
    if (import.meta.env.DEV && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return (
        params.get("dev") === "true" || window.location.hash === "#dev-studio"
      );
    }
    return false;
  });

  // Keep hash in sync only during development
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const handleHashChange = () => {
      if (window.location.hash === "#dev-studio") {
        setIsStudioOpen(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const scrollToMenu = () => {
    if (typeof document !== "undefined") {
      const menuEl = document.getElementById("menu-section");
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNavigate = (item: NavItem) => {
    setActiveSection(item.id);
    if (item.id === "menu") {
      scrollToMenu();
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.items[item.id];
      const newQty = (existing?.quantity || 0) + 1;
      const updatedItems = {
        ...prev.items,
        [item.id]: { menuItem: item, quantity: newQty },
      };
      return {
        items: updatedItems,
        totalCount: prev.totalCount + 1,
        totalAmount: prev.totalAmount + item.price,
      };
    });
  };

  const handleSetCartCount = (count: number) => {
    setCart((prev) => ({
      ...prev,
      totalCount: count,
    }));
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
        {import.meta.env.DEV && isStudioOpen ? (
          /* Development-only preview route/component — strictly excluded in production */
          <Suspense
            fallback={
              <div style={{ padding: "32px", textAlign: "center" }}>
                Loading Studio...
              </div>
            }
          >
            <NavbarVerificationStudio
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              cartCount={cartCount}
              onSetCartCount={handleSetCartCount}
              onClose={() => setIsStudioOpen(false)}
            />
          </Suspense>
        ) : (
          /* Production Customer Homepage */
          <div className="bitesbro-homepage">
            {/* Task 02: Premium Customer Homepage Hero Section */}
            <Hero
              onNavigate={(route) => {
                if (route.includes("#orders")) {
                  setActiveSection("orders");
                } else if (route === "/me" || route === "/me#menu") {
                  setActiveSection("menu");
                  scrollToMenu();
                }
              }}
            />

            {/* Task 03: Premium Customer Menu Section */}
            <MenuSection onAddToCart={handleAddToCart} />
          </div>
        )}
      </main>

      {/* Floating dev preview trigger — strictly excluded in production builds */}
      {import.meta.env.DEV && !isStudioOpen && (
        <aside
          aria-label="Developer Preview Trigger"
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 999,
          }}
        >
          <button
            type="button"
            onClick={() => setIsStudioOpen(true)}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              fontFamily: "var(--font-ui)",
              fontWeight: 600,
              backgroundColor: "var(--color-espresso)",
              color: "var(--color-cream)",
              borderRadius: "var(--radius-pill)",
              border: "1px solid rgba(254, 243, 226, 0.2)",
              boxShadow: "var(--shadow-dropdown)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              opacity: 0.88,
              transition: "opacity 140ms ease, transform 140ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.opacity = "0.88";
              (e.currentTarget as HTMLElement).style.transform =
                "translateY(0)";
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "var(--color-amber)",
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
