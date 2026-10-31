# Agent Instructions — BitesBro

## Authority and source of truth
- Treat `source/` and `docs/` as the project requirements baseline.
- The supplied Architect 1 design is a candidate proposal, not approved production policy.
- Preserve explicit exclusions and unresolved decisions. Do not silently turn proposals into requirements.
- If a requirement is missing, record it in `docs/OPEN_QUESTIONS.md` and ask before implementing consequential behavior.

## Architecture boundaries
- Frontend: React PWA on Cloudflare Pages.
- Trusted backend: Supabase Edge Functions.
- Data/auth/files: Supabase Auth + PostgreSQL/RLS + private Supabase Storage.
- Keep secrets and privileged credentials server-side.
- Keep this project's Supabase project, environments, credentials and storage independent.
- Do not add a separate always-on server or cloud service without an approved architecture decision.

## Security rules
- Never trust role, user ID, price, tax, worksite, payment status or permissions supplied by the browser.
- Enforce authorization on every protected server operation and with PostgreSQL RLS.
- Use least privilege, validated input, idempotency for retryable writes and audit records for privileged changes.
- Private evidence/documents must not be exposed through public buckets. Use short-lived authorized access.
- Never commit `.env`, API keys, service-role keys, payment secrets or personal data.

## Product-specific invariants
Customer selects food; Edge Function validates current menu availability, price and tax; creates one PENDING order with unique request key; payment is verified from trustworthy provider/bank evidence or routed to human review; only verified/authorized orders enter kitchen preparation; kitchen updates preparing/ready; customer sees server-confirmed status.

## Implementation workflow
1. Inspect existing code and docs before editing.
2. Propose a small plan and identify affected modules/migrations.
3. Add or update tests with each behavior change.
4. Prefer small, typed, modular code; avoid premature microservices.
5. Add database migrations; do not edit production schema manually.
6. Verify authorization for allowed and denied roles, including cross-user access.
7. Run lint, typecheck, unit tests and relevant integration tests.
8. Update docs when API, schema, environment variables or behavior changes.

## UI rules
- Follow `design_system.md`; use semantic HTML, keyboard support and responsive layouts.
- Provide loading, empty, error, offline/disconnected and success states.
- Do not display success until the server confirms the saved result.
- Do not invent brand assets, copy, pricing, legal text or operational policy.

## Done means
- Tests cover happy path, invalid input, duplicate request, permission denial and failure/retry.
- RLS and server authorization are both reviewed.
- No secrets or real personal/payment data are in fixtures or logs.
- Docs and `.env.example` are updated.
