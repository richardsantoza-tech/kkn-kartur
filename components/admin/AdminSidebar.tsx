"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import clsx from "clsx";
import {
  CalendarDays,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquareHeart,
  Newspaper,
  Users,
} from "lucide-react";
import { signOut } from "@/app/admin/actions";
import type { Profile } from "@/lib/types";

const NAV = [
  { href: "/admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { href: "/admin/aspirasi", label: "Aspirasi", icon: MessageSquareHeart },
  { href: "/admin/news", label: "Berita", icon: Newspaper },
  { href: "/admin/programs", label: "Program", icon: GraduationCap },
  { href: "/admin/info-sessions", label: "Info Session", icon: CalendarDays },
];

export function AdminSidebar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isSuper = profile?.role === "super_admin";
  const items = isSuper
    ? [...NAV, { href: "/admin/users", label: "Pengguna", icon: Users, exact: false }]
    : NAV;

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  }

  function handleSignOut() {
    startTransition(async () => {
      await signOut();
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-navy text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-lg font-extrabold">
          Pusaka <span className="text-peach">Admin</span>
        </p>
        {profile && (
          <p className="mt-1 truncate text-xs text-navy-100">
            {profile.full_name || profile.email} ·{" "}
            {isSuper ? "Super Admin" : "Editor"}
          </p>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((it) => {
          const Icon = it.icon;
          const active = isActive(it.href, it.exact);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={clsx(
                "flex items-center gap-3 rounded px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-white/15 text-white"
                  : "text-navy-100 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon size={18} aria-hidden />
              {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded px-3 py-2 text-sm font-semibold text-navy-100 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={18} aria-hidden />
          Lihat Situs
        </a>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-semibold text-navy-100 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
        >
          <LogOut size={18} aria-hidden />
          {pending ? "Keluar…" : "Keluar"}
        </button>
      </div>
    </aside>
  );
}
