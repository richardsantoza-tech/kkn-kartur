import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Server-only — bypasses RLS, so never import
 * this into client components. Used by super-admin flows to create and disable
 * teacher accounts (auth.users) from /admin/users.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service role is not configured (SUPABASE_SERVICE_ROLE_KEY).",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
