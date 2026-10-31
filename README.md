# BitesBro — Project Starter

**Lean Integrated Ordering System**

## Product summary
A direct food-ordering website for customers, a live order list for the kitchen and controls for administrators. React PWA delivered by Cloudflare Pages; Supabase Edge Functions perform trusted validation and state changes; Supabase Auth, PostgreSQL/RLS and private Storage hold identities, records and evidence.

## First release
Menu with availability and categories; customer Menu/Cart/Orders experience and checkout; server-side price/tax validation; pending order before payment; verified status transitions; kitchen queue; preparing/ready updates; administrator menu editing; daily totals and invoice breakdown; payment exception queue with named checker, evidence and audit trail.

## Not in the first release
AI food-demand forecasting, loyalty program, complex driver location tracking, advanced dispatch, native apps and automatic gateway migration are later possibilities, not first-release commitments.

## Architecture at a glance
- Frontend: React PWA
- Static hosting: Cloudflare Pages
- Trusted backend: Supabase Edge Functions
- Identity/data/files: Supabase Auth + PostgreSQL/RLS + private Supabase Storage

## Repository map
- `AGENTS.md` — coding-agent guardrails and workflow.
- `design_system.md` — visual tokens, component guidance and accessibility.
- `docs/ARCHITECTURE.md` — system boundaries, deployment and flow.
- `docs/API_CONTRACTS.md` — API contract proposal.
- `docs/DATA_MODEL.md` — entities and integrity constraints.
- `docs/SECURITY.md` — authorization, data protection and privacy requirements.
- `docs/DECISIONS.md` — proposed decisions and approval status.
- `docs/OPEN_QUESTIONS.md` — unresolved client decisions.
- `docs/ROADMAP.md` — staged implementation plan.
- `docs/TEST_PLAN.md` — acceptance and failure tests.
- `docs/OPERATIONS.md` — deployment, monitoring and recovery notes.
- `public/robots.txt`, `public/sitemap.xml` — SEO starter files; replace example domain.
- `source/` — supplied architecture PDF.

## Start
1. Read `AGENTS.md`, `docs/DECISIONS.md` and `docs/OPEN_QUESTIONS.md`.
2. Obtain client approval for pending policies before implementing them.
3. Copy `.env.example` to `.env.local`; fill values locally and never commit secrets.
4. Configure `seo/site.config.example.json` with the actual canonical origin.
5. Implement schema and RLS before connecting UI screens.
6. Run the test plan before pilot data is introduced.

## Status and caveats
Architecture is **proposed / approval pending**. This folder is a blueprint and scaffold,
not a running application. The source document does not provide the production domain,
credentials or all business rules. Do not invent these.
