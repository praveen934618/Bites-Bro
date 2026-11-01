import fs from "fs";
import path from "path";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MenuSection } from "./MenuSection";
import { FoodCard } from "./FoodCard";
import { FoodDetailsModal } from "./FoodDetailsModal";
import { MenuCategories } from "./MenuCategories";
import {
  MENU_CATEGORIES,
  DEMO_MENU_ITEMS,
  DEMO_CATALOG_DISCLAIMER,
} from "../../data/menuFixtures";
import { MenuItem } from "../../types/menu";

const mockDish: MenuItem = {
  id: "test-dish-1",
  name: "Artisanal Saffron Rice Bowl",
  description:
    "Fragrant saffron basmati rice with charred greens and toasted nuts.",
  price: 360,
  categoryId: "bowls",
  imageUrl: "/images/menu/bowl-salmon.svg",
  imageAlt: "Saffron rice bowl with charred greens",
  isAvailable: true,
  dietary: ["veg", "gluten-free"],
  spiceLevel: "mild",
  preparationTimeMinutes: 15,
  ingredients: ["Basmati rice", "Saffron", "Greens", "Almonds"],
  allergens: ["Tree Nuts"],
  calories: 450,
  isDemonstration: true,
};

const mockSoldOutDish: MenuItem = {
  ...mockDish,
  id: "test-dish-sold-out",
  name: "Special Truffle Risotto",
  isAvailable: false,
};

