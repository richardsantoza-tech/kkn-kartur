"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NEWS_TEMPLATES, NEWS_STATUSES, TEMPLATE_TO_CATEGORY } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const galleryItem = z.object({ url: z.string().trim().min(1), alt: z.string().default("") });

const newsInput = z.object({
  slug: z.string().trim().min(1).max(160),
  template: z.enum(NEWS_TEMPLATES),
  title: z.string().trim().min(1).max(200),
  title_en: z.string().trim().max(200).optional(),
  summary: z.string().trim().max(500).default(""),
  summary_en: z.string().trim().max(500).optional(),
  body: z.string().max(20000).default(""),
  body_en: z.string().max(20000).optional(),
  cover_image_url: z.string().trim().optional(),
  cover_image_alt: z.string().trim().optional(),
  gallery: z.array(galleryItem).default([]),
  details: z.record(z.string(), z.string()).default({}),
  status: z.enum(NEWS_STATUSES),
});

export type NewsActionResult = { ok: boolean; error?: string; id?: string };

function nullable(v: string | undefined) {
  return v && v.trim() !== "" ? v : null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 160);
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return { supabase, user };
}

export async function saveNews(
  input: unknown,
  id?: string,
): Promise<NewsActionResult> {
  const parsed = newsInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;
  const slug = slugify(d.slug) || slugify(d.title);
  const category = TEMPLATE_TO_CATEGORY[d.template];

  if (!isSupabaseConfigured) return { ok: true, id: id ?? "demo" };

  const ctx = await requireUser();
  if (!ctx) return { ok: false, error: "unauthorized" };
  const { supabase, user } = ctx;

  const base = {
    slug,
    template: d.template,
    category,
    title: d.title,
    title_en: nullable(d.title_en),
    summary: d.summary,
    summary_en: nullable(d.summary_en),
    body: d.body,
    body_en: nullable(d.body_en),
    cover_image_url: nullable(d.cover_image_url),
    cover_image_alt: nullable(d.cover_image_alt),
    gallery: d.gallery,
    details: d.details,
    status: d.status,
  };

  if (id) {
    let published_at: string | null = null;
    if (d.status === "published") {
      const { data: existing } = await supabase
        .from("news")
        .select("published_at")
        .eq("id", id)
        .maybeSingle();
      published_at = existing?.published_at ?? new Date().toISOString();
    }
    const { error } = await supabase
      .from("news")
      .update({ ...base, published_at })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase
      .from("news")
      .insert({
        ...base,
        published_at: d.status === "published" ? new Date().toISOString() : null,
        author_id: user.id,
      })
      .select("id")
      .single();
    if (error) return { ok: false, error: error.message };
    id = data.id as string;
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath("/");
  return { ok: true, id };
}

export async function deleteNews(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const ctx = await requireUser();
  if (!ctx) return;
  await ctx.supabase.from("news").delete().eq("id", id);
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function setNewsStatus(
  id: string,
  status: "draft" | "published",
): Promise<void> {
  if (!isSupabaseConfigured) return;
  const ctx = await requireUser();
  if (!ctx) return;
  const update: Record<string, unknown> = { status };
  if (status === "published") update.published_at = new Date().toISOString();
  await ctx.supabase.from("news").update(update).eq("id", id);
  revalidatePath("/admin/news");
  revalidatePath("/news");
}
