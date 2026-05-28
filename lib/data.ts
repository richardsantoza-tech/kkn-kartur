import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import {
  infoSessionFixtures,
  newsFixtures,
  programFixtures,
  statsFixture,
} from "@/lib/fixtures";
import type { NewsCategory } from "@/lib/constants";
import type { InfoSession, NewsPost, Program, SiteStats } from "@/lib/types";

/**
 * Public, read-only data access for the site. Each function falls back to
 * bundled demo fixtures when Supabase is not yet configured, so the site
 * renders before a database is connected. See SETUP.md.
 */

export async function getPublishedNews(
  category?: NewsCategory,
): Promise<NewsPost[]> {
  if (!isSupabaseConfigured) {
    const items = category
      ? newsFixtures.filter((n) => n.category === category)
      : newsFixtures;
    return items;
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as NewsPost[];
}

export async function getLatestNews(limit = 3): Promise<NewsPost[]> {
  const all = await getPublishedNews();
  return all.slice(0, limit);
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  if (!isSupabaseConfigured) {
    return newsFixtures.find((n) => n.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return (data as NewsPost) ?? null;
}

export async function getPrograms(): Promise<Program[]> {
  if (!isSupabaseConfigured) {
    return programFixtures
      .filter((p) => p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as Program[];
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  if (!isSupabaseConfigured) {
    return programFixtures.find((p) => p.slug === slug) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Program) ?? null;
}

export async function getInfoSessions(): Promise<InfoSession[]> {
  if (!isSupabaseConfigured) {
    return [...infoSessionFixtures].sort((a, b) => a.sort_order - b.sort_order);
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("info_sessions")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as InfoSession[];
}

export async function getSiteStats(): Promise<SiteStats> {
  return statsFixture;
}
