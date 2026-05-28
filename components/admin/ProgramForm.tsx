"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProgram } from "@/app/admin/(panel)/programs/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { GalleryImage, Program } from "@/lib/types";

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

export function ProgramForm({ initial }: { initial?: Program }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [description, setDescription] = useState(initial?.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    initial?.description_en ?? "",
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [cover, setCover] = useState<GalleryImage[]>(
    initial?.cover_image_url
      ? [{ url: initial.cover_image_url, alt: initial.cover_image_alt ?? "" }]
      : [],
  );

  const effectiveSlug = slugTouched ? slug : slugify(title);

  function submit() {
    setError(null);
    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    if (cover[0] && !cover[0].alt.trim()) {
      setError("Mohon isi teks alternatif (alt) untuk gambar.");
      return;
    }
    const payload = {
      slug: effectiveSlug,
      title: title.trim(),
      title_en: titleEn.trim() || undefined,
      description: description.trim(),
      description_en: descriptionEn.trim() || undefined,
      cover_image_url: cover[0]?.url,
      cover_image_alt: cover[0]?.alt,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    };
    startTransition(async () => {
      const res = await saveProgram(payload, initial?.id);
      if (res.ok) {
        router.push("/admin/programs");
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
    <div className="max-w-3xl space-y-6">
      <div className="space-y-4 rounded-lg border border-navy-100 bg-white p-5">
        <h2 className="text-base font-extrabold text-navy">Konten (Indonesia)</h2>
        <div>
          <label className={labelCls}>Nama Program</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="mis. Persiapan IELTS"
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
          />
          <p className="mt-1 text-xs text-muted">/programs/{effectiveSlug || "…"}</p>
        </div>
        <div>
          <label className={labelCls}>Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={inputCls}
          />
        </div>
      </div>

      <details className="rounded-lg border border-navy-100 bg-white p-5">
        <summary className="cursor-pointer text-base font-extrabold text-navy">
          Terjemahan Bahasa Inggris (opsional)
        </summary>
        <div className="mt-4 space-y-4">
          <div>
            <label className={labelCls}>Name (EN)</label>
            <input
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Description (EN)</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={5}
              className={inputCls}
            />
          </div>
        </div>
      </details>

      <div className="space-y-3 rounded-lg border border-navy-100 bg-white p-5">
        <h2 className="text-base font-extrabold text-navy">Gambar</h2>
        <ImageUploader
          bucket={STORAGE_BUCKETS.programs}
          images={cover}
          onChange={setCover}
        />
      </div>

      <div className="grid gap-4 rounded-lg border border-navy-100 bg-white p-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Urutan tampil</label>
          <input
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={inputCls}
          />
          <p className="mt-1 text-xs text-muted">Angka kecil tampil lebih dulu.</p>
        </div>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-semibold text-navy">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-navy"
          />
          Tampilkan di situs
        </label>
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
          onClick={submit}
          className="inline-flex items-center rounded bg-navy px-6 py-2.5 text-sm font-bold text-amber hover:bg-navy-700 disabled:opacity-60"
        >
          {pending ? "Menyimpan…" : "Simpan Program"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/programs")}
          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-muted hover:text-navy"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
