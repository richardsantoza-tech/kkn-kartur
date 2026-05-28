"use server";

import { aspirasiSchema } from "@/lib/aspirasi-schema";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AspirasiResult = { ok: boolean; error?: string };

export async function submitAspirasi(input: unknown): Promise<AspirasiResult> {
  const parsed = aspirasiSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "invalid" };

  const data = parsed.data;

  // Honeypot tripped → pretend success, store nothing.
  if (data.website && data.website.trim() !== "") return { ok: true };

  // No backend connected yet (demo mode): accept without persisting.
  if (!isSupabaseConfigured) return { ok: true };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("aspirasi").insert({
    nama: data.nama,
    kelas: data.kelas,
    kategori: data.kategori,
    judul: data.judul,
    isi: data.isi,
    contact: data.contact && data.contact.trim() !== "" ? data.contact : null,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
