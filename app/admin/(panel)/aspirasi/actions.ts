"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ASPIRASI_STATUSES, type AspirasiStatus } from "@/lib/constants";

export async function updateAspirasiStatus(id: string, status: AspirasiStatus) {
  if (!ASPIRASI_STATUSES.includes(status)) return;
  if (!isSupabaseConfigured) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("aspirasi").update({ status }).eq("id", id);
  revalidatePath("/admin/aspirasi");
  revalidatePath(`/admin/aspirasi/${id}`);
}

export async function saveAspirasiNotes(id: string, notes: string) {
  if (!isSupabaseConfigured) return;
  const supabase = await createSupabaseServerClient();
  await supabase
    .from("aspirasi")
    .update({ internal_notes: notes.trim() || null })
    .eq("id", id);
  revalidatePath(`/admin/aspirasi/${id}`);
}

export async function deleteAspirasi(id: string) {
  if (!isSupabaseConfigured) return;
  const supabase = await createSupabaseServerClient();
  await supabase.from("aspirasi").delete().eq("id", id);
  revalidatePath("/admin/aspirasi");
}
