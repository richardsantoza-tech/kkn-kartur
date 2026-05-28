"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import {
  updateAspirasiStatus,
  saveAspirasiNotes,
  deleteAspirasi,
} from "@/app/admin/(panel)/aspirasi/actions";
import { ASPIRASI_STATUSES, type AspirasiStatus } from "@/lib/constants";
import { ASPIRASI_STATUS_LABEL } from "@/lib/admin-labels";

export function AspirasiDetailControls({
  id,
  status,
  notes,
}: {
  id: string;
  status: AspirasiStatus;
  notes: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [noteValue, setNoteValue] = useState(notes);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  function changeStatus(next: AspirasiStatus) {
    startTransition(async () => {
      await updateAspirasiStatus(id, next);
      router.refresh();
    });
  }

  function save() {
    startTransition(async () => {
      await saveAspirasiNotes(id, noteValue);
      setSavedMsg("Catatan tersimpan.");
      router.refresh();
      setTimeout(() => setSavedMsg(null), 2500);
    });
  }

  function remove() {
    if (!confirm("Hapus aspirasi ini? Tindakan ini tidak dapat dibatalkan."))
      return;
    startTransition(async () => {
      await deleteAspirasi(id);
      router.push("/admin/aspirasi");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="mb-1.5 block text-sm font-bold text-navy">Status</span>
        <div className="flex flex-wrap gap-2">
          {ASPIRASI_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={pending}
              onClick={() => changeStatus(s)}
              className={`rounded px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                s === status
                  ? "bg-navy text-white"
                  : "border border-navy-100 text-navy hover:bg-navy-50"
              }`}
            >
              {ASPIRASI_STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-bold text-navy">
          Catatan Internal
        </label>
        <textarea
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
          rows={4}
          placeholder="Catatan tindak lanjut (hanya terlihat oleh staf)…"
          className="w-full rounded border border-navy-100 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-navy"
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="inline-flex items-center gap-2 rounded bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
          >
            <Save size={15} aria-hidden /> Simpan Catatan
          </button>
          {savedMsg && (
            <span className="text-sm font-medium text-emerald-700">
              {savedMsg}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-navy-100 pt-4">
        <button
          type="button"
          onClick={remove}
          disabled={pending}
          className="inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-pink hover:bg-pink/10 disabled:opacity-60"
        >
          <Trash2 size={15} aria-hidden /> Hapus Aspirasi
        </button>
      </div>
    </div>
  );
}
