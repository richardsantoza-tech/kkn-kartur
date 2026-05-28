"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

const LOGO =
  "https://karangturi.sch.id/wp-content/uploads/2024/09/LOGO-GAOK-WEB-2.png";

export function Header() {
  const t = useTranslations("Nav");
  const tc = useTranslations("Common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: t("home") },
    { href: "/news", label: t("news") },
    { href: "/programs", label: t("programs") },
    { href: "/info-sessions", label: t("infoSessions") },
    { href: "/aspirasi", label: t("aspirasi") },
    { href: "/about", label: t("about") },
  ];

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <Image
            src={LOGO}
            alt={tc("siteName")}
            width={40}
            height={40}
            className="h-9 w-auto"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-base font-extrabold text-navy">
              {tc("siteName")}
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-wide text-muted sm:block">
              {tc("schoolName")}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "rounded px-3 py-2 text-sm font-semibold transition-colors",
                isActive(l.href)
                  ? "text-navy"
                  : "text-muted hover:text-navy",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <button
            type="button"
            className="text-navy lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-navy-100 bg-white lg:hidden">
          <Container className="flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "rounded px-3 py-2.5 text-sm font-semibold",
                  isActive(l.href)
                    ? "bg-navy-50 text-navy"
                    : "text-muted hover:bg-navy-50 hover:text-navy",
                )}
              >
                {l.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
