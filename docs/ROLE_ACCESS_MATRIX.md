# Role-Based Access Matrix (RBAC) & Authorization Architecture
**Project:** BitesBro Cloud Kitchen Platform
**Document Status:** Foundation Readiness Specification
**Authority:** `docs/ROUTES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, and `AGENTS.md`

---

## 1. Security Principle: Frontend Routing vs. Server-Side Authorization

> **MANDATORY SECURITY INVARIANT (AGENTS.md & docs/SECURITY.md):**
> Never trust role, user ID, price, tax, worksite, payment status, or permissions supplied by the browser.
> Frontend navigation guards and route hiding are user-experience conveniences, **NOT security boundaries**. Every protected operation, database query, and state mutation must be cryptographically verified and enforced server-side via Supabase Auth, PostgreSQL Row Level Security (RLS), and Supabase Edge Functions.
>
> **JWT Claim Structure — Application Role Path:**
> In Supabase JWTs, the application role is stored inside `app_metadata`. The correct PostgreSQL extraction in RLS policies is:
> ```sql
> (auth.jwt() -> 'app_metadata' ->> 'role')
> ```
> Using `auth.jwt() ->> 'role'` reads the top-level PostgreSQL database role (`authenticated`/`anon`), which will never match an application role value such as `kitchen` or `admin`. All RLS policy examples in §4 use the correct nested path.
>
> **Edge Function Role Verification:**
> RLS policies use `auth.jwt() -> 'app_metadata' ->> 'role'` for high-performance row filtering. Every privileged Edge Function must additionally look up the caller's role from `public.profiles` via the service-role client before executing any mutation. `app_metadata` is writable only via the service-role key (server-side administrative processes only); `user_metadata` is user-editable and must never be used for authorization. Privileged role assignment must never be accepted from a client request body or user-editable metadata — see `docs/BACKEND_FOUNDATION_PLAN.md` §2.

---

## 2. Comprehensive Route Access Matrix

| Application Route | Public / Guest | Customer (`customer`) | Kitchen Staff (`kitchen`) | Administrator (`admin`) | Payment Checker (`finance`) | Planned Server-Side Enforcement Mechanism |
|---|:---:|:---:|:---:|:---:|:---:|---|
| **`/me`**<br>*(Menu, Cart, Orders)* | **Read Menu Only**<br>(Browse dishes) | **Full Access**<br>(Menu, Cart, Order History) | **Read Menu Only**<br>(View catalog) | **Read Menu Only**<br>(View catalog) | **Read Menu Only**<br>(View catalog) | • `GET /menu`: Public access to `menu_items` where `is_available = true` and `is_published = true`.<br>• Cart state: Frontend local storage/memory.<br>• Orders: Supabase RLS `orders.customer_id = auth.uid()`. |
| **`/profile`**<br>*(Customer Profile & Addresses)* | **DENIED**<br>(Redirects to login) | **Full Access**<br>(Own profile only) | **DENIED** | **DENIED**<br>(Admins use dedicated admin views) | **DENIED** | • Supabase RLS on `profiles` table: `auth.uid() = id`.<br>• Users cannot query or mutate other profiles. |
| **`/checkout`**<br>*(Order Initiation & Payment)* | **DENIED**<br>(Auth required to checkout) | **Full Access**<br>(Initiate pending order) | **DENIED** | **DENIED** | **DENIED** | • Supabase Edge Function `POST /orders`.<br>• Server validates verified session token, recalculates prices/taxes, checks dish availability, and generates unique request key. |
| **`/orders/:id`**<br>*(Order Status & Receipt)* | **DENIED** | **Conditional Access**<br>(Only if `order.customer_id == auth.uid()`) | **Read Only**<br>(If order is active/assigned) | **Full Read Access**<br>(All orders in system) | **Read Only**<br>(Verification & audit purposes) | • PostgreSQL RLS on `orders` and `order_items` tables.<br>• Customer query: `orders.customer_id = auth.uid()`.<br>• Operational query: `(auth.jwt() -> 'app_metadata' ->> 'role') IN ('kitchen', 'admin', 'finance')`. |
| **`/kitchen/queue`**<br>*(Live Kitchen Active Orders)* | **DENIED** | **DENIED** | **Full Access**<br>(Active orders queue) | **Read Only**<br>(Operational oversight) | **DENIED** | • RLS on `orders`: `status IN ('CONFIRMED', 'PREPARING', 'READY')`.<br>• Kitchen staff can only query active operational states, never raw customer payment tokens or financial reconciliations. |
| **`/kitchen/order/:id`**<br>*(Order Preparation & Dispatch)* | **DENIED** | **DENIED** | **Full Access**<br>(Advance `CONFIRMED` &rarr; `PREPARING` &rarr; `READY`) | **Read / Override**<br>(Emergency override) | **DENIED** | • Edge Function `POST /orders/:id/status`.<br>• Enforces strict finite state machine transitions.<br>• Kitchen staff cannot mark order as `COMPLETED` (handled by delivery confirmation) or cancel without review. |
| **`/admin/menu`**<br>*(Menu Management & Pricing)* | **DENIED** | **DENIED** | **DENIED** | **Full Access**<br>(Create, update, toggle availability, prices) | **DENIED** | • RLS write policy: `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`.<br>• Edge Function validates price numeric format, GST slab, and creates audit log entry for price history. |
| **`/admin/orders`**<br>*(Global Order Management)* | **DENIED** | **DENIED** | **DENIED** | **Full Access**<br>(Historical & active orders) | **Read Only** | • RLS read policy: `(auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'finance')`.<br>• Admin status updates require logged justification in `audit_log`. |
| **`/admin/reports/daily`**<br>*(Financial & Daily Aggregates)* | **DENIED** | **DENIED** | **DENIED** | **Full Access**<br>(Daily totals, tax reports) | **Read / Reconcile**<br>(Financial validation) | • PostgreSQL stored procedure / Edge Function `GET /admin/reports/daily`.<br>• Restricted strictly to `admin` and `finance` roles.<br>• Excludes unmasked customer PII. |
| **`/finance/review`**<br>*(Unconfirmed Payment Queue)* | **DENIED** | **DENIED** | **DENIED** | **Read Only**<br>(Oversight) | **Full Access**<br>(Verify bank evidence & approve) | • RLS policy on `payments` where `status = 'PENDING_REVIEW'`.<br>• Edge Function `POST /payments/:id/manual-review` records checker identity, UTR/evidence reference, and transitions order to `CONFIRMED`. |
| **`/finance/reconcile`**<br>*(Settlement Ledger & Invoices)* | **DENIED** | **DENIED** | **DENIED** | **Read Only**<br>(Oversight) | **Full Access**<br>(Match bank statements to orders) | • PostgreSQL RLS on `invoices` and `payments` tables.<br>• Append-only reconciliation records in `audit_log`. |

---

## 3. Planned Access Rules vs. Implemented Authorization Status

| Layer | Planned Specification | Current Implementation Status (Task 06) | Next Step (Phase 1 / Task 07) |
|---|---|---|---|
| **Public Browsing** | Menu browsing at `/me` without authentication. | **IMPLEMENTED** (Frontend prototype active with demonstration fixtures). | Connect `GET /menu` Edge Function when backend is deployed. |
| **Customer Navigation** | Responsive Navbar and hash routing for Menu, Cart, and Orders (`#orders`). | **IMPLEMENTED** (Task 01-05 verified with 96 passing tests). | Bind real auth state from Supabase Auth listener. |
| **Staff & Admin Routes** | `/kitchen/*`, `/admin/*`, `/finance/*` routes isolated from customer navigation. | **PLANNED** (Defined in `navigation.config.ts` role configurations; routes unmounted in customer shell). | Create protected route wrappers and role-based lazy-loaded bundles in Phase 1. |
| **API Authorization** | JWT verification with custom claims (`role: customer \| kitchen \| admin \| finance`). | **PLANNED** (Design approved; no active backend services connected in frontend). | Implement Supabase Auth custom claims hook or `user_roles` database lookup. |
| **Database RLS** | PostgreSQL policies restricting read/write row access per role and tenant. | **PLANNED** (SQL migration blueprint prepared; no production database connected). | Apply versioned migration `00001_initial_schema.sql` to Supabase. |
| **Storage Access** | Private Supabase Storage buckets with 15-minute signed URLs for payment proof. | **PLANNED** (Documented in `docs/SECURITY.md`). | Configure private storage bucket policies in Supabase Storage. |

