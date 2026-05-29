import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getPrograms } from "@/lib/data";
import { pickLocalized } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/config";

const SCHOOL_URL = "https://karangturi.sch.id";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("About");
  return { title: t("title"), description: t("subtitle") };
}

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("About");
  const tc = await getTranslations("Common");
  const tn = await getTranslations("Nav");
  const programs = await getPrograms();

  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-extrabold text-amber sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted">{t("subtitle")}</p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-amber">{t("missionTitle")}</h2>
          <p className="mt-3 leading-relaxed text-ink">{t("missionBody")}</p>
        </section>

        {programs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-amber">{t("whatTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {programs.map((p) => (
                <li
                  key={p.id}
                  className="rounded-lg border border-navy-100 bg-white p-4"
                >
                  <p className="font-bold text-navy">
                    {pickLocalized(locale, p.title, p.title_en)}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {pickLocalized(locale, p.description, p.description_en)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-10 rounded-xl bg-navy-50 p-6">
          <h2 className="text-2xl font-bold text-amber">{t("contactTitle")}</h2>
          <p className="mt-3 text-ink">{tc("schoolName")}</p>
          <p className="mt-1">
            <a
              href={SCHOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy underline hover:text-pink"
            >
              karangturi.sch.id
            </a>
          </p>
          <div className="mt-5">
            <ButtonLink href="/aspirasi" variant="primary">
              {tn("aspirasi")}
            </ButtonLink>
          </div>
        </section>
      </Container>
    </div>
  );
}
