import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getNewsBySlug } from "@/lib/data";
import { NEWS_CATEGORY_LABEL_KEY } from "@/lib/constants";
import { formatDate, pickLocalized } from "@/lib/i18n-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary || undefined,
    openGraph: post.cover_image_url
      ? { images: [{ url: post.cover_image_url }] }
      : undefined,
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) notFound();

  const locale = await getLocale();
  const t = await getTranslations("News");
  const tc = await getTranslations("Common");
  const title = pickLocalized(locale, post.title, post.title_en);
  const body = pickLocalized(locale, post.body, post.body_en);
  const paragraphs = body.split(/\n\n+/).filter((p) => p.trim() !== "");
  const link = post.details?.link;

  return (
    <article className="py-12 sm:py-16">
      <Container className="max-w-3xl">
        <Link
          href="/news"
          className="text-sm font-semibold text-navy hover:text-pink"
        >
          ← {t("backToNews")}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge>{t(NEWS_CATEGORY_LABEL_KEY[post.category])}</Badge>
          {post.published_at && (
            <time className="text-sm text-muted">
              {t("publishedOn")} {formatDate(post.published_at, locale)}
            </time>
          )}
        </div>

        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          {title}
        </h1>

        {post.cover_image_url && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg border border-navy-100">
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="mt-8">
          {paragraphs.map((para, i) => (
            <p key={i} className="mt-4 text-base leading-relaxed text-ink">
              {para}
            </p>
          ))}
        </div>

        {link && (
          <div className="mt-8">
            <ButtonLink href={link} variant="primary">
              {tc("readMore")}
            </ButtonLink>
          </div>
        )}
      </Container>
    </article>
  );
}
