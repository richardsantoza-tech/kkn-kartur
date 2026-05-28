"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSession } from "@/app/admin/(panel)/info-sessions/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { STORAGE_BUCKETS } from "@/lib/constants";
import type { GalleryImage, InfoSession } from "@/lib/types";

const inputCls =
  "w-full rounded border border-navy-100 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-navy";
const labelCls = "mb-1 block text-sm font-bold text-navy";

export function SessionForm({ initial }: { initial?: InfoSession }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleEn, setTitleEn] = useState(initial?.title_en ?? "");
  const [date, setDate] = useState(initial?.session_date ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(
    initial?.description_en ?? "",
  );
  const [sortOrder, setSortOrder] = useState(String(initial?.sort_order ?? 0));
  const [cover, setCover] = useState<GalleryImage[]>(
    initial?.cover_image_url ? [{ url: initial.cover_image_url, alt: "" }] : [],
  );
  const [gallery, setGallery] = useState<GalleryImage[]>(initial?.gallery ?? []);

  function submit() {
    setError(null);
    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    const payload = {
      title: title.trim(),
      title_en: titleEn.trim() || undefined,
      session_date: date || undefined,
      description: description.trim(),
      description_en: descriptionEn.trim() || undefined,
      cover_image_url: cover[0]?.url,
      gallery,
      sort_order: Number(sortOrder) || 0,
    };
    startTransition(async () => {
      const res = await saveSession(payload, initial?.id);
      if (res.ok) {
        router.push("/admin/info-sessions");
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
          <label className={labelCls}>Judul Kegiatan</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputCls}
            placeholder="mis. Sesi Informasi Studi ke Luar Negeri"
          />
        </div>
        <div>
          <label className={labelCls}>Tanggal</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
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
            <label className={labelCls}>Title (EN)</label>
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
              rows={4}
              className={inputCls}
            />
          </div>
        </div>
      </details>

      <div className="space-y-5 rounded-lg border border-navy-100 bg-white p-5">
        <div>
          <h2 className="text-base font-extrabold text-navy">Gambar Sampul</h2>
          <ImageUploader
            bucket={STORAGE_BUCKETS.sessions}
            images={cover}
            onChange={setCover}
          />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-navy">Galeri Foto</h2>
          <p className="mb-3 text-sm text-muted">
            Dokumentasi kegiatan — bisa lebih dari satu foto.
          </p>
          <ImageUploader
            bucket={STORAGE_BUCKETS.sessions}
            images={gallery}
            onChange={setGallery}
            multiple
          />
        </div>
      </div>

      <div className="rounded-lg border border-navy-100 bg-white p-5">
        <label className={labelCls}>Urutan tampil</label>
        <input
          type="number"
          min={0}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={`${inputCls} max-w-40`}
        />
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
          {pending ? "Menyimpan…" : "Simpan Kegiatan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/info-sessions")}
          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-muted hover:text-navy"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
