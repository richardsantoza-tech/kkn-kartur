import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAllInfoSessions } from "@/lib/admin-data";
import { SessionRowActions } from "@/components/admin/SessionRowActions";
import { formatDate } from "@/lib/i18n-content";

export default async function AdminInfoSessionsPage() {
  const sessions = await getAllInfoSessions();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Info Session</h1>
          <p className="text-sm text-muted">
            Dokumentasi sesi informasi dan kegiatan Pusaka.
          </p>
        </div>
        <Link
          href="/admin/info-sessions/new"
          className="inline-flex items-center gap-2 rounded bg-navy px-4 py-2.5 text-sm font-bold text-amber hover:bg-navy-700"
        >
          <Plus size={16} aria-hidden /> Tambah Kegiatan
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-navy-100 bg-white p-10 text-center">
          <p className="text-sm text-muted">
            Belum ada kegiatan. Klik “Tambah Kegiatan” untuk membuat yang pertama.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-navy-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50 text-left text-xs font-bold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Kegiatan</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Urutan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-navy-50 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-navy-50">
                        {s.cover_image_url && (
                          <Image
                            src={s.cover_image_url}
                            alt={s.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <span className="font-semibold text-navy">{s.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(s.session_date, "id")}
                  </td>
                  <td className="px-4 py-3 text-muted">{s.gallery.length}</td>
                  <td className="px-4 py-3 text-muted">{s.sort_order}</td>
                  <td className="px-4 py-3">
                    <SessionRowActions id={s.id} />
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
