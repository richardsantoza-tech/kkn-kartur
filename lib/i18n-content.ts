import { format } from "date-fns";
import { enUS, id as idLocale } from "date-fns/locale";
import type { Locale } from "@/i18n/config";

/**
 * Pick the localized value for the active locale, falling back to the primary
 * (Indonesian) value when the translation is missing or empty. This powers the
 * "optional per-post translation" behavior for news, programs, and sessions.
 */
export function pickLocalized(
  locale: Locale,
  primary: string,
  translated: string | null | undefined,
): string {
  if (locale === "en" && translated != null && translated.trim() !== "") {
    return translated;
  }
  return primary;
}

/** Format an ISO date string for display in the active locale. */
export function formatDate(dateStr: string | null | undefined, locale: Locale): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return format(date, "d MMMM yyyy", {
    locale: locale === "id" ? idLocale : enUS,
  });
}
