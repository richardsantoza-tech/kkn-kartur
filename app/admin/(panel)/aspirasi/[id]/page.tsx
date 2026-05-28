import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAspirasiById } from "@/lib/admin-data";
import { formatDate } from "@/lib/i18n-content";
import { AspirasiDetailControls } from "@/components/admin/AspirasiDetailControls";
import {
  ASPIRASI_KATEGORI_LABEL,
  ASPIRASI_STATUS_CLASS,
  ASPIRASI_STATUS_LABEL,
} from "@/lib/admin-labels";

export default async function AspirasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getAspirasiById(id);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/admin/aspirasi"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-navy"
      >
        <ArrowLeft size={16} aria-hidden /> Kembali ke daftar
      </Link>

      <div className="rounded-lg border border-navy-100 bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold ${ASPIRASI_STATUS_CLASS[item.status]}`}
          >
            {ASPIRASI_STATUS_LABEL[item.status]}
          </span>
          <span className="rounded bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy">
            {item.kelas}
          </span>
          <span className="rounded bg-pink/10 px-2 py-0.5 text-xs font-semibold text-pink">
            {ASPIRASI_KATEGORI_LABEL[item.kategori]}
          </span>
          <span className="ml-auto text-xs text-muted">
            {formatDate(item.created_at, "id")}
          </span>
        </div>

        <h1 className="mt-4 text-xl font-extrabold text-navy">{item.judul}</h1>
        <p className="mt-1 text-sm text-muted">
          Oleh <span className="font-semibold text-ink">{item.nama}</span>
          {item.contact ? (
            <>
              {" · "}
              <span className="text-ink">{item.contact}</span>
            </>
          ) : null}
        </p>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink">
          {item.isi}
        </p>
      </div>

      <div className="rounded-lg border border-navy-100 bg-white p-6">
        <AspirasiDetailControls
          id={item.id}
          status={item.status}
          notes={item.internal_notes ?? ""}
        />
      </div>
    </div>
  );
}
