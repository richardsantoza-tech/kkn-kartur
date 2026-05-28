import { z } from "zod";
import { ASPIRASI_KATEGORI, ASPIRASI_KELAS } from "@/lib/constants";

export const aspirasiSchema = z.object({
  nama: z.string().trim().min(1).max(120),
  kelas: z.enum(ASPIRASI_KELAS),
  kategori: z.enum(ASPIRASI_KATEGORI),
  judul: z.string().trim().min(1).max(160),
  isi: z.string().trim().min(1).max(4000),
  contact: z.string().trim().max(160).optional(),
  // Honeypot: real users never see or fill this. Validated loosely so a bot
  // filling it does not surface an error — the server silently drops it.
  website: z.string().optional(),
});

export type AspirasiInput = z.infer<typeof aspirasiSchema>;
