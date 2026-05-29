import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ghostLight";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-white hover:bg-amber-600",
  secondary: "bg-peach text-navy hover:bg-peach-600",
  ghost: "border border-navy-100 text-navy hover:bg-navy-50",
  ghostLight: "border border-white/40 text-white hover:bg-white/10",
};

export function buttonClass(variant: Variant = "primary", className?: string) {
  return clsx(base, variants[variant], className);
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}
