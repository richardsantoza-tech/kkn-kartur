import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/NewsForm";
import {
  NEWS_TEMPLATES,
  TEMPLATE_TO_CATEGORY,
  type NewsTemplate,
} from "@/lib/constants";
import { NEWS_CATEGORY_LABEL, NEWS_TEMPLATE_LABEL } from "@/lib/admin-labels";

const TEMPLATE_DESC: Record<NewsTemplate, string> = {
  announcement: "Kabar atau pemberitahuan umum dari Pusaka.",
  achievement: "Pencapaian atau prestasi siswa dan sekolah.",
  event: "Acara, fair, atau kegiatan yang akan datang.",
  scholarship: "Informasi beasiswa beserta syarat dan tenggatnya.",
  university_info: "Informasi universitas, jalur masuk, dan tenggat.",
};

export default async function NewNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const valid = (NEWS_TEMPLATES as readonly string[]).includes(template ?? "")
    ? (template as NewsTemplate)
    : null;

  if (valid) {
    return (
      <div className="max-w-3xl">
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy"
        >
          <ArrowLeft size={15} aria-hidden /> Pilih template lain
        </Link>
        <h1 className="mb-6 mt-2 text-2xl font-extrabold text-navy">
          Berita Baru
        </h1>
        <NewsForm template={valid} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-navy">Berita Baru</h1>
      <p className="mb-6 mt-1 text-sm text-muted">
        Pilih template untuk memulai. Template menentukan kolom isian dan
        kategori tempat berita ini ditampilkan.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {NEWS_TEMPLATES.map((t) => (
          <Link
            key={t}
            href={`/admin/news/new?template=${t}`}
            className="rounded-lg border border-navy-100 bg-white p-5 transition-colors hover:border-navy hover:bg-navy-50"
          >
            <p className="font-extrabold text-navy">{NEWS_TEMPLATE_LABEL[t]}</p>
            <p className="mt-1 text-sm text-muted">{TEMPLATE_DESC[t]}</p>
            <p className="mt-3 text-xs font-semibold text-pink">
              Kategori: {NEWS_CATEGORY_LABEL[TEMPLATE_TO_CATEGORY[t]]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
