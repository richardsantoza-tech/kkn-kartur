"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import {
  createUser,
  setUserActive,
  setUserRole,
} from "@/app/admin/(panel)/users/actions";
import type { Profile } from "@/lib/types";

const inputCls =
  "w-full rounded border border-navy-100 bg-white px-3 py-2 text-sm text-ink outline-none focus:border-navy";
const labelCls = "mb-1 block text-sm font-bold text-navy";

export function UserManager({
  profiles,
  currentUserId,
  configured,
}: {
  profiles: Profile[];
  currentUserId: string | null;
  configured: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"editor" | "super_admin">("editor");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  function errorText(error?: string) {
    if (error === "not_configured") return "Supabase belum dikonfigurasi (lihat SETUP.md).";
    if (error === "unauthorized") return "Hanya super admin yang dapat mengelola pengguna.";
    if (error === "self") return "Anda tidak dapat menonaktifkan atau menurunkan akun sendiri.";
    if (error === "invalid") return "Periksa isian. Kata sandi minimal 8 karakter.";
    return error || "Terjadi kesalahan.";
  }

  function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    startTransition(async () => {
      const res = await createUser({ email, password, full_name: fullName, role });
      if (res.ok) {
        setMsg({ ok: true, text: "Akun dibuat." });
        setEmail("");
        setPassword("");
        setFullName("");
        setRole("editor");
        router.refresh();
      } else {
        setMsg({ ok: false, text: errorText(res.error) });
      }
    });
  }

  function toggleActive(p: Profile) {
    startTransition(async () => {
      const res = await setUserActive(p.id, !p.is_active);
      if (!res.ok) setMsg({ ok: false, text: errorText(res.error) });
      router.refresh();
    });
  }

  function changeRole(p: Profile, next: "editor" | "super_admin") {
    startTransition(async () => {
      const res = await setUserRole(p.id, next);
      if (!res.ok) setMsg({ ok: false, text: errorText(res.error) });
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={submitCreate}
        className="max-w-3xl space-y-4 rounded-lg border border-navy-100 bg-white p-5"
      >
        <h2 className="flex items-center gap-2 text-base font-extrabold text-navy">
          <UserPlus size={18} aria-hidden /> Tambah Pengguna
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Nama Lengkap</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
          </div>
          <div>
            <label className={labelCls}>Kata Sandi Sementara</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Minimal 8 karakter" required />
          </div>
          <div>
            <label className={labelCls}>Peran</label>
            <select value={role} onChange={(e) => setRole(e.target.value as "editor" | "super_admin")} className={inputCls}>
              <option value="editor">Editor</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending || !configured}
            className="inline-flex items-center rounded bg-navy px-5 py-2.5 text-sm font-bold text-amber hover:bg-navy-700 disabled:opacity-60"
          >
            {pending ? "Menyimpan…" : "Buat Akun"}
          </button>
          {msg && (
            <span className={`text-sm font-medium ${msg.ok ? "text-emerald-700" : "text-pink"}`}>
              {msg.text}
            </span>
          )}
        </div>
        {!configured && (
          <p className="text-sm text-muted">
            Hubungkan Supabase untuk membuat akun (lihat SETUP.md). Akun super admin
            pertama dibuat lewat dasbor Supabase.
          </p>
        )}
      </form>

      <div className="overflow-hidden rounded-lg border border-navy-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-navy-100 bg-navy-50 text-left text-xs font-bold uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Peran</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  Belum ada pengguna untuk ditampilkan.
                </td>
              </tr>
            ) : (
              profiles.map((p) => {
                const isSelf = p.id === currentUserId;
                return (
                  <tr key={p.id} className="border-b border-navy-50 last:border-0">
                    <td className="px-4 py-3 font-semibold text-navy">
                      {p.full_name || "—"}
                      {isSelf && <span className="ml-2 text-xs font-normal text-muted">(Anda)</span>}
                    </td>
                    <td className="px-4 py-3 text-muted">{p.email || "—"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.role}
                        disabled={pending || isSelf}
                        onChange={(e) => changeRole(p, e.target.value as "editor" | "super_admin")}
                        className="rounded border border-navy-100 bg-white px-2 py-1 text-sm disabled:opacity-60"
                      >
                        <option value="editor">Editor</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-bold ${
                          p.is_active ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {p.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggleActive(p)}
                        disabled={pending || isSelf}
                        className="rounded px-2.5 py-1 text-xs font-semibold text-navy hover:bg-navy-50 disabled:opacity-40"
                      >
                        {p.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
