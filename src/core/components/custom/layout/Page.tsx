"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { cn } from "@/core/utils/helpers";

import { Button } from "../../ui/button";

/* =====================================================
   Skeleton (base primitive)
   ===================================================== */
type SkeletonProps = React.ComponentProps<"div">;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

/* =====================================================
   PageSkeleton (full-page wireframe)
   ===================================================== */
type PageSkeletonProps = React.ComponentProps<"div">;

function PageSkeleton({ className, ...props }: PageSkeletonProps) {
  return (
    <div
      data-slot="page-skeleton"
      className={cn("mx-auto w-full max-w-7xl", className)}
      {...props}
    >
      {/* Header: title + description + actions + back button */}
      <header className="mb-6 flex w-full items-center justify-between gap-6">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48 md:h-7" />
            <Skeleton className="h-3 w-72 md:h-4" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
        <Skeleton className="size-10 shrink-0 rounded-md" />
      </header>

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-40 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}

/* =====================================================
   Page (Root)
   ===================================================== */
type PageProps = React.ComponentProps<"div"> & {
  isLoading?: boolean;
};

function Page({ className, isLoading = false, children, ...props }: PageProps) {
  if (isLoading) return <PageSkeleton className={className} />;

  return (
    <div
      data-slot="page"
      className={cn("mx-auto w-full max-w-7xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* =====================================================
   PageHeader
   ===================================================== */
type PageHeaderProps = React.ComponentProps<"header"> & {
  forwardBack?: boolean;
};

function PageHeader({
  className,
  children,
  forwardBack = false,
  ...props
}: PageHeaderProps) {
  const router = useRouter();
  return (
    <header
      data-slot="page-header"
      className={cn(
        "flex w-full items-center justify-between gap-6",
        className,
      )}
      {...props}
    >
      <div className="mb-6 flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {children}
      </div>
      {forwardBack && (
        <Button
          size={"icon-lg"}
          variant={"outline"}
          className={"mb-6 size-10"}
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft />
        </Button>
      )}
    </header>
  );
}

/* =====================================================
   PageHeading (wrapper for title and description)
   ===================================================== */
type PageHeadingProps = React.ComponentProps<"div">;

function PageHeading({ className, ...props }: PageHeadingProps) {
  return (
    <div
      data-slot="page-heading"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

/* =====================================================
   PageTitle
   ===================================================== */
type PageTitleProps = React.ComponentProps<"h1">;

function PageTitle({ className, ...props }: PageTitleProps) {
  return (
    <h1
      data-slot="page-title"
      className={cn(
        "font-vazir-bold text-foreground text-lg tracking-tight md:text-xl",
        className,
      )}
      {...props}
    />
  );
}

/* =====================================================
   PageDescription
   ===================================================== */
type PageDescriptionProps = React.ComponentProps<"p">;

function PageDescription({ className, ...props }: PageDescriptionProps) {
  return (
    <p
      data-slot="page-description"
      className={cn("text-muted-foreground text-xs md:text-sm", className)}
      {...props}
    />
  );
}

/* =====================================================
   PageActions
   ===================================================== */
type PageActionsProps = React.ComponentProps<"div">;

function PageActions({ className, ...props }: PageActionsProps) {
  return (
    <div
      data-slot="page-actions"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

/* =====================================================
   PageContent
   ===================================================== */
type PageContentProps = React.ComponentProps<"div">;

function PageContent({ className, ...props }: PageContentProps) {
  return (
    <div
      data-slot="page-content"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

/* =====================================================
   PageFooter
   ===================================================== */
type PageFooterProps = React.ComponentProps<"footer">;

function PageFooter({ className, ...props }: PageFooterProps) {
  return (
    <footer
      data-slot="page-footer"
      className={cn("text-muted-foreground pt-10 pb-5 text-sm", className)}
      {...props}
    />
  );
}

/* =====================================================
   Export all components
   ===================================================== */
export {
  Page,
  PageSkeleton,
  Skeleton,
  PageHeader,
  PageHeading,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
  PageFooter,
};
