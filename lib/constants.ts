// ── News ──────────────────────────────────────────────────────────────────
export const NEWS_CATEGORIES = [
  "prestasi",
  "pengumuman",
  "event",
  "beasiswa",
  "universitas",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const NEWS_TEMPLATES = [
  "announcement",
  "achievement",
  "event",
  "scholarship",
  "university_info",
] as const;
export type NewsTemplate = (typeof NEWS_TEMPLATES)[number];

export const NEWS_STATUSES = ["draft", "published"] as const;
export type NewsStatus = (typeof NEWS_STATUSES)[number];

/** Each template maps to the news category its posts appear under. */
export const TEMPLATE_TO_CATEGORY: Record<NewsTemplate, NewsCategory> = {
  announcement: "pengumuman",
  achievement: "prestasi",
  event: "event",
  scholarship: "beasiswa",
  university_info: "universitas",
};

/** Message keys in the `News` namespace for category labels. */
export const NEWS_CATEGORY_LABEL_KEY: Record<NewsCategory, string> = {
  prestasi: "cat_prestasi",
  pengumuman: "cat_pengumuman",
  event: "cat_event",
  beasiswa: "cat_beasiswa",
  universitas: "cat_universitas",
};

// ── Aspirasi ─────────────────────────────────────────────────────────────────
export const ASPIRASI_KELAS = [
  "X IPA",
  "X IPS",
  "XI IPA",
  "XI IPS",
  "XII IPA",
  "XII IPS",
] as const;
export type AspirasiKelas = (typeof ASPIRASI_KELAS)[number];

export const ASPIRASI_KATEGORI = [
  "fasilitas",
  "akademik",
  "kegiatan",
  "universitas",
  "lainnya",
] as const;
export type AspirasiKategori = (typeof ASPIRASI_KATEGORI)[number];

/** Message keys in the `Aspirasi` namespace for category labels. */
export const ASPIRASI_KATEGORI_LABEL_KEY: Record<AspirasiKategori, string> = {
  fasilitas: "kat_fasilitas",
  akademik: "kat_akademik",
  kegiatan: "kat_kegiatan",
  universitas: "kat_universitas",
  lainnya: "kat_lainnya",
};

export const ASPIRASI_STATUSES = [
  "new",
  "in_review",
  "resolved",
  "archived",
] as const;
export type AspirasiStatus = (typeof ASPIRASI_STATUSES)[number];

// ── Storage buckets ──────────────────────────────────────────────────────────
export const STORAGE_BUCKETS = {
  news: "news-images",
  programs: "program-images",
  sessions: "session-images",
} as const;
