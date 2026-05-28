import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NewsForm } from "@/components/admin/NewsForm";
import { getNewsById } from "@/lib/admin-data";

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getNewsById(id);
  if (!post) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/news"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-navy"
      >
        <ArrowLeft size={15} aria-hidden /> Kembali ke daftar berita
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-extrabold text-navy">Edit Berita</h1>
      <NewsForm template={post.template} initial={post} />
    </div>
  );
}
