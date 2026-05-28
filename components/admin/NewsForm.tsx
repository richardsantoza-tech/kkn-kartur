"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveNews } from "@/app/admin/(panel)/news/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  STORAGE_BUCKETS,
  TEMPLATE_TO_CATEGORY,
  type NewsTemplate,
} from "@/lib/constants";
import {
  NEWS_CATEGORY_LABEL,
  NEWS_TEMPLATE_LABEL,
  TEMPLATE_FIELDS,
} from "@/lib/admin-labels";
import type { GalleryImage, NewsPost } from "@/lib/types";

const inputCls =
  "w-full rounded border border-navy-100 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-navy";
const labelCls = "mb-1 block text-sm font-bold text-navy";

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 160);
}

export function NewsForm({
  template,
  initial,
}: {
  template: NewsTemplate;
  initial?: NewsPost;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [summaryEn, setSummaryEn] = useState(initial?.summary_en ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [bodyEn, setBodyEn] = useState(initial?.body_en ?? "");
  const [details, setDetails] = useState<Record<string, string>>(
    initial?.details ?? {},
  );
  const [cover, setCover] = useState<GalleryImage[]>(
    initial?.cover_image_url
      ? [{ url: initial.cover_image_url, alt: initial.cover_image_alt ?? "" }]
      : [],
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(initial?.gallery ?? []);

  const category = TEMPLATE_TO_CATEGORY[template];
  const effectiveSlug = slugTouched ? slug : slugify(title);

  function submit(status: "draft" | "published") {
    setError(null);
    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (cover[0] && !cover[0].alt.trim()) {
      setError("Mohon isi teks alternatif (alt) untuk gambar sampul.");
      return;
    }
    const payload = {
      slug: effectiveSlug,
      template,
      title: title.trim(),
      title_en: titleEn.trim() || undefined,
      summary: summary.trim(),
      summary_en: summaryEn.trim() || undefined,
      body,
      body_en: bodyEn.trim() || undefined,
      cover_image_url: cover[0]?.url,
      cover_image_alt: cover[0]?.alt,
      gallery,
      details,
      status,
    };
    startTransition(async () => {
      const res = await saveNews(payload, initial?.id);
      if (res.ok) {
        router.push("/admin/news");
        router.refresh();
      } else {
        setError(
          res.error === "unauthorized"
            ? "Sesi berakhir. Silakan masuk kembali."
            : "Gagal menyimpan. Periksa isian lalu coba lagi.",
        );
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded bg-navy px-2.5 py-1 font-bold text-white">
          {NEWS_TEMPLATE_LABEL[template]}
        </span>
        <span className="text-muted">
          Tampil di kategori{" "}
          <span className="font-semibold text-navy">
            {NEWS_CATEGORY_LABEL[category]}
          </span>
        </span>
      </div>

      {/* Indonesian content */}
      <div className="space-y-4 rounded-lg border border-navy-100 bg-white p-5">
        <h2 className="text-base font-extrabold text-navy">Konten (Indonesia)</h2>
        <div>
          <label className={labelCls}>Judul</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="Judul berita"
          />
        </div>
        <div>
          <label className={labelCls}>Slug URL</label>
          <input
            value={effectiveSlug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputCls}
            placeholder="slug-otomatis-dari-judul"
          />
          <p className="mt-1 text-xs text-muted">/news/{effectiveSlug || "…"}</p>
        </div>
        <div>
          <label className={labelCls}>Ringkasan</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={2}
            className={inputCls}
            placeholder="Ringkasan singkat untuk daftar berita"
          />
        </div>
        <div>
          <label className={labelCls}>Isi</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            className={inputCls}
            placeholder="Tulis isi berita di sini. Pisahkan paragraf dengan baris kosong."
          />
        </div>
      </div>

      {/* Optional English translation */}
      <details className="rounded-lg border border-navy-100 bg-white p-5">
        <summary className="cursor-pointer text-base font-extrabold text-navy">
          Terjemahan Bahasa Inggris (opsional)
        </summary>
        <p className="mt-1 text-sm text-muted">
          Jika dikosongkan, versi Indonesia ditampilkan untuk pengunjung
          berbahasa Inggris.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelCls}>Title (EN)</label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Summary (EN)</label>
            <textarea
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              rows={2}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Body (EN)</label>
            <textarea
              value={bodyEn}
              onChange={(e) => setBodyEn(e.target.value)}
              rows={10}
              className={inputCls}
            />
          </div>
        </div>
      </details>

      {/* Template-specific fields */}
      {TEMPLATE_FIELDS[template].length > 0 && (
        <div className="space-y-4 rounded-lg border border-navy-100 bg-white p-5">
          <h2 className="text-base font-extrabold text-navy">
            Detail {NEWS_TEMPLATE_LABEL[template]}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TEMPLATE_FIELDS[template].map((f) => (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                <input
                  type={f.type === "date" ? "date" : f.type === "url" ? "url" : "text"}
                  value={details[f.key] ?? ""}
                  onChange={(e) =>
                    setDetails((d) => ({ ...d, [f.key]: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      <div className="space-y-5 rounded-lg border border-navy-100 bg-white p-5">
        <div>
          <h2 className="text-base font-extrabold text-navy">Gambar Sampul</h2>
          <p className="mb-3 text-sm text-muted">Tampil di kartu & atas berita.</p>
          <ImageUploader
            bucket={STORAGE_BUCKETS.news}
            images={cover}
            onChange={setCover}
          />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-navy">Galeri (opsional)</h2>
          <p className="mb-3 text-sm text-muted">Gambar tambahan di dalam berita.</p>
          <ImageUploader
            bucket={STORAGE_BUCKETS.news}
            images={gallery}
            onChange={setGallery}
            multiple
          />
        </div>
      </div>

      {error && (
        <p className="rounded bg-pink/10 px-4 py-3 text-sm font-medium text-pink">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => submit("published")}
          className="inline-flex items-center rounded bg-navy px-6 py-2.5 text-sm font-bold text-amber hover:bg-navy-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Terbitkan"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => submit("draft")}
          className="inline-flex items-center rounded border border-navy-100 px-6 py-2.5 text-sm font-bold text-navy hover:bg-navy-50 disabled:opacity-60"
        >
          Simpan sebagai Draf
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/news")}
          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-muted hover:text-navy"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
