# Backend Foundation & Technical Implementation Plan
**Project:** BitesBro Cloud Kitchen Platform
**Target Architecture:** Supabase (Auth + PostgreSQL + Edge Functions + Private Storage)
**Document Status:** Foundation Readiness Plan (Phase 1 Blueprint)
**Specification Date:** November 2026

---

## 1. Technical Implementation Sequence

The backend foundation for BitesBro is engineered as a deterministic, phased rollout following `docs/ROADMAP.md`. Each step establishes prerequisite security and schema controls before subsequent services are initialized:

```
Step 1: Environment Isolation & Project Setup (Dev / Staging / Prod)
   │
Step 2: Supabase Auth & Role Claims Infrastructure
   │
Step 3: PostgreSQL Schema Migration (Tables, Constraints, Indexes)
   │
Step 4: Row Level Security (RLS) Policy Implementation & Automated Tests
   │
Step 5: Private Storage Buckets & Presigned URL Policies
   │
Step 6: Server-Authoritative Pricing, Tax (GST), & Availability Engine
   │
Step 7: Idempotent Order Creation Edge Function (`create-order`)
   │
Step 8: Payment Gateway Webhook & Manual Review Edge Function (`verify-payment`)
   │
Step 9: Order Status Transition State Machine Edge Function (`update-order-status`)
   │
Step 10: Append-Only Audit Logging, Reporting (`daily-reports`), & Health Verification
```

---

## 2. Supabase Auth & Role-Based Profiles

### Identity Model
- **Primary Auth Provider:** Supabase Auth handling JWT session tokens, refresh token rotation, and secure HTTP-only cookies.
- **Role Assignment:** User roles (`customer`, `kitchen`, `admin`, `finance`) are the authoritative source of truth in the `public.profiles` table, linked via foreign key to `auth.users.id`.
- **Custom Claims Synchronization:** A trusted server-side PostgreSQL trigger copies the verified role from `profiles` into the user's JWT `app_metadata` object. In PostgreSQL RLS policies the role is accessed via the nested path `auth.jwt() -> 'app_metadata' ->> 'role'` — **not** `auth.jwt() ->> 'role'`, which reads the top-level PostgreSQL role (`authenticated`/`anon`) and would never match an application role.

> **SECURITY NOTE — JWT Claim Structure and Trust:**
>
> - The correct claim path for application roles in all RLS policies is:
>   ```sql
>   (auth.jwt() -> 'app_metadata' ->> 'role')
>   ```
> - `app_metadata` in Supabase is writable **only** by the service-role key (server-side administrative processes). It is **not** writable by client-side code or the anon key. Never use `user_metadata`, which users can edit freely, for privilege decisions.
> - Despite `app_metadata` being server-controlled, **every privileged Edge Function must independently verify the caller's role by querying `public.profiles` via the service-role client** before executing any privileged mutation. The JWT claim provides high-performance RLS row filtering; the `profiles` lookup provides authoritative defence-in-depth against misconfigured claim propagation or stale tokens.
> - Role assignment to `profiles.role` must only occur via a trusted server-side administrative API call (service-role key). It must never be accepted from a client request body or JWT metadata supplied by the browser.
>
> See `docs/ROLE_ACCESS_MATRIX.md` §1 and §4 and `AGENTS.md` invariant: "Never trust role… supplied by the browser."

