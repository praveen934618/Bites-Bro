# API Contracts — BitesBro

Candidate routes from the architecture source; not a finalized OpenAPI contract.
Define request/response schemas, error codes, pagination and versioning before implementation.

| Method / path | Purpose | Required control |
|---|---|---|
| `GET /menu` | Published and available menu items | Public; published + available filter |
| `POST /orders` | Create pending order | Recalculate totals server-side; unique request key |
| `GET /orders/:id` | Read order | Owner or assigned operational role |
| `POST /orders/:id/status` | Kitchen/admin status update | Enforce allowed state transitions |
| `POST /payments/webhook` | Payment provider notification | Signature verification + deduplication, only if provider supports it |
| `POST /payments/:id/manual-review` | Payment checker review | Evidence, reason, actor and audit |
| `GET /admin/reports/daily` | Daily aggregates | Administrator scope |

## Contract-wide rules
- Derive identity from verified session, never from browser-supplied identity.
- Validate all inputs server-side; authorize before reading or writing protected records.
- Use stable error codes without leaking stack traces or secrets.
- Use idempotency keys for retryable writes.
- Audit actor, action, target and timestamp for privileged/financial changes.
- Store timestamps in UTC; localize only for display.

## Suggested response envelope
```json
{
  "data": {},
  "error": null,
  "request_id": "server-generated-correlation-id"
}
```
