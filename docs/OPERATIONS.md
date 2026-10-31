# Operations Runbook — BitesBro

## Environments
Maintain separate development, staging and production environments, Supabase projects
and credentials. Do not share production data with development.

## Release
1. Review migration and rollback plan.
2. Run lint, typecheck, unit, integration, RLS and build checks.
3. Deploy backend and migrations through controlled CI.
4. Deploy frontend to Cloudflare Pages.
5. Smoke-test sign-in, role permissions and critical workflow.
6. Confirm monitoring and incident ownership.

## Monitoring
Track request volume, error rate, latency, function runtime/CPU, database/storage usage,
auth delivery costs and monthly spend. Set review thresholds before pilot launch.

## Recovery
Document backup frequency, restore owner, recovery point/time objectives and a tested
restore procedure. Free-tier pausing, backup, support and uptime limitations must be checked
against the actual provider plan.

## Incident handling
Restrict access, preserve audit evidence, rotate exposed secrets, assess data exposure,
notify responsible owners under approved policy and record remediation.
