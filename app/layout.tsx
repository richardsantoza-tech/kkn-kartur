import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pusaka.karangturi.sch.id"),
  title: {
    default: "PUSAKA — Pusat Layanan Studi Lanjut Karangturi",
    template: "%s — PUSAKA",
  },
  description:
    "Pusat Layanan Studi Lanjut Karangturi (PUSAKA) membantu siswa SMA Karangturi memahami, memilih, dan mempersiapkan diri untuk perguruan tinggi di dalam dan luar negeri.",
  icons: {
    icon: "/Logo Pusaka (New).png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        />
      </head>
      <body className="min-h-full font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
