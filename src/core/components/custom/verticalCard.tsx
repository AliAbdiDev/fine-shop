import type { ReactNode } from "react";

import { type Route } from "next";

import Image from "next/image";
import Link from "next/link";

import { ImageIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { cn } from "@/core/utils/helpers";

export interface VerticalCardProps {
  image?: string;
  imageAlt?: string;

  title?: ReactNode;
  description?: ReactNode;
  badge?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;

  mediaOverlay?: ReactNode;

  href?: Route;
  aspect?: "square" | "4/3" | "3/4" | "16/9" | "video";
  priority?: boolean;

  sizes?: string;

  className?: string;
  mediaClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  imageClassName?: string;
  mediaBgClassName?: string;
  align?: "right" | "center" | "left";
}

const aspectMap = {
  square: "aspect-square",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  "16/9": "aspect-[16/9]",
  video: "aspect-video",
} as const;

const alignMap = {
  right: "text-right items-start",
  center: "text-center items-center",
  left: "text-left items-start",
} as const;

export function VerticalCard({
  image,
  imageAlt,
  title,
  description,
  badge,
  footer,
  children,
  mediaOverlay,
  href,
  aspect = "4/3",
  priority = false,
  sizes = "100vw",
  className,
  mediaClassName,
  headerClassName,
  contentClassName,
  footerClassName,
  imageClassName,
  mediaBgClassName = "bg-secondary",
  align = "right",
}: VerticalCardProps) {
  const hasImage = Boolean(image);

  const content = (
    <Card
      className={cn(
        "border-border hover:border-foreground/20 flex h-full flex-col gap-0 overflow-hidden rounded-lg border bg-white py-0 shadow-none",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-white",
          aspectMap[aspect],
          mediaBgClassName,
          mediaClassName,
        )}
      >
        {hasImage ? (
          <Image
            src={image as string}
            alt={imageAlt ?? ""}
            fill
            sizes={sizes}
            className={cn("object-cover", imageClassName)}
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            quality={75}
          />
        ) : (
          <div
            className="text-muted-foreground flex h-full w-full items-center justify-center"
            aria-hidden
          >
            <ImageIcon className="size-14 opacity-40" />
          </div>
        )}
        {mediaOverlay}
      </div>

      {(badge || title || description) && (
        <CardHeader
          className={cn(
            "flex flex-col gap-1.5 p-4 pb-2",
            alignMap[align],
            headerClassName,
          )}
        >
          {badge && (
            <div className="text-destructive text-[10px] font-medium sm:text-xs">
              {badge}
            </div>
          )}

          {title && (
            <CardTitle
              className={cn(
                "font-vazir-bold line-clamp-1 text-base leading-snug",
                align === "center" && "text-center",
              )}
            >
              {title}
            </CardTitle>
          )}

          {description && (
            <CardDescription className="text-muted-foreground text-[11px] leading-relaxed sm:text-xs">
              {description}
            </CardDescription>
          )}
        </CardHeader>
      )}

      {children && (
        <CardContent
          className={cn(
            "flex flex-1 flex-col gap-2 px-4 pb-2",
            alignMap[align],
            contentClassName,
          )}
        >
          {children}
        </CardContent>
      )}

      {footer && (
        <CardFooter
          className={cn(
            "mt-auto flex items-center justify-between gap-2 p-4 pt-2",
            alignMap[align],
            footerClassName,
          )}
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
