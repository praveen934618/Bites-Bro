# Phase 0 — Client Approval Checklist & Readiness Assessment
**Project:** BitesBro Cloud Kitchen PWA
**Status:** Readiness Assessment Prepared — Approvals Pending
**Baseline Architecture:** Architect 1 Proposal (`source/` & `docs/ARCHITECTURE.md`)
**Specification Date:** November 2026

---

## Executive Summary

In accordance with `docs/ROADMAP.md` and `AGENTS.md`, Phase 0 ("Confirm") establishes the business, legal, privacy, and operational policies that govern the system prior to deploying backend infrastructure or collecting real customer data.

This document identifies **Confirmed Architectural Baselines** (approved technical constraints) versus **Pending Client Approvals** (unresolved operational and business decisions).

> **CRITICAL POLICY (AGENTS.md):**
> Do not convert candidate proposals into production requirements without recorded client approval. All unresolved decisions below are explicitly marked **PENDING CLIENT APPROVAL**.

---

## 1. Customer Authentication

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Identity Provider** | Supabase Auth (JWT tokens, secure HTTP-only sessions). | **PENDING CLIENT APPROVAL** | Confirm whether primary login is Mobile Phone OTP (SMS/WhatsApp) or Email Magic Link. |
| **Guest Checkout vs Mandatory Account** | Allow unauthenticated menu browsing; require authenticated account or verified phone session before order creation. | **PENDING CLIENT APPROVAL** | Confirm if one-time phone verification without persistent profile is permitted for guest ordering. |
| **Session Lifetime & Refresh** | 1-hour access tokens with 30-day rotating refresh tokens on customer devices. | **PENDING CLIENT APPROVAL** | Confirm device timeout policy and auto-logout intervals for shared/public devices. |
| **SMS/OTP Gateway Selection** | Third-party SMS gateway (e.g., Twilio, MSG91, or Supabase Native SMS). | **PENDING CLIENT APPROVAL** | Gateway provider, sender ID, cost per verification, and rate-limiting thresholds require client approval. |

---

## 2. Kitchen Staff Roles & Operational Terminal

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Kitchen Access Model** | Dedicated `kitchen` role in Supabase Auth with RLS restricting access exclusively to `/kitchen/*` routes and active order status transitions. | **PENDING CLIENT APPROVAL** | Confirm whether staff log in with individual staff accounts or a shared kitchen display terminal PIN. |
| **Device Authorization** | Terminal authorization via static device token or IP allowlist for cloud kitchen premises. | **PENDING CLIENT APPROVAL** | Confirm physical security requirements and whether remote staff access to the kitchen queue is prohibited. |
| **Allowed Status Transitions** | Kitchen can transition orders from `CONFIRMED` &rarr; `PREPARING` &rarr; `READY`. Cannot alter prices, cancel orders without review, or modify payment records. | **PENDING CLIENT APPROVAL** | Confirm whether kitchen staff may mark an item "sold out" in real-time or if that requires Administrator authority. |
| **Audit Logging** | Every state transition logs staff ID/terminal ID, timestamp (UTC), previous status, and new status to `order_events`. | **CONFIRMED ARCHITECTURAL BASELINE** | Enforced via PostgreSQL append-only event table. |

---

## 3. Administrator Permissions & Management Scope

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Menu & Price Management** | Administrators have write access to `/admin/menu` to publish dishes, adjust base prices, update ingredient/allergen metadata, and toggle availability. | **PENDING CLIENT APPROVAL** | Confirm whether price adjustments apply immediately to active carts or only to newly initiated orders (price snapshotting). |
| **Operational Hours & Dispatch** | Admin controls cloud kitchen ordering windows (open/closed) and service area boundaries. | **PENDING CLIENT APPROVAL** | Confirm delivery service radius, operating hours, and whether orders outside operating hours are queued or blocked. |
| **Reporting & Exporting** | Access to `/admin/reports/daily` for sales volume, GST breakdown, and category breakdowns. | **PENDING CLIENT APPROVAL** | Confirm who has authority to export sensitive sales CSVs and whether PII is redacted from reports. |
| **User Role Assignment** | Admin assigns `kitchen`, `finance`, and `admin` roles via secure server API. Cannot grant roles client-side. | **CONFIRMED ARCHITECTURAL BASELINE** | Roles must be validated server-side and never trusted from client JWT metadata without database verification. |