describe("Customer Menu Experience (Task 03)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("MenuSection Integration", () => {
    it("renders menu section with accessible title, eyebrow, and description", () => {
      render(<MenuSection />);

      const section = screen.getByRole("region", { name: /Explore Our Menu/i });
      expect(section).toBeInTheDocument();

      const heading = screen.getByRole("heading", {
        level: 2,
        name: /Explore Our Menu/i,
      });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveAttribute("id", "menu-heading");

      expect(screen.getByText(/Curated Culinary Lineup/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Wholesome grain bowls, slow-braised kitchen mains/i),
      ).toBeInTheDocument();
    });

    it("renders prototype disclaimer note complying with AGENTS.md rules", () => {
      render(<MenuSection />);

      const note = screen.getByRole("note");
      expect(note).toBeInTheDocument();
      expect(note).toHaveTextContent("Prototype Notice");
      expect(note).toHaveTextContent(DEMO_CATALOG_DISCLAIMER);
    });

    it("renders all menu categories with display order and badges", () => {
      render(<MenuSection />);

      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toBe(MENU_CATEGORIES.length);
      expect(tabs[0]).toHaveTextContent("All Items");
      expect(tabs[1]).toHaveTextContent("Grain Bowls");
      expect(tabs[2]).toHaveTextContent("Kitchen Mains");
    });

    it("filters food cards when a category tab is clicked", () => {
      render(<MenuSection />);

      // Initially all 12 items are rendered
      expect(screen.getByText(/Showing/i)).toHaveTextContent("12");

      // Click "Small Plates" tab
      const smallPlatesTab = screen.getByRole("tab", { name: /Small Plates/i });
      fireEvent.click(smallPlatesTab);

      // Verify category active tab
      expect(smallPlatesTab).toHaveAttribute("aria-selected", "true");

      // Small plates items should be visible
      expect(
        screen.getByText("Charred Paneer Tikka Medallions"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Crispy Lotus Stem with Sweet Chilli Glaze"),
      ).toBeInTheDocument();

      // Items from other categories should not be rendered
      expect(
        screen.queryByText("Glazed Salmon & Haas Avocado Bowl"),
      ).not.toBeInTheDocument();
    });

    it("filters dishes by case-insensitive search query", () => {
      render(<MenuSection />);

      const searchInput = screen.getByRole("searchbox", {
        name: /Search food menu by dish name or ingredient/i,
      });

      // Search for "salmon"
      fireEvent.change(searchInput, { target: { value: "salmon" } });

      expect(
        screen.getByText("Glazed Salmon & Haas Avocado Bowl"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Smoked Teriyaki Tofu & Soba Bowl"),
      ).not.toBeInTheDocument();
    });

    it("combines category filter and search query correctly", () => {
      render(<MenuSection />);

      // Select "Refreshers"
      const refreshersTab = screen.getByRole("tab", { name: /Refreshers/i });
      fireEvent.click(refreshersTab);

      // Search for "orange"
      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "orange" } });

      expect(
        screen.getByText("Cold-Pressed Blood Orange & Ginger Cooler"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Iced Yuzu & Roasted Barley Tea"),
      ).not.toBeInTheDocument();
    });

    it("clears search input when clear button is clicked", () => {
      render(<MenuSection />);

      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, { target: { value: "biryani" } });

      const clearBtn = screen.getByRole("button", {
        name: /Clear search input/i,
      });
      expect(clearBtn).toBeInTheDocument();

      fireEvent.click(clearBtn);

      expect(searchInput).toHaveValue("");
      expect(screen.getByText(/Showing/i)).toHaveTextContent("12");
    });

    it("renders empty state when search query finds 0 matches", () => {
      render(<MenuSection />);

      const searchInput = screen.getByRole("searchbox");
      fireEvent.change(searchInput, {
        target: { value: "nonexistentxyzrecipe" },
      });

      const emptyStatus = screen.getByRole("status", {
        name: /No dishes found/i,
      });
      expect(emptyStatus).toBeInTheDocument();
      expect(
        screen.getByText(/No Dishes Match Your Search/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/nonexistentxyzrecipe/i)).toBeInTheDocument();

      // Reset filters button
      const resetBtn = screen.getByRole("button", {
        name: /Reset All Filters/i,
      });
      expect(resetBtn).toBeInTheDocument();

      fireEvent.click(resetBtn);

      // Full catalog restored
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(screen.getByText(/Showing/i)).toHaveTextContent("12");
    });

    it("filters items by dietary filter pill (e.g., Vegan)", () => {
      render(<MenuSection />);

      const veganPill = screen.getByRole("button", { name: "Vegan" });
      fireEvent.click(veganPill);

      expect(veganPill).toHaveAttribute("aria-pressed", "true");

      // Tofu bowl is vegan
      expect(
        screen.getByText("Smoked Teriyaki Tofu & Soba Bowl"),
      ).toBeInTheDocument();
      // Salmon bowl is non-veg, should not be present
      expect(
        screen.queryByText("Glazed Salmon & Haas Avocado Bowl"),
      ).not.toBeInTheDocument();
    });
  });

  describe("FoodCard Component", () => {
    it("renders dish details including name, price in INR, prep time, and dietary badges", () => {
      render(<FoodCard item={mockDish} />);

      expect(
        screen.getByText("Artisanal Saffron Rice Bowl"),
      ).toBeInTheDocument();
      expect(screen.getByText("360")).toBeInTheDocument();
      expect(screen.getByText("₹")).toBeInTheDocument();
      expect(screen.getByText("15m prep")).toBeInTheDocument();
      expect(screen.getByText(/450\s*kcal/i)).toBeInTheDocument();
      expect(screen.getByText("gluten-free")).toBeInTheDocument();

      // Fallback image handling
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("src", "/images/menu/bowl-salmon.svg");
      expect(img).toHaveAttribute(
        "alt",
        "Saffron rice bowl with charred greens",
      );
    });

    it("calls onAddToCart callback when Add to Cart button is clicked", () => {
      const handleAddToCart = vi.fn();
      render(<FoodCard item={mockDish} onAddToCart={handleAddToCart} />);

      const addBtn = screen.getByRole("button", {
        name: /Add Artisanal Saffron Rice Bowl to cart/i,
      });
      fireEvent.click(addBtn);

      expect(handleAddToCart).toHaveBeenCalledTimes(1);
      expect(handleAddToCart).toHaveBeenCalledWith(mockDish);
      expect(screen.getByText("Added")).toBeInTheDocument();
    });

    it("renders sold out state with disabled action button for unavailable items", () => {
      const handleAddToCart = vi.fn();
      render(<FoodCard item={mockSoldOutDish} onAddToCart={handleAddToCart} />);

      expect(screen.getByText("Sold Out")).toBeInTheDocument();

      const addBtn = screen.getByRole("button", {
        name: /Special Truffle Risotto is sold out/i,
      });
      expect(addBtn).toBeDisabled();
      expect(addBtn).toHaveTextContent("Unavailable");

      fireEvent.click(addBtn);
      expect(handleAddToCart).not.toHaveBeenCalled();
    });

    it("triggers onViewDetails when Details button is clicked", () => {
      const handleViewDetails = vi.fn();
      render(<FoodCard item={mockDish} onViewDetails={handleViewDetails} />);

      const detailsBtn = screen.getByRole("button", {
        name: /View ingredients and details for Artisanal Saffron Rice Bowl/i,
      });
      fireEvent.click(detailsBtn);

      expect(handleViewDetails).toHaveBeenCalledTimes(1);
      expect(handleViewDetails).toHaveBeenCalledWith(mockDish);
    });
  });

  describe("FoodDetailsModal Accessibility & Interactions", () => {
    it("renders modal dialog with accessible attributes when open", () => {
      render(
        <FoodDetailsModal item={mockDish} isOpen={true} onClose={vi.fn()} />,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "modal-food-title");
      expect(dialog).toHaveAttribute(
        "aria-describedby",
        "modal-food-description",
      );

      expect(
        screen.getByText("Artisanal Saffron Rice Bowl"),
      ).toBeInTheDocument();
      expect(screen.getByText("Ingredients")).toBeInTheDocument();
      expect(screen.getByText("Tree Nuts")).toBeInTheDocument();
      expect(screen.getByText(/Prototype Notice/i)).toBeInTheDocument();
    });

    it("closes modal when close button is clicked", () => {
      const handleClose = vi.fn();
      render(
        <FoodDetailsModal
          item={mockDish}
          isOpen={true}
          onClose={handleClose}
        />,
      );

      const closeBtn = screen.getByRole("button", {
        name: /Close food details dialog/i,
      });
      fireEvent.click(closeBtn);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("closes modal when Escape key is pressed", () => {
      const handleClose = vi.fn();
      render(
        <FoodDetailsModal
          item={mockDish}
          isOpen={true}
          onClose={handleClose}
        />,
      );

      fireEvent.keyDown(window, { key: "Escape" });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("invokes onAddToCart and closes modal when Add to Cart is clicked inside modal", () => {
      const handleAddToCart = vi.fn();
      const handleClose = vi.fn();

      render(
        <FoodDetailsModal
          item={mockDish}
          isOpen={true}
          onClose={handleClose}
          onAddToCart={handleAddToCart}
        />,
      );

      const addBtn = screen.getByRole("button", {
        name: /Add Artisanal Saffron Rice Bowl to cart for ₹360/i,
      });
      fireEvent.click(addBtn);

      expect(handleAddToCart).toHaveBeenCalledTimes(1);
      expect(handleAddToCart).toHaveBeenCalledWith(mockDish);
      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not render when isOpen is false", () => {
      render(
        <FoodDetailsModal item={mockDish} isOpen={false} onClose={vi.fn()} />,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("MenuCategories Navigation", () => {
    it("handles keyboard arrow navigation between category tabs", () => {
      const handleSelectCategory = vi.fn();
      render(
        <MenuCategories
          categories={MENU_CATEGORIES}
          selectedCategoryId="all"
          onSelectCategory={handleSelectCategory}
        />,
      );

      const allTab = screen.getByRole("tab", { name: /All Items/i });
      fireEvent.keyDown(allTab, { key: "ArrowRight" });

      // Should advance to second category (Grain Bowls)
      expect(handleSelectCategory).toHaveBeenCalledWith("bowls");
    });
  });

  describe("Menu Fixture Assets Integrity", () => {
    it("verifies that every menu fixture imageUrl maps to an existing file in public/", () => {
      const publicDir = path.resolve(process.cwd(), "public");

      expect(DEMO_MENU_ITEMS.length).toBeGreaterThan(0);

      DEMO_MENU_ITEMS.forEach((dish) => {
        const relativePath = dish.imageUrl.replace(/^\//, "");
        const fullPath = path.join(publicDir, relativePath);

        expect(
          fs.existsSync(fullPath),
          `Missing image asset for "${dish.name}" at: ${dish.imageUrl} (resolved to ${fullPath})`,
        ).toBe(true);
      });
    });

    it("verifies that the dish fallback image asset exists in public/", () => {
      const publicDir = path.resolve(process.cwd(), "public");
      const fallbackPath = path.join(
        publicDir,
        "images/menu/dish-fallback.svg",
      );

      expect(
        fs.existsSync(fallbackPath),
        `Missing fallback image asset at: ${fallbackPath}`,
      ).toBe(true);
    });
  });
});
