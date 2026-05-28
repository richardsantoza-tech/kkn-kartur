import Image from "next/image";
import { getLocale } from "next-intl/server";
import { pickLocalized } from "@/lib/i18n-content";
import type { Program } from "@/lib/types";

export async function ProgramCard({ program }: { program: Program }) {
  const locale = await getLocale();
  const title = pickLocalized(locale, program.title, program.title_en);
  const description = pickLocalized(
    locale,
    program.description,
    program.description_en,
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-navy-100 bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-navy-50">
        {program.cover_image_url && (
          <Image
            src={program.cover_image_url}
            alt={program.cover_image_alt ?? title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-navy">{title}</h3>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
    </article>
  );
}
