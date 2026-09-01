"use client";

import { Fragment, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@base-ui/react";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/core/components/ui/breadcrumb"; // مسیر صحیح را جایگزین کنید
import { ROUTES, type Routekeys } from "@/core/constants/misc";
import { cn } from "@/core/utils/helpers";

import { SidebarTrigger } from "../../ui/sidebar";

export const ROUTE_LABELS: Partial<Record<Routekeys, string>> = {
  ADMIN: "داشبورد",
  Products: "محصولات",
};

const ROUTE_PATH_TO_KEY =
  typeof window !== "undefined"
    ? (Object.fromEntries(
        Object.entries(ROUTES).map(([key, path]) => [path, key]),
      ) as Record<string, Routekeys>)
    : {};

export function getSegmentLabel(segment: string): string {
  const decoded = decodeURIComponent(segment);
  const fullPath = `/${decoded}`;

  if (fullPath in ROUTE_PATH_TO_KEY) {
    const routeKey = ROUTE_PATH_TO_KEY[fullPath];
    return ROUTE_LABELS[routeKey] ?? decoded;
  }

  return decoded.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function FloatingHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (mounted) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [mounted]);

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = getSegmentLabel(segment);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <header className="sticky top-0 z-20 mx-4 mt-3 mb-2">
      <nav
        aria-label="Breadcrumb"
        className={cn(
          "border-border bg-background/80 flex items-center gap-1.5 rounded-sm border px-4 py-2.5",
          "shadow-xs backdrop-blur-md",
        )}
      >
        <SidebarTrigger className="-ms-1" />
        <Separator orientation="vertical" className="me-2 bg-black" />

        <Breadcrumb>
          <BreadcrumbList>
            {mounted &&
              breadcrumbs.map((item) => (
                <Fragment key={item.href}>
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink render={<Link href={item.href} />}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!item.isLast && <BreadcrumbSeparator />}
                </Fragment>
              ))}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </header>
  );
}
