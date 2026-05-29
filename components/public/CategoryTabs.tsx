"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABEL_KEY } from "@/lib/constants";

export function CategoryTabs() {
  const t = useTranslations("News");
  const params = useSearchParams();
  const active = params.get("category") ?? "all";

  const tabs = [
    { key: "all", href: "/news", label: t("cat_all") },
    ...NEWS_CATEGORIES.map((c) => ({
      key: c as string,
      href: `/news?category=${c}`,
      label: t(NEWS_CATEGORY_LABEL_KEY[c]),
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          scroll={false}
          className={clsx(
            "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
            active === tab.key
              ? "border-amber bg-amber text-white"
              : "border-navy-100 bg-white text-navy hover:bg-navy-50",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
