import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pusaka.karangturi.sch.id"),
  title: {
    default: "Pusaka — Pusat Layanan Studi Lanjut Karangturi",
    template: "%s — Pusaka",
  },
  description:
    "Pusat Layanan Studi Lanjut Karangturi (Pusaka) membantu siswa SMA Karangturi memahami, memilih, dan mempersiapkan diri untuk perguruan tinggi di dalam dan luar negeri.",
  icons: {
    icon: "https://karangturi.sch.id/wp-content/uploads/2024/09/cropped-gaok-logo-32x32.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${roboto.variable} h-full`}>
      <body className="min-h-full font-sans antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
