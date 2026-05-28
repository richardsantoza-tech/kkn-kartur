import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { aspirasiFixtures, newsFixtures, programFixtures, infoSessionFixtures } from "@/lib/fixtures";
import type {
  AspirasiKategori,
  AspirasiKelas,
  AspirasiStatus,
} from "@/lib/constants";
import type { Aspirasi, InfoSession, NewsPost, Profile, Program } from "@/lib/types";

/**
 * Staff-only data access (admin area). Reads fall back to demo fixtures when
 * Supabase is not configured so the admin UI is browsable; writes require a
 * real Supabase connection and are no-ops only at the action layer.
 */

export interface AspirasiFilters {
  status?: AspirasiStatus;
  kategori?: AspirasiKategori;
  kelas?: AspirasiKelas;
  q?: string;
}

/** Strip characters that would break a PostgREST `or` filter expression. */
function sanitizeQ(q: string): string {
  return q.replace(/[,()*]/g, " ").trim();
}

export async function getAspirasiList(
  filters: AspirasiFilters = {},
): Promise<Aspirasi[]> {
  if (!isSupabaseConfigured) {
    const q = filters.q?.toLowerCase();
    return aspirasiFixtures.filter(
      (a) =>
        (!filters.status || a.status === filters.status) &&
        (!filters.kategori || a.kategori === filters.kategori) &&
        (!filters.kelas || a.kelas === filters.kelas) &&
        (!q || `${a.nama} ${a.judul} ${a.isi}`.toLowerCase().includes(q)),
    );
  }

  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("aspirasi")
    .select("*")
    .order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.kategori) query = query.eq("kategori", filters.kategori);
  if (filters.kelas) query = query.eq("kelas", filters.kelas);
  if (filters.q) {
    const q = sanitizeQ(filters.q);
    if (q) query = query.or(`nama.ilike.%${q}%,judul.ilike.%${q}%,isi.ilike.%${q}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Aspirasi[];
}

export async function getAspirasiById(id: string): Promise<Aspirasi | null> {
  if (!isSupabaseConfigured) {
    return aspirasiFixtures.find((a) => a.id === id) ?? null;
  }
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("aspirasi")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Aspirasi) ?? null;
}

export async function getAllNews(): Promise<NewsPost[]> {
  if (!isSupabaseConfigured) return newsFixtures;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as NewsPost[];
}

export async function getNewsById(id: string): Promise<NewsPost | null> {
  if (!isSupabaseConfigured) return newsFixtures.find((n) => n.id === id) ?? null;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as NewsPost) ?? null;
}

export async function getAllPrograms(): Promise<Program[]> {
  if (!isSupabaseConfigured)
    return [...programFixtures].sort((a, b) => a.sort_order - b.sort_order);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Program[];
}

export async function getAllInfoSessions(): Promise<InfoSession[]> {
  if (!isSupabaseConfigured)
    return [...infoSessionFixtures].sort((a, b) => a.sort_order - b.sort_order);
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("info_sessions")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as InfoSession[];
}

export async function getProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured) return [];
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []) as Profile[];
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (data as Profile) ?? null;
}

export interface DashboardCounts {
  newsPublished: number;
  newsDrafts: number;
  aspirasiNew: number;
  aspirasiTotal: number;
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  if (!isSupabaseConfigured) {
    return {
      newsPublished: newsFixtures.filter((n) => n.status === "published").length,
      newsDrafts: newsFixtures.filter((n) => n.status === "draft").length,
      aspirasiNew: aspirasiFixtures.filter((a) => a.status === "new").length,
      aspirasiTotal: aspirasiFixtures.length,
    };
  }
  const supabase = await createSupabaseServerClient();
  const [pub, draft, aspNew, aspTotal] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("news").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("aspirasi").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("aspirasi").select("id", { count: "exact", head: true }),
  ]);
  return {
    newsPublished: pub.count ?? 0,
    newsDrafts: draft.count ?? 0,
    aspirasiNew: aspNew.count ?? 0,
    aspirasiTotal: aspTotal.count ?? 0,
  };
}
