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

export function Header() {
  const t = useTranslations("Nav");
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
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link href="/" onClick={() => setOpen(false)}>
          <Image
            src="/pusaka-logo.png"
            alt="Pusaka"
            width={160}
            height={54}
            className="h-14 w-auto"
          />
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
