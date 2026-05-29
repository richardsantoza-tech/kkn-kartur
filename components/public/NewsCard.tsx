import Link from "next/link";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/Badge";
import { NEWS_CATEGORY_LABEL_KEY } from "@/lib/constants";
import { formatDate, pickLocalized } from "@/lib/i18n-content";
import type { NewsPost } from "@/lib/types";
import type { Locale } from "@/i18n/config";

export async function NewsCard({ post }: { post: NewsPost }) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("News");
  const tc = await getTranslations("Common");
  const title = pickLocalized(locale, post.title, post.title_en);
  const summary = pickLocalized(locale, post.summary, post.summary_en);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-clay">
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-navy-50">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.cover_image_alt ?? title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-black text-navy-100">Pusaka</span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge>{t(NEWS_CATEGORY_LABEL_KEY[post.category])}</Badge>
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {post.published_at && (
          <time className="text-xs font-medium text-muted">
            {formatDate(post.published_at, locale)}
          </time>
        )}
        <h3 className="mt-1 text-lg font-bold leading-snug">
          <Link href={`/news/${post.slug}`} className="text-navy hover:text-pink">
            {title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted">{summary}</p>
        <Link
          href={`/news/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-navy hover:text-pink"
        >
          {tc("readMore")} <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}
