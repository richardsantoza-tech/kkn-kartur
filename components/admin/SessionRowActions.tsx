"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteSession } from "@/app/admin/(panel)/info-sessions/actions";

export function SessionRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    if (!confirm("Hapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.")) return;
    startTransition(async () => {
      await deleteSession(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/info-sessions/${id}/edit`}
        className="rounded p-1.5 text-muted hover:bg-navy-50 hover:text-navy"
        aria-label="Edit"
      >
        <Pencil size={16} />
      </Link>
      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="rounded p-1.5 text-muted hover:bg-pink/10 hover:text-pink disabled:opacity-60"
        aria-label="Hapus"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
