import type {
  AspirasiKategori,
  AspirasiKelas,
  AspirasiStatus,
  NewsCategory,
  NewsStatus,
  NewsTemplate,
} from "@/lib/constants";

export interface GalleryImage {
  url: string;
  alt: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  template: NewsTemplate;
  category: NewsCategory;
  status: NewsStatus;
  title: string;
  title_en: string | null;
  summary: string;
  summary_en: string | null;
  body: string;
  body_en: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  gallery: GalleryImage[];
  /** Template-specific fields (event date, scholarship deadline, etc.). */
  details: Record<string, string>;
  published_at: string | null;
  author_id: string | null;
  author_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  details: Record<string, string>;
  sort_order: number;
  is_active: boolean;
}

export interface InfoSession {
  id: string;
  title: string;
  title_en: string | null;
  session_date: string | null;
  description: string;
  description_en: string | null;
  cover_image_url: string | null;
  gallery: GalleryImage[];
  sort_order: number;
}

export interface Aspirasi {
  id: string;
  nama: string;
  kelas: AspirasiKelas;
  kategori: AspirasiKategori;
  judul: string;
  isi: string;
  contact: string | null;
  status: AspirasiStatus;
  assigned_to: string | null;
  assigned_name?: string | null;
  internal_notes: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email?: string | null;
  role: "super_admin" | "editor";
  is_active: boolean;
  created_at: string;
}

export interface SiteStats {
  universities: number;
  students: number;
  sessions: number;
  scholarships: number;
}
