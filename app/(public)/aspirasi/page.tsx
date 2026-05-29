import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { AspirasiForm } from "@/components/public/AspirasiForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Aspirasi");
  return { title: t("title"), description: t("subtitle") };
}

export default async function AspirasiPage() {
  const t = await getTranslations("Aspirasi");
  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-2xl">
        <h1 className="text-4xl font-extrabold text-amber sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-muted">{t("subtitle")}</p>
        <div className="mt-8">
          <AspirasiForm />
        </div>
      </Container>
    </div>
  );
}
