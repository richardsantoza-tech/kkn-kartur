import clsx from "clsx";
import type { ReactNode } from "react";

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-block rounded bg-peach px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white",
        className,
      )}
    >
      {children}
    </span>
  );
}
