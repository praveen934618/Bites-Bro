/**
 * Menu Types & Data Contracts for BitesBro — Lean Integrated Ordering System
 * Aligned with docs/DATA_MODEL.md (menu_items) and docs/API_CONTRACTS.md (GET /menu)
 */

export type DietaryType = 'veg' | 'non-veg' | 'vegan' | 'gluten-free' | 'high-protein';

export type SpiceLevel = 'none' | 'mild' | 'medium' | 'spicy';

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in INR (currency unit)
  categoryId: string;
  imageUrl: string;
  imageAlt: string;
  isAvailable: boolean;
  dietary: DietaryType[];
  spiceLevel?: SpiceLevel;
  preparationTimeMinutes: number;
  ingredients: string[];
  allergens?: string[];
  calories?: number;
  isDemonstration?: boolean;
}

export interface MenuFilterState {
  selectedCategoryId: string;
  searchQuery: string;
  dietaryFilter?: DietaryType | 'all';
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CartSummary {
  items: Record<string, CartItem>;
  totalCount: number;
  totalAmount: number;
}
