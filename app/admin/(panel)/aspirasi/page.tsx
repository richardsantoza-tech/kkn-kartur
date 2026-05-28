import Link from "next/link";
import type { Metadata } from "next";
import { getAspirasiList, type AspirasiFilters as Filters } from "@/lib/admin-data";
import { AspirasiFilters } from "@/components/admin/AspirasiFilters";
import { formatDate } from "@/lib/i18n-content";
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
  ASPIRASI_STATUS_CLASS,
  ASPIRASI_STATUS_LABEL,
} from "@/lib/admin-labels";

export const metadata: Metadata = { title: "Aspirasi" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function AspirasiAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const status = one(sp.status);
  const kategori = one(sp.kategori);
  const kelas = one(sp.kelas);
  const q = one(sp.q);

  const filters: Filters = {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Aspirasi Siswa</h1>
        <p className="mt-1 text-sm text-muted">
          {items.length} aspirasi{" "}
          {Object.values(filters).some(Boolean) ? "(terfilter)" : "total"}.
        </p>
      </div>

      <AspirasiFilters />

      <div className="overflow-hidden rounded-lg border border-navy-100 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-navy-100 bg-navy-50 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-bold">Tanggal</th>
                <th className="px-4 py-3 font-bold">Nama</th>
                <th className="px-4 py-3 font-bold">Kelas</th>
                <th className="px-4 py-3 font-bold">Kategori</th>
                <th className="px-4 py-3 font-bold">Judul</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">
                    Tidak ada aspirasi yang cocok.
                  </td>
                </tr>
              ) : (
                items.map((a) => (
                  <tr key={a.id} className="hover:bg-navy-50">
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatDate(a.created_at, "id")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy">{a.nama}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy">
                        {a.kelas}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded bg-pink/10 px-2 py-0.5 text-xs font-semibold text-pink">
                        {ASPIRASI_KATEGORI_LABEL[a.kategori]}
                      </span>
                    </td>
                    <td className="max-w-xs truncate px-4 py-3 text-ink">
                      {a.judul}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${ASPIRASI_STATUS_CLASS[a.status]}`}
                      >
                        {ASPIRASI_STATUS_LABEL[a.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <Link
                        href={`/admin/aspirasi/${a.id}`}
                        className="text-sm font-semibold text-pink hover:underline"
                      >
                        Lihat
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