---

## 4. Payment Checker Responsibilities & Exception Queue

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Role Separation (Maker-Checker)** | `finance` / `payment_checker` role reviews unconfirmed payments in `/finance/review`. Cannot prepare food or alter menu prices. | **CONFIRMED ARCHITECTURAL BASELINE** | Defined in `AGENTS.md` and `docs/ARCHITECTURE.md`. |
| **Manual Verification Threshold** | Any order lacking automated webhook confirmation (e.g. manual bank transfer, offline UPI) routes to human review with mandatory UTR/transaction ID entry. | **PENDING CLIENT APPROVAL** | Confirm threshold limits (e.g. orders above ₹2,000 requiring dual approval) and maximum review timeout window. |
| **Evidence Standards** | Screenshot alone is NOT acceptable proof of payment (`docs/SECURITY.md`). Must match bank statement credit or provider settlement API. | **CONFIRMED ARCHITECTURAL BASELINE** | Enforced per project invariants. |
| **Override & Void Authority** | Payment checker can approve valid payment evidence or void expired orders. Must log reason, actor ID, and transaction reference. | **PENDING CLIENT APPROVAL** | Confirm escalation procedure when payment is disputed by customer after cancellation. |

---

## 5. Privacy, Personal Data Processing & Regulatory Compliance

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Applicable Regulations** | Digital Personal Data Protection (DPDP) Act 2023 (India) and local consumer protection standards. | **PENDING CLIENT APPROVAL** | Legal review required for customer consent notices, privacy policy wording, and grievance officer details. |
| **Customer Data Collected** | Minimum required for fulfillment: Name, phone number, delivery address, order history. No credit card/bank numbers stored directly. | **PENDING CLIENT APPROVAL** | Confirm if optional delivery notes (e.g., gate codes, dietary notes) require periodic sanitization. |
| **Data Retention Schedule** | Financial and tax invoice records retained for 8 years (per Indian tax law). Ephemeral order tracking data pruned after 90 days. | **PENDING CLIENT APPROVAL** | Formal retention and automated archival schedule requires accounting/legal sign-off. |
| **Right to Erasure (Anonymization)** | When customer requests account deletion, personal identifiers are anonymized (`Customer #xxxx`) while preserving immutable tax invoice totals. | **PENDING CLIENT APPROVAL** | Confirm erasure request handling procedure and response SLAs (e.g., 30 days). |

---

## 6. Order Cancellation & Refund Policies

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Customer Cancellation Window** | Customer may cancel while order is in `PENDING` status. Once `CONFIRMED` and kitchen preparation begins (`PREPARING`), cancellations are locked. | **PENDING CLIENT APPROVAL** | Confirm grace period (e.g., 60 seconds after payment authorization) and cancellation fees, if any. |
| **Kitchen/System Cancellation** | System automatically voids orders if payment review expires without confirmation within designated timeout (e.g. 15 minutes). | **PENDING CLIENT APPROVAL** | Confirm exact timeout window for payment verification before automatic void. |
| **Refund Mechanism** | Reversals processed via original payment source (Razorpay/PayTM/UPI) or issued as cloud kitchen store credits. | **PENDING CLIENT APPROVAL** | Confirm policy on banking fee deductions for customer-initiated cancellations and refund turnaround time (T+3 to T+5 days). |
| **Kitchen Stockout Cancellation** | If kitchen runs out of ingredients after order confirmation, system triggers full automatic refund with priority notification. | **PENDING CLIENT APPROVAL** | Confirm customer communication template (SMS/WhatsApp) and compensation voucher policy. |

---

