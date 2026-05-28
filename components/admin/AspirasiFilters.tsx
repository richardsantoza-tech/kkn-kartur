"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Download, Search, X } from "lucide-react";
import {
  ASPIRASI_KATEGORI,
  ASPIRASI_KELAS,
  ASPIRASI_STATUSES,
} from "@/lib/constants";
import {
  ASPIRASI_KATEGORI_LABEL,
  ASPIRASI_STATUS_LABEL,
} from "@/lib/admin-labels";

const selectCls =
  "rounded border border-navy-100 bg-white px-3 py-2 text-sm text-navy outline-none focus:border-navy";

export function AspirasiFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/aspirasi?${next.toString()}`);
  }

  const hasFilters = ["status", "kategori", "kelas", "q"].some((k) =>
    params.get(k),
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={params.get("status") ?? ""}
        onChange={(e) => setParam("status", e.target.value)}
        className={selectCls}
        aria-label="Status"
      >
        <option value="">Semua Status</option>
        {ASPIRASI_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ASPIRASI_STATUS_LABEL[s]}
          </option>
        ))}
      </select>

      <select
        value={params.get("kategori") ?? ""}
        onChange={(e) => setParam("kategori", e.target.value)}
        className={selectCls}
        aria-label="Kategori"
      >
        <option value="">Semua Kategori</option>
        {ASPIRASI_KATEGORI.map((k) => (
          <option key={k} value={k}>
            {ASPIRASI_KATEGORI_LABEL[k]}
          </option>
        ))}
      </select>

      <select
        value={params.get("kelas") ?? ""}
        onChange={(e) => setParam("kelas", e.target.value)}
        className={selectCls}
        aria-label="Kelas"
      >
        <option value="">Semua Kelas</option>
        {ASPIRASI_KELAS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", q.trim());
        }}
        className="relative"
      >
        <Search
          size={15}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama / judul…"
          className="w-52 rounded border border-navy-100 bg-white py-2 pl-8 pr-3 text-sm text-navy outline-none focus:border-navy"
        />
      </form>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push("/admin/aspirasi");
          }}
          className="inline-flex items-center gap-1 rounded px-2 py-2 text-sm font-semibold text-muted hover:text-navy"
        >
          <X size={15} aria-hidden /> Reset
        </button>
      )}

      <a
        href={`/admin/aspirasi/export?${params.toString()}`}
        className="ml-auto inline-flex items-center gap-2 rounded bg-navy px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700"
      >
        <Download size={15} aria-hidden /> Ekspor CSV
      </a>
    </div>
  );
}
