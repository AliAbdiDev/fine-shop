"use client";

import * as React from "react";

import { cn } from "@/core/utils/helpers";

/* =====================================================
   Page (Root)
   ===================================================== */
type PageProps = React.ComponentProps<"div">;

function Page({ className, ...props }: PageProps) {
  return (
    <div
      data-slot="page"
      className={cn("mx-auto w-full max-w-7xl", className)}
      {...props}
    />
  );
}

/* =====================================================
   PageHeader
   ===================================================== */
type PageHeaderProps = React.ComponentProps<"header">;

function PageHeader({ className, ...props }: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
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
        "font-vazir-bold text-foreground text-xl font-bold tracking-tight",
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
      className={cn("text-muted-foreground text-sm", className)}
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
   Export all components
   ===================================================== */
export {
  Page,
  PageHeader,
  PageHeading,
  PageTitle,
  PageDescription,
  PageActions,
  PageContent,
};
