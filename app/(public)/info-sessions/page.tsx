import Image from "next/image";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getInfoSessions } from "@/lib/data";
import { formatDate, pickLocalized } from "@/lib/i18n-content";
import type { Locale } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("InfoSessions");
  return { title: t("title"), description: t("subtitle") };
}

export default async function InfoSessionsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("InfoSessions");
  const sessions = await getInfoSessions();

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <h1 className="text-4xl font-extrabold text-amber sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">{t("subtitle")}</p>

        {sessions.length === 0 ? (
          <p className="mt-12 rounded-lg border border-navy-100 bg-white p-10 text-center text-muted">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-10 space-y-14">
            {sessions.map((s) => {
              const title = pickLocalized(locale, s.title, s.title_en);
              const description = pickLocalized(
                locale,
                s.description,
                s.description_en,
              );
              return (
                <section key={s.id}>
                  {s.session_date && (
                    <p className="text-sm font-bold uppercase tracking-wide text-amber">
                      {t("heldOn")} {formatDate(s.session_date, locale)}
                    </p>
                  )}
                  <h2 className="mt-1 text-2xl font-bold text-amber">{title}</h2>
                  <p className="mt-2 max-w-3xl text-muted">{description}</p>
                  {s.gallery.length > 0 && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {s.gallery.map((img, i) => (
                        <div
                          key={i}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg border border-navy-100"
                        >
                          <Image
                            src={img.url}
                            alt={img.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
