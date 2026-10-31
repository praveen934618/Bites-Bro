# Frontend Source Layout — BitesBro

```text
src/
  app/
    App.tsx                       # Clean customer application shell with dev preview toggle
  dev/
    NavbarVerificationStudio.tsx  # Isolated development-only verification workbench & test studio
  components/
    navigation/
      Navbar.tsx                  # Desktop & mobile responsive Navbar component (68px desktop)
      MobileNavigation.tsx        # Accessible mobile drawer with ESC key & focus handling
      NavIcons.tsx                # Custom accessible SVG vector icons
      navigation.config.ts        # Centralized route navigation config (docs/ROUTES.md)
      Navbar.test.tsx             # Unit and accessibility test suite
  styles/
    tokens.css                    # Official BitesBro palette tokens & typographic scales
    globals.css                   # Global CSS reset, accessibility styles, skip link
    navbar.css                    # Scoped navbar layout and interaction styles
  types/
    navigation.ts                 # TypeScript interfaces for navigation
  test/
    setup.ts                      # Vitest test environment configuration
  main.tsx                        # Application entry point
```

## Task 01: Navbar Refinements
- **Visual Identity:** Warm Cream (`#FEF3E2`), Golden Amber (`#F4AE52`), Burnt Orange (`#D4621A`), Espresso Brown (`#2A1A0E`).
- **Typography:** Bricolage Grotesque (brand display wordmark) and IBM Plex Sans (navigation & controls). Tagline removed from customer navbar.
- **Refined Geometry:** 68px compact desktop height, 60px mobile height, >= 44px touch targets.
- **Deduplicated Cart:** Dedicated in persistent action zone with live badge (`cartCount > 0`) and active state; center nav holds `Menu` and `Orders`.
- **Order Now CTA:** Directs to `/me` (Menu) without implying completed checkout.
- **Isolated Dev Studio:** Development testing workbench moved to `src/dev/NavbarVerificationStudio.tsx` and toggled via `#dev-studio` or `?dev=true` or floating dev trigger.
