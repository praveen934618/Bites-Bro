# Supabase setup

Create a dedicated Supabase project for BitesBro and independent projects for each
environment as required. Apply versioned SQL migrations from `supabase/migrations/`.
Enable RLS on exposed tables and test allowed and denied access. Use private storage.
Keep service-role keys in backend secret management only.

The source architecture does not provide finalized SQL DDL. Do not invent production
columns or policies without reviewing `docs/DATA_MODEL.md` and `docs/OPEN_QUESTIONS.md`.