```sql
-- Trigger to initialize profile and default role on user creation.
-- SECURITY: raw_app_meta_data is populated by Supabase Auth server-side only
-- (service-role key or Supabase dashboard). Client-side signup cannot set app_metadata.
-- The COALESCE defaults to 'customer'; a non-customer role may only be set via a
-- trusted server-side administrative call after account creation — never from a
-- client request body or user-editable metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    new.phone,
    COALESCE(new.raw_app_meta_data->>'role', 'customer'),
    NOW(),
    NOW()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. PostgreSQL Database Schema Blueprint

The schema enforces strict referential integrity, historical data snapshotting, and immutable audit logs:

### Key Tables
1. **`profiles`**: User details, phone number, display name, assigned RBAC role (`customer`, `kitchen`, `admin`, `finance`).
2. **`menu_items`**: Dish catalog, base price (in INR integer paise/rupees), category (`bowls`, `mains`, `starters`, `desserts`, `beverages`), availability status (`is_available`), publication flag (`is_published`), preparation time, dietary tags, allergens.
3. **`orders`**: Master order record containing `customer_id`, unique `request_key` (idempotency token), server-calculated `subtotal`, `estimated_tax`, `delivery_fee`, `total_amount`, current `status` (`PENDING`, `CONFIRMED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`), timestamps.
4. **`order_items`**: Line items snapshotting `menu_item_id`, dish `name` at time of purchase, immutable unit `price`, `quantity`, line total, and optional dish notes.
5. **`payments`**: Payment records with `order_id`, `provider` (e.g. Razorpay, UPI, Cash), `transaction_id`, `utr_number`, `amount`, `status` (`PENDING`, `VERIFIED`, `PENDING_REVIEW`, `FAILED`, `REFUNDED`), verified timestamp, and review evidence URL.
6. **`invoices`**: Official sequential GST tax invoice (`invoice_number`, `gstin`, `cgst_amount`, `sgst_amount`, `total_tax`, `invoice_url`).
7. **`order_events`**: Append-only status transition log (`order_id`, `previous_status`, `new_status`, `actor_id`, `actor_role`, `notes`, `created_at`).
8. **`audit_log`**: Comprehensive security and financial audit ledger recording actor, IP hash, action slug, target table/record, previous state JSON, and new state JSON.

---

## 4. Versioned SQL Migrations Plan

Migrations will be committed to `supabase/migrations/` using standard timestamps and descriptive slugs:

- `20261102000001_create_core_schema.sql`: Base tables, foreign keys, check constraints, and performance indexes.
- `20261102000002_create_rls_policies.sql`: Complete Row Level Security policies for all tables across all 4 roles.
- `20261102000003_create_audit_triggers.sql`: Triggers for `order_events` and append-only `audit_log` records.
- `20261102000004_create_storage_buckets.sql`: Private storage bucket definitions and RLS policies.

*No manual production schema modifications via the Supabase dashboard will be permitted.*

---

## 5. Supabase Edge Functions Layout

Edge Functions are written in TypeScript, run on Deno / Cloudflare V8 isolates, and act as the trusted server boundary:

```
functions/
├── _shared/
│   ├── auth.ts              # JWT verification & role validation
│   ├── cors.ts              # Strict CORS headers (allowed origins only)
│   ├── db.ts                # Authenticated Supabase client (service_role pool)
│   ├── errors.ts            # Standardized error response envelope
│   └── pricing.ts           # Server-side subtotal, GST [PENDING CA APPROVAL], and delivery calculations
├── create-order/
│   └── index.ts             # Validates items, recalculates totals, ensures idempotency, creates PENDING order
├── update-order-status/
│   └── index.ts             # Validates state machine transition, records order_events
├── verify-payment/
│   └── index.ts             # Webhook validation & manual maker-checker review resolution
└── daily-reports/
    └── index.ts             # Aggregates daily orders, tax totals, and items sold for admin
