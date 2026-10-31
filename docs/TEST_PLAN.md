# Test Plan — BitesBro

## Access control
- [ ] Anonymous request cannot access protected resources.
- [ ] User cannot read another user's private records.
- [ ] Staff roles access only assigned scope.
- [ ] Browser-supplied role/owner/price/status cannot grant privileges.
- [ ] Direct database access is constrained by RLS.

## Integrity and resilience
- [ ] Duplicate idempotency key does not create duplicate records.
- [ ] Invalid input and unauthorized transitions are rejected.
- [ ] Network timeout/retry does not show false success.
- [ ] Concurrent updates preserve invariants.
- [ ] Audit trail records actor, action and time.
- [ ] Private file URLs expire and unauthorized access fails.

## Product acceptance
- [ ] Concurrent purchase of final item cannot oversell inventory.
- [ ] Double checkout or timeout retry does not create duplicate financial orders.
- [ ] Amount match without trustworthy proof remains pending/manual review.
- [ ] Kitchen user cannot alter payment settlement or invoice facts.
- [ ] Tax mismatch blocks invoice finalization.

## Performance and operations
- [ ] Measure p95 under representative pilot load; source target <2 seconds, not an SLA.
- [ ] Verify monitoring, backup and restore procedures.
- [ ] Test keyboard navigation, screen reader labels and responsive layouts.
