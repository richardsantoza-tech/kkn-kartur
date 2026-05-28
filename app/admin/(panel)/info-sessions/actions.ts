"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const galleryItem = z.object({
  url: z.string().trim().min(1),
  alt: z.string().default(""),
});

const schema = z.object({
  title: z.string().trim().min(1).max(200),
  title_en: z.string().trim().max(200).optional(),
  session_date: z.string().trim().optional(),
  description: z.string().trim().max(4000).default(""),
  description_en: z.string().trim().max(4000).optional(),
  cover_image_url: z.string().trim().optional(),
  gallery: z.array(galleryItem).default([]),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
});

export type SessionActionResult = { ok: boolean; error?: string };

function nullable(v: string | undefined) {
  return v && v.trim() !== "" ? v : null;
}

async function requireStaff() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase;
}

export async function saveSession(
  input: unknown,
  id?: string,
): Promise<SessionActionResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  if (!isSupabaseConfigured) return { ok: true };

  const supabase = await requireStaff();
  if (!supabase) return { ok: false, error: "unauthorized" };

  const row = {
    title: d.title,
    title_en: nullable(d.title_en),
    session_date: nullable(d.session_date),
    description: d.description,
    description_en: nullable(d.description_en),
    cover_image_url: nullable(d.cover_image_url),
    gallery: d.gallery,
    sort_order: d.sort_order,
  };

  const { error } = id
    ? await supabase.from("info_sessions").update(row).eq("id", id)
    : await supabase.from("info_sessions").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/info-sessions");
  revalidatePath("/info-sessions");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteSession(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireStaff();
  if (!supabase) return;
  await supabase.from("info_sessions").delete().eq("id", id);
  revalidatePath("/admin/info-sessions");
  revalidatePath("/info-sessions");
}
