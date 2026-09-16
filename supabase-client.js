// Single Supabase client for the whole site — read-only (RLS grants `anon` SELECT only on
// sectors/guides/categories/products, no write policies exist). See
// .claude/memory/project_affiliate_db_schema_and_design_first.md (paypal-poc repo) for the schema
// and why this DB, not trip-planner.js, is now the source of truth for affiliate structure.
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);
