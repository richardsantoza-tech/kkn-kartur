"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Loader2, Plus, X } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { GalleryImage } from "@/lib/types";

/**
 * Drag-and-drop image "dropbox". Uploads to a public Supabase Storage bucket
 * and returns the public URL(s). When Supabase isn't configured, falls back to
 * pasting an image URL so the form still works in demo mode. Alt text is
 * required on every image for accessibility + SEO.
 */
export function ImageUploader({
  bucket,
  images,
  onChange,
  multiple = false,
}: {
  bucket: string;
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  multiple?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const add = useCallback(
    (img: GalleryImage) => {
      onChange(multiple ? [...images, img] : [img]);
    },
    [images, multiple, onChange],
  );

  const onDrop = useCallback(
    async (files: File[]) => {
      setError(null);
      if (!isSupabaseConfigured) {
        setError(
          "Unggah berkas memerlukan Supabase. Untuk sekarang, tempel URL gambar di bawah.",
        );
        return;
      }
      setUploading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const accepted = multiple ? files : files.slice(0, 1);
        const uploaded: GalleryImage[] = [];
        for (const file of accepted) {
          const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
          const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
          const { error: upErr } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: false });
          if (upErr) {
            setError(upErr.message);
            continue;
          }
          const { data } = supabase.storage.from(bucket).getPublicUrl(path);
          uploaded.push({ url: data.publicUrl, alt: "" });
        }
        if (uploaded.length) {
          onChange(multiple ? [...images, ...uploaded] : [uploaded[0]]);
        }
      } finally {
        setUploading(false);
      }
    },
    [bucket, images, multiple, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
  });

  function updateAlt(index: number, alt: string) {
    onChange(images.map((img, i) => (i === index ? { ...img, alt } : img)));
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    add({ url, alt: "" });
    setUrlInput("");
  }

  return (
    <div className="space-y-3">
      {(multiple || images.length === 0) && (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors ${
            isDragActive
              ? "border-navy bg-navy-50"
              : "border-navy-100 hover:border-navy hover:bg-navy-50"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="animate-spin text-navy" size={22} aria-hidden />
          ) : (
            <ImagePlus className="text-pink" size={22} aria-hidden />
          )}
          <p className="text-sm font-semibold text-navy">
            {uploading
              ? "Mengunggah…"
              : "Seret gambar ke sini atau klik untuk memilih"}
          </p>
          <p className="text-xs text-muted">PNG, JPG, atau WEBP</p>
        </div>
      )}

      {error && <p className="text-sm font-medium text-pink">{error}</p>}

      {images.length > 0 && (
        <ul className="space-y-3">
          {images.map((img, i) => (
            <li
              key={`${img.url}-${i}`}
              className="flex gap-3 rounded-lg border border-navy-100 bg-white p-3"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded bg-navy-50">
                <Image
                  src={img.url}
                  alt={img.alt || "Pratinjau"}
                  fill
                  sizes="112px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <label className="block text-xs font-bold text-navy">
                  Teks alternatif (alt){" "}
                  <span className="font-normal text-muted">
                    — wajib untuk aksesibilitas
                  </span>
                </label>
                <input
                  value={img.alt}
                  onChange={(e) => updateAlt(i, e.target.value)}
                  placeholder="Deskripsikan gambar singkat"
                  className="mt-1 w-full rounded border border-navy-100 px-2.5 py-1.5 text-sm outline-none focus:border-navy"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="Hapus gambar"
                className="self-start rounded p-1 text-muted hover:bg-pink/10 hover:text-pink"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="…atau tempel URL gambar"
          className="flex-1 rounded border border-navy-100 px-3 py-2 text-sm outline-none focus:border-navy"
        />
        <button
          type="button"
          onClick={addUrl}
          className="inline-flex items-center gap-1 rounded border border-navy-100 px-3 py-2 text-sm font-semibold text-navy hover:bg-navy-50"
        >
          <Plus size={15} aria-hidden /> Tambah
        </button>
      </div>
    </div>
  );
}
