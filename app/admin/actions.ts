"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type LoginResult = { ok: boolean; error?: "not_configured" | "invalid" };

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<LoginResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "invalid" };
  return { ok: true };
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
}
