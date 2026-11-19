"use client";

import * as React from "react";

import { type Route } from "next";

import Link from "next/link";

import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "cn";
import { LayoutGrid } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import { type Categorys } from "@/core/types/entities.types";

/* ─────────────────────────────────────────────
   Shared trigger
   ───────────────────────────────────────────── */

function TriggerButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className="font-vazir-bold shrink-0 text-[13px]"
      {...props}
    >
      <LayoutGrid className="h-4 w-4" aria-hidden />
      همه دسته‌ها
    </Button>
  );
}

/* ─────────────────────────────────────────────
   Virtualized list (shared by desktop + mobile)
   ───────────────────────────────────────────── */

const ROW_HEIGHT_DESKTOP = 40;
const ROW_HEIGHT_MOBILE = 48;

interface VirtualizedCategoryListProps {
  categories: Categorys;
  /** Height of each row in px. */
  rowHeight: number;
  /** Extra rows rendered above/below the viewport for smooth scrolling. */
  overscan?: number;
  /** Called when a category link is clicked. */
  onSelect: () => void;
  /** Class applied to each row's anchor. */
  itemClassName: string;
  scrollClassName?: string;
}

const ALL_ITEM = { slug: null, name: "کل محصولات" };

function VirtualizedCategoryList({
  categories,
  rowHeight,
  overscan = 6,
  onSelect,
  itemClassName,
  scrollClassName,
}: VirtualizedCategoryListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const items = React.useMemo(() => [ALL_ITEM, ...categories], [categories]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  return (
    <div ref={parentRef} className={cn("overflow-y-auto", scrollClassName)}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const item = items[virtualRow.index];
          const href = item.slug ? `/shop/${item.slug}` : "/shop";

          return (
            <div
              key={virtualRow.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <Link
                href={href as Route}
                onClick={onSelect}
                className={cn("h-full", itemClassName)}
              >
                {item.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Desktop: Popover dropdown
   ───────────────────────────────────────────── */

export function DesktopAllCategories({
  categories,
}: {
  categories: Categorys;
}) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<TriggerButton />} />
      <PopoverContent
        align="start"
        sideOffset={12}
        className="w-64 overflow-hidden p-2"
      >
        {/* Fixed max-height on the scroll container so the virtualizer has
            a stable viewport to measure. 8 rows × 40px + padding ≈ 320px. */}
        <VirtualizedCategoryList
          scrollClassName="h-70"
          categories={categories}
          rowHeight={ROW_HEIGHT_DESKTOP}
          onSelect={handleClose}
          itemClassName="hover:bg-muted hover:text-primary flex h-full items-center rounded-md px-3 text-[13px] transition-colors"
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─────────────────────────────────────────────
   Mobile: Sheet from bottom
   ───────────────────────────────────────────── */

export function MobileAllCategories({ categories }: { categories: Categorys }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<TriggerButton />} />
      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl p-0">
        <SheetHeader className="border-border border-b px-5 py-4">
          <SheetTitle className="font-vazir-bold text-base">
            همه دسته‌ها
          </SheetTitle>
        </SheetHeader>

        {/* The header takes ~64px; the rest of the sheet scrolls. */}
        <div className="px-4">
          <VirtualizedCategoryList
            categories={categories}
            rowHeight={ROW_HEIGHT_MOBILE}
            onSelect={handleClose}
            itemClassName="flex h-full items-center border-b text-sm"
            scrollClassName="h-84"
          />
          <div className="py-4">
            <Button
              variant={"outline"}
              className={"w-full"}
              onClick={() => setOpen(false)}
            >
              بستن
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
