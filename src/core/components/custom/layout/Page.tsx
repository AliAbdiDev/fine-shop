"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";

import { cn } from "@/core/utils/helpers";

import { Button } from "../../ui/button";

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
          variant={"secondary"}
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
      className={cn("text-muted-foreground pt-12 pb-5 text-sm", className)}
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
  PageFooter,
};
