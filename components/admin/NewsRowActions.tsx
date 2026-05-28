"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteNews, setNewsStatus } from "@/app/admin/(panel)/news/actions";
import type { NewsStatus } from "@/lib/constants";

export function NewsRowActions({
  id,
  status,
}: {
  id: string;
  status: NewsStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await setNewsStatus(id, status === "published" ? "draft" : "published");
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("Hapus berita ini? Tindakan ini tidak dapat dibatalkan.")) return;
    startTransition(async () => {
      await deleteNews(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className="rounded px-2.5 py-1 text-xs font-semibold text-navy hover:bg-navy-50 disabled:opacity-60"
      >
        {status === "published" ? "Jadikan Draf" : "Terbitkan"}
      </button>
      <Link
        href={`/admin/news/${id}/edit`}
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
