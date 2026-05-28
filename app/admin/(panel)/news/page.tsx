import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllNews } from "@/lib/admin-data";
import { NewsRowActions } from "@/components/admin/NewsRowActions";
import {
  NEWS_CATEGORY_LABEL,
  NEWS_STATUS_CLASS,
  NEWS_STATUS_LABEL,
} from "@/lib/admin-labels";
import { formatDate } from "@/lib/i18n-content";

export default async function AdminNewsPage() {
  const news = await getAllNews();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">Berita</h1>
          <p className="text-sm text-muted">
            Kelola pengumuman, prestasi, event, beasiswa, dan info universitas.
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded bg-navy px-4 py-2.5 text-sm font-bold text-amber hover:bg-navy-700"
        >
          <Plus size={16} aria-hidden /> Tambah Berita
        </Link>
      </div>

      {news.length === 0 ? (
        <div className="rounded-lg border border-dashed border-navy-100 bg-white p-10 text-center">
          <p className="text-sm text-muted">
            Belum ada berita. Klik “Tambah Berita” untuk membuat yang pertama.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-navy-100 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-navy-100 bg-navy-50 text-left text-xs font-bold uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {news.map((n) => (
                <tr key={n.id} className="border-b border-navy-50 last:border-0">
                  <td className="px-4 py-3 font-semibold text-navy">{n.title}</td>
                  <td className="px-4 py-3 text-muted">
                    {NEWS_CATEGORY_LABEL[n.category]}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${NEWS_STATUS_CLASS[n.status]}`}
                    >
                      {NEWS_STATUS_LABEL[n.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(n.published_at ?? n.created_at, "id")}
                  </td>
                  <td className="px-4 py-3">
                    <NewsRowActions id={n.id} status={n.status} />
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