## 7. Payment Evidence Verification & Provider Feeds

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Payment Gateway Integration** | Formal gateway integration (Razorpay / Cashfree / Stripe India / PayU) with cryptographically signed webhook notifications. | **PENDING CLIENT APPROVAL** | Selection of primary payment gateway, merchant account credentialing, and escrow agreement. |
| **Direct UPI / QR Code Verification** | If direct UPI QR codes are offered, transactions must integrate with bank statement APIs (e.g., Decentro / Setu / ICICI EAZYPAY) for automated settlement. | **PENDING CLIENT APPROVAL** | Confirm whether direct UPI QR is in Phase 1 scope or deferred to Phase 2. |
| **Deduplication & Replay Defense** | Every webhook notification validates cryptographic signature, unique event ID, and timestamp window. Duplicate webhooks return HTTP 200 without duplicate credit. | **CONFIRMED ARCHITECTURAL BASELINE** | Enforced in Supabase Edge Function API contract (`docs/API_CONTRACTS.md`). |
| **Invoice Numbering & GST Treatment** | Sequential tax invoice numbering (`BB-FY26-00001`), itemized 5% GST (CGST 2.5% + SGST 2.5% for cloud kitchens), and HSN code classification. | **PENDING CLIENT APPROVAL** | Formal sign-off on GST registration number (GSTIN), legal entity name, and rounding rules from chartered accountant. |

---

## 8. Retention, Backups & Disaster Recovery

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Recovery Point Objective (RPO)** | Maximum acceptable data loss: &le; 1 hour. Point-in-time recovery (PITR) enabled on PostgreSQL. | **PENDING CLIENT APPROVAL** | Confirm backup frequency (automated daily snapshot + continuous WAL archiving on Supabase Pro). |
| **Recovery Time Objective (RTO)** | Maximum acceptable downtime to restore service: &le; 4 hours. | **PENDING CLIENT APPROVAL** | Confirm disaster recovery tier, warm standby requirements, and budget allocation for automated failover. |
| **Private Evidence Storage** | Bank evidence, payment receipts, and delivery confirmations stored in private Supabase Storage buckets with 15-minute presigned URLs. | **CONFIRMED ARCHITECTURAL BASELINE** | Enforced in `docs/SECURITY.md`. Zero public bucket access. |
| **Drill Schedule** | Quarterly database restore drills and emergency credential rotation rehearsals. | **PENDING CLIENT APPROVAL** | Operational ownership and rehearsal schedule approval. |

---

## 9. Deployment Environments & Operational Ownership

| Item | Architecture Proposal | Client Decision Status | Requirements & Impact |
|---|---|---|---|
| **Environment Isolation** | Three strictly separated environments: `development` (local/preview), `staging` (pre-production verification), `production` (live customer traffic). | **CONFIRMED ARCHITECTURAL BASELINE** | Enforced in `docs/ARCHITECTURE.md`. Separate Supabase projects and independent credentials. |
| **Hosting & DNS Delegation** | Frontend hosted on Cloudflare Pages; custom domain DNS managed through Cloudflare with DNSSEC and strict SSL/TLS. | **PENDING CLIENT APPROVAL** | Production domain acquisition (e.g. `bitesbro.com`), SSL certificate validation, and Cloudflare account ownership. |
| **Secret Management** | Service-role keys, payment secrets, and webhook secrets stored exclusively in Cloudflare Pages / Supabase Edge Functions environment secrets. Never in git. | **CONFIRMED ARCHITECTURAL BASELINE** | Enforced via `.gitignore`, CI scanning, and `.env.example` placeholder policy. |
| **Operational Incident Escalation** | Designated incident response lead, on-call rotation, and client escalation contact for payment discrepancies or service outages. | **PENDING CLIENT APPROVAL** | Naming primary technical and financial escalation contacts. |

---

## Phase 0 Sign-Off Summary

```
[ ] 1. Customer Authentication Policy Approved
[ ] 2. Kitchen Staff Role & Terminal Access Model Approved
[ ] 3. Administrator Authority & Pricing Control Approved
[ ] 4. Payment Checker Responsibilities & Review Thresholds Approved
[ ] 5. Privacy, DPDP Act 2023 & Retention Schedule Approved
[ ] 6. Cancellation & Refund Policy Approved
[ ] 7. Payment Gateway Merchant Account & GST Invoice Specs Approved
[ ] 8. Backup RPO/RTO & Storage Policies Approved
[ ] 9. Production Domain, Cloudflare & Supabase Environments Approved
```

*Backend migrations, real customer authentication, and payment integrations will proceed upon formal client sign-off on the items above.*
