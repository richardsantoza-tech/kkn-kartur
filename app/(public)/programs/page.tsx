import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { ProgramCard } from "@/components/public/ProgramCard";
import { getPrograms } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Programs");
  return { title: t("title"), description: t("subtitle") };
}

export default async function ProgramsPage() {
  const t = await getTranslations("Programs");
  const programs = await getPrograms();

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <h1 className="text-4xl font-extrabold text-navy sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">{t("subtitle")}</p>

        {programs.length === 0 ? (
          <p className="mt-12 rounded-lg border border-navy-100 bg-white p-10 text-center text-muted">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
