# Open Questions — BitesBro
- Confirm menu categories, modifiers, availability and sold-out rules.
- Confirm pickup/delivery scope, operator, hours and service area.
- Confirm payment provider/bank feed and trustworthy transaction confirmation.
- Confirm timeout, late/duplicate payment, refund and cancellation policies.
- Confirm GST treatment, invoice/legal requirements, fees and tax rounding with accountant.
- Confirm payment checker authority, evidence and override policy.
- Confirm kitchen status workflow and transition permissions.
- Confirm order volume, peak concurrency, retention, support and uptime.
- Confirm production domain and public pages.

## Task 01 — Presentation Defaults (Resolved for Navbar)
- **Customer Navigation Structure:** Customer links point to `/me` sub-views (`Menu`, `Cart`, `Orders`) as specified in `docs/ROUTES.md`.
- **Cart & Profile Affordances:** Cart icon provides an accessible shortcut to `/me` (cart view); Profile icon points to `/profile`. Zero fake items or mock counts are displayed to avoid fabricated state.
- **Brand Typography:** Deployed with Google Fonts `Bricolage Grotesque` and `IBM Plex Sans` with system sans-serif fallbacks.
- **Role Extensibility:** Navigation configuration is structured by role (`customer`, `kitchen`, `admin`, `finance`), with customer-facing navigation active for Task 01.

