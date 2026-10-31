# Security and Privacy — BitesBro

## Mandatory controls
1. Verify authentication and authorization for every protected API call.
2. Enforce PostgreSQL RLS on exposed tables.
3. Keep service-role/provider secrets server-side.
4. Validate upload type, size, ownership and authorization.
5. Store evidence in private buckets; issue short-lived links.
6. Rate-limit sensitive operations and protect against replay/duplicate requests.
7. Audit privileged actions and sensitive record access.
8. Separate environments and credentials.
9. Avoid sensitive payloads in logs; test restore and incident procedures.

## Privacy gates
Document purpose, notice/consent where applicable, retention and deletion before collecting
photos, location or financial evidence. Restrict access to approved roles. Do not introduce
biometrics or tracking without explicit review and approval.

## Product-specific caution
An amount match or customer screenshot alone is not proof of payment. Require trustworthy transaction identity/provider evidence; otherwise keep the order pending for manual review.

## Review checklist
- [ ] Threat model and data classification reviewed.
- [ ] RLS and cross-user access tests pass.
- [ ] Privileged secrets absent from browser bundles and repository.
- [ ] Upload authorization and private access tested.
- [ ] Idempotency/replay handling tested.
- [ ] Audit history cannot be silently edited by ordinary users.
- [ ] Backup restore and incident procedure rehearsed.
