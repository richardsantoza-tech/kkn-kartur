import clsx from "clsx";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div
      className={clsx(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p
          className={clsx(
            "text-sm font-bold uppercase tracking-wide",
            light ? "text-amber" : "text-pink",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx(
          "mt-1 text-3xl font-extrabold sm:text-4xl",
          light && "text-white",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-3 text-base",
            light ? "text-navy-100" : "text-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
