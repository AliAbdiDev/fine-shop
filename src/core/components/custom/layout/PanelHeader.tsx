"use client";

import { Fragment, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/core/components/ui/breadcrumb";
import { useBreadCrumbSelector } from "@/core/states/breadcrumb";
import { cn } from "@/core/utils/helpers";

import { SidebarTrigger } from "../../ui/sidebar";

function getSegmentLabel(segment: string): string {
  const decoded = decodeURIComponent(segment);
  return decoded.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function FloatingHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const labels = useBreadCrumbSelector.useLabels();

  useEffect(() => {
    if (mounted) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [mounted]);

  const allSegments = pathname.split("/").filter(Boolean);

  let basePath = "";
  let segments = allSegments;
  if (allSegments[0] === "admin") {
    basePath = "/admin";
    segments = allSegments.slice(1);
  }

  const breadcrumbs = segments.map((segment, index) => {
    const href = basePath + "/" + segments.slice(0, index + 1).join("/");
    const label = labels[href] ?? getSegmentLabel(segment);
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

        <Breadcrumb>
          <BreadcrumbList>
            {mounted ? (
              breadcrumbs.length > 0 ? (
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
                ))
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage>داشبورد</BreadcrumbPage>
                </BreadcrumbItem>
              )
            ) : (
              <div className="bg-accent/20 h-6 w-20 animate-pulse rounded-sm" />
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
    </header>
  );
}
