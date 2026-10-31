# BitesBro — Design System

## 1. Design Intent
BitesBro is a lean, direct food-ordering platform connecting customers and cloud-kitchen operations. The visual identity balances culinary warmth with operational clarity. The aesthetic combines Warm Cream surfaces, deep Espresso Brown typography, vibrant Burnt Orange operational accents, and Golden Amber highlights.

---

## 2. Brand Palette & Contrast Verification

### Official Palette
| Token | Hex | Name | Role |
|---|---|---|---|
| `color.cream` | `#FEF3E2` | Warm Cream | Canvas ground, navbar background, soft warm surfaces. |
| `color.amber` | `#F4AE52` | Golden Amber | Selected highlights, subtle tints, borders, decorative accents. |
| `color.orange` | `#D4621A` | Burnt Orange | Primary brand accent, active navigation indicator, icon accents, large display brand mark. |
| `color.espresso` | `#2A1A0E` | Espresso Brown | Main typography, navigation labels, high-contrast controls. |

### Semantic Feedback Colors
| Token | Hex | Name | Role |
|---|---|---|---|
| `color.success` | `#16845B` | Forest Green | Verified payments, confirmed orders, kitchen ready status. |
| `color.warning` | `#B7791F` | Amber Ochre | Pending payments, review required, prep queue waiting. |
| `color.danger` | `#C0393B` | Crimson Red | Rejected items, payment mismatch, cancelled orders. |

### WCAG 2.2 Contrast Verification (on Warm Cream `#FEF3E2`)
*Reference background: Warm Cream (`#FEF3E2`)*

1. **Espresso Brown (`#2A1A0E`) on Warm Cream:**
   - Contrast Ratio: **approximately 15.27:1** (Exceeds WCAG AAA requirement of 7:1 for all text sizes).
   - **Usage:** All body text, navigation link text, titles, headings, and high-contrast button surfaces.

2. **Burnt Orange (`#D4621A`) on Warm Cream:**
   - Contrast Ratio: **approximately 3.44:1**.
   - **Compliance:** Meets WCAG AA requirement of 3:1 for **large text** (≥ 24px regular or ≥ 18.66px bold) and graphical UI components / indicators.
   - **Strict Rule:** Burnt Orange `#D4621A` **must not** be used for ordinary small body or navigation text on Warm Cream. It is reserved for:
     - The "Bro" wordmark (rendered at 24px bold).
     - Visual indicators (active underline bars, icon strokes, borders, focus rings).
     - Button backgrounds with Warm Cream text (where large/bold contrast applies).

3. **Accessible Accent Text Variant (`#943803` — Deep Terracotta):**
   - Contrast Ratio: **approximately 6.77:1** on Warm Cream.
   - **Compliance:** Meets WCAG AA for normal text (threshold 4.5:1), but does not meet AAA (threshold 7:1).
   - **Usage:** Whenever text smaller than 24px requires an orange/terracotta brand color on Warm Cream (e.g. active navigation text).

4. **Secondary Text (`#5E4F45` — Muted Espresso):**
   - Contrast Ratio: **approximately 6.9:1** on Warm Cream (Exceeds WCAG AA 4.5:1).
   - **Usage:** Subtitles, captions, metadata, item descriptions.

5. **Golden Amber (`#F4AE52`):**
   - Contrast Ratio on Warm Cream: **approximately 1.74:1**.
   - **Strict Rule:** Strictly non-text on cream surfaces. Used for decorative culinary dots, active highlight tints, border glows, or with dark Espresso text (where contrast exceeds 7:1).

---

## 3. Typography

- **Brand & Display Face:** `Bricolage Grotesque`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
  - Used for the BitesBro wordmark, prominent display headings, and brand moments.
  - Characteristics: Distinctive editorial personality, tight tracking (`letter-spacing: -0.03em`), bold/extrabold weights.
- **Interface & UI Face:** `IBM Plex Sans`, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif.
  - Used for navigation labels, buttons, controls, captions, and body copy.
  - Characteristics: Crisp legibility, balanced proportions, high optical clarity across viewports.

