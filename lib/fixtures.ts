import type { Aspirasi, InfoSession, NewsPost, Program, SiteStats } from "@/lib/types";

/**
 * Demo seed data. Served by the data layer when Supabase is not yet configured
 * so the whole site renders during development and demos. Once a Supabase
 * project is connected (see SETUP.md), real rows replace these.
 */

const now = "2026-05-28T00:00:00.000Z";

export const newsFixtures: NewsPost[] = [
  {
    id: "n1",
    slug: "medali-emas-osn-2026",
    template: "achievement",
    category: "prestasi",
    status: "published",
    title: "Siswa Karangturi Raih Medali Emas Olimpiade Sains Nasional 2026",
    title_en: "Karangturi Student Wins Gold at the 2026 National Science Olympiad",
    summary:
      "Prestasi membanggakan di tingkat nasional kembali ditorehkan siswa SMA Karangturi pada bidang Fisika.",
    summary_en:
      "Another proud national-level achievement by a Karangturi student, this time in Physics.",
    body:
      "Siswa kelas XI IPA, mewakili Jawa Tengah, berhasil meraih medali emas pada Olimpiade Sains Nasional 2026 bidang Fisika.\n\nPusaka turut mendampingi proses persiapan dan pemetaan peluang studi lanjut bagi para peraih medali, termasuk jalur prestasi ke perguruan tinggi negeri dan luar negeri.",
    body_en:
      "An eleventh-grade science student representing Central Java won a gold medal in Physics at the 2026 National Science Olympiad.\n\nPusaka supported the preparation process and mapped further-study pathways for medalists, including achievement-based admission to top universities at home and abroad.",
    cover_image_url: "/info-sessions/session-1.jpeg",
    cover_image_alt: "Siswa Karangturi berprestasi",
    gallery: [],
    details: { student: "Nathan W. (XI IPA)", achievement: "Medali Emas Fisika", date: "2026-05-10" },
    published_at: "2026-05-12T02:00:00.000Z",
    author_id: null,
    author_name: "Tim Pusaka",
    created_at: now,
    updated_at: now,
  },
  {
    id: "n2",
    slug: "nus-early-admission-2026",
    template: "university_info",
    category: "universitas",
    status: "published",
    title: "Pendaftaran NUS Early Admission 2026 Telah Dibuka",
    title_en: "NUS Early Admission 2026 Is Now Open",
    summary:
      "National University of Singapore membuka jalur penerimaan awal untuk siswa internasional tahun ajaran 2026/2027.",
    summary_en:
      "The National University of Singapore has opened its early-admission track for international students for 2026/2027.",
    body:
      "National University of Singapore (NUS) kembali membuka jalur Early Admission. Pusaka mengadakan sesi pendampingan penyusunan esai dan dokumen pendaftaran.\n\nSiswa yang berminat dapat menghubungi tim Pusaka untuk konsultasi jadwal dan persyaratan.",
    body_en: null,
    cover_image_url: "/info-sessions/session-2.jpeg",
    cover_image_alt: "Informasi universitas NUS",
    gallery: [],
    details: {
      university: "National University of Singapore",
      country: "Singapura",
      deadline: "2026-06-30",
      link: "https://nus.edu.sg",
    },
    published_at: "2026-05-08T02:00:00.000Z",
    author_id: null,
    author_name: "Tim Pusaka",
    created_at: now,
    updated_at: now,
  },
  {
    id: "n3",
    slug: "beasiswa-monash-2026",
    template: "scholarship",
    category: "beasiswa",
    status: "published",
    title: "Beasiswa Penuh Monash University untuk Lulusan 2026",
    title_en: "Full Monash University Scholarship for the Class of 2026",
    summary:
      "Kesempatan beasiswa penuh studi sarjana di Monash University, Australia, bagi lulusan berprestasi.",
    summary_en:
      "A full undergraduate scholarship opportunity at Monash University, Australia, for high-achieving graduates.",
    body:
      "Monash University menawarkan beasiswa penuh mencakup biaya kuliah untuk program sarjana. Pusaka membantu siswa memahami kriteria dan menyiapkan berkas.\n\nKuota terbatas dan bersifat kompetitif. Segera konsultasikan rencana studimu dengan tim Pusaka.",
    body_en:
      "Monash University offers a full scholarship covering tuition for undergraduate programs. Pusaka helps students understand the criteria and prepare their documents.\n\nPlaces are limited and competitive — talk to the Pusaka team about your study plan soon.",
    cover_image_url: "/info-sessions/session-3.jpeg",
    cover_image_alt: "Informasi beasiswa Monash",
    gallery: [],
    details: {
      provider: "Monash University",
      deadline: "2026-07-15",
      eligibility: "Lulusan 2026 dengan rata-rata nilai minimal 85",
      link: "https://monash.edu",
    },
    published_at: "2026-05-05T02:00:00.000Z",
    author_id: null,
    author_name: "Tim Pusaka",
    created_at: now,
    updated_at: now,
  },
  {
    id: "n4",
    slug: "university-fair-2026",
    template: "event",
    category: "event",
    status: "published",
    title: "Pusaka Gelar University Fair 2026 Bersama 20 Universitas",
    title_en: "Pusaka Hosts University Fair 2026 with 20 Universities",
    summary:
      "Temui perwakilan 20 universitas dalam dan luar negeri dalam satu hari di kampus Karangturi.",
    summary_en:
      "Meet representatives from 20 local and international universities in one day on the Karangturi campus.",
    body:
      "University Fair 2026 menghadirkan perwakilan dari 20 universitas. Siswa dapat berkonsultasi langsung mengenai program studi, biaya, dan beasiswa.\n\nAcara terbuka untuk siswa kelas X hingga XII beserta orang tua.",
    body_en:
      "University Fair 2026 brings together representatives from 20 universities. Students can consult directly about programs, fees, and scholarships.\n\nThe event is open to students in grades 10 to 12 and their parents.",
    cover_image_url: "/info-sessions/session-4.jpeg",
    cover_image_alt: "University Fair Karangturi",
    gallery: [],
    details: { eventDate: "2026-06-05", location: "Aula SMA Karangturi", link: "" },
    published_at: "2026-05-02T02:00:00.000Z",
    author_id: null,
    author_name: "Tim Pusaka",
    created_at: now,
    updated_at: now,
  },
  {
    id: "n5",
    slug: "jadwal-konsultasi-genap",
    template: "announcement",
    category: "pengumuman",
    status: "published",
    title: "Jadwal Konsultasi Studi Lanjut Semester Genap",
    title_en: "Further-Study Counseling Schedule for the Even Semester",
    summary:
      "Layanan konsultasi tatap muka bersama tim Pusaka kini tersedia setiap Senin–Jumat.",
    summary_en:
      "In-person counseling with the Pusaka team is now available every Monday to Friday.",
    body:
      "Mulai semester genap, konsultasi studi lanjut tersedia setiap hari kerja pukul 09.00–15.00 di ruang Pusaka.\n\nSilakan mendaftar terlebih dahulu melalui wali kelas atau langsung ke ruang Pusaka.",
    body_en: null,
    cover_image_url: null,
    cover_image_alt: null,
    gallery: [],
    details: { date: "2026-05-20" },
    published_at: "2026-04-28T02:00:00.000Z",
    author_id: null,
    author_name: "Tim Pusaka",
    created_at: now,
    updated_at: now,
  },
  {
    id: "n6",
    slug: "tim-debat-juara-regional",
    template: "achievement",
    category: "prestasi",
    status: "published",
    title: "Tim Debat Bahasa Inggris Karangturi Juara Regional",
    title_en: "Karangturi English Debate Team Wins Regional Title",
    summary:
      "Tim debat sekolah menutup musim dengan gelar juara tingkat regional Jawa Tengah.",
    summary_en:
      "The school debate team closes the season with a Central Java regional championship.",
    body:
      "Tim debat bahasa Inggris SMA Karangturi meraih gelar juara pada kompetisi tingkat regional. Prestasi ini memperkuat portofolio siswa untuk jalur prestasi ke universitas.",
    body_en:
      "The Karangturi English debate team won the regional competition, strengthening students' portfolios for achievement-based university admission.",
    cover_image_url: "/info-sessions/session-5.jpeg",
    cover_image_alt: "Tim debat Karangturi",
    gallery: [],
    details: { student: "Tim Debat Bahasa Inggris", achievement: "Juara 1 Regional", date: "2026-04-22" },
    published_at: "2026-04-24T02:00:00.000Z",
    author_id: null,
    author_name: "Tim Pusaka",
    created_at: now,
    updated_at: now,
  },
];

