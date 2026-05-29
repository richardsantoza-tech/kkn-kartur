import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { NewsCard } from "@/components/public/NewsCard";
import { CategoryTabs } from "@/components/public/CategoryTabs";
import { getPublishedNews } from "@/lib/data";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/constants";

export async function generateMetadata() {
  const t = await getTranslations("News");
  return { title: t("title"), description: t("subtitle") };
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const t = await getTranslations("News");
  const { category } = await searchParams;
  const valid = NEWS_CATEGORIES.includes(category as NewsCategory)
    ? (category as NewsCategory)
    : undefined;
  const posts = await getPublishedNews(valid);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <h1 className="text-4xl font-extrabold text-amber sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted">{t("subtitle")}</p>

        <div className="mt-8">
          <Suspense fallback={null}>
            <CategoryTabs />
          </Suspense>
        </div>

        {posts.length === 0 ? (
          <p className="mt-12 rounded-lg border border-navy-100 bg-white p-10 text-center text-muted">
            {t("empty")}
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <NewsCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
