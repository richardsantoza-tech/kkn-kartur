export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const localeLabels: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};

export const LOCALE_COOKIE = "NEXT_LOCALE";