```

---

## 6. Private Storage Bucket Architecture

All file uploads and generated documents are housed in private Supabase Storage buckets:

| Bucket Name | Purpose | Access Control | Expiration Policy |
|---|---|---|---|
| `bitesbro-evidence` | Payment receipts, bank transaction screenshots for exception review. | Read restricted to `finance` and `admin` roles only. Customer can write own proof during review. | 15-minute signed URL generated on demand. |
| `bitesbro-invoices` | Generated PDF tax invoices. | Customer can read own invoice; `admin` / `finance` can read all invoices. | 1-hour signed URL generated on request. |

*Zero public storage buckets. Direct access without signed JWT authentication is rejected by storage RLS.*

---

## 7. Server-Authoritative Pricing, Tax & Availability Engine

> **SECURITY INVARIANT (AGENTS.md):**
> Never trust price, tax, or availability supplied by the browser.

When the customer submits an order:
1. The client sends `{ items: [{ menuItemId: "dish-01", quantity: 2 }] }`.
2. Edge Function `create-order` fetches current database records for the requested IDs.
3. Availability is verified: if `is_available = false`, the order is rejected with HTTP 409 (`ITEM_UNAVAILABLE`).
4. Unit prices are retrieved from the database, NOT the request payload.
5. Subtotal is computed: `subtotal = SUM(db_price * quantity)`.
6. Taxes are computed: **[PENDING CLIENT APPROVAL — GST rate, delivery fee thresholds, and rounding rules require chartered accountant sign-off; see `docs/PHASE_0_APPROVALS.md` §7]** The illustrative calculation below uses candidate values only:
   ```ts
   const subtotal = items.reduce((sum, item) => sum + (item.dbPrice * item.quantity), 0);
   // CANDIDATE: 5% GST (2.5% CGST + 2.5% SGST) for cloud kitchen — subject to CA confirmation
   const estimatedTax = Math.round(subtotal * 0.05);
   // CANDIDATE: ₹40 delivery fee; waived above ₹500 cart value — subject to client approval
   const deliveryFee = subtotal >= 500 ? 0 : 40;
   const totalAmount = subtotal + estimatedTax + deliveryFee;
   ```
7. Database transaction writes the order and item snapshots atomically.

---

## 8. Idempotent Order Creation

To prevent duplicate charges, network retry issues, or double-clicks:
1. Client generates a unique UUID `request_key` for each checkout attempt.
2. The `request_key` is passed via header `Idempotency-Key` or payload property `requestKey`.
3. Database enforces a unique constraint on `orders(customer_id, request_key)`.
4. If a duplicate request arrives:
   - If previous order is `PENDING` or `CONFIRMED`, the existing order record is returned without re-creating.
   - If previous order was `FAILED`, client must generate a fresh `request_key`.

---

## 9. Payment Verification & Exception Review Workflow

```
[Payment Initiated]
        │
        ├── Automated Webhook (Razorpay/UPI API) ──> Cryptographic Signature Validated?
        │         ├── YES ──> Record Payment (VERIFIED) ──> Order Status: CONFIRMED
        │         └── NO  ──> Log Security Alert ──> Discard Request
        │
        └── Offline / Unconfirmed Transfer (UTR Reference Submitted)
                  │
                  ▼
          Order Status: PENDING (Review Required)
          Payment Record: PENDING_REVIEW
                  │
                  ▼
          Routes to `/finance/review` Queue
                  │
                  ▼
          Payment Checker Inspects Bank Credit / Evidence
                  ├── Validated ──> Approves (Logs UTR & Checker ID) ──> Order Status: CONFIRMED
                  └── Invalid   ──> Rejects (Logs Reason) ──> Order Status: CANCELLED (Voided)
```

---

## 10. Finite State Machine for Order Transitions

Orders strictly adhere to a one-way state transition matrix enforced in PostgreSQL triggers and Edge Functions:

```
 ┌──────────┐
 │ PENDING  │ ──(Payment Failed / Timeout / Stockout)──> ┌───────────┐
 └──────────┘                                            │ CANCELLED │
      │ (Payment Verified / Approved)                    └───────────┘
      ▼                                                        ▲
 ┌───────────┐                                                 │
 │ CONFIRMED │ ──(Kitchen Stockout with Refund)────────────────┘
 └───────────┘
      │ (Kitchen begins preparation)
      ▼
 ┌───────────┐
 │ PREPARING │
 └───────────┘
      │ (Dishes boxed & dispatched to counter)
      ▼
 ┌───────────┐
 │   READY   │
 └───────────┘
      │ (Delivery partner / customer handoff)
      ▼
 ┌───────────┐
 │ COMPLETED │
 └───────────┘
```

- Any attempt to transition backwards (e.g., `READY` &rarr; `PREPARING`) or skip steps (e.g., `PENDING` &rarr; `READY`) is rejected with HTTP 422 (`INVALID_STATE_TRANSITION`).
- Every valid transition appends a record to `order_events` with the actor's identity and timestamp.