---

## 4. Database-Level Row Level Security (RLS) Policy Specifications

### `menu_items`
```sql
-- Anyone can view available published dishes
CREATE POLICY "Public menu items view" ON public.menu_items
  FOR SELECT USING (is_published = true AND is_available = true);

-- Kitchen and admin can view all dishes (including sold out)
CREATE POLICY "Staff menu view" ON public.menu_items
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('kitchen', 'admin', 'finance'));

-- Only administrators can modify menu items or prices
CREATE POLICY "Admin menu management" ON public.menu_items
  FOR ALL TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
```

### `orders`
```sql
-- Customers can view only their own orders
CREATE POLICY "Customer own orders select" ON public.orders
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

-- Kitchen staff can view orders in active fulfillment states
CREATE POLICY "Kitchen active orders select" ON public.orders
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'kitchen' AND
    status IN ('CONFIRMED', 'PREPARING', 'READY')
  );

-- Admin and Finance can view all orders
CREATE POLICY "Management orders view" ON public.orders
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('admin', 'finance'));

-- Client cannot insert orders directly; must use Edge Function
-- (INSERT is restricted to service_role within Supabase Edge Functions)
```

### `payments` & `order_events`
```sql
-- Customer can view payment status for own orders
CREATE POLICY "Customer payments view" ON public.payments
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

-- Finance team can view and update pending review payments
CREATE POLICY "Finance payments review" ON public.payments
  FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('finance', 'admin'));

-- Order events are append-only; direct UPDATE or DELETE is strictly forbidden
CREATE POLICY "Append-only order events" ON public.order_events
  FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('kitchen', 'admin', 'finance'));

CREATE POLICY "No order event modifications" ON public.order_events
  FOR UPDATE USING (false);

CREATE POLICY "No order event deletions" ON public.order_events
  FOR DELETE USING (false);
```

