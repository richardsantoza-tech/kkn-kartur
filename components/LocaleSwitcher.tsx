"use client";

import clsx from "clsx";
import { useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { setUserLocale } from "@/i18n/locale";
import { locales, localeShort, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const current = useLocale() as Locale;
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(locale: Locale) {
    if (locale === current) return;
    startTransition(async () => {
      await setUserLocale(locale);
      router.refresh();
    });
  }

  return (
    <div
      className="inline-flex overflow-hidden rounded border border-navy-100 text-xs font-bold"
      role="group"
      aria-label="Language / Bahasa"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          disabled={pending}
          aria-pressed={l === current}
          className={clsx(
            "px-2.5 py-1 transition-colors",
            l === current
              ? "bg-navy text-white"
              : "bg-white text-navy hover:bg-navy-50",
          )}
        >
          {localeShort[l]}
        </button>
      ))}
    </div>
  );
}