export const programFixtures: Program[] = [
  {
    id: "p1",
    slug: "ielts-preparation",
    title: "Persiapan IELTS",
    title_en: "IELTS Preparation",
    description:
      "Kelas persiapan IELTS bersama pengajar berpengalaman untuk membantu siswa mencapai skor yang dibutuhkan universitas luar negeri.",
    description_en:
      "IELTS preparation classes with experienced instructors to help students reach the scores required by overseas universities.",
    cover_image_url: "/programs/ielts.jpeg",
    cover_image_alt: "Kelas persiapan IELTS",
    details: { schedule: "Setiap Sabtu", level: "Pemula–Lanjutan" },
    sort_order: 1,
    is_active: true,
  },
  {
    id: "p2",
    slug: "konseling-universitas",
    title: "Konseling Universitas",
    title_en: "University Counseling",
    description:
      "Bimbingan personal untuk memetakan minat, jurusan, dan pilihan universitas yang paling sesuai bagi setiap siswa.",
    description_en:
      "One-on-one guidance to map each student's interests, majors, and best-fit university options.",
    cover_image_url: "/info-sessions/session-2.jpeg",
    cover_image_alt: "Sesi konseling universitas",
    details: { schedule: "Sesuai janji temu" },
    sort_order: 2,
    is_active: true,
  },
  {
    id: "p3",
    slug: "sat-toefl-prep",
    title: "Persiapan SAT & TOEFL",
    title_en: "SAT & TOEFL Preparation",
    description:
      "Latihan terstruktur dan simulasi ujian SAT dan TOEFL untuk siswa yang menargetkan universitas di Amerika Serikat.",
    description_en:
      "Structured practice and mock tests for the SAT and TOEFL for students targeting universities in the United States.",
    cover_image_url: "/info-sessions/session-3.jpeg",
    cover_image_alt: "Kelas persiapan SAT dan TOEFL",
    details: { schedule: "Dua kali seminggu" },
    sort_order: 3,
    is_active: true,
  },
  {
    id: "p4",
    slug: "bimbingan-beasiswa",
    title: "Bimbingan Beasiswa",
    title_en: "Scholarship Guidance",
    description:
      "Pendampingan pencarian, seleksi, dan penyusunan dokumen beasiswa dalam dan luar negeri.",
    description_en:
      "Support for finding, selecting, and preparing documents for local and international scholarships.",
    cover_image_url: "/info-sessions/session-4.jpeg",
    cover_image_alt: "Bimbingan beasiswa",
    details: { schedule: "Sepanjang tahun ajaran" },
    sort_order: 4,
    is_active: true,
  },
];

