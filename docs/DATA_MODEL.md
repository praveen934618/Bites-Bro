# Data Model Notes — BitesBro

## Core entities named in source
users, menu_items, orders, order_items, payments, invoices, order_events, audit_log

## Integrity constraints
- Stable primary keys and foreign keys; index ownership, status and date-range queries.
- Preserve historical snapshots when later edits must not rewrite prior facts.
- Use append-only event/history tables for status changes and corrections.
- Add tenant/site scope where authorization requires it.
- Define retention and deletion behavior before collecting personal/evidence data.

## Product invariants
Customer selects food; Edge Function validates current menu availability, price and tax; creates one PENDING order with unique request key; payment is verified from trustworthy provider/bank evidence or routed to human review; only verified/authorized orders enter kitchen preparation; kitchen updates preparing/ready; customer sees server-confirmed status.

## Migration guidance
Use versioned SQL migrations in `supabase/migrations/`. Enable RLS on every exposed table
and test positive and negative access for every role. Frontend filtering is not authorization.