---

## 5. Enforcement Architecture: Defense in Depth

```
[Customer Browser / Staff Terminal]
          │  (HTTP / WebSockets)
          ▼
┌───────────────────────────────────────┐
│ 1. Frontend Route Guard (UX Only)     │ ──> Hides unauthorized buttons/screens
└───────────────────────────────────────┘
          │  (Bearer JWT in Auth Header)
          ▼
┌───────────────────────────────────────┐
│ 2. Edge Function Gateway Validation   │ ──> Verifies JWT signature, expiration, & role claims
│    (Supabase Edge Functions)          │ ──> Recalculates prices, taxes, & availability
└───────────────────────────────────────┘     ──> Enforces finite state machine transitions
          │  (PostgreSQL Connection Pool)
          ▼
┌───────────────────────────────────────┐
│ 3. PostgreSQL Row Level Security      │ ──> Restricts rows returned per `auth.uid()` and role
│    (PostgreSQL Database Engine)       │ ──> Blocks cross-tenant / cross-customer access
└───────────────────────────────────────┘     ──> Rejects direct unauthorized SQL writes
          │
          ▼
┌───────────────────────────────────────┐
│ 4. Append-Only Audit Logging          │ ──> Records actor, action, previous/new status, timestamp
│    (Immutable `audit_log` Table)      │ ──> Non-repudiation for financial & status changes
└───────────────────────────────────────┘
```

*Every layer functions independently. If a malicious client bypasses the frontend route guard, the Edge Function rejects the unauthenticated request; if an attacker attempts direct database manipulation, PostgreSQL RLS rejects the query.*
