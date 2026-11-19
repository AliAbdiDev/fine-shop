import type { ReactNode } from "react";

import type { Route } from "next";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { cn } from "@/core/utils/helpers";

interface SectionHeaderProps {
  title: string;
  className?: string;
  href?: Route;
  linkText?: string;
  action?: ReactNode;
}

export function SectionHeader({
  title,
  href,
  linkText,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between", className)}>
      <h2 className="font-vazir-bold text-sm sm:text-xl">{title}</h2>

      {action ?? (
        <Link
          href={href ?? "#"}
          className="text-primary text-2xs flex items-center gap-1 md:text-xs"
        >
          {linkText}
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

interface SectionSliderProps {
  tone?: "secondary" | "card";
  children: ReactNode;
}
export function SectionSlider({
  tone = "secondary",
  children,
}: SectionSliderProps) {
  return (
    <section
      className={cn(
        "shop-section-space py-5",
        tone === "secondary" ? "bg-secondary" : "bg-card",
      )}
    >
      {children}
    </section>
  );
}
