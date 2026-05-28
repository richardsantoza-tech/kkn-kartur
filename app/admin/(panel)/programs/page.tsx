import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAllPrograms } from "@/lib/admin-data";
import { ProgramRowActions } from "@/components/admin/ProgramRowActions";

export default async function AdminProgramsPage() {
  const programs = await getAllPrograms();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Program</h1>
          <p className="text-sm text-muted">
            Kelola program dan layanan yang ditampilkan di situs.
          </p>
        </div>
        <Link
          href="/admin/programs/new"
          className="inline-flex items-center gap-2 rounded bg-navy px-4 py-2.5 text-sm font-bold text-amber hover:bg-navy-700"
        >
          <Plus size={16} aria-hidden /> Tambah Program
        </Link>
      </div>

      {programs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-navy-100 bg-white p-10 text-center">
          <p className="text-sm text-muted">
            Belum ada program. Klik “Tambah Program” untuk membuat yang pertama.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-navy-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50 text-left text-xs font-bold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Program</th>
                <th className="px-4 py-3">Urutan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.id} className="border-b border-navy-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-navy-50">
                        {p.cover_image_url && (
                          <Image
                            src={p.cover_image_url}
                            alt={p.cover_image_alt ?? p.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <span className="font-semibold text-navy">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.sort_order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                        p.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {p.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ProgramRowActions id={p.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
