"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UserActionResult = { ok: boolean; error?: string };

/** Returns the caller's id only if they are an active super admin. */
async function requireSuperAdmin(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || !profile.is_active || profile.role !== "super_admin") {
    return null;
  }
  return user.id;
}

const createSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72),
  full_name: z.string().trim().min(1).max(120),
  role: z.enum(["editor", "super_admin"]).default("editor"),
});

export async function createUser(input: unknown): Promise<UserActionResult> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  const callerId = await requireSuperAdmin();
  if (!callerId) return { ok: false, error: "unauthorized" };

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name },
  });
  if (error) return { ok: false, error: error.message };

  // The on_auth_user_created trigger inserts a default 'editor' profile;
  // apply the requested name + role.
  if (data.user) {
    await admin
      .from("profiles")
      .update({
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        role: parsed.data.role,
      })
      .eq("id", data.user.id);
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserActive(
  id: string,
  active: boolean,
): Promise<UserActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  const callerId = await requireSuperAdmin();
  if (!callerId) return { ok: false, error: "unauthorized" };
  if (id === callerId && !active) return { ok: false, error: "self" };

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ is_active: active })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function setUserRole(
  id: string,
  role: "editor" | "super_admin",
): Promise<UserActionResult> {
  if (!isSupabaseConfigured) return { ok: false, error: "not_configured" };
  const callerId = await requireSuperAdmin();
  if (!callerId) return { ok: false, error: "unauthorized" };
  if (id === callerId && role !== "super_admin") {
    return { ok: false, error: "self" };
  }

  const admin = createSupabaseAdminClient();
  const { error } = await admin
    .from("profiles")
    .update({ role })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/users");
  return { ok: true };
}
