"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmail } from "@/app/admin/actions";

const inputCls =
  "w-full rounded border border-navy-100 bg-white px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-navy";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signInWithEmail(email, password);
    if (res.ok) {
      router.push(params.get("next") || "/admin");
      router.refresh();
    } else {
      setError(
        res.error === "not_configured"
          ? "Supabase belum dikonfigurasi. Lihat SETUP.md."
          : "Email atau kata sandi salah.",
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-navy">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold text-navy">
          Kata Sandi
        </span>
        <input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
        />
      </label>
      {error && <p className="text-sm font-medium text-pink">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-amber py-2.5 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-60"
      >
        {loading ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
