import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { NewsCard } from "@/components/public/NewsCard";
import { ProgramCard } from "@/components/public/ProgramCard";
import {
  getInfoSessions,
  getLatestNews,
  getPrograms,
  getSiteStats,
} from "@/lib/data";
import { formatDate, pickLocalized } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/config";

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("Home");
  const [news, programs, sessions, stats] = await Promise.all([
    getLatestNews(3),
    getPrograms(),
    getInfoSessions(),
    getSiteStats(),
  ]);

  const statItems = [
    { value: stats.universities, label: t("statUniversities") },
    { value: stats.students, label: t("statStudents") },
    { value: stats.sessions, label: t("statSessions") },
    { value: stats.scholarships, label: t("statScholarships") },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-dvh items-center overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-50">
          <Image
            src="/info-sessions/session-1.jpeg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/20" />
        <Container className="relative py-20 sm:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-peach">
              {t("heroEyebrow")}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-lg text-navy-100">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/aspirasi" variant="secondary">
                {t("heroCtaPrimary")}
              </ButtonLink>
              <ButtonLink href="/programs" variant="ghostLight">
                {t("heroCtaSecondary")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      {/* Get to know us — video */}
      <section className="py-16 sm:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow={t("getToKnowEyebrow")}
            title={t("getToKnowTitle")}
            subtitle={t("getToKnowBody")}
          />
          <div className="overflow-hidden rounded-lg border border-navy-100 bg-black shadow-lg">
            <video
              controls
              preload="metadata"
              poster="/info-sessions/session-2.jpeg"
              className="aspect-video w-full"
            >
              <source src="/video/pusaka.mp4" type="video/mp4" />
            </video>
          </div>
        </Container>
      </section>

      {/* What we offer — programs */}
      {programs.length > 0 && (
        <section className="border-y border-navy-100 bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading
              title={t("offerTitle")}
              subtitle={t("offerSubtitle")}
              align="center"
            />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {programs.slice(0, 4).map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* By the numbers */}
      <section className="bg-navy py-16 text-white sm:py-20">
        <Container>
          <SectionHeading title={t("statsTitle")} align="center" light />
          <dl className="mt-10 grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {statItems.map((s) => (
              <div key={s.label}>
                <dd className="text-4xl font-extrabold text-peach sm:text-5xl">
                  {s.value}+
                </dd>
                <dt className="mt-2 text-sm font-medium text-navy-100">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Latest news */}
      {news.length > 0 && (
        <section className="py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                title={t("latestNewsTitle")}
                subtitle={t("latestNewsSubtitle")}
              />
              <ButtonLink
                href="/news"
                variant="ghost"
                className="hidden shrink-0 sm:inline-flex"
              >
                {t("latestNewsCta")}
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((p) => (
                <NewsCard key={p.id} post={p} />
              ))}
            </div>
            <div className="mt-8 sm:hidden">
              <ButtonLink href="/news" variant="ghost">
                {t("latestNewsCta")}
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}

      {/* Info sessions highlight */}
      {sessions.length > 0 && (
        <section className="border-t border-navy-100 bg-white py-16 sm:py-20">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                title={t("infoHighlightTitle")}
                subtitle={t("infoHighlightSubtitle")}
              />
              <ButtonLink
                href="/info-sessions"
                variant="ghost"
                className="hidden shrink-0 sm:inline-flex"
              >
                {t("infoHighlightCta")}
              </ButtonLink>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.slice(0, 3).map((s) => {
                const title = pickLocalized(locale, s.title, s.title_en);
                return (
                  <article
                    key={s.id}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg"
                  >
                    {s.cover_image_url && (
                      <Image
                        src={s.cover_image_url}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      {s.session_date && (
                        <p className="text-xs font-medium text-peach">
                          {formatDate(s.session_date, locale)}
                        </p>
                      )}
                      <h3 className="text-base font-bold text-white">{title}</h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Aspirasi CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-navy to-navy-700 px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-extrabold text-white">
              {t("aspirasiCtaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-100">
              {t("aspirasiCtaBody")}
            </p>
            <div className="mt-7">
              <ButtonLink href="/aspirasi" variant="secondary">
                {t("aspirasiCtaButton")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
