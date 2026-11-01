import React, { useState, useEffect, Suspense, useCallback } from "react";
import Navbar from "../components/navigation/Navbar";
import { Hero } from "../components/hero";
import { MenuSection } from "../components/menu";
import { CartSection } from "../components/cart";
import { OrdersSection } from "../components/orders";
import { NavItem } from "../types/navigation";
import { MenuItem, CartSummary } from "../types/menu";
import type { NavbarVerificationStudioProps } from "../dev/NavbarVerificationStudio";
import "../styles/globals.css";
import "../styles/menu.css";
import "../styles/cart.css";
import "../styles/orders.css";

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
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#cart") return "cart";
      if (hash === "#orders" || hash.startsWith("#orders/")) return "orders";
    }
    return "menu";
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && window.location.hash.startsWith("#orders/")) {
      return window.location.hash.replace("#orders/", "").trim() || null;
    }
    return null;
  });

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

  // Keep section & studio in sync with browser hash
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (import.meta.env.DEV && currentHash === "#dev-studio") {
        setIsStudioOpen(true);
      } else if (currentHash === "#cart") {
        setActiveSection("cart");
        setSelectedOrderId(null);
      } else if (currentHash === "#orders") {
        setActiveSection("orders");
        setSelectedOrderId(null);
      } else if (currentHash.startsWith("#orders/")) {
        const orderId = currentHash.replace("#orders/", "").trim() || null;
        setActiveSection("orders");
        setSelectedOrderId(orderId);
      } else if (currentHash === "#menu" || currentHash === "" || currentHash === "#") {
        setActiveSection("menu");
        setSelectedOrderId(null);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const scrollToMenu = useCallback(() => {
    if (typeof document !== "undefined") {
      const menuEl = document.getElementById("menu-section");
      if (menuEl) {
        menuEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  const handleNavigate = (item: NavItem) => {
    setActiveSection(item.id);
    setSelectedOrderId(null);
    if (item.id === "cart") {
      if (typeof window !== "undefined" && window.location.hash !== "#cart") {
        window.location.hash = "#cart";
      }
    } else if (item.id === "menu") {
      if (typeof window !== "undefined" && window.location.hash !== "#menu" && window.location.hash !== "") {
        window.location.hash = "#menu";
      }
      scrollToMenu();
    } else if (item.id === "orders") {
      if (typeof window !== "undefined" && window.location.hash !== "#orders") {
        window.location.hash = "#orders";
      }
    }
  };

  const handleBrowseMenu = useCallback(() => {
    setActiveSection("menu");
    setSelectedOrderId(null);
    if (typeof window !== "undefined") {
      window.location.hash = "#menu";
    }
    scrollToMenu();
  }, [scrollToMenu]);

  const handleSelectOrder = useCallback((orderId: string | null) => {
    setSelectedOrderId(orderId);
    if (typeof window !== "undefined") {
      if (orderId) {
        window.location.hash = `#orders/${orderId}`;
      } else {
        window.location.hash = "#orders";
      }
    }
  }, []);

  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.items[item.id];
      const newQty = (existing?.quantity || 0) + 1;
      const updatedItems = {
        ...prev.items,
        [item.id]: { menuItem: item, quantity: newQty },
      };
      const count = Object.values(updatedItems).reduce((sum, i) => sum + i.quantity, 0);
      const amount = Object.values(updatedItems).reduce(
        (sum, i) => sum + i.quantity * i.menuItem.price,
        0
      );
      return {
        items: updatedItems,
        totalCount: count,
        totalAmount: amount,
      };
    });
  };

  const handleUpdateQuantity = useCallback((itemId: string, newQty: number) => {
    setCart((prev) => {
      const existing = prev.items[itemId];
      if (!existing) return prev;

      if (newQty <= 0) {
        const { [itemId]: _, ...remainingItems } = prev.items;
        const count = Object.values(remainingItems).reduce(
          (sum, i) => sum + i.quantity,
          0
        );
        const amount = Object.values(remainingItems).reduce(
          (sum, i) => sum + i.quantity * i.menuItem.price,
          0
        );
        return {
          items: remainingItems,
          totalCount: count,
          totalAmount: amount,
        };
      }

      const updatedItems = {
        ...prev.items,
        [itemId]: { ...existing, quantity: newQty },
      };
      const count = Object.values(updatedItems).reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      const amount = Object.values(updatedItems).reduce(
        (sum, i) => sum + i.quantity * i.menuItem.price,
        0
      );
      return {
        items: updatedItems,
        totalCount: count,
        totalAmount: amount,
      };
    });
  }, []);

  const handleRemoveItem = useCallback((itemId: string) => {
    setCart((prev) => {
      const existing = prev.items[itemId];
      if (!existing) return prev;
      const { [itemId]: _, ...remainingItems } = prev.items;
      const count = Object.values(remainingItems).reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      const amount = Object.values(remainingItems).reduce(
        (sum, i) => sum + i.quantity * i.menuItem.price,
        0
      );
      return {
        items: remainingItems,
        totalCount: count,
        totalAmount: amount,
      };
    });
  }, []);

  const handleClearCart = useCallback(() => {
    setCart({
      items: {},
      totalCount: 0,
      totalAmount: 0,
    });
  }, []);

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
        ) : activeSection === "cart" ? (
          /* Task 04: Premium Customer Cart Experience */
          <CartSection
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onBrowseMenu={handleBrowseMenu}
          />
        ) : activeSection === "orders" ? (
          /* Task 05: Premium Customer Orders Experience */
          <OrdersSection
            selectedOrderId={selectedOrderId}
            onSelectOrder={handleSelectOrder}
            onBrowseMenu={handleBrowseMenu}
          />
        ) : (
          /* Production Customer Homepage */
          <div className="bitesbro-homepage">
            {/* Task 02: Premium Customer Homepage Hero Section */}
            <Hero
              onNavigate={(route) => {
                if (route.includes("#orders")) {
                  setActiveSection("orders");
                  setSelectedOrderId(null);
                  if (typeof window !== "undefined") {
                    window.location.hash = "#orders";
                  }
                } else if (route.includes("#cart")) {
                  setActiveSection("cart");
                  setSelectedOrderId(null);
                  if (typeof window !== "undefined") {
                    window.location.hash = "#cart";
                  }
                } else if (route === "/me" || route === "/me#menu") {
                  setActiveSection("menu");
                  setSelectedOrderId(null);
                  if (typeof window !== "undefined") {
                    window.location.hash = "#menu";
                  }
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
