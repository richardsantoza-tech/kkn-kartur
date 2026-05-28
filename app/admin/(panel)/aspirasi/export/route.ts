import { NextResponse, type NextRequest } from "next/server";
import { getAspirasiList, type AspirasiFilters } from "@/lib/admin-data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ASPIRASI_KATEGORI,
  ASPIRASI_KELAS,
  ASPIRASI_STATUSES,
  type AspirasiKategori,
  type AspirasiKelas,
  type AspirasiStatus,
} from "@/lib/constants";
import {
  ASPIRASI_KATEGORI_LABEL,
  ASPIRASI_STATUS_LABEL,
} from "@/lib/admin-labels";

function csvCell(value: string | null | undefined): string {
  const s = (value ?? "").replace(/"/g, '""');
  return `"${s}"`;
}

export async function GET(request: NextRequest) {
  // Enforce staff auth when a backend is connected.
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  const sp = request.nextUrl.searchParams;
  const status = sp.get("status") ?? undefined;
  const kategori = sp.get("kategori") ?? undefined;
  const kelas = sp.get("kelas") ?? undefined;
  const q = sp.get("q") ?? undefined;

  const filters: AspirasiFilters = {
    status: ASPIRASI_STATUSES.includes(status as AspirasiStatus)
      ? (status as AspirasiStatus)
      : undefined,
    kategori: ASPIRASI_KATEGORI.includes(kategori as AspirasiKategori)
      ? (kategori as AspirasiKategori)
      : undefined,
    kelas: ASPIRASI_KELAS.includes(kelas as AspirasiKelas)
      ? (kelas as AspirasiKelas)
      : undefined,
    q: q?.trim() || undefined,
  };

  const items = await getAspirasiList(filters);

  const header = [
    "Tanggal",
    "Nama",
    "Kelas",
    "Kategori",
    "Judul",
    "Isi",
    "Kontak",
    "Status",
    "Catatan",
  ];
  const rows = items.map((a) =>
    [
      a.created_at,
      a.nama,
      a.kelas,
      ASPIRASI_KATEGORI_LABEL[a.kategori],
      a.judul,
      a.isi,
      a.contact ?? "",
      ASPIRASI_STATUS_LABEL[a.status],
      a.internal_notes ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  // Prepend BOM so Excel reads UTF-8 correctly.
  const csv = "﻿" + [header.map(csvCell).join(","), ...rows].join("\r\n");

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="aspirasi-${stamp}.csv"`,
    },
  });
}
