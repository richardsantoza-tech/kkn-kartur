"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  slug: z.string().trim().min(1).max(160),
  title: z.string().trim().min(1).max(200),
  title_en: z.string().trim().max(200).optional(),
  description: z.string().trim().max(2000).default(""),
  description_en: z.string().trim().max(2000).optional(),
  cover_image_url: z.string().trim().optional(),
  cover_image_alt: z.string().trim().optional(),
  sort_order: z.coerce.number().int().min(0).max(999).default(0),
  is_active: z.boolean().default(true),
});

export type ProgramActionResult = { ok: boolean; error?: string };

function nullable(v: string | undefined) {
  return v && v.trim() !== "" ? v : null;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 160);
}

async function requireStaff() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return supabase;
}

export async function saveProgram(
  input: unknown,
  id?: string,
): Promise<ProgramActionResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;
  const slug = slugify(d.slug) || slugify(d.title);

  if (!isSupabaseConfigured) return { ok: true };

  const supabase = await requireStaff();
  if (!supabase) return { ok: false, error: "unauthorized" };

  const row = {
    slug,
    title: d.title,
    title_en: nullable(d.title_en),
    description: d.description,
    description_en: nullable(d.description_en),
    cover_image_url: nullable(d.cover_image_url),
    cover_image_alt: nullable(d.cover_image_alt),
    sort_order: d.sort_order,
    is_active: d.is_active,
  };

  const { error } = id
    ? await supabase.from("programs").update(row).eq("id", id)
    : await supabase.from("programs").insert(row);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteProgram(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const supabase = await requireStaff();
  if (!supabase) return;
  await supabase.from("programs").delete().eq("id", id);
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
}
