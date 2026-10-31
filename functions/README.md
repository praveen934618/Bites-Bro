# Trusted backend layout proposal

Implementation target: Supabase Edge Functions. Keep handlers thin and separate validation,
authorization, domain rules and persistence. Privileged writes must be server-authorized
and auditable. Use idempotency for retryable writes. Never trust browser-supplied roles,
statuses or financial values.
