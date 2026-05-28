import Link from "next/link";
import type { Metadata } from "next";
import {
  MessageSquareHeart,
  Newspaper,
  FileText,
  Inbox,
} from "lucide-react";
import { getDashboardCounts, getAspirasiList } from "@/lib/admin-data";
import {
  ASPIRASI_KATEGORI_LABEL,
  ASPIRASI_STATUS_CLASS,
  ASPIRASI_STATUS_LABEL,
} from "@/lib/admin-labels";

export const metadata: Metadata = { title: "Dasbor" };

const cards = [
  { key: "aspirasiNew", label: "Aspirasi Baru", icon: Inbox, href: "/admin/aspirasi?status=new" },
  { key: "aspirasiTotal", label: "Total Aspirasi", icon: MessageSquareHeart, href: "/admin/aspirasi" },
  { key: "newsPublished", label: "Berita Terbit", icon: Newspaper, href: "/admin/news" },
  { key: "newsDrafts", label: "Draf Berita", icon: FileText, href: "/admin/news" },
] as const;

export default async function AdminDashboard() {
  const counts = await getDashboardCounts();
  const recent = (await getAspirasiList()).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Dasbor</h1>
        <p className="mt-1 text-sm text-muted">
          Ringkasan aktivitas Pusaka.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.key}
              href={c.href}
              className="rounded-lg border border-navy-100 bg-white p-5 transition-colors hover:border-navy"
            >
              <Icon size={22} className="text-pink" aria-hidden />
              <p className="mt-3 text-3xl font-extrabold text-navy">
                {counts[c.key]}
              </p>
              <p className="text-sm font-medium text-muted">{c.label}</p>
            </Link>
          );
        })}
      </div>

      <section className="rounded-lg border border-navy-100 bg-white">
        <div className="flex items-center justify-between border-b border-navy-100 px-5 py-4">
          <h2 className="text-base font-extrabold text-navy">
            Aspirasi Terbaru
          </h2>
          <Link
            href="/admin/aspirasi"
            className="text-sm font-semibold text-pink hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Belum ada aspirasi.
          </p>
        ) : (
          <ul className="divide-y divide-navy-100">
            {recent.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/admin/aspirasi/${a.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-navy-50"
                >
                  <span
                    className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-bold ${ASPIRASI_STATUS_CLASS[a.status]}`}
                  >
                    {ASPIRASI_STATUS_LABEL[a.status]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy">
                      {a.judul}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {a.nama} · {a.kelas} · {ASPIRASI_KATEGORI_LABEL[a.kategori]}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