export const infoSessionFixtures: InfoSession[] = [
  {
    id: "s1",
    title: "Kunjungan ke Universitas Mitra",
    title_en: "Visit to Partner Universities",
    session_date: "2026-04-18",
    description:
      "Siswa Karangturi mengunjungi kampus mitra untuk mengenal langsung suasana perkuliahan dan fasilitas.",
    description_en:
      "Karangturi students visited partner campuses to experience university life and facilities firsthand.",
    cover_image_url: "/info-sessions/session-1.jpeg",
    gallery: [
      { url: "/info-sessions/session-1.jpeg", alt: "Kunjungan kampus 1" },
      { url: "/info-sessions/session-2.jpeg", alt: "Kunjungan kampus 2" },
      { url: "/info-sessions/session-3.jpeg", alt: "Kunjungan kampus 3" },
    ],
    sort_order: 1,
  },
  {
    id: "s2",
    title: "Sesi Informasi Studi ke Luar Negeri",
    title_en: "Studying Abroad Info Session",
    session_date: "2026-03-22",
    description:
      "Paparan mengenai jalur, biaya, dan beasiswa untuk melanjutkan studi ke luar negeri.",
    description_en:
      "An overview of pathways, costs, and scholarships for continuing studies abroad.",
    cover_image_url: "/info-sessions/session-4.jpeg",
    gallery: [
      { url: "/info-sessions/session-4.jpeg", alt: "Sesi informasi 1" },
      { url: "/info-sessions/session-5.jpeg", alt: "Sesi informasi 2" },
    ],
    sort_order: 2,
  },
  {
    id: "s3",
    title: "Workshop Persiapan IELTS",
    title_en: "IELTS Preparation Workshop",
    session_date: "2026-02-15",
    description:
      "Lokakarya intensif strategi mengerjakan tiap bagian ujian IELTS.",
    description_en:
      "An intensive workshop on strategies for each section of the IELTS test.",
    cover_image_url: "/programs/ielts.jpeg",
    gallery: [{ url: "/programs/ielts.jpeg", alt: "Workshop IELTS" }],
    sort_order: 3,
  },
];

export const aspirasiFixtures: Aspirasi[] = [
  {
    id: "a1",
    nama: "Clara Wijaya",
    kelas: "XI IPA",
    kategori: "universitas",
    judul: "Lebih banyak info universitas Jepang",
    isi: "Mohon diadakan sesi khusus tentang pendaftaran dan beasiswa universitas di Jepang.",
    contact: "clara@example.com",
    status: "new",
    assigned_to: null,
    assigned_name: null,
    internal_notes: null,
    created_at: "2026-05-26T03:00:00.000Z",
  },
  {
    id: "a2",
    nama: "Bagas Pratama",
    kelas: "XII IPS",
    kategori: "akademik",
    judul: "Tryout SAT tambahan",
    isi: "Apakah memungkinkan menambah jadwal tryout SAT menjelang pendaftaran?",
    contact: null,
    status: "in_review",
    assigned_to: null,
    assigned_name: "Tim Pusaka",
    internal_notes: "Cek ketersediaan ruang dan pengajar.",
    created_at: "2026-05-24T03:00:00.000Z",
  },
  {
    id: "a3",
    nama: "Devina Sari",
    kelas: "X IPA",
    kategori: "fasilitas",
    judul: "Akses ruang Pusaka saat istirahat",
    isi: "Usul agar ruang Pusaka dibuka saat jam istirahat untuk konsultasi singkat.",
    contact: "devina@example.com",
    status: "resolved",
    assigned_to: null,
    assigned_name: "Tim Pusaka",
    internal_notes: "Sudah dijadwalkan buka tiap istirahat kedua.",
    created_at: "2026-05-20T03:00:00.000Z",
  },
];

export const statsFixture: SiteStats = {
  universities: 120,
  students: 850,
  sessions: 24,
  scholarships: 60,
};
