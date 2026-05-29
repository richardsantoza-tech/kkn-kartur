import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { MapPin } from "lucide-react";

const SCHOOL_URL = "https://karangturi.sch.id";

const CAMPUSES = [
  {
    name: "KAMPUS GRAHA PADMA",
    address: [
      "Jl. Padma Boulevard Selatan Blok F",
      "Komplek Perumahan Graha Padma, Semarang",
      "(SMP) 024.3543273, (SMA) 024.3543884",
      "(YAYASAN) 024.76430500, HP/WA 081250001929",
      "Fax. 024.76431555",
    ],
    mapUrl: "https://maps.app.goo.gl/yyXDwcawKYLqKk6r8",
  },
  {
    name: "KAMPUS MATARAM",
    address: [
      "Jl. MT. Haryono No. 752-756, Semarang, Jawa Tengah, Indonesia",
      "(TK) 024.8444934, (SD) 024.8447400, Fax: (024) 8413756",
    ],
    mapUrl: "https://maps.app.goo.gl/GHvf1rje9DtmTz6h7",
  },
];

export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const tc = await getTranslations("Common");

  const links = [
    { href: "/news", label: tn("news") },
    { href: "/programs", label: tn("programs") },
    { href: "/info-sessions", label: tn("infoSessions") },
    { href: "/aspirasi", label: tn("aspirasi") },
    { href: "/about", label: tn("about") },
  ];

  return (
    <footer className="mt-auto bg-navy text-navy-100">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-karangturi-3.png"
              alt="SMA Karangturi"
              width={40}
              height={40}
              className="h-10 w-auto brightness-0 invert"
            />
            <Image
              src="/Logo Pusaka (New).png"
              alt="PUSAKA"
              width={140}
              height={44}
              className="h-11 w-auto brightness-0 invert"
            />
          </div>
          <p className="mt-4 max-w-md text-sm text-navy-100/80">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-peach">
            {t("quickLinks")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-navy-100/90 transition-colors hover:text-white"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-peach">
            {t("contact")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-navy-100/90">
            <li>{tc("schoolName")}</li>
            <li>
              <a
                href={SCHOOL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {t("schoolSite")}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      {/* Campus addresses */}
      <div className="border-t border-white/10">
        <Container className="grid gap-8 py-8 sm:grid-cols-2">
          {CAMPUSES.map((campus) => (
            <a
              key={campus.name}
              href={campus.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                <MapPin
                  size={14}
                  className="shrink-0 text-peach group-hover:text-peach/80"
                  aria-hidden
                />
                {campus.name}
              </p>
              <ul className="mt-1 space-y-0.5 text-xs text-navy-100/70 group-hover:text-navy-100/90">
                {campus.address.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </a>
          ))}
        </Container>
      </div>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-5 text-xs text-navy-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {tc("siteName")} —{" "}
            {tc("schoolName")}. {t("rights")}
          </p>
        </Container>
      </div>
    </footer>
  );
}
