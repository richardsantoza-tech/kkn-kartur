import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

const LOGO =
  "https://karangturi.sch.id/wp-content/uploads/2024/09/LOGO-GAOK-WEB-2.png";
const SCHOOL_URL = "https://karangturi.sch.id";

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
              src={LOGO}
              alt={tc("siteName")}
              width={44}
              height={44}
              className="h-10 w-auto rounded bg-white p-1"
            />
            <div className="leading-tight">
              <p className="text-lg font-extrabold text-white">
                {tc("siteName")}
              </p>
              <p className="text-xs text-navy-100">{tc("siteFullName")}</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-navy-100/80">
            {t("tagline")}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber">
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
          <h2 className="text-sm font-bold uppercase tracking-wide text-amber">
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
