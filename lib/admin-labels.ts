import type {
  AspirasiKategori,
  AspirasiStatus,
  NewsCategory,
  NewsStatus,
  NewsTemplate,
} from "@/lib/constants";

/** Indonesian labels for the (Indonesian-only) admin UI. */

export const ASPIRASI_STATUS_LABEL: Record<AspirasiStatus, string> = {
  new: "Baru",
  in_review: "Ditinjau",
  resolved: "Selesai",
  archived: "Diarsipkan",
};

export const ASPIRASI_STATUS_CLASS: Record<AspirasiStatus, string> = {
  new: "bg-amber-100 text-amber-800",
  in_review: "bg-blue-100 text-blue-800",
  resolved: "bg-emerald-100 text-emerald-800",
  archived: "bg-gray-200 text-gray-700",
};

export const ASPIRASI_KATEGORI_LABEL: Record<AspirasiKategori, string> = {
  fasilitas: "Fasilitas",
  akademik: "Akademik",
  kegiatan: "Kegiatan Sekolah",
  universitas: "Informasi Universitas",
  lainnya: "Lainnya",
};

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  prestasi: "Prestasi",
  pengumuman: "Pengumuman",
  event: "Event",
  beasiswa: "Beasiswa",
  universitas: "Universitas",
};

export const NEWS_TEMPLATE_LABEL: Record<NewsTemplate, string> = {
  announcement: "Pengumuman",
  achievement: "Prestasi",
  event: "Event",
  scholarship: "Beasiswa",
  university_info: "Informasi Universitas",
};

export const NEWS_STATUS_LABEL: Record<NewsStatus, string> = {
  draft: "Draf",
  published: "Terbit",
};

export const NEWS_STATUS_CLASS: Record<NewsStatus, string> = {
  draft: "bg-gray-200 text-gray-700",
  published: "bg-emerald-100 text-emerald-800",
};

/** Extra fields each news template exposes, rendered as labeled inputs. */
export interface TemplateField {
  key: string;
  label: string;
  type?: "text" | "date" | "url";
}

export const TEMPLATE_FIELDS: Record<NewsTemplate, TemplateField[]> = {
  announcement: [{ key: "date", label: "Tanggal", type: "date" }],
  achievement: [
    { key: "student", label: "Nama Siswa / Tim" },
    { key: "achievement", label: "Prestasi" },
    { key: "date", label: "Tanggal", type: "date" },
  ],
  event: [
    { key: "eventDate", label: "Tanggal Acara", type: "date" },
    { key: "location", label: "Lokasi" },
    { key: "link", label: "Tautan Pendaftaran", type: "url" },
  ],
  scholarship: [
    { key: "provider", label: "Penyelenggara" },
    { key: "deadline", label: "Batas Pendaftaran", type: "date" },
    { key: "eligibility", label: "Persyaratan" },
    { key: "link", label: "Tautan", type: "url" },
  ],
  university_info: [
    { key: "university", label: "Universitas" },
    { key: "country", label: "Negara" },
    { key: "deadline", label: "Batas Pendaftaran", type: "date" },
    { key: "link", label: "Tautan", type: "url" },
  ],
};