### Scale & Hierarchy
- **Wordmark:** 24px (desktop) / 20px (mobile), weight 800, tracking -0.03em.
- **Section Titles:** 20–24px, weight 700.
- **Navigation Labels:** 15px, weight 500, line-height 1.4.
- **Body:** 14–16px, line-height 1.5.
- **Metadata / Captions:** 12–13px, weight 400–500.

---

## 4. Spacing, Geometry & Layout
- **Baseline Scale:** 4px grid (4, 8, 12, 16, 20, 24, 32, 40, 48, 64px).
- **Max Content Width:** 1200px.
- **Navbar Height:** 68px (desktop) / 60px (mobile).
- **Minimum Touch Targets:** 44 × 44px for all interactive controls (buttons, links, toggles).
- **Radii:**
  - Controls & Buttons: 8px (`--radius-md`).
  - Small elements: 4–6px (`--radius-sm`).
  - Cards & Panels: 12px (`--radius-lg`).
  - Full / Pill: 9999px (`--radius-pill`).

---

## 5. Component Standards

### Navigation (Navbar)
- Semantic `<header role="banner">` with `<nav aria-label="Main Navigation">`.
- Three functional desktop zones:
  - **Left:** Typographic wordmark `BitesBro` (`Bites` in Espresso, `Bro` in Burnt Orange, Golden Amber dot). No customer-facing tagline clutter.
  - **Center:** Clean architectural link group (Menu, Orders) without an oversized artificial pill container and without duplicate Cart link.
  - **Right:** Dedicated customer action shortcuts (Cart with live item count badge & active state, Profile, high-contrast primary Order CTA).
- Mobile responsive drawer (< 769px) with accessible hamburger toggle, `aria-expanded`, `aria-controls`, Escape dismissal, focus management, and body scroll locking.
- Sticky positioning with subtle scroll elevation (`box-shadow: 0 4px 20px -2px rgba(42, 26, 14, 0.07)` and border transition) without layout shift.

### Accessibility Rules
- Target WCAG 2.2 AA.
- Visible focus rings (`outline: 2px solid var(--color-orange); outline-offset: 2px`).
- Support for `prefers-reduced-motion: reduce`.
- Never communicate state through color alone.

---

## 6. Centralized CSS Variables

```css
:root {
  /* Brand Colors */
  --color-cream: #FEF3E2;
  --color-amber: #F4AE52;
  --color-orange: #D4621A;
  --color-orange-accessible: #943803; /* Deep Terracotta: ~6.77:1 on cream (WCAG AA normal text) */
  --color-espresso: #2A1A0E;

  /* Semantic UI Surfaces & Text */
  --color-bg-page: var(--color-cream);
  --color-bg-navbar: var(--color-cream);
  --color-surface-card: #FFFFFF;
  --color-text-primary: var(--color-espresso);
  --color-text-secondary: #5E4F45;
  --color-text-inverse: var(--color-cream);
  --color-text-accent: var(--color-orange-accessible);

  /* Borders & Interactive Tints */
  --color-border-subtle: rgba(42, 26, 14, 0.08);
  --color-border-medium: rgba(42, 26, 14, 0.14);
  --color-border-focus: var(--color-orange);
  --color-hover-tint: rgba(244, 174, 82, 0.14);
  --color-active-surface: rgba(42, 26, 14, 0.06);

  /* Primary Button (Espresso ~15.27:1) */
  --color-btn-primary-bg: var(--color-espresso);
  --color-btn-primary-text: var(--color-cream);
  --color-btn-primary-hover: #3E2716;

  /* Feedback */
  --color-success: #16845B;
  --color-warning: #B7791F;
  --color-danger: #C0393B;

  /* Typography */
  --font-brand: 'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-ui: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Sizing & Geometry */
  --navbar-height-desktop: 68px;
  --navbar-height-mobile: 60px;
  --max-content-width: 1200px;
  --touch-target-min: 44px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 9999px;
}
```
